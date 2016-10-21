const runSequence = require('run-sequence');


module.exports = function(gulp, callback) {
    return runSequence(
        'config:css', 
        'css:import', 
        'css:libraries', 
        //'css:lint', 
        'css:compile', 
        'css:concat'
    );
};