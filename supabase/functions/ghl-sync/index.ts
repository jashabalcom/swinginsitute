import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

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

interface GHLOpportunity {
  id?: string;
  name: string;
  pipelineId: string;
  pipelineStageId: string;
  contactId: string;
  monetaryValue?: number;
  status?: string;
}

// Helper to make GHL API requests
async function ghlRequest(endpoint: string, method: string, body?: any) {
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
    throw new Error(`GHL API Error: ${response.status} - ${JSON.stringify(data)}`);
  }

  return data;
}

// Find contact by email
async function findContactByEmail(email: string): Promise<GHLContact | null> {
  const locationId = Deno.env.get("GHL_LOCATION_ID");
  try {
    const data = await ghlRequest(
      `/contacts/?locationId=${locationId}&query=${encodeURIComponent(email)}`,
      "GET"
    );
    
    if (data.contacts && data.contacts.length > 0) {
      const contact = data.contacts.find((c: any) => 
        c.email?.toLowerCase() === email.toLowerCase()
      );
      return contact || null;
    }
    return null;
  } catch (error) {
    logStep("Error finding contact", { email, error: error instanceof Error ? error.message : "Unknown" });
    return null;
  }
}

// Create or update contact
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

  const contactData = {
    locationId,
    email: contact.email,
    firstName,
    lastName,
    phone: contact.phone,
    tags: contact.tags || [],
    customFields: contact.customFields || [],
  };

  if (existingContact?.id) {
    // Update existing contact
    logStep("Updating existing contact", { id: existingContact.id, email: contact.email });
    const data = await ghlRequest(
      `/contacts/${existingContact.id}`,
      "PUT",
      contactData
    );
    return existingContact.id;
  } else {
    // Create new contact
    logStep("Creating new contact", { email: contact.email });
    const data = await ghlRequest("/contacts/", "POST", contactData);
    return data.contact?.id;
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

// Create opportunity
async function createOpportunity(opportunity: GHLOpportunity): Promise<string> {
  logStep("Creating opportunity", { name: opportunity.name, contactId: opportunity.contactId });
  
  const data = await ghlRequest("/opportunities/", "POST", {
    pipelineId: opportunity.pipelineId,
    pipelineStageId: opportunity.pipelineStageId,
    contactId: opportunity.contactId,
    name: opportunity.name,
    monetaryValue: opportunity.monetaryValue || 0,
    status: opportunity.status || "open",
  });
  
  return data.opportunity?.id;
}

// Update opportunity stage
async function updateOpportunityStage(opportunityId: string, stageId: string): Promise<void> {
  logStep("Updating opportunity stage", { opportunityId, stageId });
  
  await ghlRequest(
    `/opportunities/${opportunityId}`,
    "PUT",
    { pipelineStageId: stageId, status: "open" }
  );
}

// Find opportunities for a contact
async function findOpportunitiesForContact(contactId: string): Promise<any[]> {
  const pipelineId = Deno.env.get("GHL_PIPELINE_ID");
  
  try {
    const data = await ghlRequest(
      `/opportunities/search?pipelineId=${pipelineId}&contactId=${contactId}`,
      "GET"
    );
    return data.opportunities || [];
  } catch (error) {
    logStep("Error finding opportunities", { contactId, error: error instanceof Error ? error.message : "Unknown" });
    return [];
  }
}

// Win/close opportunity
async function winOpportunity(opportunityId: string, stageId: string): Promise<void> {
  logStep("Winning opportunity", { opportunityId, stageId });
  
  await ghlRequest(
    `/opportunities/${opportunityId}/status`,
    "PUT",
    { status: "won" }
  );
  
  // Also update to the customer stage
  await ghlRequest(
    `/opportunities/${opportunityId}`,
    "PUT",
    { pipelineStageId: stageId }
  );
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const { action, ...payload } = await req.json();
    logStep("Action received", { action });

    switch (action) {
      case "sync_signup": {
        // Sync new user signup to GHL
        const { email, name, phone, source = "Website Signup" } = payload;
        
        const contactId = await upsertContact({
          email,
          name,
          phone,
          tags: [source, "Free Member"],
        });

        // Create opportunity in New Lead stage
        const pipelineId = Deno.env.get("GHL_PIPELINE_ID");
        const stageNewLead = Deno.env.get("GHL_STAGE_NEW_LEAD");
        
        if (pipelineId && stageNewLead && contactId) {
          await createOpportunity({
            name: `${name || email} - New Signup`,
            pipelineId,
            pipelineStageId: stageNewLead,
            contactId,
          });
        }

        return new Response(JSON.stringify({ success: true, contactId }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "sync_purchase": {
        // Sync purchase/subscription to GHL
        const { email, name, tier, amount, paymentType } = payload;
        
        const tierTag = tier ? `Tier: ${tier.charAt(0).toUpperCase() + tier.slice(1)}` : "Customer";
        const typeTag = paymentType === "subscription" ? "Subscriber" : "Package Purchase";
        
        const contactId = await upsertContact({
          email,
          name,
          tags: [tierTag, typeTag, "Paying Customer"],
        });

        // Find and update opportunity to Customer stage, or create new one
        const pipelineId = Deno.env.get("GHL_PIPELINE_ID");
        const stageCustomer = Deno.env.get("GHL_STAGE_CUSTOMER");
        
        if (pipelineId && stageCustomer && contactId) {
          const opportunities = await findOpportunitiesForContact(contactId);
          
          if (opportunities.length > 0) {
            // Update existing opportunity to won
            const opp = opportunities[0];
            await winOpportunity(opp.id, stageCustomer);
            logStep("Opportunity won", { opportunityId: opp.id });
          } else {
            // Create new opportunity as won
            const oppId = await createOpportunity({
              name: `${name || email} - ${tier || "Purchase"}`,
              pipelineId,
              pipelineStageId: stageCustomer,
              contactId,
              monetaryValue: amount || 0,
              status: "won",
            });
            logStep("New opportunity created as won", { opportunityId: oppId });
          }
        }

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
