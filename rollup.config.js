export default {
  entry: 'dist/src/index.js',
  dest: 'dist/bundles/ngaxpath.umd.js',
  sourceMap: false,
  format: 'umd',
  moduleName: 'NgCanvasModule',
  globals: {
    '@angular/core': 'ng.core',
    '@angular/common': 'common',
    'd3': 'd3',
    'rxjs/Observable': 'Rx',
    'rxjs/ReplaySubject': 'Rx',
    'rxjs/add/operator/map': 'Rx.Observable.prototype',
    'rxjs/add/operator/mergeMap': 'Rx.Observable.prototype',
    'rxjs/add/observable/fromEvent': 'Rx.Observable',
    'rxjs/add/observable/of': 'Rx.Observable'

  }
}
