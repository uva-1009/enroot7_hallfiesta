-- Hall Fiesta database. Paste this whole file into Supabase > SQL Editor > New query, then Run. Safe to run once.
-- Row Level Security is on with no policies, so the browser (anon key) can read nothing.
-- Only the site's server routes, using the service role key, can read or write.

-- One row per booth: its stamp code and current queue.
create table if not exists booths (
  id          text primary key,
  name        text not null,
  code        text not null,
  queue       text not null default 'none' check (queue in ('none', 'short', 'long', 'closed')),
  updated_at  timestamptz not null default now()
);

-- Placeholder codes. Change them on /staff before the event.
insert into booths (id, name, code) values
  ('nerf',  'Nerf Cup Knockdown',    'change-me-nerf'),
  ('pasta', 'Pasta Tower Challenge', 'change-me-pasta'),
  ('ball',  'Ball Transfer',         'change-me-ball')
on conflict (id) do nothing;

-- People who started the Telegram bot (so it can send reminders). /stop removes them.
create table if not exists subscribers (
  chat_id        bigint primary key,
  first_name     text,
  joined_at      timestamptz not null default now(),
  feedback_done  boolean not null default false,
  session        jsonb            -- where they are in the feedback questions
);

-- Feedback answers. No chat id or name is stored with them.
create table if not exists feedback (
  id          bigint generated always as identity primary key,
  nerf        smallint check (nerf between 1 and 5),
  pasta       smallint check (pasta between 1 and 5),
  ball        smallint check (ball between 1 and 5),
  overall     smallint check (overall between 1 and 5),
  come_again  text check (come_again in ('yes', 'maybe', 'no')),
  change      text,
  created_at  timestamptz not null default now()
);

-- Records which bot announcements were sent, so nobody gets the same message twice.
create table if not exists broadcasts (
  key         text primary key,
  sent_at     timestamptz not null default now(),
  sent_count  integer not null default 0
);

alter table booths      enable row level security;
alter table subscribers enable row level security;
alter table feedback    enable row level security;
alter table broadcasts  enable row level security;

-- Let the server's secret key (service_role) use these tables.
grant usage on schema public to service_role;
grant all on table public.booths, public.subscribers, public.feedback, public.broadcasts to service_role;
grant usage, select on all sequences in schema public to service_role;
