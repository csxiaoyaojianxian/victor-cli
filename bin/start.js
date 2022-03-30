#! /usr/bin/env node

/*
【说明】
#! 符号用于指定脚本的解释程序，Node CLI 应用入口文件必备

$ chmod 755 ./bin/start.js
$ npm link
$ victor-cli

*/

import { program } from 'commander'; // commander插件用于开发脚手架命令
import create from './create.js'; // 创建项目命令

program
  .version('1.0.0') // 版本
  .command('create <name>') // 新建命令 create
  .option('-f, --force', '是否强制覆盖') // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
  .description('创建项目') // 描述
  .action((name, options) => { // 回调
    console.log('name:', name, 'options:', options);
    create(name, options); // 创建项目
  });

program
  .command('help')
  .description('查看帮助')
  .action(() => {
    console.log('相关帮助内容～～～');
  });

// 解析用户执行命令传入参数
program.parse(process.argv);

