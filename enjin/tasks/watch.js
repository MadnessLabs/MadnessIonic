module.exports = function(gulp, callback) {
    global.isWatching = true;
    gulp.watch(configFile, ['config:build']);
    gulp.watch(cssWatch, ['css:build']);
    gulp.watch(jsWatch, ['js:lint']);
    gulp.watch(jsLib, ['js:libraries']);
    gulp.watch(htmlWatch, ['html:compile']);
    gulp.watch(htmlTemplate, ['html:template']);
    //gulp.watch(imgWatch, ['img:icon']);
};