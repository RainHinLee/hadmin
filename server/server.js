
const express = require('express');
const httpProxy =  require('express-http-proxy'); //https://github.com/villadora/express-http-proxy
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const proxyConfig = require('./proxyConfig.js');
const routes = require('./routes/index.js');

const app = express();
const port = 18080;
const PROXY_HOST = "http://dev.hanbridgemandarin.com"

//---设置代理服务器
Object.keys(proxyConfig).forEach(item=>{
  let {prefix} = proxyConfig[item];  //--handler可以为Promise
  app.use(item,httpProxy(PROXY_HOST,{
    proxyReqPathResolver(req,res){
      console.log(`/${prefix}${req.originalUrl}`)
      return `/${prefix}${req.originalUrl}`;
    }
  }))
});

//--静态文件设置
app.use(express.static(path.resolve(__dirname,'./dist')));
app.use(express.static(path.resolve(__dirname,'./statics')));

//--解析数据
app.use(cookieParser())
app.use(bodyParser.json()); // application/json
app.use(bodyParser.urlencoded({ 'extended': true })); // application/x-www-form-urlencoded

//--页面路由
app.use(routes.session.query)
app.get('/',routes.home); //--首页
app.get('/user/login',routes.login)//--登录页
app.get('/user/logout',routes.session.logout)//--登录页
app.post('/user/login',routes.session.login)
//--监听端口 ，；，，，
app.listen(port);

//zoom: https://zoom.us/j/313595733?uname=RainHinLee

/*
 	https://hanbridge.webex.com/hanbridge/m.php?MTID=m61ea8c5b82654b7bb55b00e7f30cf724
 	https://hanbridge.webex.com/hanbridge/e.php?MTID=mee6950db7b31713ff83cb1aa398fd1cb
 	https://hanbridge.webex.com/hanbridge/e.php?MTID=mee6950db7b31713ff83cb1aa398fd1cb

 *
 * */
