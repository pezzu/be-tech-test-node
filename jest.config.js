const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
  transform: tsjPreset.transform,
  rootDir: './src',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  preset: "@shelf/jest-mongodb",
  testEnvironment: 'node',
};