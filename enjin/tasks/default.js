const runSequence = require('run-sequence');


module.exports = function(gulp, callback) {
    return runSequence(
        'clean:build',
        'router',
        'config',
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