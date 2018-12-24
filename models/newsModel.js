var mongoose = require("mongoose");
var News = new mongoose.Schema({
  title:String,   //新闻标题
  author:String,  //新闻作者
  source:String,  //来源
  ctime:String,   //创建时间
  content:String, //新闻内容
});


var NewsModel = mongoose.model("DocNews",News);


exports.NewsModel = NewsModel;
