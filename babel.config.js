/* eslint-disable */
module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
  plugins: [
    /*
    Resolve absolute paths to ./src directory
    */
    [
      'module-resolver',
      {
        root: './src',
        extensions: ['.ts', '.tsx'],
      },
    ],
  ],
};
