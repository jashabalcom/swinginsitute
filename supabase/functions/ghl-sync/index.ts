import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GHL_API_BASE = "https://services.leadconnectorhq.com";

const logStep = (step: string, details?: any) => {
  console.log(`[GHL-SYNC] ${step}${details ? ` - ${JSON.stringify(details)}` : ''}`);
};

interface GHLContact {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  tags?: string[];
  customFields?: Record<string, any>[];
}

// Helper to make GHL API requests (returns null on error instead of throwing for recoverable errors)
async function ghlRequest(endpoint: string, method: string, body?: any): Promise<any> {
  const apiKey = Deno.env.get("GHL_API_KEY");
  const locationId = Deno.env.get("GHL_LOCATION_ID");

  if (!apiKey || !locationId) {
    throw new Error("GHL API Key or Location ID not configured");
  }

  const headers: Record<string, string> = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "Version": "2021-07-28",
  };

  const url = `${GHL_API_BASE}${endpoint}`;
  logStep(`GHL Request: ${method} ${endpoint}`);

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    logStep("GHL API Error", { status: response.status, data });
    // Return error data instead of throwing for 400 errors (duplicates)
    if (response.status === 400) {
      return { error: true, status: response.status, data };
    }
    throw new Error(`GHL API Error: ${response.status} - ${JSON.stringify(data)}`);
  }

  return data;
}

// Find contact by email using lookup endpoint first, then fallback to search
async function findContactByEmail(email: string): Promise<GHLContact | null> {
  const locationId = Deno.env.get("GHL_LOCATION_ID");
  
  try {
    // Try the lookup endpoint first (more reliable for exact email match)
    logStep("Attempting contact lookup", { email });
    const lookupData = await ghlRequest(
      `/contacts/lookup?locationId=${locationId}&email=${encodeURIComponent(email)}`,
      "GET"
    );
    
    // Check if lookup returned a contact
    if (lookupData.contact) {
      logStep("Contact found via lookup", { 
        id: lookupData.contact.id, 
        email: lookupData.contact.email 
      });
      return lookupData.contact;
    }
    
    // If lookup didn't error but no contact, try search as fallback
    logStep("Lookup returned no contact, trying search", { email });
  } catch (lookupError) {
    logStep("Lookup endpoint failed, trying search", { 
      email, 
      error: lookupError instanceof Error ? lookupError.message : "Unknown" 
    });
  }

  // Fallback to search query
  try {
    const searchData = await ghlRequest(
      `/contacts/?locationId=${locationId}&query=${encodeURIComponent(email)}`,
      "GET"
    );
    
    logStep("Search results", { 
      email, 
      count: searchData.contacts?.length || 0 
    });
    
    if (searchData.contacts && searchData.contacts.length > 0) {
      const contact = searchData.contacts.find((c: any) => 
        c.email?.toLowerCase() === email.toLowerCase()
      );
      if (contact) {
        logStep("Contact found via search", { id: contact.id, email: contact.email });
        return contact;
      }
    }
    
    logStep("No contact found", { email });
    return null;
  } catch (error) {
    logStep("Error in contact search", { 
      email, 
      error: error instanceof Error ? error.message : "Unknown" 
    });
    return null;
  }
}

// Create or update contact with duplicate error recovery
async function upsertContact(contact: GHLContact): Promise<string> {
  const locationId = Deno.env.get("GHL_LOCATION_ID");
  
  // Check if contact exists
  const existingContact = await findContactByEmail(contact.email);
  
  // Parse name into first/last if only name is provided
  let firstName = contact.firstName;
  let lastName = contact.lastName;
  if (!firstName && !lastName && contact.name) {
    const nameParts = contact.name.split(" ");
    firstName = nameParts[0];
    lastName = nameParts.slice(1).join(" ") || "";
  }

  // Base contact data (shared between create and update)
  const baseContactData = {
    email: contact.email,
    firstName,
    lastName,
    phone: contact.phone,
    tags: contact.tags || [],
    customFields: contact.customFields || [],
  };

  if (existingContact?.id) {
    // Update existing contact - DO NOT include locationId in PUT request body
    logStep("Updating existing contact", { id: existingContact.id, email: contact.email });
    await ghlRequest(
      `/contacts/${existingContact.id}`,
      "PUT",
      baseContactData
    );
    return existingContact.id;
  } else {
    // Create new contact - locationId required for POST
    logStep("Creating new contact", { email: contact.email });
    const createResult = await ghlRequest("/contacts/", "POST", {
      locationId,
      ...baseContactData,
    });
    
    // Handle duplicate error response - extract contactId and update instead
    if (createResult?.error && createResult.status === 400) {
      const errorData = createResult.data;
      
      // Check if it's a duplicate contact error
      if (errorData?.meta?.contactId) {
        const existingId = errorData.meta.contactId;
        logStep("Duplicate detected, updating instead", { 
          contactId: existingId, 
          email: contact.email 
        });
        
        // Update the existing contact with our data
        await ghlRequest(
          `/contacts/${existingId}`,
          "PUT",
          baseContactData
        );
        return existingId;
      }
      
      // If it's a different 400 error, throw it
      throw new Error(`GHL API Error: 400 - ${JSON.stringify(errorData)}`);
    }
    
    return createResult.contact?.id;
  }
}

