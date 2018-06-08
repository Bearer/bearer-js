import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import typescript from 'rollup-plugin-typescript2'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'

import { version } from './package.json'

const { parsed: parsedConfig } = require('dotenv').config()

const isProduction = process.env.NODE_ENV === 'production'

if (isProduction) {
  const { parsed: parsedSample } = require('dotenv').config({
    path: '.env.example'
  })

  const requiredKeys = new Set(Object.keys(parsedSample || {}))

  const setEquality = (set1, set2) =>
    set1.size === set2.size && Array.from(set1).every(item => set2.has(item))

  const configuredKeys = new Set(
    Object.keys(parsedConfig || {}).filter(key => parsedConfig[key])
  )
  if (!setEquality(requiredKeys, configuredKeys)) {
    console.warn('Missing configuration, please check .env.* files')
  }
}

function plugins() {
  const base = [
    typescript({}),
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    }),
    replace({
      LIB_VERSION: version
    })
  ]
  return isProduction
    ? [...base, uglify()]
    : [...base, serve({ contentBase: ['dist', 'static'] }), livereload()]
}

const bundles = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/main.es.js',
        format: 'es'
      },
      {
        file: 'dist/main.js',
        format: 'cjs',
        exports: 'named'
      },
      {
        file: 'dist/main.browser.js',
        name: 'Bearer',
        format: 'iife'
      }
    ],
    plugins: plugins()
  },
  {
    input: 'src/plugins.ts',
    output: {
      file: 'dist/plugins.js',
      format: 'cjs'
    }
  }
]

export default bundles