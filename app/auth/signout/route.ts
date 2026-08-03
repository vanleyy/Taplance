import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Sign the session out server-side so the Supabase auth cookies are
// invalidated. The client calls this from the navbar's Logout button.
export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.json({ success: true });
}
