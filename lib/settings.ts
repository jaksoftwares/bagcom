import { createServerClient } from './supabase/server';

/**
 * Fetches a system-wide setting from the database.
 * Falls back to a default value if not found.
 */
export async function getSystemSetting(key: string, defaultValue: string): Promise<string> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', key)
      .single();

    if (error || !data) return defaultValue;
    return data.value;
  } catch (err) {
    console.error(`Error fetching setting ${key}:`, err);
    return defaultValue;
  }
}

/**
 * Convenience helper to check if maintenance mode is active.
 */
export async function isMaintenanceMode(): Promise<boolean> {
  const val = await getSystemSetting('maintenance_mode', 'false');
  return val === 'true';
}

/**
 * Convenience helper to get the platform commission rate.
 * Returns as a decimal (e.g., 0.1 for 10%)
 */
export async function getCommissionRate(): Promise<number> {
  const val = await getSystemSetting('commission_rate', '10');
  return parseInt(val) / 100;
}
