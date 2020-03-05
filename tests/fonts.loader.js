const path = require('path');

module.exports = {
  fonts: {
    files: [
      // '**/*.+(woff|woff2|eot|ttf|otf)',
      '**/*.woff',
      '**/*.woff2',
      '**/*.eot',
      '**/*.ttf',
      '**/*.otf'
    ],
    inputPath: path.resolve(__dirname, 'assets/fonts'),
    outputPath: 'fonts',
    fontFilename: '[fontname].[chunkhash].[ext]?[hash]',
    cssDest: path.resolve(__dirname, 'styles/fonts'),
    cssFilename: 'fonts',
    scssDest: path.resolve(__dirname, 'styles/fonts'),
    scssFilename: 'fonts'
  },
  icons: {
    files: [
      '**/*.svg',
      'arrow2.svg',
      'subdirectory/animal1.svg',
      'subdirectory/animal2.svg',
      'subdirectory/animal200.svg',
      'subfolder',
      'subdirectory',
      path.resolve(__dirname, '../Icons/svg', 'arrow.svg'),
      path.resolve(__dirname, '../Icons/svg/subdirectory', 'animal1.svg')
    ],
    inputPath: path.resolve(__dirname, 'assets/icons/svg'),
    outputPath: 'iconfont',
    types: ['eot', 'woff', 'woff2', 'ttf', 'svg'],
    order: ['eot', 'woff', 'woff2', 'ttf', 'svg'],
    publicPath: '/',
    font: 'IconFont',
    fontFilename: '[fontname].[chunkhash].[ext]?[hash]',
    cssFilename: 'iconfont',
    cssDest: path.resolve(__dirname, 'styles/iconfont'),
    scssFilename: 'iconfont',
    scssDest: path.resolve(__dirname, 'styles/iconfont')
  }
};
