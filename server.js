const app = require("./src/app");

const PORT = 3055;

const server = app.listen(PORT, () => {
  console.log(process.env);
  console.log(`Server is starting with port ${PORT}`);
});
