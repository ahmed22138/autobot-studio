import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDb } from "@/lib/sqlite";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.app_metadata?.provider === "google") {
        const db = getDb();
        const stmt = db.prepare(`
          INSERT INTO google_users (id, email, full_name, avatar_url, provider)
          VALUES (?, ?, ?, ?, 'google')
          ON CONFLICT(id) DO UPDATE SET
            email = excluded.email,
            full_name = excluded.full_name,
            avatar_url = excluded.avatar_url
        `);
        stmt.run(
          user.id,
          user.email ?? "",
          user.user_metadata?.full_name ?? null,
          user.user_metadata?.avatar_url ?? null
        );
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
