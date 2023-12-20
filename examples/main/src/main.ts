/*
 * @Author: Yorn Qiu
 * @Date: 2022-04-25 18:11:23
 * @LastEditors: Yorn Qiu
 * @LastEditTime: 2023-12-20 13:55:17
 * @Description: file content
 * @FilePath: /flatpad/examples/main/src/main.ts
 */

import { registerApplication, start } from 'flatpad';
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('body');

registerApplication([
  {
    name: 'app1',
    entry: 'http://localhost:9091/apps/app1/index.html',
  },
  {
    name: 'app2',
    entry: 'http://localhost:9092/apps/app2/index.html',
  },
]);

start();
