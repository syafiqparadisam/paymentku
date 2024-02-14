
const server = Bun.serve({
    port: 3002,
    fetch(request) {
      return new Response("Welcome to Bun! 3 hddidfhdsffidsfihisgskddsksh");
    },
  });
  
  console.log(`Listening on localhost:${server.port}`);