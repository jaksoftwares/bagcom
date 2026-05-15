import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase.from('audit_logs').select('*').limit(1);
  return Response.json({ data, error });
}
