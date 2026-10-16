import type { NextRequest } from "next/server";

/**
 * Proxy para a searchprice-master-api.
 *
 * Substitui o `rewrites` do next.config para que a `x-api-key` seja injetada
 * no servidor e nunca vá para o bundle do navegador.
 *
 * Variáveis de ambiente (servidor):
 *   SEARCHPRICE_API_URL  ex.: http://localhost:3345
 *   SEARCHPRICE_API_KEY  mesmo valor esperado pelo ApiTokenMiddleware da API
 */
const API_URL = process.env.SEARCHPRICE_API_URL ?? "http://localhost:3345";
const API_KEY = process.env.SEARCHPRICE_API_KEY ?? "";

const FORWARDED_HEADERS = ["authorization", "content-type", "accept"];

async function proxy(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const target = new URL(`${API_URL.replace(/\/$/, "")}/${path.join("/")}`);
  target.search = req.nextUrl.search;

  const headers = new Headers();
  for (const name of FORWARDED_HEADERS) {
    const value = req.headers.get(name);
    if (value) headers.set(name, value);
  }
  if (API_KEY) headers.set("x-api-key", API_KEY);

  const hasBody = !["GET", "HEAD"].includes(req.method);

  try {
    const res = await fetch(target, {
      method: req.method,
      headers,
      body: hasBody ? await req.arrayBuffer() : undefined,
      cache: "no-store",
    });

    return new Response(res.body, {
      status: res.status,
      headers: {
        "content-type": res.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return Response.json(
      { message: "API indisponível no momento. Tente novamente." },
      { status: 502 }
    );
  }
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE };
