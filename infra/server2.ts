
const server = Bun.serve({
    port: 3000,
    fetch(request) {
      console.log(request.headers)
      return new Response("Welcome to Bun! 2");
    },
    
  });
  
  console.log(`Listening on localhost:${server.port}`);