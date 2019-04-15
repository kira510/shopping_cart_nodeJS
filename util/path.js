const path = require('path');

module.exports = path.dirname(process.mainModule.filename);

/**
 * the process is global function that has access to the main running module
 * which is the app.js
 */