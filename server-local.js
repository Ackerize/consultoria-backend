
"use strict";

const Server = require("./express/models/server");
require('dotenv').config();

const server = new Server();
server.execute();