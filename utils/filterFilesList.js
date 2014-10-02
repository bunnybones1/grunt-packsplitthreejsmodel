var fs = require('fs'),
  derive = require('filepathderivatives');

var INCLUDE_ONLY = 1;

function match(file, extensions, mode) {
	if(mode === INCLUDE_ONLY) {
		var valid = false;
		for (var i = extensions.length - 1; i >= 0; i--) {
			if(derive.hasExtension(file, extensions[i])) {
				valid = true;
			}
		};
		return valid;
	}
}

function filterFilesList(files, extensions, grunt, mode) {
	grunt.verbose.writeln('filtering files by', extensions);
	var totalWas = files.length;
	for (var i = files.length - 1; i >= 0; i--) {
		if(!match(files[i], extensions, mode)) {
			files.splice(i, 1);
		}
	};
	var totalIs = files.length;
	grunt.verbose.writeln('removed', totalWas-totalIs, 'files');
	return files;
}

filterFilesList.INCLUDE_ONLY = INCLUDE_ONLY;
filterFilesList.prototype = {
}

module.exports = filterFilesList;