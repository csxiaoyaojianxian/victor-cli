/*
 * @Author: victorsun
 * @Date: 2022-03-29 22:29:12
 * @LastEditors: victorsun
 * @LastEditTime: 2022-03-31 00:52:46
 * @Descripttion: 创建项目命令入口
 */

import path from 'path';
import fs from 'fs-extra';
import inquirer from 'inquirer'; // inquirer插件用于设置控制台与用户交互
import Generator from './Generator.js';

export default async function (name, options) {
  
  const cwd = process.cwd(); // 获取当前目录
  const targetDir = path.join(cwd, name); // 拼接目标文件夹地址

  if (fs.existsSync(targetDir)) {
    // 是否强制创建(覆盖)
    if (options.force) {
      await fs.remove(targetDir);
    } else {
      // 异步获取结果
      let { action } = await inquirer.prompt([{
        name: 'action',
        type: 'list',
        message: '目录已存在，请选择操作：',
        choices: [
          {
            name: '覆盖',
            value: 'overwrite'
          }, {
            name: '取消',
            value: false
          },
        ],
      }])
      // 处理用户交互结果
      if (!action) {
        return
      } else if (action === 'overwrite') {
        console.log(`\r\nRemoving...`);
        await fs.remove(targetDir);
      }
    }
  }
  // 执行创建项目
  const generator = new Generator(name, targetDir);
  generator.create();
}
