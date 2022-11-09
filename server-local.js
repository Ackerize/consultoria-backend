"use strict";
require("dotenv").config();
const app = require("./express/server");

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
