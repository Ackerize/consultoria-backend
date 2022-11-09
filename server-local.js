
"use strict";

const Server = require("./express/server");
require('dotenv').config();

const server = new Server();
server.execute();