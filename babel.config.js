module.exports = {
  // 默认环境（用于 Rollup 构建、dev server）
  presets: ['@vue/cli-plugin-babel/preset'],

  // Jest 测试时使用此配置
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current' // 使用当前 Node 版本
            }
          }
        ]
      ]
    }
  }
};
