var mongoose = require('mongoose');  
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var searchlogSchema = new mongoose.Schema({
  term: {type: String, required: true},
  when: {type: Date, required: true}
});

mongoose.model('SearchLog',searchlogSchema);

module.exports = mongoose.model('SearchLog');