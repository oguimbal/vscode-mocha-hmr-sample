// require all files that match '*-spec.ts'
var req = require.context('./src', true, /\-spec$/);
req.keys().forEach(req);

// this piece of code enables mocha HMR support
require('vscode-mocha-hmr')(module);