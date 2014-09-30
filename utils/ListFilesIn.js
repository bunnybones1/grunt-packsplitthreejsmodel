var fs = require('fs');
var _grunt;

function ListFilesIn(path, grunt, onComplete) {
	_grunt = grunt;
	_grunt.verbose.writeln('getting list of files in', path);
	this.exploring = 0;
	this.files = [];
	this.path = path;
	this.onComplete = onComplete;
	this.finishOneExplorationAncCheckIfDone = this.finishOneExplorationAncCheckIfDone.bind(this);
	this.readDirAndAppendFiles = this.readDirAndAppendFiles.bind(this);
	this.readDirAndAppendFiles(this.path);
}

ListFilesIn.prototype = {
	finishOneExplorationAncCheckIfDone: function() {
		this.exploring--;
		if (this.exploring == 0) {
			_grunt.verbose.writeln('finished discovering files.');
			this.onComplete(this.files);
		}
	},
	readDirAndAppendFiles: function(path) {
		this.exploring++;
		var _this = this;
		fs.readdir(path, function(err, files) {
			if (err) _grunt.log.error(err);
			files.forEach(function(file) {
				file = path + '/' + file;
				// _grunt.verbose.writeln(file);
				_this.exploring++;
				fs.stat(file, function(err, stat) {
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