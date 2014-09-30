
var path = require('path'),
  fs = require('fs'),
  tar = require("tar"),
  zlib = require("zlib"),
  fstream = require("fstream"),
  _ = require('lodash'),
  derive = require('./filePathDerivatives');

var zipped = 0;
var zipping = 0;
function createTarGZ(path, files, outputPath, callback) {
  zipping++;
  fstream.Reader({
    path: path,
    type: "Directory",
    filter: function () {
      var isDirectory = this.type == "Directory"
      var relFilePath = derive.dropLeadingSlash(derive.difference(this.root.dirname, this.path));
      var willInclude = isDirectory || (files.indexOf(relFilePath) != -1);
      // if(willInclude && !isDirectory) {
      //   console.log("adding " + this.basename);
      // } else {
      //   console.log("skipping " + this.basename);
      // }
      return willInclude;
    }
  })
  .pipe(tar.Pack())
  .pipe(zlib.createGzip())
  .pipe(fstream.Writer(outputPath))
  .on('close', function() {
    zipped++;
    callback();
  })
}

function PackFiles (pathSrc, files, pathDst, onComplete, onError, grunt) {
  grunt.verbose.writeln('compressing', files.length , 'file(s) in', pathSrc);
  var rootPath = path.resolve('./' + pathSrc + '/..');
  var filePrependPath = path.resolve('./' + pathSrc + '/../..');
  rootPath = derive.dropLeadingSlash(derive.difference(rootPath, path.resolve('.')));
  filePrependPath = derive.dropLeadingSlash(derive.difference(filePrependPath, path.resolve(rootPath)));

  var prependDirPath = derive.dropLeadingSlash(derive.difference(rootPath, pathSrc));
  // grunt.verbose.writeln(prependDirPath);
  for (var i = files.length - 1; i >= 0; i--) {
    var filePath = path.resolve(pathSrc+files[i]);
    filePath = derive.dropLeadingSlash(derive.difference(filePath, path.resolve(rootPath)));
    files[i] = filePrependPath + '/' + filePath;
    var filePathRelToNode = rootPath + '/' + filePath;
    if(grunt.file.exists(filePathRelToNode)) {
      grunt.verbose.ok(filePathRelToNode, 'exists!');
    } else {
      grunt.log.error(filePathRelToNode, 'does not exist! omitting.');
      files.splice(i, 1);
    }
  };
  if(files.length > 0) {
    createTarGZ(rootPath, files, pathDst, function() {
      grunt.log.oklns("gzipped", pathDst);
      onComplete();
    });
  }
  // onComplete();
    // fs.exists(pathDst, function(exists) {
    //   if(exists) {
    //     grunt.verbose.error('File exists. Overwrite!');
    //   } else {
    //     grunt.verbose.ok('File does not exist. Create!');
    //   }
    // });
}

module.exports = PackFiles;
