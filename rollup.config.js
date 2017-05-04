import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import uglify from 'rollup-plugin-uglify';
import replace from 'rollup-plugin-replace';

process.env.BABEL_ENV = 'distribution'

export default {
  entry: 'index.js',
  format: 'umd',
  moduleName: 'Ardagryd',
  plugins: [
    eslint(),
    resolve(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
    (process.env.NODE_ENV === 'production' && uglify())
  ],
  dest: process.env.NODE_ENV === 'production' ? 'dist/Ardagryd.min.js' : 'dist/Ardagryd.js',
  sourceMap: true,
  external: [ 'react', 'prop-types' ],
  globals: {
    react: 'React',
    'prop-types': 'PropTypes'
  },
  exports: 'named'
};