// Add tags to contact
async function addTagsToContact(contactId: string, tags: string[]): Promise<void> {
  if (!tags.length) return;
  
  logStep("Adding tags to contact", { contactId, tags });
  await ghlRequest(
    `/contacts/${contactId}/tags`,
    "POST",
    { tags }
  );
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...payload } = await req.json();
    logStep("Action received", { action });

    switch (action) {
      case "sync_signup": {
        // Sync new user signup to GHL - contacts only
        const { email, name, phone, source = "Website Signup" } = payload;
        
        const contactId = await upsertContact({
          email,
          name,
          phone,
          tags: [source, "Free Member"],
        });

        return new Response(JSON.stringify({ success: true, contactId }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "sync_purchase": {
        // Sync purchase/subscription to GHL - contacts and tags only
        const { email, name, tier, amount, paymentType } = payload;
        
        const tierTag = tier ? `Tier: ${tier.charAt(0).toUpperCase() + tier.slice(1)}` : "Customer";
        const typeTag = paymentType === "subscription" ? "Subscriber" : "Package Purchase";
        
        const contactId = await upsertContact({
          email,
          name,
          tags: [tierTag, typeTag, "Paying Customer"],
        });

        logStep("Purchase synced", { email, tier, contactId });

        return new Response(JSON.stringify({ success: true, contactId }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "add_tags": {
        const { email, tags } = payload;
        const contact = await findContactByEmail(email);
        
        if (contact?.id) {
          await addTagsToContact(contact.id, tags);
          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        
        return new Response(JSON.stringify({ success: false, error: "Contact not found" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        });
      }

      case "sync_booking": {
        // Sync booking to GHL
        const { email, name, serviceType, bookingDate } = payload;
        
        const contactId = await upsertContact({
          email,
          name,
          tags: [`Booked: ${serviceType}`, "Active Trainee"],
        });

        return new Response(JSON.stringify({ success: true, contactId }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "sync_quiz": {
        // Sync quiz completion to GHL with full tagging
        const { email, name, phone, playerName, answers, resultProfile } = payload;
        
        const tags = [
          "Quiz: Swing Assessment",
          `Age: ${answers.age}`,
          `Level: ${answers.level}`,
          `Frustration: ${answers.frustration}`,
          `Training: ${answers.trainingFrequency}`,
          `Confidence: ${answers.confidence}`,
          `Coaching: ${answers.coachingHistory}`,
          `Goal: ${answers.parentGoal}`,
          `Profile: ${resultProfile}`,
          "Source: Quiz Funnel",
        ];

        const contactId = await upsertContact({
          email,
          name,
          phone,
          tags,
        });

        logStep("Quiz synced", { email, profile: resultProfile, contactId });

        return new Response(JSON.stringify({ success: true, contactId }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "sync_quiz_abandonment": {
        // Sync quiz abandonment (exit-intent email capture) to GHL
        const { email, partialAnswers, questionReached } = payload;
        
        const tags = [
          "Quiz: Abandoned",
          `Quiz Reached: Q${questionReached + 1}/7`,
          "Source: Exit Intent",
        ];

        // Add any answered questions as tags
        if (partialAnswers.age) tags.push(`Age: ${partialAnswers.age}`);
        if (partialAnswers.level) tags.push(`Level: ${partialAnswers.level}`);
        if (partialAnswers.frustration) tags.push(`Frustration: ${partialAnswers.frustration}`);
        if (partialAnswers.trainingFrequency) tags.push(`Training: ${partialAnswers.trainingFrequency}`);
        if (partialAnswers.confidence) tags.push(`Confidence: ${partialAnswers.confidence}`);
        if (partialAnswers.coachingHistory) tags.push(`Coaching: ${partialAnswers.coachingHistory}`);
        if (partialAnswers.parentGoal) tags.push(`Goal: ${partialAnswers.parentGoal}`);

        const contactId = await upsertContact({
          email,
          tags,
        });

        logStep("Quiz abandonment synced", { email, questionReached, contactId });

        return new Response(JSON.stringify({ success: true, contactId }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
    }
  } catch (error) {
    logStep("ERROR", { message: error instanceof Error ? error.message : "Unknown" });
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
