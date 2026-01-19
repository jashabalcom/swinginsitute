-- Create service_type enum
CREATE TYPE public.service_type AS ENUM ('lesson', 'class', 'camp', 'assessment');

-- Create booking_status enum
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');

-- Create payment_method enum
CREATE TYPE public.payment_method AS ENUM ('credits', 'package', 'direct_pay');

-- Create package_status enum
CREATE TYPE public.package_status AS ENUM ('active', 'expired', 'depleted');

-- Create service_types table
CREATE TABLE public.service_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  base_price NUMERIC(10,2) NOT NULL,
  member_price NUMERIC(10,2) NOT NULL,
  service_type service_type NOT NULL DEFAULT 'lesson',
  max_participants INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create packages table
CREATE TABLE public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  session_count INTEGER NOT NULL,
  base_price NUMERIC(10,2) NOT NULL,
  member_price NUMERIC(10,2) NOT NULL,
  savings_amount NUMERIC(10,2) DEFAULT 0,
  service_type_id UUID REFERENCES public.service_types(id) ON DELETE SET NULL,
  validity_days INTEGER NOT NULL DEFAULT 90,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create purchased_packages table
CREATE TABLE public.purchased_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
  sessions_remaining INTEGER NOT NULL,
  sessions_total INTEGER NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status package_status NOT NULL DEFAULT 'active',
  stripe_payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create coach_availability table
CREATE TABLE public.coach_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_recurring BOOLEAN NOT NULL DEFAULT true,
  specific_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blocked_times table
CREATE TABLE public.blocked_times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL,
  start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  service_type_id UUID REFERENCES public.service_types(id) ON DELETE SET NULL,
  coach_id UUID NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  payment_method payment_method,
  purchased_package_id UUID REFERENCES public.purchased_packages(id) ON DELETE SET NULL,
  amount_paid NUMERIC(10,2) DEFAULT 0,
  stripe_payment_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create booking_participants table (for classes/camps)
CREATE TABLE public.booking_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  checked_in BOOLEAN NOT NULL DEFAULT false,
  checked_in_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.service_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchased_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for service_types (public read, admin write)
CREATE POLICY "Anyone can view active service types"
  ON public.service_types FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage service types"
  ON public.service_types FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- RLS Policies for packages (public read, admin write)
CREATE POLICY "Anyone can view active packages"
  ON public.packages FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage packages"
  ON public.packages FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- RLS Policies for purchased_packages
CREATE POLICY "Users can view their own purchased packages"
  ON public.purchased_packages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchased packages"
  ON public.purchased_packages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all purchased packages"
  ON public.purchased_packages FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage purchased packages"
  ON public.purchased_packages FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- RLS Policies for coach_availability
CREATE POLICY "Anyone can view coach availability"
  ON public.coach_availability FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage coach availability"
  ON public.coach_availability FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Coaches can manage their own availability"
  ON public.coach_availability FOR ALL
  USING (auth.uid() = coach_id)
  WITH CHECK (auth.uid() = coach_id);

-- RLS Policies for blocked_times
CREATE POLICY "Anyone can view blocked times"
  ON public.blocked_times FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage blocked times"
  ON public.blocked_times FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Coaches can manage their own blocked times"
  ON public.blocked_times FOR ALL
  USING (auth.uid() = coach_id)
  WITH CHECK (auth.uid() = coach_id);

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all bookings"
  ON public.bookings FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Coaches can view their assigned bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = coach_id);

CREATE POLICY "Coaches can update their assigned bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = coach_id);

-- RLS Policies for booking_participants
CREATE POLICY "Users can view their own participation"
  ON public.booking_participants FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all participants"
  ON public.booking_participants FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Create trigger for bookings updated_at
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_coach_id ON public.bookings(coach_id);
CREATE INDEX idx_bookings_start_time ON public.bookings(start_time);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_purchased_packages_user_id ON public.purchased_packages(user_id);
CREATE INDEX idx_purchased_packages_status ON public.purchased_packages(status);
CREATE INDEX idx_coach_availability_coach_id ON public.coach_availability(coach_id);
CREATE INDEX idx_blocked_times_coach_id ON public.blocked_times(coach_id);