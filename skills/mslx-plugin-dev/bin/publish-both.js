#!/usr/bin/env node

/**
 * MSLX Plugin Dev Skill - 双通道发布助手
 * 支持一键将当前 Skill 同时发布为：
 * 1. 组织级包: @mslteam/mslx-plugin-dev-skill
 * 2. 个人/全局包: mslx-plugin-dev-skill
 * 支持交互式输入 2FA OTP 验证码或通过 --otp=123456 参数传入。
 * 发布完成后自动恢复 package.json，不影响 Git 仓库与文档状态。
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const pkgPath = path.resolve(__dirname, '..', 'package.json');
const originalPkgStr = fs.readFileSync(pkgPath, 'utf8');
const originalPkg = JSON.parse(originalPkgStr);

const packagesToPublish = [
  '@mslteam/mslx-plugin-dev-skill',
  'mslx-plugin-dev-skill'
];

function askOtp() {
  return new Promise((resolve) => {
    // 检查命令行参数中是否已传入 --otp=xxxxxx
    const otpArg = process.argv.find((a) => a.startsWith('--otp='));
    if (otpArg) {
      return resolve(otpArg.split('=')[1].trim());
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('🔑 请输入 npm 账号的 6 位 2FA 动态验证码 (OTP) [若未开启直接按回车]: ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log('🚀 正在启动双通道 npm 发布助手 (组织级 + 个人/全局级)...\n');

  let otp = await askOtp();
  console.log('');

  try {
    for (const name of packagesToPublish) {
      console.log(`📦 [${packagesToPublish.indexOf(name) + 1}/${packagesToPublish.length}] 正在发布 ${name} ...`);
      const currentPkg = JSON.parse(JSON.stringify(originalPkg));
      currentPkg.name = name;
      fs.writeFileSync(pkgPath, JSON.stringify(currentPkg, null, 2) + '\n');

      const otpParam = otp ? ` --otp=${otp}` : '';
      const cmd = `npm publish --access public --registry=https://registry.npmjs.org/${otpParam}`;

      try {
        execSync(cmd, {
          cwd: path.resolve(__dirname, '..'),
          stdio: 'inherit'
        });
        console.log(`✔ ${name} 发布成功！\n`);
      } catch (cmdErr) {
        console.error(`\n⚠️ ${name} 发布失败。若提示 2FA 错误，请核对 Authenticator 验证码或重新运行。\n`);
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
}

main();
