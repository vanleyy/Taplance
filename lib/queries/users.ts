import { createClient } from "@/utils/supabase/client";


  
  export const getUserProfile = (
    userId: string
  ) => {
    const supabase = createClient()
    return supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .limit(1)
      .single()
      .throwOnError();
  };
  
  export const getPublicUserProfile = (
    username: string
  ) => {
    const supabase = createClient()
    return supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .limit(1)
      .single()
      .throwOnError();
  };
  
