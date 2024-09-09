let clc = require("cli-color");

let error = clc.red.bold;
let warn = clc.yellow;
let info = clc.blue;
let success = clc.green;
let highlight = clc.yellowBright.bgWhiteBright.bold.underline;

module.exports = {
    error,
    warn,
    info,
    success,
    highlight
}