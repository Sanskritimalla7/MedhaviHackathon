const app = require("./app");
const connectDatabase = require("./config/database");

process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shuting down the server due to Uncaught Exception");
  server.close(() => {
    process.exit(1);
  });
});

if (process.env.NODE_ENV !== "PRODUCTION")
  require("dotenv").config({ path: "/config/.env" });

connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});

process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shuting down the server due to Unhandled Promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
