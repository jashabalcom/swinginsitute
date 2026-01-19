export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface ServiceType {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  base_price: number;
  member_price: number;
  service_type: "lesson" | "class" | "camp" | "assessment";
  max_participants: number;
  is_active: boolean;
  created_at: string;
}

export interface Package {
  id: string;
  name: string;
  description: string | null;
  session_count: number;
  base_price: number;
  member_price: number;
  savings_amount: number | null;
  service_type_id: string | null;
  validity_days: number;
  is_active: boolean;
  created_at: string;
}

export interface PurchasedPackage {
  id: string;
  user_id: string;
  package_id: string | null;
  sessions_remaining: number;
  sessions_total: number;
  purchased_at: string;
  expires_at: string;
  status: "active" | "expired" | "depleted";
  stripe_payment_id: string | null;
  created_at: string;
  package?: Package;
}

export interface CoachAvailability {
  id: string;
  coach_id: string;
  day_of_week: number | null;
  start_time: string;
  end_time: string;
  is_recurring: boolean;
  specific_date: string | null;
  created_at: string;
}

export interface BlockedTime {
  id: string;
  coach_id: string;
  start_datetime: string;
  end_datetime: string;
  reason: string | null;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  service_type_id: string | null;
  coach_id: string;
  start_time: string;
  end_time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
  payment_method: "credits" | "package" | "direct_pay" | null;
  purchased_package_id: string | null;
  amount_paid: number | null;
  stripe_payment_id: string | null;
  notes: string | null;
  created_at: string;
  cancelled_at: string | null;
  updated_at: string;
  service_type?: ServiceType;
}

export interface BookingParticipant {
  id: string;
  booking_id: string;
  user_id: string;
  checked_in: boolean;
  checked_in_at: string | null;
  created_at: string;
}
