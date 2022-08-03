/*
 * @Author: Yorn Qiu
 * @Date: 2022-04-25 18:11:23
 * @LastEditors: Yorn Qiu
 * @LastEditTime: 2022-08-02 17:58:14
 * @Description: file content
 * @FilePath: /flatpad/examples/main/src/main.js
 */

import { registerApplication } from 'flatpad';
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('body');

registerApplication([
  {
    name: 'app1',
    entry: '/apps/app1/index.html',
  },
  {
    name: 'app2',
    entry: '/apps/app2/index.html',
  },
  {
    name: 'app3',
    entry: '/apps/app3/index.html',
  },
]);
