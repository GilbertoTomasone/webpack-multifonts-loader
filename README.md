[![npm](https://img.shields.io/npm/v/multifonts-loader.svg?style=flat-square)](https://www.npmjs.com/package/multifonts-loader)
[![npm](https://img.shields.io/npm/dm/multifonts-loader.svg?style=flat-square)](https://www.npmjs.com/package/multifonts-loader)
[![Travis](https://img.shields.io/travis/gilbertotomasone/webpack-multifonts-loader.svg?style=flat-square)](https://travis-ci.org/gilbertotomasone/webpack-multifonts-loader)
[![license](https://img.shields.io/github/license/gilbertotomasone/webpack-multifonts-loader.svg?style=flat-square)](https://github.com/GilbertoTomasone/webpack-multifonts-loader/blob/master/LICENSE)

# Webpack Multifonts Loader

Loader for webpack to generate **fontfaces** from font families and **iconfonts** from svgs using <a href="https://github.com/vusion/webfonts-generator">webfonts-generator</a>.

## Installation

```
$ npm install webpack-fonts-loader
```

## Usage

### Inject classes in the markup

#### `*.html`

```html
<span class="[FONT_CLASS_PREFIX]-[FONT_FILE_NAME]"></span>

<span class="[ICON_BASE_SELECTOR] [ICON_CLASS_PREFIX]-[SVG_FILE_NAME]"></span>
```

*Example*

```html
<span class="font-Roboto-ThinItalic"></span>

<span class="icon icon-arrow"></span>
```

### Import the scss files and use the mixins

#### `*.sass`

#### Mixin: `webfont`

FONT_FILE_NAME: `Required`

FONT_WEIGHT: `Optional | Default: normal | Values: css standard`

FONT_STYLE: `Optional | Default: normal | Values: css standard`

```sass
@include webfont('FONT_FILE_NAME', 'FONT_WEIGHT', 'FONT_STYLE')
```

*Example:*

```sass
@import 'fonts/fonts'

div
  @include webfont('Arial', 'bold', 'italic')
  
p
  @include webfont('Roboto-ThinItalic')
```

#### Mixin: `webfont-icon`

SVG_FILE_NAME: `Required`

ICON_POSITION: `Optional | Default: before | Values: [before|after]`

ICON_ALIGN: `Optional | Default: top | Values: css standard`

ICON_SIZE: `Optional | Default: inherit | Values: css standard`

ICON_WEIGHT: `Optional | Default: normal | Values: css standard`

ICON_STYLE: `Optional | Default: normal | Values: css standard`

```sass
@include webfont-icon('SVG_FILE_NAME', 'ICON_POSITION', 'ICON_ALIGN', 'ICON_SIZE', 'ICON_WEIGHT', 'ICON_STYLE')
```

*Example:*

```sass
@import 'iconfont/iconfont'

span
  @include webfont-icon('calendar', 'before', 'middle', '16px', 'bold', 'italic')
  @include webfont-icon('arrow', 'after')
```

## Setup

### Webpack Rule

Create one or multiple configuration files for your fonts and iconfonts 
and chain the multifonts-loader with the css-loader 
and MiniCssExtractPlugin loader to generate the CSS style 
directly into the Webpack default output path.

Optionally you can also generate the css and scss files to include directly
into your application.

See below [fonts webpack-multifonts-loader#cssdest](https://github.com/GilbertoTomasone/webpack-multifonts-loader#cssdest)

See below [fonts webpack-multifonts-loader#scssdest](https://github.com/GilbertoTomasone/webpack-multifonts-loader#scssdest)

See below [icons webpack-multifonts-loader#cssdest](https://github.com/GilbertoTomasone/webpack-multifonts-loader#cssdest-1)

See below [icons webpack-multifonts-loader#scssdest](https://github.com/GilbertoTomasone/webpack-multifonts-loader#scssdest-1)


```javascript
{
  test: /multifonts\.loader\.js/,
  use: [
    MiniCssExtractPlugin.loader,
    'css-loader',
    'multifonts-loader'
  ]
}
```

### Loader Options

Extend the loader configuration by including all the available options
directly into the rule definition.

See below [webpack-multifonts-loader#options](https://github.com/GilbertoTomasone/webpack-multifonts-loader#options)

*Example:*

You can override the fontFilename depending on the environment.

See below [fonts webpack-multifonts-loader#fontfilename](https://github.com/GilbertoTomasone/webpack-multifonts-loader#fontfilename)

See below [icons webpack-multifonts-loader#fontfilename](https://github.com/GilbertoTomasone/webpack-multifonts-loader#fontfilename-1)

```javascript
{
  test: /multifonts\.loader\.js/,
  use: [
    MiniCssExtractPlugin.loader,
    'css-loader',
    {
      loader: 'multifonts-loader',
      options: {
          fonts: {
            fontFilename: isDevelopment
              ? '[fontname].[chunkhash].[ext]?[hash]'
              : '[chunkhash].[ext]?[hash]'
             // ...
             // Add any other available option
          },
          icons: {
            fontFilename: isDevelopment
              ? '[fontname].[chunkhash].[ext]?[hash]'
              : '[chunkhash].[ext]?[hash]'
             // ...
             // Add any other available option
          }
      }
    }
  ]
}
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
    scssFilename: 'fonts',
    templateOptions: {
      classPrefix: 'font-',
      mixinName: 'webfont'
    }
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
    templateOptions: {
      baseSelector: 'icon',
      classPrefix: 'icon-',
      mixinName: 'webfont-icon'
    }
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
    scssFilename: 'fonts',
    templateOptions: {
      classPrefix: 'font-',
      mixinName: 'webfont'
    }
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

#### fontfaceTemplateCSS

Required: `false`

Type: `String`

Default: `../templates/fontface-css.hbs`

The template to use to generate the css.

#### fontfaceTemplateSCSS

Required: `false`

Type: `String`

Default: `../templates/fontface-scss.hbs`

The template to use to generate the scss.

#### templateOptions

Options passed to the fontfaceTemplateCSS and fontfaceTemplateSCSS.

It can be extended to include any custom variables you would like 
to render in your custom templates.

```javascript
templateOptions: {
  classPrefix: 'font-',
  mixinName: 'webfont',
  // This options will be passed to the template for you to render
  customOption: 'customValue'
}
```

##### classPrefix

Required: `false`

Type: `String`

Default: `font-`

The prefix to use for the font classes being generated.

##### mixinName

Required: `false`

Type: `String`

Default: `webfont`

The name of the scss mixin to call when including the font.

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
    templateOptions: {
      baseSelector: 'icon',
      classPrefix: 'icon-',
      mixinName: 'webfont-icon'
    }
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

#### cssTemplate

Required: `false`

Type: `String`

Default: `../templates/css.hbs`

The template to use to generate the css.

#### scssTemplate

Required: `false`

Type: `String`

Default: `../templates/scss.hbs`

The template to use to generate the scss.

#### templateOptions

Options passed to the cssTemplate and scssTemplate.

It can be extended to include any custom variables you would like 
to render in your custom templates.

```javascript
templateOptions: {
  baseSelector: 'icon',
  classPrefix: 'icon-',
  mixinName: 'webfont-icon',
  // This options will be passed to the template for you to render
  customOption: 'customValue'
}
```

##### baseSelector

Required: `false`

Type: `String`

Default: `icon`

The class name for the css being generated.

See [webfonts-generator#templateoptions](https://github.com/vusion/webfonts-generator#templateoptions)

##### classPrefix

Required: `false`

Type: `String`

Default: `icon-`

The css class prefix for the css being generated.

See [webfonts-generator#templateoptions](https://github.com/vusion/webfonts-generator#templateoptions)

##### mixinName

Required: `false`

Type: `String`

Default: `webfont-icon`

The name of the scss mixin to call when including the icons.

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
