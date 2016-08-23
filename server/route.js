"use strict";
var router = require('koa-router')();

router.get('/', function *(next) {
  yield this.render('index', {
    title: 'Hello World Koa!'
  });
});

router.post('/test1',function  *(data,next){
 let id =ctx.request.body.id || 0;
 //  let id =this.params.id || 0;
 	console.log(this.body)
	return id;
});
router.get('/test2',function  *(next){
	console.log(111111111)
	 let id =this.params.id || 0;
	 this.body = "you post data:"+JSON.stringify({id:id});
});

module.exports = router;
