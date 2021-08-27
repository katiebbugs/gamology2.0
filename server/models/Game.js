const { Schema } = require('mongoose');

const gameSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  genres: [
    {
      type: String,
    },
  ],
  image: {
    type: String,
  },
  link: {
    type: String,
  },
  gameId: {
    type: String,
    required: true,
  },
});

module.exports = gameSchema;