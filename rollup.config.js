import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import replace from 'rollup-plugin-replace';

process.env.BABEL_ENV = 'distribution'

export default {
  input: 'index.js',
  output: {
    file: process.env.NODE_ENV === 'production' ? 'dist/Ardagryd.min.js' : 'dist/Ardagryd.js',
    format: 'umd',
  },
  name: 'Ardagryd',
  plugins: [
    resolve(),
    commonjs({
      include: 'node_modules/**'
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
    (process.env.NODE_ENV === 'production' && uglify())
  ],
  sourcemap: true,
  external: [ 'react', 'prop-types' ],
  globals: {
    react: 'React',
    'prop-types': 'PropTypes'
  },
  exports: 'named'
};
