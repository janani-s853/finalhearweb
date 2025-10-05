// Test Supabase connection
import { supabase } from './supabaseClient.js';

export const testConnection = async () => {
  try {
    // Test basic connection
    const { data, error } = await supabase.from('consultations').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Supabase connection error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Supabase connection successful');
    return { success: true, data };
  } catch (err) {
    console.error('Connection test failed:', err);
    return { success: false, error: err.message };
  }
};

// Test table structure
export const testTableStructure = async () => {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Table structure error:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, message: 'Table exists and is accessible' };
  } catch (err) {
    console.error('Table test failed:', err);
    return { success: false, error: err.message };
  }
};