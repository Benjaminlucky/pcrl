// app.cjs — startup file for DirectAdmin / cPanel "Setup Node.js App"
// (Phusion Passenger). Passenger loads the startup file with require(), which
// cannot load this project's ES modules directly, so this CommonJS shim
// dynamically imports the real entry point. Passenger intercepts the
// app.listen() call inside index.js and routes traffic to it — no port config
// is needed on the server.
import("./index.js").catch((err) => {
  console.error("Failed to start PCRG API:", err);
  process.exit(1);
});
