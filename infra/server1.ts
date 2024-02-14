
const server = Bun.serve({
    port: 3001,
    fetch(request) {
      return new Response("Welcome to Bun! 1");
    },
  });
  
  console.log(`Listening on localhost:${server.port}`);