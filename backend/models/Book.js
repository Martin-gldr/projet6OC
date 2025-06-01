const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: String, required: true },
  year: { type: Number, required: true },
  genre: {type: String, require: true},
  ratings: [
    {
        userId: {type: String, require: true},
        grade: {type: Number, require:true},
    }],
averageRating:{type:Number, require:true}
});

module.exports = mongoose.model('Book', bookSchema);