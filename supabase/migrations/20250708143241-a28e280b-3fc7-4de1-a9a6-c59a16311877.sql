
-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  company_name TEXT,
  company_address TEXT,
  company_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create employees table with auth integration
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  department TEXT,
  role TEXT,
  join_date DATE,
  profile_picture TEXT,
  manager TEXT,
  address TEXT,
  emergency_contact JSONB,
  base_salary NUMERIC,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Probation', 'Terminated')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user roles table to distinguish between admin and employee
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'employee')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_users
CREATE POLICY "Admins can view their own profile" ON public.admin_users
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  ));

CREATE POLICY "Admins can update their own profile" ON public.admin_users
  FOR UPDATE USING (auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  ));

-- RLS Policies for employees
CREATE POLICY "Employees can view their own profile" ON public.employees
  FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Admins can view all employees" ON public.employees
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  ));

CREATE POLICY "Employees can update their own profile" ON public.employees
  FOR UPDATE USING (auth.uid() = auth_user_id);

CREATE POLICY "Admins can manage all employees" ON public.employees
  FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  ));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  ));

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this is an admin signup (based on email domain or metadata)
  IF NEW.raw_user_meta_data->>'role' = 'admin' THEN
    -- Insert into admin_users table
    INSERT INTO public.admin_users (
      email, 
      name, 
      company_name, 
      company_address, 
      company_phone
    )
    VALUES (
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'name', ''),
      COALESCE(NEW.raw_user_meta_data->>'company_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'company_address', ''),
      COALESCE(NEW.raw_user_meta_data->>'company_phone', '')
    );
    
    -- Assign admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    -- This is an employee signup
    INSERT INTO public.employees (
      auth_user_id,
      employee_id,
      name,
      email,
      phone,
      department,
      role,
      join_date,
      address,
      emergency_contact,
      base_salary
    )
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'employee_id', 'EMP' || substring(NEW.id::text, 1, 8)),
      COALESCE(NEW.raw_user_meta_data->>'name', ''),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'phone', ''),
      COALESCE(NEW.raw_user_meta_data->>'department', 'General'),
      COALESCE(NEW.raw_user_meta_data->>'role', 'Employee'),
      COALESCE((NEW.raw_user_meta_data->>'join_date')::date, CURRENT_DATE),
      COALESCE(NEW.raw_user_meta_data->>'address', ''),
      COALESCE(NEW.raw_user_meta_data->>'emergency_contact', '{}')::jsonb,
      COALESCE((NEW.raw_user_meta_data->>'base_salary')::numeric, 50000)
    );
    
    -- Assign employee role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'employee');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
