import { HandlerContext, Handlers } from "$fresh/server.ts";

// Interface para os cookies
interface Cookies {
  [key: string]: string;
}

// Função para obter cookies
export function getCookies(headers: Headers): Cookies {
  const cookies: Cookies = {};
  const cookieHeader = headers.get("cookie");

  if (cookieHeader) {
    cookieHeader.split(";").forEach((cookie) => {
      const [key, value] = cookie.trim().split("=");
      cookies[key] = decodeURIComponent(value);
    });
  }

  return cookies;
}

export function setCookie(headers: Headers, options: {
  name: string;
  value: string;
  maxAge?: number;
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
  httpOnly?: boolean;
}): void {
  let cookie = `${options.name}=${encodeURIComponent(options.value)}`;

  if (options.expires) {
    cookie += `; Expires=${options.expires.toUTCString()}`;
  } else if (options.maxAge) {
    cookie += `; Max-Age=${options.maxAge}`;
  }

  if (options.path) {
    cookie += `; Path=${options.path}`;
  }
  if (options.domain) {
    cookie += `; Domain=${options.domain}`;
  }
  if (options.secure) {
    cookie += `; Secure`;
  }
  if (options.sameSite) {
    cookie += `; SameSite=${options.sameSite}`;
  }
  if (options.httpOnly) {
    cookie += `; HttpOnly`;
  }

  headers.append("Set-Cookie", cookie);
}

// Função para deletar cookies
export function deleteCookie(
  headers: Headers,
  name: string,
  options: Record<string, any> = {},
): void {
  setCookie(headers, { name, value: "", maxAge: 0, ...options });
}

// Handler para a rota
export const handler: Handlers = {
  GET: (req: Request, ctx: HandlerContext) => {
    const cookies = getCookies(req.headers);
    return new Response(JSON.stringify(cookies), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
