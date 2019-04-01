
const store = {
  time: Date.now(),
  fonts: '//at.alicdn.com/t/font_503735_rdy6x85h0po.css',   //---阿里字体库
  test:{
    api: "",
    domain: "",
    cmsapi: "",
  },
  release:{
    api: "http://dev.hanbridgemandarin.com/api2",
    cmsapi: "http://dev.hanbridgemandarin.com/cmsapi",
    domain: "/hadmin"
  }
};
//---webpack插件使用的正则
store['patterns'] = {
  test: [
    {pattern: /_api/g, replacement(){return store.test.api}},
    {pattern: /_cmsapi/g, replacement(){return store.test.domain}},
    {pattern: /_domain/g, replacement(){return store.test.cmsapi}},
    {pattern: /_timestamp/g, replacement(){return store.time}},

  ],

  release: [
    {pattern: /_api/g, replacement(){return store.release.api}},
    {pattern: /_domain/g, replacement(){return store.release.domain}},
    {pattern: /_cmsapi/g, replacement(){return store.release.cmsapi}},
    {pattern: /_timestamp/g, replacement(){return store.time}},
  ],
}





module.exports =store
