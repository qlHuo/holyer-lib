// scripts/rollup.config.js
const vue = require('rollup-plugin-vue');
const less = require('rollup-plugin-less');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const { terser } = require('rollup-plugin-terser');

module.exports = function createConfig({ input, name, formats = ['esm', 'cjs', 'umd'] }) {
  const outputs = [];

  if (formats.includes('esm')) {
    outputs.push({
      file: `dist/${name}.esm.js`,
      format: 'es',
      exports: 'named'
    });
  }
  if (formats.includes('cjs')) {
    outputs.push({
      file: `dist/${name}.cjs.js`,
      format: 'cjs',
      exports: 'named' // 👈 关键：明确告诉 Rollup 这是 default-only 模块
    });
  }
  if (formats.includes('umd')) {
    outputs.push({
      file: `dist/${name}.umd.js`,
      format: 'umd',
      name: name.replace(/-/g, '_').replace(/\b\w/g, l => l.toUpperCase()), // 转为 PascalCase
      globals: { vue: 'Vue' },
      exports: 'named'
    });
  }

  return {
    input,
    external: ['vue'],
    plugins: [
      vue({
        css: true,
        compileTemplate: true,
        target: 'browser'
      }),
      less({
        insert: true,
        output: false
      }),
      nodeResolve(),
      commonjs(),
      process.env.NODE_ENV === 'production' && terser()
    ].filter(Boolean),
    // 注意：这里不返回 output！只返回 input/plugins 等
    // output 单独通过 outputs 字段返回
    outputs // 👈 关键：单独返回 output 数组
  };
};
