git-batch-file-builder
======================

Git批处理文件生成，Git批量克隆、更新、重置

### About 

编写此工具的原因是工作上遇到数十个工程，需要一个个`git clone`到本地，所以想使用工具替代重复的操作。

在`生成bat文件`时，需要允许浏览器弹窗下载文件，如下图：

[允许浏览器弹窗](https://raw.githubusercontent.com/giscafer/git-batch-file-builder/master/allowpopwin.jpg)

### Dependencies

* AngularJS 1.0.7+
* Bootstrap 2.3.2+
* Grunt (to build the project) 0.4.1+

## Installing the Application

* 前置环境:
 ```
  $ npm install -g grunt-cli
  $ npm install -g grunt
  $ npm install -g bower 
 ```

* 然后下载代码: 
 ``` 
  $ git clone git@github.com:/selmanh/git-batch-file-builder.git 
  $ cd git-batch-file-builder/ 
 ```
  
* 接着安装node依赖包: 
 ``` 
  $ npm install 
 ``` 
 
* 使用bower安装前端依赖库: 
 ``` 
  $ bower install 
 ``` 
 
## Launching the App

* 启动server: 
 ```
  $ grunt server --force
 ```
 
* 将会使用你的默认浏览器打开App首页 

### Related

* A simple form builder application written with AngularJS. http://selmanh.github.io/angularjs-form-builder


## License
![](https://img.shields.io/badge/license-MIT-blue.svg)

---

> [giscafer.com](http://giscafer.com) &nbsp;&middot;&nbsp;
> GitHub [@giscafer](https://github.com/giscafer) &nbsp;&middot;&nbsp;
> Weibo [@Nickbing Lao](https://weibo.com/laohoubin)
