"use strict";

const gulp = require("gulp");
const webpack = require("webpack-stream");
const browsersync = require("browser-sync");

const dist = "./dist/";

gulp.task("copy-html", () => { //отслеживает изменения, вносимые в html файл
    return gulp.src("./src/index.html")//адрес html-файла
                .pipe(gulp.dest(dist))//перемещает в папку dist
                .pipe(browsersync.stream());//запускает browsersync для перезагрузки страницы 
});

gulp.task("build-js", () => {//черновая компиляция скриптов 
    return gulp.src("./src/js/main.js")
                .pipe(webpack({
                    mode: 'development',//режим разработки
                    output: {
                        filename: 'script.js'//место куда все будет складываться 
                    },
                    watch: false,//webpack не следит 
                    devtool: "source-map",//карта проекта,т.е. из каких кусочков они состоят 
                    module: { //подключенные модули webpack
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                              loader: 'babel-loader',
                              options: {
                                presets: [['@babel/preset-env', {
                                    debug: true,//если возникнет ошибка, то консоль покажет где она возникла 
                                    corejs: 3,
                                    useBuiltIns: "usage"//когда проект компилируется, библиотека corejs анализирует наш код, смотрит на browserlist, и подключает те полифилы, которые необходимы в нашем проекте 
                                }]]
                              }
                            }
                          }
                        ]
                      }
                }))
                .pipe(gulp.dest(dist))
                .on("end", browsersync.reload);
});

gulp.task("copy-assets", () => {
    return gulp.src("./src/assets/**/*.*")//из папки src/assets берет любые файлы в любых папках  
                .pipe(gulp.dest(dist + "/assets"))//при изменение перемещает в папку dist
                .on("end", browsersync.reload);//запускает browsersync для перезагрузки страницы
});

gulp.task("watch", () => {//запускается сервер, который работает при помощи browsersync
    browsersync.init({
		server: "./dist/",// серверет файлы, которые находятся в папке dist 
		port: 4000,
		notify: true
    });
    //gulp следит за изменениям в файлах, прописанных ниже 
    gulp.watch("./src/index.html", gulp.parallel("copy-html"));
    gulp.watch("./src/assets/**/*.*", gulp.parallel("copy-assets"));
    gulp.watch("./src/js/**/*.js", gulp.parallel("build-js"));
});

gulp.task("build", gulp.parallel("copy-html", "copy-assets", "build-js"));//параллельно запускает три перечисленные задачи 

gulp.task("build-prod-js", () => {
    return gulp.src("./src/js/main.js")
                .pipe(webpack({
                    mode: 'production',
                    output: {
                        filename: 'script.js'
                    },
                    module: {
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                              loader: 'babel-loader',
                              options: {
                                presets: [['@babel/preset-env', {
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]]
                              }
                            }
                          }
                        ]
                      }
                }))
                .pipe(gulp.dest(dist));
});

gulp.task("default", gulp.parallel("watch", "build"));//задача, запускаемая по умолчанию 