-- Calculator Plans Table
CREATE TABLE IF NOT EXISTS calculator_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  plan_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(email, plan_name)
);

-- Auth Tokens for Magic Links
CREATE TABLE IF NOT EXISTS calculator_auth_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Users/Subscribers
CREATE TABLE IF NOT EXISTS calculator_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  last_login TIMESTAMP
);

-- Enable RLS
ALTER TABLE calculator_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculator_auth_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculator_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Plans: Users can only see their own plans
CREATE POLICY "Users can view their own plans" ON calculator_plans
  FOR SELECT USING (email = current_user_email());

CREATE POLICY "Users can insert their own plans" ON calculator_plans
  FOR INSERT WITH CHECK (email = current_user_email());

CREATE POLICY "Users can update their own plans" ON calculator_plans
  FOR UPDATE USING (email = current_user_email());

CREATE POLICY "Users can delete their own plans" ON calculator_plans
  FOR DELETE USING (email = current_user_email());

-- RLS Policies for Auth Tokens: Only service role can access
CREATE POLICY "Service role only" ON calculator_auth_tokens
  FOR ALL USING (false);

-- RLS Policies for Users: Users can view themselves
CREATE POLICY "Users can view their own profile" ON calculator_users
  FOR SELECT USING (email = current_user_email());

CREATE POLICY "Users can update their own profile" ON calculator_users
  FOR UPDATE USING (email = current_user_email());

-- Indexes for performance
CREATE INDEX idx_calculator_plans_email ON calculator_plans(email);
CREATE INDEX idx_calculator_auth_tokens_token ON calculator_auth_tokens(token);
CREATE INDEX idx_calculator_auth_tokens_expires ON calculator_auth_tokens(expires_at);
CREATE INDEX idx_calculator_users_email ON calculator_users(email);
