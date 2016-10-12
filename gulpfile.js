 /////////////////////////////////////
// REQUIRES
var addsrc       = require('gulp-add-src'),
    argv         = require('yargs').argv,
    browserSync  = require('browser-sync').create(),
    cache        = require('gulp-cached'),
    clean        = require('gulp-clean'),
    concat       = require('gulp-concat'),
    data         = require('gulp-data'),
    exec         = require('child_process').exec,
    favicons     = require('gulp-favicons'),
    fs           = require('fs'),
    gulp         = require('gulp'),
    gulpif       = require('gulp-if'),
    inquirer     = require('inquirer'),
    intercept    = require('gulp-intercept'),
    jade         = require('gulp-jade'),
    jadelint     = require('gulp-jadelint'),
    jeditor      = require("gulp-json-editor"),
    jSass        = require('gulp-json-sass'),
    minifycss    = require('gulp-minify-css'),
    ngConfig     = require('gulp-ng-config'),
    npc          = require('copy-paste'),
    path         = require('path'),
    plumber      = require('gulp-plumber'),
    rename       = require('gulp-rename'),
    replace      = require('gulp-replace'),
    runSequence  = require('run-sequence'),
    sass         = require('gulp-sass'),
    sassLint     = require('gulp-sass-lint'),
    shell        = require('gulp-shell'),
    strip        = require('gulp-strip-comments'),
    ts           = require('gulp-typescript'),
    tslint       = require('gulp-tslint'),
    uglify       = require('gulp-uglify');

 /////////////////////////////////////
// FUNCTIONS
function addService(serviceName) {
    gulp.src(tmplDir+'ts/service.ts')
        .pipe(replace('@@{app}', appName))
        .pipe(replace('@@{name}', capFirstLetter(serviceName)))
        .pipe(replace('@@{nameLower}', serviceName.toLowerCase()))
        .pipe(rename(serviceName+'.ts'))
        .pipe(gulp.dest(jsSrcDir+'service/'));
}

function removeService(serviceName) {
    gulp.src([
        jsSrcDir+'service/'+capFirstLetter(serviceName)+'.ts'
    ],{
        read: false
    })
    .pipe(clean({force: true}));
}

function addFilter(filterName) {
    gulp.src(tmplDir+'ts/filter.ts')
        .pipe(replace('@@{app}', appName))
        .pipe(replace('@@{name}', filterName))
        .pipe(rename(filterName+'.ts'))
        .pipe(gulp.dest(jsSrcDir+'filter/'));
}

function removeFilter(filterName) {
    gulp.src([
        jsSrcDir+'filter/'+filterName+'.ts'
    ],{
        read: false
    })
    .pipe(clean({force: true}));
}

function addController(controllerName) {
    gulp.src(tmplDir+'ts/controller.ts')
        .pipe(replace('@@{app}', appName))
        .pipe(replace('@@{name}', capFirstLetter(controllerName)))
        .pipe(rename(controllerName+'.ts'))
        .pipe(gulp.dest(jsSrcDir+'controller/'));
}

function addPage(pageName) {
    gulp.src(tmplDir+'jade/page.jade')
        .pipe(replace('@@{name}', pageName))
        .pipe(rename(pageName+'.jade'))
        .pipe(gulp.dest(htmlSrcDir+'page/'));
    gulp.src(tmplDir+'scss/page.scss')
        .pipe(replace('@@{name}', pageName))
        .pipe(rename(pageName+'.scss'))
        .pipe(gulp.dest(cssSrcDir+'page/'));
    addController(pageName);
    addRoute(pageName, '/'+pageName, 'html/page/'+pageName+'.html', capFirstLetter(pageName)+'Controller');
}

function addComponent(name, attrs, restrict) {
    gulp.src(tmplDir+'jade/directive.jade')
        .pipe(replace('@@{name}', name.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()))
        .pipe(rename(name+'.jade'))
        .pipe(gulp.dest(htmlSrcDir+'directive/'));
    gulp.src(tmplDir+'scss/directive.scss')
        .pipe(replace('@@{name}', name.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()))
        .pipe(rename(name+'.scss'))
        .pipe(gulp.dest(cssSrcDir+'directive/'));
    addDirective(name, attrs, true, restrict);
}

