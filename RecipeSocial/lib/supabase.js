import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nsfkmuqtorixjwtuekqu.supabase.co'
const supabasePublishableKey = 'sb_publishable_iYWLy_YtkLDM1ebcju3y1w_Qjj-_Xls'
export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
     },
 })