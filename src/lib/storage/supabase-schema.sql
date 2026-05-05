create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  title text not null,
  status text not null default 'draft',
  project_type text,
  raw_problem text not null,
  diagnosis jsonb,
  improving_parameter text,
  worsening_parameter text,
  contradiction jsonb,
  recommended_principles jsonb,
  selected_principle_id integer,
  ifr jsonb,
  resources jsonb,
  action_plan jsonb,
  validation jsonb,
  export_map jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table project_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  event_type text not null,
  payload jsonb,
  created_at timestamp with time zone default now()
);

create table consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  consent_type text not null,
  granted boolean not null,
  created_at timestamp with time zone default now()
);
