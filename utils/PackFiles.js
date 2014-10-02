
var path = require('path'),
  fs = require('fs'),
  tar = require("tar"),
  zlib = require("zlib"),
  fstream = require("fstream"),
  _ = require('lodash'),
  derive = require('filepathderivatives');

var zipped = 0;
var zipping = 0;
function createTarGZ(path, files, outputPath, callback) {
  zipping++;
  fstream.Reader({
    path: path,
    type: "Directory",
    filter: function () {
      var isDirectory = this.type == "Directory"
      var relFilePath = derive.difference(this.root.dirname, this.path);
      var willInclude = isDirectory || (files.indexOf(relFilePath) != -1);
      if(willInclude && !isDirectory) {
        console.log("adding " + this.basename);
      } else {
        console.log("skipping " + this.basename);
      }
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
  grunt.verbose.writeln('compressing', files.length , 'file(s) in', path.normalize(pathSrc));
  var rootPath = path.resolve(pathSrc);
  var filePrependPath = path.resolve(pathSrc + '/..');
  // console.log(rootPath);
  // console.log(filePrependPath);
  filePrependPath = derive.difference(filePrependPath, rootPath);
  rootPath = derive.difference(path.resolve(rootPath), path.resolve('.'));

  // console.log(rootPath);
  // console.log(filePrependPath);
  // var prependDirPath = derive.dropLeadingSlash(derive.difference(rootPath, pathSrc));
  // grunt.verbose.writeln(prependDirPath);

  var temp = path.resolve('./' + rootPath + '/../..');
  var gzipPath = path.resolve('./' + rootPath + '/..');
  temp = derive.difference(gzipPath, temp);
  for (var i = files.length - 1; i >= 0; i--) {
    var filePath = path.normalize(files[i]);
    // filePath = derive.difference(filePath, path.resolve(rootPath));
    files[i] = path.normalize(temp + filePrependPath + '/' + filePath);
    var filePathRelToNode = path.normalize('.' + rootPath + '/' + filePath);
    if(grunt.file.exists(filePathRelToNode)) {
      grunt.verbose.ok(filePathRelToNode, 'exists!');
      console.log(files[i]);
    } else {
      grunt.log.error(filePathRelToNode, 'does not exist! omitting.');
      files.splice(i, 1);
    }
  };
  if(files.length > 0) {
    createTarGZ(gzipPath, files, pathDst, function() {
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
