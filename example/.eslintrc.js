const path = require('path');
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', 'eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    parser: '@babel/eslint-parser', // ← 这是给 .vue 和 .js 用的
    // 显式指定 Babel 配置文件的绝对路径，确保 ESLint 能正确加载 Babel 配置
    babelOptions: {
      configFile: path.resolve(__dirname, './babel.config.js')
    }
  },
  rules: {
    'no-console': 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 0,
    'vue/no-mutating-props': 0,
    'vue/no-use-v-if-with-v-for': 0,
    'vue/valid-template-root': 0,
    'no-empty': 0
  }
};
