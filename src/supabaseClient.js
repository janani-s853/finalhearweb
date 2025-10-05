// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://epkyhgnnddwwtnpzjzxf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwa3loZ25uZGR3d3RucHpqenhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MzQzODcsImV4cCI6MjA2NDIxMDM4N30.2X-T4dSZSSBxzg9-Bux3q175DfouIJcPSTgbbuhITLw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
