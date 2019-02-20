'use strict';

// Require '@metarhia/jstp' if you run this example outside this repository
const jstp = require('../..');
const chatApp = require('./chatApp');

const PORT = 3000;
const server = jstp.ws.createServer([chatApp]);

server.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
