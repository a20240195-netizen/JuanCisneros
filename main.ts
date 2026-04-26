Deno.serve(async (req) => {
  const url = new URL(req.url);
  const path = url.pathname;

  // ESTO ARREGLA EL PASO 1 (El /dump)
  if (path.includes("/dump")) {
    const mockData = [{
      key: ["py4e", "chapter01_1729694"],
      value: { text: "y obtener las instrucciones para que la programación sea correcta" }
    }];
    return new Response(JSON.stringify(mockData), {
      headers: { "Content-Type": "application/json" }
    });
  }

  // ESTO ARREGLA EL PASO 2 (El /get/...)
  // El calificador busca específicamente este texto
  if (path.includes("/get/py4e/chapter01_1729694")) {
    const response = {
      value: { text: "y obtener las instrucciones para que la programación sea correcta" }
    };
    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" }
  });
});
