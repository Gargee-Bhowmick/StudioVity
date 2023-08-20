const mongoose = require('mongoose');

const relationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  character1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character'
  },
  character2: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character'
  }]
});

const Relation = mongoose.model('Relation', relationSchema);

module.exports = Relation