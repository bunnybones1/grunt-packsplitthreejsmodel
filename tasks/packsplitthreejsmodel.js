/*
 * grunt-packsplitthreejsmodel
 * https://github.com/Tomasz/grunt-packsplitthreejsmodel
 *
 * Copyright (c) 2014 Tomasz Dysinski
 * Licensed under the MIT license.
 */

'use strict';

var PackFiles = require('../utils/PackFiles'),
  PackJsonTreeFiles = require('../utils/PackJsonTreeFiles'),
  derive = require('filepathderivatives'),
  path = require('path'),
  filterFilesList = require('../utils/filterFilesList');

var writingFileGroups = 0;
var done;

function wroteFileGroupCompleteCallback() {
  console.log('wrote');
  writingFileGroups--;
  if(writingFileGroups === 0) {
    done();
  }
}
function errorHandler(err) {
  // grunt.fail.fatal(err);
}

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  grunt.registerMultiTask('packsplitthreejsmodel', 'A task to compress files and folder for streaming.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    done = this.async();
    var options = this.options({
    });

    var i, model, pathSrc, files, outputPath;

    grunt.log.ok("COMPRESSING FULL JSON");

    for (i = options.models.length - 1; i >= 0; i--) {
      writingFileGroups++;
      model = path.normalize(options.models[i]);
      pathSrc = path.dirname(model);
      files = [derive.replaceExtension(path.basename(model), 'json')];
      outputPath = derive.replaceExtension(model, 'full.tar.gz');
      new PackFiles(
        pathSrc,
        files,
        outputPath,
        wroteFileGroupCompleteCallback,
        errorHandler,
        grunt);
    }
    grunt.log.ok("COMPRESSING JSON TREE");

    for (i = options.models.length - 1; i >= 0; i--) {
      writingFileGroups++;
      model = options.models[i];
      pathSrc = path.dirname(model);
      outputPath = derive.replaceExtension(model, 'tree.tar.gz');
    
      new PackJsonTreeFiles(
        path.normalize(pathSrc + '/' + path.basename(model, path.extname(model))),
        outputPath,
        wroteFileGroupCompleteCallback,
        errorHandler,
        grunt);
    }
    return;
    grunt.log.ok("COMPRESSING INDIVIDUAL GEOMETRIES");
    grunt.log.ok("COMPRESSING BRANCH GEOMETRIES");
    grunt.log.ok("COMPRESSING SAMPLE STARTERKIT");

    grunt.log.ok("DONE");
  });

};
