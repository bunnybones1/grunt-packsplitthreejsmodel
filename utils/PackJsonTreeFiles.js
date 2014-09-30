var PackFiles = require('./PackFiles'),
  DiscoverGeometryFiles = require('./DiscoverGeometryFiles'),
  derive = require('./filePathDerivatives'),
  ListFilesIn = require('./ListFilesIn'),
  filterFilesList = require('./filterFilesList');

function PackJsonTreeFiles (pathSrc, pathDst, onComplete, onError, grunt) {
  new ListFilesIn(pathSrc, grunt, function(files) {
    filterFilesList(files, ['.json'], grunt, filterFilesList.INCLUDE_ONLY);
    new DiscoverGeometryFiles(pathSrc, files, grunt, function(geomFiles){
      files = files.concat(geomFiles);
      for (var i = files.length - 1; i >= 0; i--) {
        var shortenedIfPossible = derive.difference(files[i], pathSrc);
        if(shortenedIfPossible) {
          files[i] = shortenedIfPossible;
        }
      };
      PackFiles.call(this, pathSrc, files, pathDst, onComplete, onError, grunt);
    });
  });
}

PackJsonTreeFiles.prototype = Object.create(PackFiles.prototype);

module.exports = PackJsonTreeFiles;
