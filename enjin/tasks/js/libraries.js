const runSequence = require('run-sequence');


module.exports = function(gulp, callback) {
    if(global.synced){
        runSequence(
            'js:concat', 
            'sync:reload'
        );
    }
};