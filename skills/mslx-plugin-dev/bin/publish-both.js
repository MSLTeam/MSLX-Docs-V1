#!/usr/bin/env node

/**
 * MSLX Plugin Dev Skill - 双通道发布助手
 * 支持一键将当前 Skill 同时发布为：
 * 1. 组织级包: @mslteam/mslx-plugin-dev-skill
 * 2. 个人/全局包: mslx-plugin-dev-skill
 * 发布完成后自动恢复 package.json，不影响 Git 仓库与文档状态。
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const pkgPath = path.resolve(__dirname, '..', 'package.json');
const originalPkgStr = fs.readFileSync(pkgPath, 'utf8');
const originalPkg = JSON.parse(originalPkgStr);

const packagesToPublish = [
  '@mslteam/mslx-plugin-dev-skill',
  'mslx-plugin-dev-skill'
];

console.log('🚀 正在启动双通道 npm 发布助手 (组织级 + 个人/全局级)...\n');

try {
  for (const name of packagesToPublish) {
    console.log(`📦 [${packagesToPublish.indexOf(name) + 1}/${packagesToPublish.length}] 正在发布 ${name} ...`);
    const currentPkg = JSON.parse(JSON.stringify(originalPkg));
    currentPkg.name = name;
    fs.writeFileSync(pkgPath, JSON.stringify(currentPkg, null, 2) + '\n');

    try {
      execSync('npm publish --access public --registry=https://registry.npmjs.org/', {
        cwd: path.resolve(__dirname, '..'),
        stdio: 'inherit'
      });
      console.log(`✔ ${name} 发布成功！\n`);
    } catch (cmdErr) {
      console.error(`\n⚠️ ${name} 发布失败。请检查是否已登录 npm，或该名称是否已被占用。\n`);
      throw cmdErr;
    }
  }
  console.log('🎉 双通道发布全部顺利完成！');
} catch (err) {
  console.error('\n✘ 发布中断:', err.message);
  process.exitCode = 1;
} finally {
  // 绝对保证恢复原始 package.json，避免工作区被污染
  fs.writeFileSync(pkgPath, originalPkgStr);
  console.log('✨ package.json 已恢复为默认规范包名: @mslteam/mslx-plugin-dev-skill\n');
}
