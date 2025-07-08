
-- Fix the recursive RLS policy issue by creating a security definer function
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.user_roles WHERE user_id = user_uuid LIMIT 1;
$$;

-- Drop the problematic RLS policies that cause recursion
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all employees" ON public.employees;
DROP POLICY IF EXISTS "Admins can manage all employees" ON public.employees;
DROP POLICY IF EXISTS "Admins can view their own profile" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can update their own profile" ON public.admin_users;

-- Create new non-recursive policies using the security definer function
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own roles" ON public.user_roles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Employee policies
CREATE POLICY "Employees can view their own profile" ON public.employees
  FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Employees can update their own profile" ON public.employees
  FOR UPDATE USING (auth.uid() = auth_user_id);

CREATE POLICY "Admins can view all employees" ON public.employees
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can manage all employees" ON public.employees
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Admin policies
CREATE POLICY "Admins can view their own profile" ON public.admin_users
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can update their own profile" ON public.admin_users
  FOR UPDATE USING (public.get_user_role(auth.uid()) = 'admin');

-- Insert test users for both admin and employee
-- Note: These will be created with temporary passwords that need to be set up through Supabase Auth
INSERT INTO public.admin_users (
  id,
  email, 
  name, 
  company_name
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'admin@company.com',
  'System Administrator',
  'Test Company'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO public.employees (
  id,
  auth_user_id,
  employee_id,
  name,
  email,
  department,
  role,
  join_date,
  base_salary,
  status
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440001',
  'EMP001',
  'Alice Johnson',
  'alice.johnson@company.com',
  'Engineering',
  'Software Developer',
  CURRENT_DATE,
  75000,
  'Active'
) ON CONFLICT (email) DO NOTHING;

-- Insert corresponding user roles
INSERT INTO public.user_roles (user_id, role) VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'admin'),
  ('550e8400-e29b-41d4-a716-446655440001', 'employee')
ON CONFLICT (user_id, role) DO NOTHING;
