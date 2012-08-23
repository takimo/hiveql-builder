
/*
 * GET home page.
 */

var TITLE = "HiveQL Builder";

var hiveqlDB = require('dirty')('./data/hiveql.db');

var crypto = require('crypto'), shasum = crypto.createHash('sha1');

var template  = require('swig');

exports.index = function(req, res){
  var id = req.params.id || "";
  console.log(id);
  var hiveql = (id) ? hiveqlDB.get(id) : {template: "", data: ""};
  console.log(hiveql);
  res.render('index', { title: TITLE, id: id, hiveql: {
    template: hiveql.template,
    data: hiveql.data ? JSON.stringify(hiveql.data, null, "  ") : ""
  }});
};

exports.save = function(req, res){
  console.log(req.body);
  var getHex = function(){
    var time = (new Date()).getTime().toString();
    shasum.update(time);
    return shasum.digest('hex').slice(0,7);
  };
  var id = req.body.id ? req.body.id : getHex();

  var hiveql = {
    template: req.body.template,
    data: JSON.parse(req.body.data)
  };

  hiveqlDB.set(id, hiveql, function(){
    console.log("saved");
    res.redirect("/hiveql/" + id);
  });
};

exports.build = function(req, res){
  console.log(req.params.id);
  var hiveql = hiveqlDB.get(req.params.id);
  
  var sql = "";
  if(hiveql){
    var tmpl = template.compile(hiveql.template);
    sql = tmpl(hiveql.data);
  }
  res.render('build', { title: TITLE, hiveql: sql })
};

