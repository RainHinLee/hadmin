
var path = require('path')
var fs = require('fs');
var config = require('./config.js');
var session = require('./session.js');

module.exports = function (req,res,next){
  var teacher = req.params.teacher;
  if(teacher){
    session.findByUsername(teacher).then(result=>{
      return session.create(result.uid).then(session=>{ //---生成cookie
        var maxAge = 1*24*60*60*1000;
        var options = {
            expires: new Date(Date.now() + maxAge)
        };
        res.cookie(config.sessionKey,session,options);
        setTimeout(()=>{
          res.redirect("/");
        },100)
      });
    }).catch(err=>{
      console.log('err',err.message)
      res.redirect("/");
    })
  }else{
    res.redirect("/");
  }
}
