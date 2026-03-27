// jest.config.js
const path = require('path');

module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'vue'],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.vue$': '@vue/vue2-jest'
  },
  transformIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    // 映射 monorepo 内部包
    '^@holyer-lib/utils$': path.resolve(__dirname, 'packages/utils/src/index.js')
    // '^@holyer-lib/styles$': path.resolve(__dirname, 'packages/styles/src/index.js')
    // 如果未来有更多包，继续添加...
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  testMatch: ['<rootDir>/test/**/*.spec.js'],
  collectCoverageFrom: ['packages/ui/**/src/**/*.{js,vue}'],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'html']
};
