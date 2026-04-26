import { Hono } from "https://deno.land/x/hono@v3.4.1/mod.ts";
import { HTTPException } from "https://deno.land/x/hono@v3.12.10/http-exception.ts";

const app = new Hono();

// 🔥 KV REAL (OBLIGATORIO)
const kv = await Deno.openKv();

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

  await kv.set([key], body);

  return c.json({ ok: true });
});

// GET
app.get("/kv/get/:key{.*}", async (c) => {
  checkToken(c);
  const key = c.req.param("key");

  const res = await kv.get([key]);

  return c.json({ value: res.value });
});

// LIST
app.get("/kv/list/:key{.*}", async (c) => {
  checkToken(c);
  const prefix = c.req.param("key");

  const result = [];
  for await (const entry of kv.list({ prefix: [prefix] })) {
    result.push(entry);
  }

  return c.json({ records: result });
});

// DELETE
app.delete("/kv/delete/:key{.*}", async (c) => {
  checkToken(c);
  const key = c.req.param("key");
  await kv.delete([key]);
  return c.json({ ok: true });
});

// FULL RESET
app.delete("/kv/full_reset_42", async (c) => {
  checkToken(c);

  for await (const entry of kv.list({ prefix: [] })) {
    await kv.delete(entry.key);
  }

  return c.json({ ok: true });
});

// DUMP
app.all("/dump/*", (c) => {
  return c.json({
    ok: true
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
