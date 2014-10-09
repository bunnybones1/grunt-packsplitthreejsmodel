# grunt-splitthreejsmodel

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

> A grunt plugin to compress threejs json model files. The resulting TAR GZ files are optimized to decompress in the order you want, in case you're using a streaming decompressor. For use in conjunction with [grunt-convertautodesktothreejs](https://github.com/bunnybones1/grunt-convertautodesktothreejs) and [grunt-splitthreejsmodel](https://github.com/bunnybones1/grunt-splitthreejsmodel).

[![NPM](https://nodei.co/npm/grunt-splitthreejsmodel.png)](https://nodei.co/npm/grunt-splitthreejsmodel/)

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install bunnybones1/grunt-packsplitthreejsmodel --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-packsplitthreejsmodel');
```

## The "packsplitthreejsmodel" task

### Overview
In your project's Gruntfile, add a section named `packsplitthreejsmodel` to the data object passed into `grunt.initConfig()`.

### Usage Examples

```js
grunt.initConfig({
  packsplitthreejsmodel: {
    options: {
      // Task-specific options go here.
    },
    exampleScene: {
      options: {
        // Target-specific options go here.
        models: [
          'test/model1/parse.autodesk.dae'
        ]
      }
    }
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).