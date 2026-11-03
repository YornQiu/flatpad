/*
 * @Author: Yorn Qiu
 * @Date: 2022-04-27 11:59:49
 * @LastEditors: Yorn Qiu
 * @LastEditTime: 2026-11-03 09:24:12
 * @FilePath: /flatpad/packages/flatpad/rollup.config.js
 * @Description: rollup config
 */

import { rmSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
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

export default [
  // dev
  {
    input: './src/index.ts',
    output: [
      {
        file: `./dist/index.js`,
        format: 'cjs',
        name: pkg.name,
        banner,
      },
      {
        file: `./dist/index.umd.js`,
        format: 'umd',
        name: pkg.name,
        banner,
      },
      {
        file: `./dist/index.esm.js`,
        format: 'esm',
        banner,
      },
    ],
    plugins: [nodeResolve({ extensions: ['.js', '.ts'] }), typescript()],
  },
  // prod
  {
    input: './src/index.ts',
    output: [
      {
        file: `./dist/index.min.js`,
        format: 'cjs',
        name: pkg.name,
        sourcemap: true,
        banner,
      },
      {
        file: `./dist/index.umd.min.js`,
        format: 'umd',
        name: pkg.name,
        sourcemap: true,
        banner,
      },
      {
        file: `./dist/index.esm.min.js`,
        format: 'esm',
        sourcemap: true,
        banner,
      },
    ],
    plugins: [nodeResolve({ extensions: ['.js', '.ts'] }), typescript(), terser()],
  },
  // dts
  {
    input: './src/index.ts',
    output: [
      {
        file: `./dist/index.d.ts`,
        format: 'es',
      },
    ],
    plugins: [dts()],
  },
];
