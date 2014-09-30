var fs = require('fs');
var _grunt;

function DiscoverGeometryFiles(path, files, grunt, onComplete) {
	_grunt = grunt;
	_grunt.verbose.writeln('discovering geometries in', path);
	this.exploring = 0;
	this.files = files;
	this.geometryFiles = [];
	this.path = path;
	this.onComplete = onComplete;
	this.finishOneExplorationAncCheckIfDone = this.finishOneExplorationAncCheckIfDone.bind(this);
	this.findGeometryReferenceInFile = this.findGeometryReferenceInFile.bind(this);
	this.reducedGeometryFiles = [];
	for (var i = this.files.length - 1; i >= 0; i--) {
		this.findGeometryReferenceInFile(this.files[i]);
	};
}

DiscoverGeometryFiles.prototype = {
	finishOneExplorationAncCheckIfDone: function() {
		this.exploring--;
		if (this.exploring == 0) {
			_grunt.verbose.writeln('finished discovering geometries.');

			for (var i = this.geometryFiles.length - 1; i >= 0; i--) {
				if(this.reducedGeometryFiles.indexOf(this.geometryFiles[i]) == -1) {
					this.reducedGeometryFiles.push(this.geometryFiles[i]);
				}
			};

			for (var i = this.reducedGeometryFiles.length - 1; i >= 0; i--) {
          		this.reducedGeometryFiles[i] = '/../geometry/' + this.reducedGeometryFiles[i] + '.json';
			};

			this.onComplete(this.reducedGeometryFiles);
		}
	},
	findGeometryReferenceInFile: function(file) {
		this.exploring++;
		var _this = this;
		fs.readFile(file, function(err, data) {
			if (err) _grunt.log.error(err);
			var obj = JSON.parse(data);
			if(obj.geometry) {
				_this.geometryFiles.push(obj.geometry);
			}
			_this.finishOneExplorationAncCheckIfDone();
		});
	}
}

module.exports = DiscoverGeometryFiles;