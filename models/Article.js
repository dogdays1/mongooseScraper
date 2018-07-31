var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },

  summary: {
    type: String,
    //Did not require, as some articles did not have summary   
  },
  link: {
    type: String,
    required: true
  },
//array for notes
  note: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note"
    }
  ]
});

// create our mongoose model
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
