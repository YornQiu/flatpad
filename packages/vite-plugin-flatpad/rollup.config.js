/*
 * @Author: Yorn Qiu
 * @Date: 2022-04-27 11:59:49
 * @LastEditors: Yorn Qiu
 * @LastEditTime: 2026-11-03 09:24:09
 * @FilePath: /flatpad/packages/vite-plugin-flatpad/rollup.config.js
 * @Description: rollup config
 */

import { rmSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
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

const external = ['vite', /^node:/];

export default [
  {
    input: 'src/index.ts',
    external,
    output: [
      {
        file: './dist/index.cjs',
        format: 'cjs',
        banner,
      },
      {
        file: './dist/index.mjs',
        format: 'esm',
        banner,
      },
    ],
    plugins: [nodeResolve({ extensions: ['.js', '.ts'] }), typescript({ declaration: false })],
  },
  {
    input: 'src/index.ts',
    external,
    output: [
      {
        file: './dist/index.d.ts',
        format: 'es',
      },
    ],
    plugins: [dts()],
  },
];
