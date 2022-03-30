/*
 * @Author: victorsun
 * @Date: 2022-03-29 22:37:23
 * @LastEditors: victorsun
 * @LastEditTime: 2022-03-31 01:09:27
 * @Descripttion: 执行创建项目
 */
import ora from 'ora'; // ora插件用于命令行中展示进度状态
import inquirer from 'inquirer'; // inquirer 控制台与用户交互
import chalk from 'chalk'; // chalk插件用于设置控制台文字颜色
import logSymbols from 'log-symbols'; // log-symbols插件用于控制台输出图标
import downloadGitRepo from 'download-git-repo'; // download-git-repo插件用于下载git仓库代码
import util from 'util';
import path from 'path';
import axios from 'axios';

axios.interceptors.response.use(res => {
  return res.data;
});

class Generator {
  constructor(name, targetDir) {
    this.name = name; // 文件夹名称
    this.targetDir = targetDir; // 目标位置
    this.timer = null;
  }

  async create() {

    // 获取模版列表
    const repoList = await wrapLoading(async () => {
      return axios.get('https://api.github.com/users/csxiaoyaojianxian/repos')
    }, '获取模版列表中...');
    if (!repoList) return;

    // 筛选模板项目
    const repos = repoList.filter(item => item.name.indexOf('Study') !== -1);

    // 用户选择交互
    const { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos.map(item => item.name),
      message: '请选择模版',
    });

    // 处理用户选择
    const selectRepos = repos.filter(item => item.name === repo)[0];
    const repoData = {
      id: selectRepos.id || 0,
      name: selectRepos.name,
      branch: selectRepos.default_branch
    };
    console.log('模板信息:', repoData);

    // 下载模板
    const requestUrl = `direct:https://github.com/csxiaoyaojianxian/${repoData.name}/archive/refs/heads/${repoData.branch}.zip`;
    this.timer = setTimeout(() => {
      clearTimeout(this.timer);
      throw ('下载超时，请重试!');
    }, 1000 * 60 * 2);
    await wrapLoading(
      util.promisify(downloadGitRepo), // 调用下载方法，进行远程下载，对download-git-repo 进行promise话改造
      '下载目标模版中...',
      requestUrl,
      path.resolve(process.cwd(), this.targetDir),
    );
    console.log(logSymbols.success, chalk.green('模版下载成功！'))
    this.timer && clearTimeout(this.timer)
  }
}

/**
 * 工具方法：添加加载动画
 */
async function wrapLoading(fn, message, ...args) {
  const spinner = ora(message);
  spinner.start();
  try {
    const result = await fn(...args); // 执行fn
    spinner.succeed();
    return result;
  } catch {
    spinner.fail('请求失败');
    console.log(logSymbols.error, chalk.red('请求失败，请重试...'));
    return null;
  }
}

export default Generator;