function addDirective(name, attrs, template, restrict) {
    var attrsJson = {};
    var attrProps = [];
    var attrName; 
    var attrBinding = '=';

    restrict = !restrict ? "'EA'": "'" + restrict + "'";
    template = !template ? '' : `\n\t\ttemplateUrl: 'html/directive/${name}.html', \t\t`;

    if (attrs) {
        if (attrs.indexOf(',') > 0) {
            attrs = attrs.split(',');
            for(var i = 0; i < attrs.length; i++) {
                attrBinding = '=';
                var attr = attrs[i];
                attrName = attr;

                if (attr.indexOf(':') > 0) {
                    var attrSplit = attr.split(':');
                    attrName = attrSplit[0];
                    attrBinding = attrSplit[1];
                }

                attrsJson[attrName] = attrBinding;
                attrProps.push(`${attrName.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()}="''"`);
            }
        } else {
            attrName = attrs;
            if (attrs.indexOf('=') > 0) {
                var attrSplit = attr.split('=');
                attrName = attrSplit[0];
                attrBinding = attrSplit[1];
            }

            attrsJson[attrName] = attrBinding;
            attrProps.push(`${attrName.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()}="''"`);
        }

        var attrsJsonString = JSON.stringify(attrsJson);

        var copyText = `${name.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()}(\n\t${attrProps.join('\n\t')}\n)`;

        npc.copy(copyText);
    } else {
        attrsJsonString = '{}';
    }

    gulp.src(tmplDir+'ts/directive.ts')
        .pipe(replace('@@{app}', appName))
        .pipe(replace('@@{name}', name))
        .pipe(replace('@@{attrs}', attrsJsonString.replace(/"/g, "'").replace(/,/g, `,\n\t\t\t`).replace("{'", "{\n\t\t\t'").replace("'}", "'\n\t\t}")))
        .pipe(replace('@@{template}', template))
        .pipe(replace('@@{restrict}', restrict))
        .pipe(rename(name+'.ts'))
        .pipe(gulp.dest(jsSrcDir+'directive/'));
}

function removeComponent(name) {
    gulp.src([
        cssSrcDir+'directive/'+name+'.scss',
        jsSrcDir+'directive/'+name+'.ts',
        htmlSrcDir+'directive/'+name+'.jade',
        htmlDir+'directive/'+name+'.html'
    ],{
        read: false
    })
    .pipe(clean({force: true}));
}

function addModal(modalName) {
    gulp.src(tmplDir+'jade/modal.jade')
        .pipe(replace('@@{name}', modalName))
        .pipe(rename(modalName+'.jade'))
        .pipe(gulp.dest(htmlSrcDir+'modal/'));
    gulp.src(tmplDir+'scss/modal.scss')
        .pipe(replace('@@{name}', modalName))
        .pipe(rename(modalName+'.scss'))
        .pipe(gulp.dest(cssSrcDir+'modal/'));

    var copyText = `
        this.$ionicModal.fromTemplateUrl('html/modal/${modalName}.html', {
            scope: this.$scope,
            animation: 'slide-in-up',
            backdropClickToClose: true
        }).then((modal) => {
            this.modal = modal;
        });
    `;

    npc.copy(copyText);
}

function removeModal(modal) {
    gulp.src([
        cssSrcDir+'modal/'+modal+'.scss',
        htmlSrcDir+'modal/'+modal+'.jade',
        htmlDir+'modal/'+modal+'.html'
    ],{
        read: false
    })
    .pipe(clean({force: true}));
}

function addPopover(popover) {
    gulp.src(tmplDir+'jade/popover.jade')
        .pipe(replace('@@{name}', popover))
        .pipe(rename(popover+'.jade'))
        .pipe(gulp.dest(htmlSrcDir+'popover/'));
    gulp.src(tmplDir+'scss/popover.scss')
        .pipe(replace('@@{name}', popover))
        .pipe(rename(popover+'.scss'))
        .pipe(gulp.dest(cssSrcDir+'popover/'));

    var copyText = `
        this.$ionicPopover.fromTemplateUrl('html/popover/${popover}.html', {
            scope: this.$scope,
            'backdropClickToClose': true
        }).then((popover) => {
            this.popover = popover;
        });
    `;

    npc.copy(copyText);
}

function removePopover(popover) {
    gulp.src([
        cssSrcDir+'popover/'+popover+'.scss',
        htmlSrcDir+'popover/'+popover+'.jade',
        htmlDir+'popover/'+popover+'.html'
    ],{
        read: false
    })
    .pipe(clean({force: true}));
}

function removePage(state) {
    var newRoutes = appRoutes;
    for(var i=0; i < newRoutes.length; i++){
        var route = newRoutes[i];
        if(route.state === state){
            newRoutes.splice(i,1);
            gulp.src(configFile)
                .pipe(jeditor(function(json) {
                    json.routes = newRoutes;
                    return json; 
                }))
                .pipe(gulp.dest("./"));
        }
    }

    gulp.src([
        cssSrcDir+'page/'+state+'.scss',
        htmlSrcDir+'page/'+state+'.jade',
        htmlDir+'page/'+state+'.html',
        jsSrcDir+'controller/'+state+'.ts'
    ],{
        read: false
    })
    .pipe(clean({force: true}));
    
    setTimeout(function(){
        runSequence('router', 'js-build', 'sync-reload');
    }, 2000)
}

function addRoute(state, url, template, controller){
    var newRoutes = appRoutes;
    var newState = {
        state: state,
        url: url,
        templateUrl: template,
        controller: appName + '.' + controller + ' as ctrl'
    };
    newRoutes.push(newState);
    gulp.src(configFile)
        .pipe(jeditor({
            'routes': newRoutes
        }))
        .pipe(gulp.dest("./"));
    if (this.seq.slice(-1)[0] !== 'install') {
        setTimeout(function(){
            runSequence('router', 'js-build', 'sync-reload');
        }, 2000);
    } else {
        setVars();
    }
}

function capFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function checkString(string) {
    return /^[a-z]+$/i.test(string);
}

function cleanString(string) {
    return string.replace(/[^A-Za-z0-9]/g, '');
}

function merge() {
    var destination = {},
        sources = [].slice.call( arguments, 0 );
    sources.forEach(function( source ) {
        var prop;
        for ( prop in source ) {
            if ( prop in destination && Array.isArray( destination[ prop ] ) ) {
                destination[ prop ] = source[ prop ];
            } else if ( prop in destination && typeof destination[ prop ] === "object" ) {
                destination[ prop ] = merge( destination[ prop ], source[ prop ] );
            } else {
                destination[ prop ] = source[ prop ];
            }
        }
    });
    return destination;
}

function removeSpaces(string) {
    return string.replace(/\s+/g, '');
}

function onError(err) {
  global.isError = true;
  console.log(err);
  browserSync.notify(err.message);
  this.emit('end');
}

function setVars() {
    envFile      = '.env';
    if (environment) {
        envFile = envFile + '-' + environment;
    }
    try {
        env = JSON.parse(fs.readFileSync(envFile));
    } catch(e) {
        env = {};
    }
    configFile   = 'enjin.json';
    configJSON   = JSON.parse(fs.readFileSync(configFile));
    configJSON   = merge(configJSON, env);
    // APP
    appName      = configJSON.name;
    appDebug     = configJSON.debug;
    appDesc      = configJSON.description;
    appDir       = configJSON.root;
    appIcon      = configJSON.img.favicon;
    appLocal     = configJSON.local;
    appMobile    = configJSON.mobile;
    appRoutes    = configJSON.routes;
    appUrl       = configJSON.url;
    appVersion   = configJSON.version;
    appAuthor    = configJSON.author;
    appBuild     = 'build/';
    appPlugins   = configJSON.plugins;
    // CSS
    cssSrcDir    = configJSON.css.srcDir;
    cssDestDir   = appDir+configJSON.css.dir;
    cssDestFile  = configJSON.css.file;
    cssBuild     = configJSON.css.build;
    cssBuildDir  = appBuild+"css/";
    cssBuildLib  = 'library.scss';
    cssLib       = configJSON.css.libraries;
    cssLint      = 'scss-lint.yml';
    cssWatch     = configJSON.css.watch;
    // ERROR
    errorCount   = 0;
    errorTimeout = 10000;
    // FONT
    fontDir      = appDir+configJSON.font.dir;
    fontWatch    = configJSON.font.watch;
    // HTML
    htmlDir      = appDir+configJSON.html.dir;
    htmlFile     = configJSON.html.file;
    htmlSrcDir   = configJSON.html.srcDir;
    htmlSrcFile  = configJSON.html.srcFile;
    htmlWatch    = configJSON.html.watch;
    htmlTemplate = htmlSrcDir + htmlSrcFile;
    // IMG
    iconDir      = 'icon/';
    imgDir       = appDir+configJSON.img.dir;
    imgIconDir   = imgDir+iconDir;
    imgWatch     = configJSON.img.watch;
    // JS
    jsSrcDir     = configJSON.js.srcDir;
    jsDestDir    = appDir+configJSON.js.dir;
    jsDestFile   = configJSON.js.file;
    jsBuild      = configJSON.js.build;
    jsBuildDir   = appBuild+"js/";
    jsBuildLib   = 'library.js';
    jsLib        = configJSON.js.libraries;
    jsWatch      = configJSON.js.watch;
    // TEMPLATES
    tmplDir      = configJSON.templates;
}


 /////////////////////////////////////
// ON LOAD
environment = argv.e ? argv.e : false;
global.isWatching = false;
global.synced     = false;
global.isError    = false;
Now = new Date();
deployEnv = argv.e ? argv.e : 'app';
deploy = {
    env: deployEnv,
    note: argv.n ? argv.n : Now.toLocaleDateString() + ' ' + Now.toLocaleTimeString(),
    branch: deployEnv == 'app' ? 'dev' : 'production'
};
setVars();

 /////////////////////////////////////
// TASKS
gulp.task('deploy', shell.task(['gulp build --e=' + deploy.env, 'ionic upload --note "' + deploy.note + '" --deploy ' + deploy.branch]));

gulp.task('upload', shell.task(['gulp build --e=' + deploy.env, 'ionic upload --note "' + deploy.note]));

gulp.task('ios', shell.task(['gulp build --e=' + deploy.env, 'ionic build ios']));

gulp.task('add-controller', function(done){
    if (argv.n) {
        addController(argv.n);
        done();
    } else {
        inquirer.prompt([{
            type: 'input',
            message: 'What is the name of the controller?',
            name: 'controller'
        }], function(res) {
            addController(res.controller);
            done();
        });
    }
});

gulp.task('add-component', function(done){
    if (argv.n) {
        addComponent(argv.n, argv.a, argv.r);
        done();
    } else {
        inquirer.prompt([{
            type: 'input',
            message: 'What is the name of the component?',
            name: 'name'
        }, {
            type: 'input',
            message: 'What attributes will you be binding? (Comma separated)',
            name: 'attrs',
            default: false
        }], function(res) {
            addComponent(res.name, res.attrs);
            done();
        });
    }    
});

gulp.task('add-directive', function(done){
    if (argv.n) {
        addDirective(argv.n, argv.a, argv.t, argv.r);
        done();
    } else {
        inquirer.prompt([{
            type: 'input',
            message: 'What is the name of the directive?',
            name: 'name'
        }, {
            type: 'input',
            message: 'What attributes will you be binding? (Comma separated)',
            name: 'attrs',
            default: false
        }], function(res) {
            addDirective(res.name, res.attrs);
            done();
        });
    }
});


gulp.task('add-page', function(done){
    if (argv.n) {
        addPage(argv.n);
        done();
    } else {
        inquirer.prompt([{
            type: 'input',
            message: 'What is the name of the page?',
            name: 'page'
        }], function(res) {
            addPage(res.page);
            done();
        });
    }
});

gulp.task('add-service', function(done){
    if (argv.n) {
        addService(argv.n);
        done();
    } else {
        inquirer.prompt([{
            type: 'input',
            message: 'What is the name of the service?',
            name: 'service'
        }], function(res) {
            addService(res.service);
            done();
        });
    }
});

gulp.task('add-filter', function(done){
    if (argv.n) {
        addFilter(argv.n);
        done();
    } else {
        inquirer.prompt([{
            type: 'input',
            message: 'What is the name of the filter?',
            name: 'filter'
        }], function(res) {
            addFilter(res.filter);
            done();
        });
    }
});

gulp.task('add-route', function(done){
    inquirer.prompt([{
        type: 'input',
        message: 'What is the state name?',
        name: 'state'
    },{
        type: 'input',
        message: 'What is the url? ( Beginning with "/" )',
        name: 'url'
    },{
        type: 'input',
        message: 'What is the path to the template?',
        name: 'template'
    },{
        type: 'input',
        message: 'What is the name of the controller?',
        name: 'controller'
    }], function(res) {
        addRoute(res.state, res.url, res.template, res.controller);
        done();
    });
});

gulp.task('add-modal', function(done){
    if (argv.n) {
        addModal(argv.n);
        done();
    } else {
        inquirer.prompt([{
            type: 'input',
            message: 'What is the name of the modal?',
            name: 'modal'
        }], function(res) {
            addModal(res.modal);
            done();
        });
    }
});

gulp.task('add-popover', function(done){
    if (argv.n) {
        addPopover(argv.n);
        done();
    } else {
        inquirer.prompt([{
            type: 'input',
            message: 'What is the name of the popover?',
            name: 'popover'
        }], function(res) {
            addPopover(res.popover);
            done();
        });
    }
});

gulp.task('android', function(callback) {
    runSequence(
        'clean', 
        'config-build', 
        'html-template',
        'html-build', 
        'css-build', 
        'js-build',
        'android-run',
        callback
    );
});

gulp.task('android-run', shell.task(['ionic run android']));

gulp.task('build', function(callback){
    return runSequence(
        'clean', 
        'config-build',
        'html-template', 
        'html-build', 
        'css-build', 
        'js-build', 
        //'minify',
        callback
    );
});

gulp.task('clean', function(){
    return gulp.src(appBuild, {read: false})
    .pipe(clean({force: true}));
});

gulp.task('clean-install', function(){
    return gulp.src(['.git/'], {read: false})
    .pipe(clean({force: true}));
});

gulp.task('config', function(callback){
    runSequence(
        'js-app',  
        'config-js', 
        'config-css',
        callback
    );
});

gulp.task('config-run', function() {
    return gulp.src(tmplDir + 'ts/run.ts')
        .pipe(replace('@@{app}', appName))
        .pipe(gulp.dest(jsSrcDir));
});

gulp.task('config-build', function(){
    return runSequence(
        'set-vars', 
        'config',
        'router',
        'html-build', 
        'js-build', 
        'css-build'
    );
});

gulp.task('config-cordova', function(){
    return gulp.src(tmplDir+'config/config.xml')
        .pipe(replace('@@{name}', cleanString(appName).toLowerCase()))
        .pipe(replace('@@{title}', appName))
        .pipe(replace('@@{version}', appVersion))
        .pipe(replace('@@{description}', appDesc))
        .pipe(replace('@@{author}', appAuthor.name))
        .pipe(replace('@@{email}', appAuthor.email))
        .pipe(replace('@@{url}', appAuthor.url))
        .pipe(gulp.dest("./"));
});

gulp.task('config-css', function(){
    return gulp.src(configFile)
        .pipe(intercept(function(file) {
            var json = JSON.parse(file.contents.toString());
            file.contents = new Buffer(JSON.stringify(json.css.vars));
            return file;
        }))
        .pipe(jSass({
          sass: false
        }))
        .pipe(rename('_variables.scss'))
        .pipe(gulp.dest(cssSrcDir));
});

gulp.task('config-js', function(){
    return gulp.src(configFile)
        .pipe(jeditor(function(json) {
            json = merge(json, env);
            return {'enjin': json};
        }))
        .pipe(ngConfig(appName+'.config'))
        .pipe(rename('config.js'))
        .pipe(gulp.dest(jsBuildDir));
});


gulp.task('config-node', function(){
    return gulp.src('package.json')
        .pipe(jeditor(function(json) {
            json.name = cleanString(appName).toLowerCase();
            json.description = appDesc;
            json.version = appVersion;
            json.scripts.postinstall = 'gulp reinstall';
            return json; 
        }))
        .pipe(gulp.dest("./"));
});

gulp.task('config-sublime', function(){
    return gulp.src(tmplDir+'config/sublime.json')
        .pipe(gulpif(!appDebug, jeditor(function(json) {
            json.folders[0].folder_exclude_patterns = json.folders[0].folder_exclude_patterns.concat(['build', 'templates', 'node_modules', 'www']);
            return json; 
        })))
        .pipe(rename(appName+'.sublime-project'))
        .pipe(gulp.dest('./'));
});

gulp.task('config-vars', setVars);

gulp.task('css-build', function(){
    return runSequence(
        'config-css', 
        'css-import', 
        'css-lib', 
        //'css-lint', 
        'css-compile', 
        'css-concat'
    );
});

gulp.task('css-compile', function(){
    return gulp.src(cssWatch)
        .pipe(plumber({
            errorHandler: function(error) {
                console.log(error.message);
                browserSync.notify(error.message, errorTimeout);
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(gulp.dest(cssBuildDir));
});

gulp.task('css-concat', function(){
    return gulp.src(cssBuild)
        .pipe(concat(cssDestFile))
        .pipe(gulp.dest(cssDestDir))
        .pipe(gulpif(global.isWatching, browserSync.stream()));
});

gulp.task('css-lint', function(){
    var errorCount   = 0,
        errorMessage = [];
        global.isError = false;
    return gulp.src(cssWatch)
        .pipe(cache('css-lint'))
        .pipe(sassLint())
        .on('error', onError)
        .pipe(sassLint.format())
        .on('end', function(){
            if(!global.isError){
                runSequence('css-compile', 'css-concat');    
            }
        });
});

gulp.task('css-minify', function(){
    return gulp.src(cssDestDir+cssDestFile)
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss())
        .pipe(gulp.dest(cssDestDir));
});

gulp.task('css-import', function() {
    var imports = "";
    for(var i=0; i < configJSON.css.libraries.length; i++){
        var cssLib = configJSON.css.libraries[i];
        imports += '@import "../../'+cssLib+'";\n';
    }

    return gulp.src(tmplDir+'scss/libraries.scss')
        .pipe(replace('@@{libraries}', imports))
        .pipe(gulp.dest(cssSrcDir));
});

gulp.task('css-lib', function() {
    return gulp.src(cssSrcDir+'libraries.scss')
        .pipe(sass())
        .pipe(gulp.dest(cssBuildDir));
});

gulp.task('icon', function(){
    runSequence('favicon', 'icon-copy', 'html-template'); 
});

gulp.task('icon-copy', function(){
    return gulp.src(appIcon)
        .pipe(gulp.dest(imgDir));
});

gulp.task('install', function(done){
    inquirer.prompt([{
        type: 'input',
        message: 'What is the name of your new app?',
        default: appName,
        name: 'name'
    },{
        type: 'input',
        message: 'How would you describe your new app?',
        default: appDesc,
        name: 'description'
    },{
        type: 'input',
        message: 'What is the url of your app?',
        default: appUrl,
        name: 'url'
    },{
        type: 'input',
        message: 'Who is the author of this app?',
        default: appAuthor.name,
        name: 'author'
    },{
        type: 'input',
        message: 'What is the author\'s website url?',
        default: appAuthor.url,
        name: 'authorUrl'
    },{
        type: 'input',
        message: 'What is the author\'s email?',
        default: appAuthor.email,
        name: 'authorEmail'
    },{
        type: 'input',
        message: 'What pages would you like to start with? (Comma Separated)',
        default: 'home',
        name: 'pages',
    }], function(res) {
        gulp.src('./enjin.json')
        .pipe(jeditor(function(json) {
            json.name = cleanString(res.name);
            json.author.name = res.author;
            json.author.url = res.authorUrl;
            json.author.email = res.authorEmail;
            json.url = res.url;
            json.description = res.description;
            return json; 
        }))
        .pipe(gulp.dest("./"))
        .on('end', function(){
            setVars();

            if (res.pages.indexOf(',')) {
                var pages = res.pages.split(',');
                
                for (var i = 0; i < pages.length; i++) {
                    addPage(pages[i]);
                }
            } else {
                addPage(res.pages);
            }

            runSequence(
                'clean',
                'clean-install',
                'js-app',
                'config-run',
                'config-js', 
                'config-css', 
                'config-cordova', 
                'config-node', 
                'config-sublime',
                'tsd',
                'fonts',
                'favicon',
                'icon-copy', 
                'router',
                'html-template',
                'html-build', 
                'css-import', 
                'css-lib', 
                'css-compile', 
                'css-concat',  
                'js-compile', 
                'js-concat', 
                'sync', 
                'watch',
                done
            );
        });
    });
});

gulp.task('reinstall', function(done){
    runSequence(
        'clean',
        'js-app',  
        'config-js', 
        'config-css', 
        'config-node',
        'tsd',
        'fonts',
        'favicon',
        'icon-copy', 
        'router',
        'html-template',
        'html-build', 
        'css-import', 
        'css-lib',  
        'css-compile', 
        'css-concat', 
        'js-compile', 
        'js-concat', 
        'sync', 
        'watch',
        done
    );
});

gulp.task('favicon', function(){
    /*gulp.src(htmlSrcDir+'favicon.jade', {read: false})
        .pipe(clean());*/
    gulp.src(appIcon).pipe(favicons({
        appName: appName,
        appDescription: appDesc,
        background: "#fff",
        url: appUrl,
        path: '/img/icon/',
        version: appVersion,
        logging: true,
        html: htmlSrcDir+'favicon.jade'
    }))
    .pipe(gulp.dest(imgIconDir));
});

gulp.task('html-compile', function () {
    var errored = false;
    var errorMessage = [];
    var ext = htmlSrcFile.split('.').pop();
    return gulp.src(htmlWatch)
        .pipe(plumber({
            errorHandler: function(error) {
                errored = true;
                if(global.isWatching && global.synced){
                    errorMessage.push(error.message.replace(/(?:\r\n|\r|\n)/g, '<br />'));
                }
                this.emit('end');
            }
        }))
        .pipe(cache('html-compile'))
        .pipe(jade({
            locals: configJSON,
            pretty: true
        }))
        .pipe(rename(function(file){
            if(file.basename+'.'+ext === htmlSrcFile){
                file.basename = 'index';
                file.dirname = '../';
            }
        }))
        .pipe(gulp.dest(htmlDir))
        .on('end', function(){
            if(!errored && global.isWatching && global.synced){
                runSequence('sync-reload');
            }else if(errored && global.isWatching && global.synced){
                cache.caches = {};
                browserSync.notify("<div style='text-align:left;'>"+errorMessage.join("<hr />")+"</div>", errorTimeout);
            }
        });
});

gulp.task('html-build', function(){
    var ext = htmlSrcFile.split('.').pop();
    return gulp.src(htmlWatch)
        .pipe(gulpif(global.isWatching, plumber({
            errorHandler: function(error) {
                console.log(error.message);
                this.emit('end');
            }
        })))
        .pipe(jade({
            locals: configJSON,
            pretty: true
        }))        
        .pipe(rename(function(file){
            if(file.basename+'.'+ext === htmlSrcFile){
                file.basename = 'index';
                file.dirname = '../';
            }
        }))
        .pipe(gulp.dest(htmlDir));
});

gulp.task('html-lint', function(){
    var lintWatch = htmlWatch;
    lintWatch.pop();
    var errorCount = 0;
    var errorMessage = [];
    return gulp.src(lintWatch)
        .pipe(plumber({
            errorHandler: function(error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(jadelint())
        .pipe(intercept(function(file) {
            if(file.jadelint.errors.length > 0){
                errorCount = errorCount + file.jadelint.errors.length;
                errorMessage.concat(file.jadelint.errors);
                console.log(errorMessage);
            }
            return file;
        }))
        .on('end', function(){
            if(errorCount === 0 && global.isWatching && global.synced){
                runSequence('html-compile');
            }else if(errorCount > 0 && global.isWatching && global.synced){
                browserSync.notify(errorMessage.join("<br />"), errorTimeout);
            }
        });
});

gulp.task('html-template', function(){
    return gulp.src(htmlSrcDir+htmlSrcFile)
        .pipe(jade({
            locals: configJSON,
            pretty: true
        }))        
        .pipe(rename('index.html'))
        .pipe(gulp.dest(appDir))
        .on('end', function(){
            if(global.isWatching){ browserSync.reload(); }
        });
});

gulp.task('js-app', function(){
    return gulp.src(tmplDir+'ts/app.ts')
        .pipe(replace('@@{app}', appName))
        .pipe(replace('@@{plugins}', JSON.stringify(appPlugins).slice(1,-1).replace(/"/g, "'").replace(/,/g, ", \n\t\t")))
        .pipe(gulp.dest(jsSrcDir));
});

gulp.task('js-build', function(){
    return runSequence(
        'config-js', 
        //'js-lint', 
        'js-compile', 
        'js-concat'
    );
});

gulp.task('js-compile', function () {
    var tsResult = gulp.src(jsWatch)
        .pipe(gulpif(global.isWatching, plumber({
            errorHandler: function(error) {
                browserSync.notify(error.message, errorTimeout);
                this.emit('end');
            }
        })))
        .pipe(gulpif(global.isWatching,  cache('js-compile')))
        .pipe(addsrc('app/typings/index.d.ts'))
        .pipe(ts({
            "compilerOptions": {
                "target": "es5",
                "sourceMap": false
            }
        }));

        tsResult.dts.pipe(gulp.dest('build/js'));
        return tsResult.js.pipe(gulp.dest('build/js'));
});

gulp.task('js-concat', function(){
    var concatArr = jsLib.concat(jsBuild);
    return gulp.src(concatArr)
        .pipe(strip())
        .pipe(concat(jsDestFile))
        .pipe(gulp.dest(jsDestDir));
});

gulp.task('js-lib', function(){
    if(global.synced){
        runSequence('js-concat', 'sync-reload');
    }
});

gulp.task('js-lint', function(){
    var errorCount = 0;
    return gulp.src(jsWatch)
        .pipe(gulpif(global.isWatching, plumber({
            errorHandler: function(error) {
                cache.caches = {};
                browserSync.notify(error.message, errorTimeout);
                this.emit('end');
            }
        })))
        .pipe(gulpif(global.isWatching,  cache('js-lint')))
        .pipe(tslint())
        .pipe(tslint.report('prose'))
        .pipe(intercept(function(file) {
            errorCount = errorCount + file.tslint.failureCount;
            //console.log(file.tslint);
            return file;
        }))
        .on('end', function(){
            console.log(errorCount);
            if(errorCount === 0 && global.isWatching && global.synced){
                runSequence('js-compile', 'js-concat', 'sync-reload');
            }
        });
});

gulp.task('js-minify', function(){
    return gulp.src(jsDestDir+jsDestFile)
        .pipe(plumber({
            errorHandler: function(error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest(jsDestDir));
});

gulp.task('fonts', function(){
    return gulp.src(fontWatch)
        .pipe(gulp.dest(fontDir));
});

gulp.task('lint', function(){
    runSequence(
        'html-lint', 
        'css-lint', 
        'js-lint'
    );
});

gulp.task('minify', function(){
    runSequence(
        'css-minify', 
        'js-minify'
    );
});

gulp.task('remove-component', function(done){
    if (argv.n) {
        removeComponent(argv.n);
        done();
    } else {
        inquirer.prompt([{
            type: 'input',
            message: 'What is the name of the component you would like to remove? (CamelCase)',
            name: 'component'
        }], function(res) {
            removeComponent(res.component);
            done();
        });
    }
});

gulp.task('remove-directive', function(done){
    if (argv.n) {
        removeComponent(argv.n);
        done();
    } else {
        inquirer.prompt([{
            type: 'input',
            message: 'What is the name of the directive you would like to remove? (CamelCase)',
            name: 'directive'
        }], function(res) {
            removeComponent(res.directive);
            done();
        });
    }
});

gulp.task('remove-page', function(done){
    if (argv.n) {
        removePage(argv.n);
        done();
    } else {
        inquirer.prompt([{
            type: 'input',
            message: 'What is the state name of the page you would like to remove?',
            name: 'state'
        }], function(res) {
            removePage(res.state);
            done();
        });
    }
});

gulp.task('remove-service', function(done){
    if (argv.n) {
        removeService(argv.n);
        done();
    } else {
        inquirer.prompt([{
            type: 'input',
            message: 'What is the state name of the service you would like to remove?',
            name: 'service'
        }], function(res) {
            removeService(res.service);
            done();
        });
    }
});

gulp.task('remove-filter', function(done){
    if (argv.n) {
        removeFilter(argv.n);
        done();
    } else {
        inquirer.prompt([{
            type: 'input',
            message: 'What is the state name of the filter you would like to remove?',
            name: 'filter'
        }], function(res) {
            removeFilter(res.filter);
            done();
        });
    }
});

gulp.task('remove-modal', function(done){
    if (argv.n) {
        removeModal(argv.n);
        done();
    } else {
        inquirer.prompt([{
            type: 'input',
            message: 'What is the name of the modal you would like to remove?',
            name: 'modal'
        }], function(res) {
            removeModal(res.modal);
            done();
        });
    }
});

gulp.task('remove-popover', function(done){
    if (argv.n) {
        removePopover(argv.n);
        done();
    } else {
        inquirer.prompt([{
            type: 'input',
            message: 'What is the name of the popover you would like to remove?',
            name: 'popover'
        }], function(res) {
            removePopover(res.popover);
            done();
        });
    }
});

gulp.task('router', function(){
    var routes = [];
    var defaultRoute = false;

    for(var i=0; i < appRoutes.length; i++){
        var route = appRoutes[i];
        var stateName = route.state;
        delete route.state;
        if(!defaultRoute){
            defaultRoute = stateName;
        }
        routes.push(".state('"+stateName+"', "+ JSON.stringify(route).replace(/"/g, "'").replace(/,/g, ", \n") +")");
    }

    return gulp.src(tmplDir+'ts/router.ts')
        .pipe(replace('@@{app}', appName))
        .pipe(replace('@@{routes}', routes.join("\n\t\t\t\t")))
        .pipe(replace('@@{default}', defaultRoute))
        .pipe(gulp.dest(jsSrcDir));    
});

gulp.task('set-vars', setVars);

gulp.task('sync', function(){
    browserSync.init({
        port: 3000,
        files: ['index.html', '**/*.js'],
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'silent',
        logPrefix: appName,
        notify: true,
        reloadDelay: 0,
        server: {
            baseDir: appDir
        }
    });
    global.synced = true;
});

gulp.task('sync-reload', function(){
    browserSync.reload();
});

gulp.task('tsd', shell.task(['typings install']));

gulp.task('watch', function(){
    global.isWatching = true;
    gulp.watch(configFile, ['config-build']);
    gulp.watch(cssWatch, ['css-build']);
    gulp.watch(jsWatch, ['js-lint']);
    gulp.watch(jsLib, ['js-lib']);
    gulp.watch(htmlWatch, ['html-compile']);
    gulp.watch(htmlTemplate, ['html-template']);
    //gulp.watch(imgWatch, ['icon']);
});

gulp.task('default', function(callback){
    return runSequence(
        'clean',
        'router',
        'config',
        'html-template',
        'html-build',
        'css-import', 
        'css-lib', 
        'css-compile', 
        'css-concat', 
        'js-compile', 
        'js-concat', 
        'sync', 
        'watch',
        callback
    );
});