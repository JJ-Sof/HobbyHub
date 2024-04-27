import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ilmepmdadzavgafcutso.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsbWVwbWRhZHphdmdhZmN1dHNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM2NTc1MDEsImV4cCI6MjAyOTIzMzUwMX0.MgmH1ZWwCudeNmN2Oopk4WFDSqrHhMx8InAgUCfVVdA';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;