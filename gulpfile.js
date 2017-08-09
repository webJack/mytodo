var gulp = require('gulp');  //引入gulp
/*var gulpminHtml= require("gulp-minify-html");  //压缩html
var gulpJSMin= require("gulp-concat");  //压缩html*/
var $ = require("gulp-load-plugins")();  //引进所有的包
var open= require("open");


//复制html
gulp.task("html",function(){
    gulp.src("src/*.html")   //读取文件
        .pipe(gulp.dest("build/"))  //复制到开发环境
        //压缩后复制到生产环境
        .pipe($.minifyHtml())   //压缩
        .pipe(gulp.dest("dev")) //复制到生产环境
        .pipe($.connect.reload());

});

//合并压缩js
gulp.task("js",function(){
    gulp.src("src/js/*.js")   //读取文件
    //合并JS
        .pipe($.concat("index.js"))
        //复制到开发环境
        .pipe(gulp.dest("build/js"))
        //压缩js复制到 生产环境
        .pipe($.uglify())
        //复制到生产环境
        .pipe(gulp.dest("dev/js"))
        .pipe($.connect.reload());
});

//压缩css
gulp.task("css",function(){
    gulp.src("src/css/*.css")   //读取文件
    //复制到开发环境
        .pipe(gulp.dest("build/css"))
        //压缩css复制到 生产环境
        .pipe($.cssmin())
        //复制到生产环境
        .pipe(gulp.dest("dev/css"))
        .pipe($.connect.reload());
});

//压缩img
gulp.task("img",function(){
    gulp.src("src/images/*")   //读取文件
    //复制到开发环境
        .pipe(gulp.dest("build/images"))
        //压缩img复制到 生产环境
        .pipe($.imagemin())
        //复制到生产环境
        .pipe(gulp.dest("dev/images"))
        .pipe($.connect.reload());
});

//lib
gulp.task("lib",function () {
    gulp.src("bower_components/**/*.js")
        .pipe(gulp.dest("build/lib/"))
        .pipe(gulp.dest("dev/lib/"))
});

//删除文件夹
gulp.task("clear",function () {
    gulp.src(["dev/","build/"])
        .pipe($.clean());
});


//总的任务
gulp.task("build",["html","js","img","css","lib"]);


//自动刷新，自动打开
gulp.task("server",function(){
    $.connect.server({
        root:"build/",
        port: 8000,
        livereload: true
    });

    open("http://localhost:8000");

    gulp.watch("src/*.html",["html"]);
    gulp.watch("src/css/*.css",["css"]);
    gulp.watch("src/js/*.js",["js"]);
    gulp.watch("src/images/*",["img"]);
});



//默认任务
gulp.task('default', ['server']);