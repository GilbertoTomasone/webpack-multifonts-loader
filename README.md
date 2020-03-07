[![npm](https://img.shields.io/npm/v/multifonts-loader.svg?style=flat-square)](https://www.npmjs.com/package/multifonts-loader)
[![npm](https://img.shields.io/npm/dm/multifonts-loader.svg?style=flat-square)](https://www.npmjs.com/package/multifonts-loader)
[![Travis](https://img.shields.io/travis/gilbertotomasone/webpack-multifonts-loader.svg?style=flat-square)](https://travis-ci.org/gilbertotomasone/webpack-multifonts-loader)
[![license](https://img.shields.io/github/license/gilbertotomasone/webpack-multifonts-loader.svg?style=flat-square)](https://github.com/GilbertoTomasone/webpack-multifonts-loader/blob/master/LICENSE)

# Webpack Multifonts Loader

Loader for webpack to generate **fontfaces** from font families and **iconfonts** from svgs using <a href="https://github.com/vusion/webfonts-generator">webfonts-generator</a>.

## Usage

The loader will generate all the necessary supporting files to use the fonts.

### Inject classes in the markup

#### `*.html`

```html
<span class="font-[FONT_FILE_NAME]"></span>

<span class="icon icon-[SVG_FILE_NAME]"></span>
```

### Import the scss files and use the mixins

#### `*.sass`

```sass
@import 'iconfont/iconfont'
@import 'fonts/fonts'

body
  font-family: "FONT_FILE_NAME"
  @include font('FONT_FILE_NAME')

span
  @include webfont-icon('SVG_FILE_NAME')
```

## Installation

```
$ npm install webpack-fonts-loader
```

## Setup

### Webpack Rule

Chain the multifonts-loader with the css-loader and MiniCssExtractPlugin loader to 
generate the CSS style directly into the Webpack default output path.

```javascript
{
  test: /multifonts\.loader\.js/,
  use: [
    MiniCssExtractPlugin.loader,
    'css-loader',
    {
      loader: 'multifonts-loader',
      options: {
        icons: {
          fontFilename: isDevelopment
            ? '[fontname].[chunkhash].[ext]?[hash]'
            : '[chunkhash].[ext]?[hash]'
        },
        fonts: {
          fontFilename: isDevelopment
            ? '[fontname].[chunkhash].[ext]?[hash]'
            : '[chunkhash].[ext]?[hash]'
        }
      }
    }
  ]
}
```

### Loader Options

```javascript
options: {
    icons: {
      fontFilename: isDevelopment
        ? '[fontname].[chunkhash].[ext]?[hash]'
        : '[chunkhash].[ext]?[hash]'
    },
    fonts: {
      fontFilename: isDevelopment
        ? '[fontname].[chunkhash].[ext]?[hash]'
        : '[chunkhash].[ext]?[hash]'
    }
}
```

#### `icons`, Object

#### fontFilename

The name of the generated iconfont file.

*Example:*
```javascript
[fontname].[chunkhash].[ext]?[hash]
[chunkhash].[ext]?[hash]
```

#### `fonts`, Object

#### fontFilename

The name of the generated font files.

*Example:*
```javascript
[fontname].[chunkhash].[ext]?[hash]
[chunkhash].[ext]?[hash]
```

## Integration

Include the configuration file into your app.

`app.js`

```javascript
require('multifonts.loader');
```

## Configuration

The configuration file defines two main sections: 

#### fonts

Responsible to locate and process the font families 
   to generate the respective fontfaces.
 
Optionally, you can decide to generate the fontfaces CSS and/or the SCSS 
files to a specified location for you to include in your application.
   
#### icons

Responsible to locate and process the svg files
    to generate the respective iconfont.
    
Optionally, you can decide to generate the iconfont CSS and/or the SCSS 
files to a specified location for you to include in your application. 

```javascript
const path = require('path');

module.exports = {
  fonts: {
    files: [
      // '**/*.+(woff|woff2|eot|ttf|otf|svg)',
      '**/*.woff',
      '**/*.woff2',
      '**/*.eot',
      '**/*.ttf',
      '**/*.otf',
      '**/*.svg'
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
    fontName: 'IconFont',
    fontFilename: '[fontname].[chunkhash].[ext]?[hash]',
    cssDest: path.resolve(__dirname, 'styles/iconfont'),
    cssFilename: 'iconfont',
    scssDest: path.resolve(__dirname, 'styles/iconfont'),
    scssFilename: 'iconfont',
    classSelector: 'icon',
    classPrefix: 'icon-'
  }
};
```

## Options

### fonts

```javascript
fonts: {
    files: [
      // '**/*.+(woff|woff2|eot|ttf|otf|svg)',
      '**/*.woff',
      '**/*.woff2',
      '**/*.eot',
      '**/*.ttf',
      '**/*.otf',
      '**/*.svg'
    ],
    inputPath: path.resolve(__dirname, 'assets/fonts'),
    outputPath: 'fonts',
    fontFilename: '[fontname].[chunkhash].[ext]?[hash]',
    cssDest: path.resolve(__dirname, 'styles/fonts'),
    cssFilename: 'fonts',
    scssDest: path.resolve(__dirname, 'styles/fonts'),
    scssFilename: 'fonts'
}
```
#### files

Required: `true`

Type: `Array`

Default: `undefined`


The <a href="https://www.npmjs.com/package/glob">Glob</a> pattern to use to find
the font files to process.

#### inputPath

Required: `true`

Type: `String`

Default: `undefined`

The context for the <a href="https://www.npmjs.com/package/glob">Glob</a> pattern.

#### outputPath

Required: `false`

Type: `String`

Default: `iconfont/`

The path relative to the default Webpack output folder where to save 
the fonts files.

#### fontFilename

See [webfonts-loader#filename-string](https://github.com/jeerbl/webfonts-loader#filename-string)

The generated font file names. These elements can be used:

* `[fontname]`: the name of the font file being generated
* `[ext]`: the extension of the font file being generated (`eot`, ...)
* `[hash]`: the hash of the current compilation
* `[chunkhash]`: the hash of the SVG files

This option can be also configured globally in the webpack loader options.

#### cssDest

Required: `false`

Type: `String`

Default: `false`

The absolute path to use to save a copy of the CSS file being generated.

If set the CSS file will be generated at the specified destination.

#### cssFilename

Required: `false`

Type: `String`

Default: `iconfont`

The name CSS file being generated.

#### fontfaceTemplateCSS

Required: `false`

Type: `String`

Default: `../templates/fontface-css.hbs`

The template to use to generate the css.

#### scssDest

Required: `false`

Type: `String`

Default: `false`

The absolute path to use to save a copy of the SCSS file being generated.

If set the SCSS file will be generated at the specified destination.

#### scssFilename

Required: `false`

Type: `String`

Default: `iconfont`

The name SCSS file being generated.

#### fontfaceTemplateSCSS

Required: `false`

Type: `String`

Default: `../templates/fontface-scss.hbs`

The template to use to generate the scss.

### icons

```javascript
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
    fontName: 'IconFont',
    fontFilename: '[fontname].[chunkhash].[ext]?[hash]',
    cssDest: path.resolve(__dirname, 'styles/iconfont'),
    cssFilename: 'iconfont',
    scssDest: path.resolve(__dirname, 'styles/iconfont'),
    scssFilename: 'iconfont',
    classSelector: 'icon',
    classPrefix: 'icon-'
}
```
#### files

Required: `true`

Type: `Array`

Default: `undefined`

The <a href="https://www.npmjs.com/package/glob">Glob</a> pattern to use to find
the svg files to process.

#### inputPath

Required: `true`

Type: `String`

Default: `undefined`

The context for the <a href="https://www.npmjs.com/package/glob">Glob</a> pattern.

#### outputPath

Required: `false`

Type: `String`

Default: `fonts/`

The path relative to the default Webpack output folder where to save 
the svg iconfont files.

#### types

See [webfonts-generator#types](https://github.com/vusion/webfonts-generator/#types)

#### order

See [webfonts-generator#order](https://github.com/vusion/webfonts-generator/#order)

#### publicPath

See [webfonts-loader#publicpath-string](https://github.com/jeerbl/webfonts-loader#publicpath-string)

#### fontName

See [webfonts-generator#fontname](https://github.com/vusion/webfonts-generator#fontname)

#### fontFilename

See [webfonts-loader#filename-string](https://github.com/jeerbl/webfonts-loader#filename-string)

The generated font file names. These elements can be used:

* `[fontname]`: the value of the `fontName` parameter
* `[ext]`: the extension of the font file being generated (`eot`, ...)
* `[hash]`: the hash of the current compilation
* `[chunkhash]`: the hash of the SVG files

This option can be also configured globally in the webpack loader options.

#### cssDest

Required: `false`

Type: `String`

Default: `false`

The absolute path to use to save a copy of the CSS file being generated.

If set the CSS file will be generated at the specified destination.

#### cssFilename

Required: `false`

Type: `String`

Default: `fonts`

The name CSS file being generated.

#### cssTemplate

Required: `false`

Type: `String`

Default: `../templates/css.hbs`

The template to use to generate the css.

#### scssDest

Required: `false`

Type: `String`

Default: `false`

The absolute path to use to save a copy of the SCSS file being generated.

If set the SCSS file will be generated at the specified destination.

#### scssFilename

Required: `false`

Type: `String`

Default: `fonts`

The name SCSS file being generated.

#### scssTemplate

Required: `false`

Type: `String`

Default: `../templates/scss.hbs`

The template to use to generate the scss.

#### classSelector

See [webfonts-generator#templateoptions](https://github.com/vusion/webfonts-generator#templateoptions)

#### classPrefix

See [webfonts-generator#templateoptions](https://github.com/vusion/webfonts-generator#templateoptions)

## Tests

```
$ npm run test-build
$ npm run test-dev
```

## References & Shout-out

* Inpired by [webfonts-loader](https://github.com/jeerbl/webfonts-loader)
* Made possible by [webfonts-generator](https://github.com/vusion/webfonts-generator)

## Licence

Public domain, see the `LICENCE` file.
