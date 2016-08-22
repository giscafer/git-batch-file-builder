"use strict";
var router = require('koa-router')();

router.post('/test',function  *(next){
 let id =ctx.request.body.id || 0;
 //  let id =this.params.id || 0;
 this.body = "you post data:"+JSON.stringify({id:id});
});
router.get('/test/:id',function  *(next){
 let id =this.params.id || 0;
 this.body = "you post data:"+JSON.stringify({id:id});
});

module.exports = router;
