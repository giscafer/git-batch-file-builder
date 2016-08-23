var app = require('koa')(),
    router = require('./route.js');

app.use(router.routes());

var server = app.listen(3000, function() {
    console.log('Koa is listening to http://localhost:3000  ' + new Date());
});
