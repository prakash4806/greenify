-- Create feedback table
create table if not exists public.feedback (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  title text not null,
  message text not null,
  is_approved boolean default false not null,
  is_featured boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint feedback_user_id_key unique (user_id)
);

-- Enable Row Level Security (RLS)
alter table public.feedback enable row level security;

-- Policy 1: Authenticated users can insert their own feedback
drop policy if exists "Users can insert their own feedback" on public.feedback;
create policy "Users can insert their own feedback"
  on public.feedback for insert
  with check (auth.uid() = user_id);

-- Policy 2: Users can read their own feedback, admins can read all, anyone can read approved reviews
drop policy if exists "Feedback is visible to owners, admins, or if approved" on public.feedback;
create policy "Feedback is visible to owners, admins, or if approved"
  on public.feedback for select
  using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    or is_approved = true
  );

-- Policy 3: Users can update their own feedback, admins can update all
drop policy if exists "Owners and admins can update feedback" on public.feedback;
create policy "Owners and admins can update feedback"
  on public.feedback for update
  using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  )
  with check (
    auth.uid() = user_id
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Policy 4: Users can delete their own feedback, admins can delete all
drop policy if exists "Owners and admins can delete feedback" on public.feedback;
create policy "Owners and admins can delete feedback"
  on public.feedback for delete
  using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Ensure one feedback record per user
alter table public.feedback drop constraint if exists feedback_user_id_key;
alter table public.feedback add constraint feedback_user_id_key unique (user_id);

-- Create non-recursive admin check function
create or replace function public.is_admin()
returns boolean
language sql
security definer
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'admin'
  );
$$;

-- Enable RLS on profiles if not already enabled
alter table public.profiles enable row level security;

-- Policies for public.profiles table
drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Enable RLS on diagnoses if not already enabled
alter table public.diagnoses enable row level security;

-- Policies for public.diagnoses table
drop policy if exists "Users can view their own diagnoses" on public.diagnoses;
create policy "Users can view their own diagnoses"
  on public.diagnoses for select
  using (auth.uid() = user_id);

drop policy if exists "Admins can view all diagnoses" on public.diagnoses;
create policy "Admins can view all diagnoses"
  on public.diagnoses for select
  using (public.is_admin());

drop policy if exists "Users can delete their own diagnoses" on public.diagnoses;
create policy "Users can delete their own diagnoses"
  on public.diagnoses for delete
  using (auth.uid() = user_id);

drop policy if exists "Admins can delete any diagnoses" on public.diagnoses;
create policy "Admins can delete any diagnoses"
  on public.diagnoses for delete
  using (public.is_admin());

