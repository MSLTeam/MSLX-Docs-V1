#!/usr/bin/env node

/**
 * MSLX Plugin Dev Skill CLI
 * 提供技能安装、说明查看以及工程代码规范自动化审计 (Audit)
 */

const fs = require('fs');
const path = require('path');

const SKILL_ROOT = path.resolve(__dirname, '..');

// ANSI 颜色定义
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
};

function printBanner() {
  console.log(`
${c.cyan}${c.bold}======================================================
  MSLX Plugin Dev Skill - 插件开发与审查引擎
======================================================${c.reset}
`);
}

function printHelp() {
  printBanner();
  console.log(`
${c.bold}用法:${c.reset}
  npx @mslteam/mslx-plugin-dev-skill <command> [options]
  npx mslx-skill <command> [options]

${c.bold}常用命令:${c.reset}
  ${c.green}audit, check${c.reset}      扫描当前插件项目，全面检测是否符合 MSLX 宿主规范、样式隔离与安全准则
  ${c.green}install, add${c.reset}      将该 Skill 安装至当前工程（支持通用公开目录与主流 AI Agent 技能目录）
  ${c.green}info, view${c.reset}        查看 Skill 包含的规范、核心参考文档与标杆示例代码清单
  ${c.green}help, --help${c.reset}      查看此帮助信息

${c.bold}选项 (Options):${c.reset}
  ${c.cyan}--skills-cli${c.reset}      在执行 install 时，通过 skills.sh 官方工具 (npx skills add) 执行安装

${c.bold}示例:${c.reset}
  # 在插件根目录下执行合规审计
  npx @mslteam/mslx-plugin-dev-skill audit

  # 将技能安装至当前工作区各大 AI Agent 目录
  npx @mslteam/mslx-plugin-dev-skill install

  # 通过 skills.sh 官方生态工具安装
  npx @mslteam/mslx-plugin-dev-skill install --skills-cli
`);
}

function printInfo() {
  printBanner();
  const pkg = require(path.join(SKILL_ROOT, 'package.json'));
  console.log(`
${c.bold}包名:${c.reset} ${pkg.name} (v${pkg.version})
${c.bold}描述:${c.reset} ${pkg.description}
${c.bold}规范文档库:${c.reset}
  - 核心指令: ${c.cyan}SKILL.md${c.reset}
  - 视觉设计系统: ${c.cyan}references/frontend-design-system.md${c.reset}
  - 宿主与插槽集成: ${c.cyan}references/frontend-integration.md${c.reset}
  - 后端架构与事件: ${c.cyan}references/backend-architecture.md${c.reset}
  - 全方位自我审查指南: ${c.cyan}references/self-audit-guide.md${c.reset}
  - 模板与发布流程: ${c.cyan}references/project-scaffold-publish.md${c.reset}

${c.bold}标杆模板代码:${c.reset}
  - 标杆前端卡片: ${c.yellow}examples/DesignCardExample.vue${c.reset}
  - 标杆插件注册: ${c.yellow}examples/pluginEntry.ts${c.reset}
  - 标杆 C# 入口: ${c.yellow}examples/MSLXPluginEntry.cs${c.reset}
`);
}

