const fs = require('fs');
const path = require('path');
const rollup = require('rollup');
const createConfig = require('./rollup.config');
const UI_DIR = path.resolve(__dirname, '../packages/ui');
const COMPONENTS_DIR = UI_DIR;

// 1. 构建全量 UI 包
async function buildComponents() {
  const dirs = fs.readdirSync(UI_DIR).filter(f => {
    const stat = fs.statSync(path.join(UI_DIR, f));
    return stat.isDirectory() && f !== 'node_modules' && !f.startsWith('__');
  });

  for (const dir of dirs) {
    const compPath = path.join(UI_DIR, dir);
    const pkgPath = path.join(compPath, 'package.json');
    if (!fs.existsSync(pkgPath)) continue;

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const input = path.join(compPath, 'index.js');
    const name = pkg.name.split('/').pop(); // e.g., "button"

    console.log(`Building ${name}...`);

    // 创建配置
    const config = createConfig({ input, name });

    // 创建 bundle
    const bundle = await rollup.rollup({
      input: config.input,
      external: config.external,
      plugins: config.plugins
    });

    // ⚠️ 关键：遍历 outputs，逐个 write
    for (const output of config.outputs) {
      // 补全绝对路径
      output.file = path.resolve(compPath, output.file);
      await bundle.write(output);
    }

    await bundle.close();
  }
}

// TODO:: 不从package.json读取组件名，而是从各个子组件中的index.js中读取export对象的key，这样能保证同一个文件下有多个组件需要导出时就能正确导出，而不是只能导出一个组件（即package.json中的name字段只能对应一个组件）
// 2. 自动生成 ui/index.js（可选）
// eslint-disable-next-line no-unused-vars
function generateIndexJs() {
  const dirs = fs.readdirSync(COMPONENTS_DIR).filter(f => {
    const stat = fs.statSync(path.join(COMPONENTS_DIR, f));
    return stat.isDirectory() && fs.existsSync(path.join(COMPONENTS_DIR, f, 'package.json'));
  });

  console.log('Generating index.js for components:', dirs);

  const imports = dirs.map(d => `import ${capitalize(d)} from './${d}';`).join('\n');
  const exports = `${dirs.map(d => capitalize(d)).join(',\n  ')}`;
  const components = `\n  ${dirs.map(d => capitalize(d)).join(',\n  ')}\n`;

  const content = `
${imports}

// eslint-disable-next-line prettier/prettier
const components = [${components}];

const install = function (Vue) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

// eslint-disable-next-line prettier/prettier
export {${components}};

export default {
  install,
  ${exports}
};
`.trimStart();

  fs.writeFileSync(path.join(UI_DIR, 'index.js'), content);
}

/**
 * @Description 命名转换，将骨节符命名转换为 PascalCase
 * @Author holyer
 * @Date 2026/02/08 15:29:32
 *  -: 匹配连字符。
 * ([a-z]): 捕获组，匹配任意一个小写字母，并将其存储在第一个捕获组中。
 */
function capitalize(str) {
  const camelCaseStr = str.replace(/-([a-z])/g, (match, p1) => p1.toUpperCase());
  // 将字符串的首字母大写
  return `Hi${camelCaseStr.charAt(0).toUpperCase() + camelCaseStr.slice(1)}`;
}

// 3. 全量 UI 构建
async function buildFullUi() {
  const input = path.join(UI_DIR, 'index.js');
  const name = 'ui';
  console.log('Building full UI...');

  const config = createConfig({ input, name });
  const bundle = await rollup.rollup({
    input: config.input,
    external: config.external,
    plugins: config.plugins
  });

  for (const output of config.outputs) {
    output.file = path.resolve(UI_DIR, output.file);
    await bundle.write(output);
  }

  await bundle.close();
}

// 主流程
(async () => {
  await buildComponents();
  // generateIndexJs(); // 可选：自动维护 index.js
  await buildFullUi();
})();
