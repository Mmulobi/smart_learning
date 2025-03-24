#!/bin/bash

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI is not installed. Installing..."
    # Install Supabase CLI
    curl -s https://raw.githubusercontent.com/supabase/cli/main/install.sh | bash
fi

# Set Supabase project variables
echo "Please provide your Supabase project details:"
read -p "Supabase Project ID: " PROJECT_ID
read -p "Supabase API Key (service_role key): " API_KEY
read -p "Supabase Database Password: " DB_PASSWORD

# Export variables for Supabase CLI
export SUPABASE_ACCESS_TOKEN=$API_KEY
export PGPASSWORD=$DB_PASSWORD

echo "Connecting to Supabase project..."
supabase link --project-ref $PROJECT_ID

echo "Applying database migrations..."
# Option 1: Using Supabase migrations
supabase db push

# Option 2: Direct SQL execution (if option 1 fails)
# Get database connection string from Supabase dashboard
read -p "If the migration failed, enter your database connection string (from Supabase dashboard): " DB_URL
if [ ! -z "$DB_URL" ]; then
    echo "Executing SQL directly..."
    psql "$DB_URL" -f ./supabase/migrations/update_schema.sql
fi

echo "Migration completed!"
