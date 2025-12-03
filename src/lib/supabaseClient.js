import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tkuqyclunshsguiqmkml.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrdXF5Y2x1bnNoc2d1aXFta21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxODYwNzYsImV4cCI6MjA3OTc2MjA3Nn0.eZieWq7BXSh_d-UFtLaARiRz4sggOPWt2wCjzsh-yfw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
