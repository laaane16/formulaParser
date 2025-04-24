import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  clearMocks: true,
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['\\\\node_modules\\\\'],
  moduleFileExtensions: ['js', 'ts'],
  rootDir: './',
  moduleDirectories: ['node_modules'],
  modulePaths: ['<rootDir>src'],
  testMatch: ['<rootDir>__tests__/**/*(*.)@(spec|test).[t]s?(x)'],
  preset: 'ts-jest',
  verbose: true,
  // setupFilesAfterEnv: ['<rootDir>config/jest/setupTests.ts'],
};
export default config;