// 递归复制文件夹
function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  const entries = fs.readdirSync(from, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(from, entry.name);
    const destPath = path.join(to, entry.name);
    if (entry.isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function handleInstall(targetDir, flags = {}) {
  printBanner();
  const cwd = process.cwd();

  // 如果指定了使用 skills.sh 官方工具 (--skills-cli 或 --skills)
  if (flags.useSkillsCli) {
    console.log('[INFO] 正在调用 skills.sh 官方工具 (npx skills add)...');
    const { execSync } = require('child_process');
    try {
      execSync('npx skills add MSLTeam/MSLX-Docs-V1 --skill mslx-plugin-dev', {
        stdio: 'inherit',
        cwd: cwd
      });
      console.log(`\n[SUCCESS] 官方 skills 工具安装完成。\n`);
      return;
    } catch (e) {
      console.error(`\n[ERROR] 调用 npx skills add 失败: ${e.message}`);
      console.log('[INFO] 自动降级为本地 npm 包直装模式...\n');
    }
  }

  console.log('[INFO] 正在部署 MSLX Plugin Dev Skill 到工作区...');

  try {
    let installedDirs = [];

    if (targetDir) {
      const customDest = path.resolve(cwd, targetDir);
      copyFolderSync(SKILL_ROOT, customDest);
      installedDirs.push({ label: '自定义目标目录', path: customDest });
    } else {
      // 默认同时安装至公开目录与主流 Agent 目录
      const targetConfigs = [
        { label: '公开查阅目录', path: path.resolve(cwd, 'skills', 'mslx-plugin-dev') },
        { label: '通用 Agent (Antigravity/Gemini)', path: path.resolve(cwd, '.agents', 'skills', 'mslx-plugin-dev') },
        { label: 'Claude Code', path: path.resolve(cwd, '.claude', 'skills', 'mslx-plugin-dev') },
        { label: 'Cursor', path: path.resolve(cwd, '.cursor', 'skills', 'mslx-plugin-dev') },
        { label: 'Windsurf', path: path.resolve(cwd, '.windsurf', 'skills', 'mslx-plugin-dev') }
      ];

      for (const cfg of targetConfigs) {
        copyFolderSync(SKILL_ROOT, cfg.path);
        installedDirs.push(cfg);
      }
    }

    console.log(`\n${c.green}${c.bold}[SUCCESS] Skill 安装完成。已同步至以下目录:${c.reset}`);
    installedDirs.forEach(it => {
      console.log(`  - ${it.label}: ${c.cyan}${it.path}${c.reset}`);
    });

    console.log(`
${c.bold}使用说明:${c.reset}
  - 规范文档与标杆工程已在本地部署就绪，各 AI Agent 会自动加载并应用 MSLX 规范。
  - 在当前工作区执行合规性审计: ${c.cyan}npx @mslteam/mslx-plugin-dev-skill audit${c.reset}
  - 亦可直接调用 skills.sh 官方工具拉取: ${c.cyan}npx skills add MSLTeam/MSLX-Docs-V1 --skill mslx-plugin-dev${c.reset}
`);
  } catch (err) {
    console.error(`\n${c.red}[ERROR] 安装失败: ${err.message}${c.reset}`);
    process.exit(1);
  }
}

// 递归查找目标文件
function findFiles(dir, extensions, ignoreDirs = ['node_modules', '.git', 'bin', 'obj', 'dist']) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of list) {
    if (file.isDirectory()) {
      if (ignoreDirs.includes(file.name)) continue;
      results = results.concat(findFiles(path.join(dir, file.name), extensions, ignoreDirs));
    } else {
      const ext = path.extname(file.name).toLowerCase();
      if (extensions.includes(ext)) {
        results.push(path.join(dir, file.name));
      }
    }
  }
  return results;
}

