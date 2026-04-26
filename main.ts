import { Hono } from "https://deno.land/x/hono@v3.4.1/mod.ts";
import { HTTPException } from "https://deno.land/x/hono@v3.12.10/http-exception.ts";

const app = new Hono();

const kv = new Map<string, any>();

// TOKEN
function checkToken(c) {
  const token = c.req.query("token");
  if (token == "2607_4f9300:8bdf84") return true;
  throw new HTTPException(401, { message: "Missing or invalid token" });
}

// SET
app.post("/kv/set/:key{.*}", async (c) => {
  checkToken(c);

  const key = c.req.param("key");
  const body = await c.req.json();

  kv.set(key, body);

  return c.json({ ok: true });
});

// GET
app.get("/kv/get/:key{.*}", (c) => {
  checkToken(c);

  const key = c.req.param("key");
  const value = kv.get(key);

  return c.json({ value: value ?? null });
});

// LIST
app.get("/kv/list/:key{.*}", (c) => {
  checkToken(c);

  const prefix = c.req.param("key");

  const records = [];

  for (const [k, v] of kv.entries()) {
    if (k.startsWith(prefix)) {
      records.push({ key: k, value: v });
    }
  }

  return c.json({ records });
});

// DELETE
app.delete("/kv/delete/:key{.*}", (c) => {
  checkToken(c);

  const key = c.req.param("key");
  kv.delete(key);

  return c.json({ ok: true });
});

// DELETE PREFIX
app.delete("/kv/delete_prefix/:key{.*}", (c) => {
  checkToken(c);

  const prefix = c.req.param("key");

  const deleted = [];

  for (const k of kv.keys()) {
    if (k.startsWith(prefix)) {
      kv.delete(k);
      deleted.push(k);
    }
  }

  return c.json({ deleted });
});

// FULL RESET
app.delete("/kv/full_reset_42", (c) => {
  checkToken(c);
  kv.clear();
  return c.json({ ok: true });
});

// DUMP
app.all("/dump/*", async (c) => {
  const req = c.req;

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    try {
      body = await req.text();
    } catch {
      body = null;
    }
  }

  return c.json({
    method: req.method,
    url: req.url,
    path: req.path,
    query: req.query(),
    body,
  });
});

// ERROR HANDLER
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.text(err.message, err.status);
  }
  return c.text("Internal Server Error", 500);
});

Deno.serve(app.fetch);
