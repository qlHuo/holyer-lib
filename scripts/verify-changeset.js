// scripts/verify-changeset.js
console.log('🔍 Running changeset verification...');

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  // 获取仓库根目录（兼容所有平台）
  const repoRoot = execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim();
  const changesetDir = path.join(repoRoot, '.changeset');

  // 获取本次 commit 修改的文件列表
  const changedFiles = execSync('git diff --name-only --cached', { encoding: 'utf-8' })
    .split('\n')
    .filter(Boolean);

  // 判断是否为包源码变更
  const isPackageSourceFile = (file) => {
    if (!file.startsWith('packages/')) return false;
    
    const ignorePatterns = [
      /\/(__tests__|__mocks__|test|tests|cypress|e2e)\//i,
      /\.(test|spec|cy)\.(js|ts|jsx|tsx|vue)$/i,
      /\/(stories|story)\.(js|ts|jsx|tsx|mdx)$/i,
      /\/docs\//i,
      /\.mdx?$/i,
      /\.snap$/i,
    ];
    
    return !ignorePatterns.some(pattern => pattern.test(file));
  };

  const hasPackageChanges = changedFiles.some(isPackageSourceFile);

  // ✅ 关键修复：没有变更就跳过
  if (!hasPackageChanges) {
    console.log('ℹ️ 未检测到 packages/ 源码变更，跳过 changeset 检查');
    process.exit(0);
  }

  // 严格匹配 changeset 文件：three-word-slug.md
  const isChangesetFile = (filename) => {
    return /^[a-z]+-[a-z]+-[a-z]+\.md$/.test(filename);
  };

  const changesetMdFiles = fs.readdirSync(changesetDir)
    .filter(file => file !== 'pre.json' && isChangesetFile(file));

  if (changesetMdFiles.length === 0) {
    console.error('❌ 未找到有效的 changeset 文件（格式：xxx-yyy-zzz.md）！');
    console.error('👉 请运行 `npx changeset` 创建变更集');
    process.exit(1);
  }

  // 检查 .changeset 目录是否存在
  if (!fs.existsSync(changesetDir)) {
    console.error('❌ .changeset 目录不存在！');
    console.error('👉 请先运行 `npx changeset init` 初始化 Changesets');
    process.exit(1);
  }

  // 检查是否有 changeset 文件（磁盘上）
  const changesetFiles = fs.readdirSync(changesetDir)
    .filter(file => file.endsWith('.md') && file !== 'pre.json');

  if (changesetFiles.length === 0) {
    console.error('❌ 检测到 packages/ 变更，但未找到 .changeset/*.md 文件！');
    console.error('👉 请运行 `npx changeset` 创建变更集');
    process.exit(1);
  }

  // 检查 changeset 文件是否已 staged
  const stagedChangesetFiles = execSync('git diff --name-only --cached .changeset', { encoding: 'utf-8' })
    .split('\n')
    .filter(Boolean)
    .filter(f => f.endsWith('.md') && !f.endsWith('pre.json'));
  console.log('Staged changeset files:', stagedChangesetFiles);
  
  if (stagedChangesetFiles.length === 0) {
    console.error('❌ .changeset/*.md 文件未被 git add！');
    console.error('👉 请运行 `git add .changeset` 后再提交');
    process.exit(1);
  }

  console.log(`✅ 检测到 ${stagedChangesetFiles.length} 个 staged changeset 文件，提交允许`);
} catch (err) {
  console.error('⚠️ changeset 校验失败:', err.message);
  process.exit(1);
}