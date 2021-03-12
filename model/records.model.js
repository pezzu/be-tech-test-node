const mongoose = require('mongoose');

const recordsSchema = new mongoose.Schema({
  owner: String,
  text: String,
  isEditable: Boolean,
});

const Records = mongoose.model('records', recordsSchema);

module.exports = Records;