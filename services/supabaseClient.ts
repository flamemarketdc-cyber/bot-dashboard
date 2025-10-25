import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aaviuftzpwkbgckbtdkz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhdml1ZnR6cHdrYmdja2J0ZGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMTUyODcsImV4cCI6MjA3Njg5MTI4N30.sIR2Who2NTmO2sKt2-AYEt_FlOU9temOSWo8z1VovLg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);