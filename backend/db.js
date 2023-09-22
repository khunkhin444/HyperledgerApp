const Nano = require('nano');
const nano = Nano('http://admin:admin@localhost:5984');
const mydatabase = nano.db.use('mydatabase');

module.exports = mydatabase;