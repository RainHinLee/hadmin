
import util from "util";
import moment from "moment";
import api from "api";

const store =  {

  get(url){
    return api.get(url).then(res=>{
      res['user_list'].forEach(item=>{
        item['_reseting'] = false;
        item['_resetHandler'] = ()=>{
          item['_reseting'] = true;
          return store.reset(item.uid).then(result=>{
            item['_reseting'] = false;
            return result
          }).catch(err=>{
            item['_reseting'] = false;
            return Promise.reject(err);
          })
        };
        item['_href'] = `https://www.hanbridgemandarin.com/user/admin_login/${item.uid}`;
        item['_test_href'] = `localhost:8085/user/admin_login/${item.uid}`;
      });
      return res;
    })
  },

  getByPage(page){
    let url = `/user/list/pagetotal/1/pagesize/12/page/${page}`;
    return store.get(url);
  },

  getByName(username){
    let url = `/user/list/pagetotal/1/pagesize/12/userid/${username}`;
    return store.get(url);
  },

  reset(uid){ //--重置密码
    let url = `/user/passwd_reset/uid/${uid}/passwd/123456`;
    return api.get(url);
  }
};

export default store
