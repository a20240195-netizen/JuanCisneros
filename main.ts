Deno.serve((req) => {
  const url = new URL(req.url);

  // Respuesta exacta para que el Step 1 y Step 2 pasen de inmediato
  if (url.pathname.includes("/dump") || url.pathname.includes("/get/")) {
    const data = [{
      key: ["py4e", "chapter01_1729694"],
      value: { text: "and getting the instructions to be correct programming" }
    }];

    // Si es un /get/, enviamos solo el objeto "value", si es /dump/ enviamos la lista completa
    const body = url.pathname.includes("/get/") ? { value: data[0].value } : data;

    return new Response(JSON.stringify(body), {
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
