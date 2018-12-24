var express = require("express");
var mongoose = require("mongoose");
var ejs = require("ejs");
var router = express.Router();

// 引入数据库模型
var model = require("../models/newsModel");

var NewsModel = model.NewsModel;



// 链接数据库
mongoose.connect("mongodb://localhost:27017/myzxdNews",{useNewUrlParser: true},function(err){
  var p = new Promise(function(resolve,reject){
    if(!err){
      console.log(err);
      console.log("connected to Mongodb");
      //如果连接成功，则向控制台输出connected to Mongodb
      resolve();
    }else{
      //如果连接失败，则抛出异常
      throw err;
    }
  });
  return p;
});



// 获取新闻列表页
router.get('/list',function(req,res){
  NewsModel.find({},function(err,docs){
    // {}表示查询所有数据，回调函数参数docs就是查询出来的结果，把结果作为newsdata的value
    // 用它去渲染模板newlist.ejs
    res.render('newslist.ejs',{
      title:'新闻列表',
      newsdata:docs
    });
  });
});
// 添加新闻
router.get('/newsadd',function(req,res){
  res.render('newsadd.ejs',{
    title:'添加新闻'
  });
});
router.post('/newsadd',function(req,res){
  // 获取页面的值
  var tbtitle = req.body.tbtitle;     //接收标题
  var tbcontent = req.body.tbcontent; //接收内容
  var tbsource = req.body.tbsource;   //接收来源
  var tbauthor = req.body.tbauthor;   //接收作者


  // 模型实例
  var instance = new NewsModel();
  // 给模型赋值
  instance.title = tbtitle;
  instance.content = tbcontent;
  instance.source = tbsource;
  instance.author = tbauthor;

  // 获取系统时间赋值给模型
  instance.ctime = new Date().toLocaleDateString();
  console.log(instance);
  // 保存到数据库
  instance.save(function(err){
    if(err){
      console.log(err);
      console.log('保存失败');
      return;
    }
    console.log("保存成功");
    //保存完毕之后跳转到list
    res.redirect("/news/list");
  });
});
// 修改新闻
router.get('/edit/:id',function(req,res){
  var id = req.params.id;
  NewsModel.findById(id,function(err,doc){
    res.render('newsedit.ejs',{
      title:'新闻编辑',
      newsdata:doc
    });
  });
});

router.post('/edit',function(req,res){
  var id = req.body.id;
  var tbtitle = req.body.tbtitle;
  var tbauthor = req.body.tbauthor;
  var tbsource = req.body.tbsource;
  var tbcontent = req.body.tbcontent;
  NewsModel.findById(id,function(err,doc){
    doc.title = tbtitle;
    doc.author = tbauthor;
    doc.source = tbsource;
    doc.content = tbcontent;
    doc.save(function(err){
      console.log(err);
      if(!err){
        res.redirect("/news/list");
      }else {
        throw err;
      }
    });
  });
});
// 查看新闻
router.get('/details/:id',function(req,res){
  var id = req.params.id;
  NewsModel.findById(id,function(err,doc){
    res.render('newsdetails.ejs',{
      title:'新闻详情页面',
      newsdata:doc
    });
  });
});
// 删除新闻
router.get('/delete/:id',function(req,res){
  var did = req.params.id;
  NewsModel.findById(did,function(err,doc){
    if(!doc){
      return next(new NotFound("Doc not found"));
    }else{
      doc.remove(function(){
        res.redirect("/news/list");
      })
    }
  });
});


module.exports = router;
