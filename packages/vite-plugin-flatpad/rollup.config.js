/*
 * @Author: Yorn Qiu
 * @Date: 2022-04-27 11:59:49
 * @LastEditors: Yorn Qiu
 * @LastEditTime: 2023-05-11 09:08:36
 * @Description: file content
 * @FilePath: /flatpad/packages/vite-plugin-flatpad/rollup.config.js
 */

import { rmSync, mkdirSync, existsSync, readFileSync } from 'fs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import babel from '@rollup/plugin-babel';
import dts from 'rollup-plugin-dts';

if (existsSync('./dist')) {
  rmSync('./dist', { recursive: true });
}
mkdirSync('./dist');

const pkg = JSON.parse(readFileSync('./package.json'));

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
        file: `./dist/index.js`,
        format: 'cjs',
        name: pkg.name,
        banner,
      },
      {
        file: `./dist/index.esm.js`,
        format: 'esm',
        banner,
      },
    ],
    plugins: [
      nodeResolve({ extensions: ['.js', '.ts'] }),
      babel(babelOpts),
      replace(replaceOpts),
      typescript({ declaration: false }),
    ],
  },
  // dts
  {
    input: 'src/index.ts',
    output: [
      {
        file: `./dist/index.d.ts`,
        format: 'es',
      },
    ],
    plugins: [dts()],
  },
])();
