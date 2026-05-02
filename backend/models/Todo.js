const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Todo title is required'],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },

 /* description: {
      type: String,
      trim: true,
    },

   dueDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > new Date(); // must be future date
        },
        message: 'Due date must be in the future',
      },
    }
*/
);

module.exports = mongoose.model('Todo', todoSchema);
