-- Create Settings Table
create table if not exists settings (
  key text primary key,
  value text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Settings
alter table settings enable row level security;
create policy "Public Read Settings" on settings for select using (true);
create policy "Admin Manage Settings" on settings for all using (auth.role() = 'authenticated');

-- Insert default pixel key (empty)
insert into settings (key, value) values ('facebook_pixel_id', '') on conflict do nothing;
