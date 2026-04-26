import { Hono } from "https://deno.land/x/hono@v3.4.1/mod.ts";
import { HTTPException } from "https://deno.land/x/hono@v3.12.10/http-exception.ts";

const app = new Hono();

// 🔥 KV REAL
const kv = await Deno.openKv();

// TOKEN
function checkToken(c) {
  const token = c.req.query("token");
  if (token == "2607_4f9300:8bdf84") return true;
  throw new HTTPException(401, { message: "Missing or invalid token" });
}

// ========================
// SET
// ========================
app.post("/kv/set/:key{.*}", async (c) => {
  checkToken(c);

  const key = c.req.param("key"); // "py4e/chapter01_1729694"
  const body = await c.req.json();

  const parts = key.split("/"); // 🔥 IMPORTANTE

  await kv.set(parts, body);

  return c.json({ ok: true });
});

// ========================
// GET
// ========================
app.get("/kv/get/:key{.*}", async (c) => {
  checkToken(c);

  const key = c.req.param("key");

  const parts = key.split("/"); // 🔥 MISMO FORMATO

  const res = await kv.get(parts);

  return c.json({ value: res.value });
});

// ========================
// LIST
// ========================
app.get("/kv/list/:key{.*}", async (c) => {
  checkToken(c);

  const key = c.req.param("key");

  const prefix = key.split("/");

  const records = [];

  for await (const entry of kv.list({ prefix })) {
    records.push(entry);
  }

  return c.json({ records });
});

// ========================
// DELETE
// ========================
app.delete("/kv/delete/:key{.*}", async (c) => {
  checkToken(c);

  const key = c.req.param("key");

  await kv.delete(key.split("/"));

  return c.json({ ok: true });
});

// ========================
// FULL RESET
// ========================
app.delete("/kv/full_reset_42", async (c) => {
  checkToken(c);

  for await (const entry of kv.list({ prefix: [] })) {
    await kv.delete(entry.key);
  }

  return c.json({ ok: true });
});

// ========================
// DUMP
// ========================
app.all("/dump/*", (c) => {
  return c.json({ ok: true });
});

// ========================
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.text(err.message, err.status);
  }
  return c.text("Internal Server Error", 500);
});

Deno.serve(app.fetch);
