
CREATE TYPE task_status AS ENUM ('todo', 'doing', 'done', 'cancel');
CREATE TYPE priority AS ENUM ('low', 'normal', 'high');

CREATE TABLE IF NOT EXISTS tags(
  id uuid primary key not null default gen_random_uuid(),
  name text not null,
  color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

CREATE TABLE IF NOT EXISTS tasks(
    id uuid primary key not null default gen_random_uuid(),
    title text not null,
    description text,
    status task_status,
    priority priority,
    tags uuid[] default '{}',
    created_at timestamptz not null default now(),
    updated_at timestamptz
);

INSERT INTO tags (name) VALUES ('work'), ('home');
