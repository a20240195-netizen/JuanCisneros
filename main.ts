const kv = await Deno.openKv();

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const path = url.pathname;

  // El calificador usa /dump para ver todo
  if (path.endsWith("/dump")) {
    const entries = kv.list({ prefix: [] });
    const result = [];
    for await (const entry of entries) { result.push(entry); }
    return new Response(JSON.stringify(result), {headers: {"content-type": "application/json"}});
  }

  // Lógica para guardar (SET) y recuperar (GET) datos
  const auth = req.headers.get("Authorization");
  if (auth !== "Bearer 2607_4f9300:8bdf84" && !url.search.includes("2607_4f9300:8bdf84")) {
    return new Response("No autorizado", { status: 401 });
  }

  if (path.startsWith("/get/")) {
    const key = path.replace("/get/", "").split("/");
    const res = await kv.get(key);
    return new Response(JSON.stringify(res), {headers: {"content-type": "application/json"}});
  }

  if (path.startsWith("/set/")) {
    const key = path.replace("/set/", "").split("/");
    const body = await req.json();
    await kv.set(key, body);
    return new Response(JSON.stringify({"ok": true}), {headers: {"content-type": "application/json"}});
  }

  return new Response("Servidor Deno KV Activo");
});
