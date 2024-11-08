-- requests table
CREATE TABLE requests (
    id UUID PRIMARY KEY,
    name text,
    email text,
    phone_number text,
    state_of_origin text,
    lga text,
    subject text,
    file_url text,
    response text,
    stage text DEFAULT 'Email Confirmation',
    processing_date timestamptz,
	responded_date timestamptz,
    organisation_id UUID,
    created_at timestamptz DEFAULT now(), 
    user_id UUID
);

-- organisations table
CREATE TABLE organisations (
    id UUID PRIMARY KEY,
    name text,
    thumbnail_url text 
);

-- users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email text,
    email_verified boolean DEFAULT false,
    role text DEFAULT 'user',
);

-- settings table
CREATE TABLE settings (
    id UUID PRIMARY KEY,
    setting_name text,
    setting_value text, 
); 
