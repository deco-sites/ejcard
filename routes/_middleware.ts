import { MiddlewareHandlerContext } from "$fresh/server.ts";
import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js";
import { getCookies } from "../routes/cookie.ts";

export interface State {
  token: string | null;
  supabaseClient: SupabaseClient<any, "public", any>;
}

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  const client = createClient(
    Deno.env.get("SUPABASE_URL") || "",
    Deno.env.get("SUPABASE_KEY") || "",
  );

  ctx.state.supabaseClient = client;

  const supaCreds = getCookies(req.headers)["supaLogin"];

  if (!supaCreds) {
    return ctx.next();
  }

  const { error } = await client.auth.getUser(supaCreds);

  if (error) {
    console.log(error.message);
    ctx.state.token = null;
  } else {
    ctx.state.token = supaCreds;
  }

  return await ctx.next();
}
