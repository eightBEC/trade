var mongoose = require('mongoose');

var positionSchema = new mongoose.Schema({

  PositionHolder: String,
  Emitter: String,
  ISIN: String,
  Position: String,
  PositionDate: String,
  CrawlDate: { type: Date, default: Date.now }
});


var Position = mongoose.model('Position', positionSchema);

module.exports = Position;
