/*
 * @Author: Yorn Qiu
 * @Date: 2022-04-27 11:59:49
 * @LastEditors: Yorn Qiu
 * @LastEditTime: 2022-08-03 15:37:43
 * @Description: file content
 * @FilePath: /flatpad/rollup.config.js
 */
import { join } from 'path';
import { rmSync, mkdirSync, existsSync } from 'fs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import babel from '@rollup/plugin-babel';
import dts from 'rollup-plugin-dts';
import pkg from './package.json';

if (existsSync('./lib')) {
  rmSync('./lib', { recursive: true });
}
mkdirSync('./lib');

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author}
 * @license ${pkg.license}
 */`;

const replaceOpts = {
  'process.env.BABEL_ENV': null,
  preventAssignment: true,
};

const babelOpts = {
  babelHelpers: 'bundled',
  exclude: 'node_modules/**',
};

export default (async () => [
  // dev
  {
    input: 'src/index.ts',
    output: [
      {
        file: `./lib/index.js`,
        format: 'cjs',
        name: pkg.name,
        banner,
      },
      {
        file: `./lib/index.umd.js`,
        format: 'umd',
        name: pkg.name,
        banner,
      },
      {
        file: `./lib/index.esm.js`,
        format: 'esm',
        banner,
      },
    ],
    plugins: [
      nodeResolve({ extensions: ['.js', '.ts'] }),
      babel(babelOpts),
      replace(replaceOpts),
      typescript({ tsconfig: join(__dirname, 'tsconfig.json') }),
    ],
  },
  // prod
  {
    input: 'src/index.ts',
    output: [
      {
        file: `./lib/index.min.js`,
        format: 'cjs',
        name: pkg.name,
        sourcemap: true,
        banner,
      },
      {
        file: `./lib/index.umd.min.js`,
        format: 'umd',
        name: pkg.name,
        sourcemap: true,
        banner,
      },
      {
        file: `./lib/index.esm.min.js`,
        format: 'esm',
        sourcemap: true,
        banner,
      },
    ],
    plugins: [
      nodeResolve({ extensions: ['.js', '.ts'] }),
      babel(babelOpts),
      replace(replaceOpts),
      typescript({ tsconfig: join(__dirname, 'tsconfig.json') }),
      terser(),
    ],
  },
  // dts
  {
    input: 'src/index.ts',
    output: [
      {
        file: `./lib/index.d.ts`,
        format: 'es',
      },
    ],
    plugins: [dts()],
  },
])();
