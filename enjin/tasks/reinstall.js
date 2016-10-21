const runSequence = require('run-sequence');


module.exports = function(gulp, callback) {
    runSequence(
        'clean:build',
        'js:app',  
        'config:js', 
        'config:css', 
        'config:node',
        'typings',
        'font:copy',
        'img:icon:favorite',
        'img:icon:copy', 
        'router',
        'html:template',
        'html:build', 
        'css:import', 
        'css:libraries',  
        'css:compile', 
        'css:concat', 
        'js:compile', 
        'js:concat', 
        'sync:start', 
        'watch',
        callback
    );
};