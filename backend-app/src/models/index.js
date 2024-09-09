const fs = require('fs');
const path = require('path');


const models = {};

fs.readdirSync(__dirname)
    .filter(file => {
        return !['index.js', 'db.js'].includes(file) && file.endsWith('.js');
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file));
        const modelName = path.basename(file, '.js');
        models[modelName] = model;
    });

module.exports = models;