function handleAudit() {
  printBanner();
  console.log(`[INFO] 正在扫描当前工作区插件工程合规性: ${c.cyan}${process.cwd()}${c.reset}\n`);

  const cwd = process.cwd();
  const vueFiles = findFiles(cwd, ['.vue']);
  const csFiles = findFiles(cwd, ['.cs']);
  const unoFiles = findFiles(cwd, ['.ts', '.js']).filter(f => f.includes('uno.config'));
  const viteFiles = findFiles(cwd, ['.ts', '.js']).filter(f => f.includes('vite.config'));

  const issues = [];
  const warnings = [];
  const passes = [];

  // 1. 审查 Vue 文件
  for (const file of vueFiles) {
    const relPath = path.relative(cwd, file);
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    // 1.1 检查 <style> 是否带 scoped
    const styleTagRegex = /<style\b([^>]*)>/gi;
    let match;
    while ((match = styleTagRegex.exec(content)) !== null) {
      const attrs = match[1];
      if (!attrs.includes('scoped')) {
        issues.push({
          file: relPath,
          title: 'Vue 样式泄露',
          desc: '<style> 标签未声明 scoped 属性，会导致全局 CSS 污染宿主 WebPanel 样式。',
          fix: '在 <style> 标签添加 scoped: <style scoped> 或 <style scoped lang="less">'
        });
      }
    }

    // 1.2 检查是否硬编码背景色
    const hardcodedColors = [
      { regex: /bg-white\b/, label: 'bg-white' },
      { regex: /#ffffff\b/i, label: '#ffffff' },
      { regex: /rgb\(\s*255\s*,\s*255\s*,\s*255\s*\)/i, label: 'rgb(255,255,255)' },
      { regex: /background\s*:\s*white\b/i, label: 'background: white' }
    ];

    lines.forEach((line, idx) => {
      for (const rule of hardcodedColors) {
        if (rule.regex.test(line) && !line.includes('var(--td-bg-color') && !line.includes('//') && !line.includes('/*')) {
          warnings.push({
            file: `${relPath}:${idx + 1}`,
            title: `硬编码纯白背景 (${rule.label})`,
            desc: '检测到硬编码的白底样式，在暗黑模式或用户自定义壁纸毛玻璃下会导致刺眼的视觉断层。',
            fix: '改用语义变量 bg-[var(--td-bg-color-container)] 或 bg-[var(--td-bg-color-container)]/80。'
          });
        }
      }
    });

    // 1.3 检查卡片根容器是否使用 design-card
    if (content.includes('<template>') && (relPath.includes('views') || relPath.includes('components'))) {
      if (!content.includes('design-card') && !relPath.toLowerCase().includes('icon')) {
        warnings.push({
          file: relPath,
          title: '未继承 design-card 样式',
          desc: '组件根容器未包含 design-card 类名，宿主将无法向其注入全局透明度 (--comp-op-light/dark)。',
          fix: '在卡片根容器增加 class="design-card ..."'
        });
      }
    }

    // 1.4 检查 t-dialog 是否加 attach="body"
    if (content.includes('<t-dialog') && !content.includes('attach="body"')) {
      issues.push({
        file: relPath,
        title: '弹窗缺少 attach="body"',
        desc: '使用 <t-dialog> 未配置 attach="body"，弹窗容易被父级卡片的 overflow-hidden 截断或遮罩错位。',
        fix: '为 <t-dialog> 添加 attach="body" 属性。'
      });
    }

    // 1.5 检查 v-html 潜在 XSS
    if (content.includes('v-html=')) {
      warnings.push({
        file: relPath,
        title: '潜在 XSS 风险 (v-html)',
        desc: '检测到 v-html 指令，请确保渲染的内容经过严格的 XSS 过滤净化，严禁直接渲染外部用户输入。',
        fix: '使用文本插值 {{ }} 或通过 DOMPurify 进行转义净化。'
      });
    }

    // 1.6 检查生命周期清理 (addEventListener / setInterval)
    const hasAddListener = content.includes('addEventListener') || content.includes('setInterval');
    const hasRemove = content.includes('removeEventListener') || content.includes('clearInterval');
    if (hasAddListener && !hasRemove) {
      warnings.push({
        file: relPath,
        title: '未注销的全局监听器或定时器',
        desc: '检测到注册了事件监听器或定时器，但在组件卸载时可能未释放，会导致内存泄漏。',
        fix: '在 onBeforeUnmount / onUnmounted 生命周期中成对执行注销与清理。'
      });
    }
  }

  // 2. 审查 UnoCSS 配置
  for (const file of unoFiles) {
    const relPath = path.relative(cwd, file);
    const content = fs.readFileSync(file, 'utf-8');
    if (content.includes('preflight: true')) {
      issues.push({
        file: relPath,
        title: 'UnoCSS Preflight 污染',
        desc: '设置了 preflight: true 会注入全局 HTML reset 样式，将彻底破坏宿主 WebPanel 的默认字号与间距。',
        fix: '在 uno.config.ts 中设置 presetUno({ preflight: false })。'
      });
    }
  }

  // 3. 审查 C# 后端
  let hasApplicationPart = false;
  for (const file of csFiles) {
    const relPath = path.relative(cwd, file);
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    if (content.includes('[assembly: ApplicationPart(')) {
      hasApplicationPart = true;
    }

    // 检查 Controller 路由前缀
    if (content.includes('[ApiController]') || content.includes(': ControllerBase')) {
      if (!content.includes('api/plugins/') && !content.includes('api/plugin/')) {
        issues.push({
          file: relPath,
          title: 'Controller 路由前缀不合规',
          desc: '控制器必须遵循 /api/plugins/{plugin-id}/ 路由前缀规范，否则无法被宿主 API 网关认证和转发。',
          fix: '在 Controller 上设置 [Route("api/plugins/{plugin-id}/[controller]")]'
        });
      }
    }

    // 检查路径穿越
    lines.forEach((line, idx) => {
      if (line.includes('Path.Combine') && !line.includes('//') && !line.includes('GetDataPath()')) {
        if (!content.includes('Path.GetFullPath') && !content.includes('StartsWith')) {
          warnings.push({
            file: `${relPath}:${idx + 1}`,
            title: '潜在路径穿越风险 (Path Traversal)',
            desc: '检测到直接拼接文件路径但缺少沙箱边界校验，恶意参数可能通过 ../../ 逃逸至宿主核心目录。',
            fix: '以 this.Config().GetDataPath() 为沙箱基准目录，并使用 Path.GetFullPath(target).StartsWith(basePath) 校验。'
          });
        }
      }
    });

    // 检查事件总线是否可能阻塞主线程
    if (content.includes('SDK.MSLX.Events.On') && !content.includes('Task.Run')) {
      warnings.push({
        file: relPath,
        title: '事件处理器中潜在的主线程阻塞',
        desc: '宿主事件总线为同步派发，若在事件处理器中执行磁盘压缩或网络请求将导致宿主卡顿。',
        fix: '将耗时操作转移至 Task.Run(async () => { ... }) 后台线程执行。'
      });
    }
  }

  // 检查是否声明了 ApplicationPart
  if (csFiles.length > 0 && !hasApplicationPart) {
    const entryFile = csFiles.find(f => f.includes('MSLXPluginEntry.cs')) || csFiles[0];
    issues.push({
      file: path.relative(cwd, entryFile),
      title: '缺少 ApplicationPart 特性声明',
      desc: '未检测到 [assembly: ApplicationPart("程序集名称")]，会导致宿主无法发现并注册插件中的 Controller，返回 404。',
      fix: '在入口文件顶部声明 [assembly: ApplicationPart("你的程序集名称")]'
    });
  }

  // 4. 汇总与输出报告
  console.log(`${c.bold}------------------- 审查报告 -------------------${c.reset}`);
  console.log(`扫描文件清单: ${vueFiles.length} 个 Vue 组件, ${csFiles.length} 个 C# 源文件\n`);

  if (issues.length === 0 && warnings.length === 0) {
    console.log(`${c.bgGreen}${c.bold} PASS ${c.reset} ${c.green}${c.bold}所有检查项均已通过，插件完全符合 MSLX 宿主设计与安全规范。${c.reset}\n`);
    return;
  }

  if (issues.length > 0) {
    console.log(`${c.bgRed}${c.bold} 严重违规 (${issues.length}) ${c.reset} ${c.red}必须修复后方可发布：${c.reset}`);
    issues.forEach((it, i) => {
      console.log(`  ${c.red}${i + 1}. [${it.title}]${c.reset} ${c.dim}${it.file}${c.reset}`);
      console.log(`     说明: ${it.desc}`);
      console.log(`     ${c.green}修复方案: ${it.fix}${c.reset}\n`);
    });
  }

  if (warnings.length > 0) {
    console.log(`${c.yellow}${c.bold} 建议改进 (${warnings.length}) ${c.reset} ${c.dim}建议优化以获得更佳的双端响应式体验与宿主融入度：${c.reset}`);
    warnings.forEach((it, i) => {
      console.log(`  ${c.yellow}${i + 1}. [${it.title}]${c.reset} ${c.dim}${it.file}${c.reset}`);
      console.log(`     说明: ${it.desc}`);
      console.log(`     ${c.cyan}优化建议: ${it.fix}${c.reset}\n`);
    });
  }

  console.log(`${c.bold}------------------------------------------------${c.reset}`);
  if (issues.length > 0) {
    console.log(`${c.red}[FAIL] 审计未通过，存在 ${issues.length} 个阻断性问题。${c.reset}\n`);
    process.exit(1);
  } else {
    console.log(`${c.green}[PASS] 基础合规性校验通过，检测到 ${warnings.length} 项体验优化建议。${c.reset}\n`);
  }
}

// 主入口
function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  const useSkillsCli = args.includes('--skills') || args.includes('--skills-cli');
  const targetDir = args.slice(1).find(a => !a.startsWith('-'));

  switch (command) {
    case 'audit':
    case 'check':
      handleAudit();
      break;
    case 'install':
    case 'add':
      handleInstall(targetDir, { useSkillsCli });
      break;
    case 'info':
    case 'view':
      printInfo();
      break;
    case 'help':
    case '--help':
    case '-h':
      printHelp();
      break;
    default:
      console.error(`${c.red}[ERROR] 未知命令: ${command}${c.reset}\n`);
      printHelp();
      process.exit(1);
  }
}

main();
