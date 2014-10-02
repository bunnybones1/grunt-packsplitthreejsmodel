var fs = require('fs');
var _grunt;
var path = require('path');
function ListFilesIn(srcPath, grunt, onComplete) {
	_grunt = grunt;
	_grunt.verbose.writeln('getting list of files in', srcPath);
	this.exploring = 0;
	this.files = [];
	this.srcPath = srcPath;
	this.onComplete = onComplete;
	this.finishOneExplorationAncCheckIfDone = this.finishOneExplorationAncCheckIfDone.bind(this);
	this.readDirAndAppendFiles = this.readDirAndAppendFiles.bind(this);
	this.readDirAndAppendFiles(this.srcPath);
}

ListFilesIn.prototype = {
	finishOneExplorationAncCheckIfDone: function() {
		this.exploring--;
		if (this.exploring == 0) {
			_grunt.verbose.writeln('finished discovering files.');
			this.onComplete(this.files);
		}
	},
	readDirAndAppendFiles: function(srcPath) {
		this.exploring++;
		var _this = this;
		fs.readdir(srcPath, function(err, files) {
			if (err) _grunt.fail.error(err);
			files.forEach(function(file) {
				file = path.normalize(srcPath + '/' + file);
				// _grunt.verbose.writeln(file);
				_this.exploring++;
				fs.stat(file, function(err, stat) {
					if(err) {
						_grunt.fail.error(err);
					} 
					if (stat && stat.isDirectory()) {
						_this.readDirAndAppendFiles(file);
					} else {
						_this.files.push(file);
					}
					_this.finishOneExplorationAncCheckIfDone();
				});
			});
			_this.finishOneExplorationAncCheckIfDone();
		});
	}
}

module.exports = ListFilesIn;