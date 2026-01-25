// scripts/build-utils.js
const fs = require('fs');
const path = require('path');
const rollup = require('rollup');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const { terser } = require('rollup-plugin-terser');

const SRC_FILE = path.resolve(__dirname, '../packages/utils/src/index.js');
const DIST_DIR = path.resolve(__dirname, '../packages/utils/dist');

// 确保 dist 目录存在
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

async function buildUtils() {
  console.log('Building @holyer-libs/utils...');

  const bundle = await rollup.rollup({
    input: SRC_FILE,
    plugins: [
      nodeResolve(),
      commonjs(),
      // 生产环境压缩（可选）
      process.env.NODE_ENV === 'production' && terser()
    ].filter(Boolean),
    // utils 是纯 JS，无需 external，但若未来引用其他包可加
    external: [] 
  });

  // 输出多种格式
  await bundle.write({
    file: path.join(DIST_DIR, 'utils.esm.js'),
    format: 'es'
  });

  await bundle.write({
    file: path.join(DIST_DIR, 'utils.cjs.js'),
    format: 'cjs'
  });

  await bundle.write({
    file: path.join(DIST_DIR, 'utils.umd.js'),
    format: 'umd',
    name: 'HolyerUtils' // UMD 全局变量名
  });

  console.log('✅ @holyer-libs/utils built successfully.');
}

buildUtils().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});