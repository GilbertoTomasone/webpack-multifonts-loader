[![npm][npm-version]][npm-url]
[![npm][npm-download]][npm-url]
[![Travis][travis-build]][travis-url]
[![license][license]][license-url]
[![size][size]][size-url]

[npm-version]: https://img.shields.io/npm/v/multifonts-loader.svg?style=flat-square
[npm-download]: https://img.shields.io/npm/dm/multifonts-loader.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/multifonts-loader
[travis-build]: https://img.shields.io/travis/gilbertotomasone/webpack-multifonts-loader.svg?style=flat-square
[travis-url]: https://travis-ci.org/gilbertotomasone/webpack-multifonts-loader
[license]: https://img.shields.io/github/license/gilbertotomasone/webpack-multifonts-loader.svg?style=flat-square
[license-url]: https://github.com/GilbertoTomasone/webpack-multifonts-loader/blob/master/LICENSE
[size]: https://packagephobia.now.sh/badge?p=multifonts-loader
[size-url]: https://packagephobia.now.sh/result?p=multifonts-loader

# Webpack Multifonts Loader

Loader for webpack to generate **fontfaces** from font families and **iconfonts** from svgs using <a href="https://github.com/vusion/webfonts-generator">webfonts-generator</a>.

## Installation

```
$ npm install multifonts-loader
```

## Usage

### `Inject classes in the markup`

#### `*.html`

```html
<span class="[FONT_CLASS_PREFIX]-[FONT_FILE_NAME]"></span>

<span class="[ICON_BASE_SELECTOR] [ICON_CLASS_PREFIX]-[SVG_FILE_NAME]"></span>
```

*Example:*

```html
<span class="font-Roboto-ThinItalic"></span>

<span class="icon icon-arrow"></span>
```

#### Options

| Name                                      | Required | Default | Description                              |
|-------------------------------------------|----------|---------|------------------------------------------|
| **[`FONT_CLASS_PREFIX`](#classprefix)**   | `true`   | font-   | Specifies the class prefix for the font  |
| **`FONT_FILE_NAME`**                      | `true`   | ''      | Specifies the font-family name           |
| **[`ICON_BASE_SELECTOR`](#baseselector)** | `true`   | icon    | Specifies the base selector for the icon |
| **[`ICON_CLASS_PREFIX`](#classprefix-1)** | `true`   | icon-   | Specifies the class prefix for the icon  |
| **`SVG_FILE_NAME`**                       | `true`   | ''      | Specifies the icon name                  |


### `Import the scss files and use the mixins`

#### Mixin: `webfont`

#### `*.sass`

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

#### Options

| Name                 | Required | Default  | Type           | Description                                                                                                          |
|----------------------|----------|----------|----------------|----------------------------------------------------------------------------------------------------------------------|
| **`FONT_FILE_NAME`** | `true`   | `''`     | `{String}`     | Specifies the name of the font-family to use. For generated fonts the font-family is derived from the font filename. |
| **`FONT_WEIGHT`**    | `false`  | `normal` | `css standard` | Sets how thick or thin characters in text should be displayed                                                        |
| **`FONT_STYLE`**     | `false`  | `normal` | `css standard` | Specifies the font style for a text                                                                                  |


#### Mixin: `webfont-icon`

#### `*.sass`

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

#### Options

| Name                | Required | Default   | Type              | Description                                                                |
|---------------------|----------|-----------|-------------------|----------------------------------------------------------------------------|
| **`SVG_FILE_NAME`** | `true`   | `''`      | `{String}`        | Specifies the name of the icon to use. It is derived from the svg filename |
| **`ICON_POSITION`** | `false`  | `before`  | `[before,after]`  | The position of the icon relative to the current element                   |
| **`ICON_ALIGN`**    | `false`  | `top`     | `css standard`    | Specifies the alignment of the icon                                        |
| **`ICON_SIZE`**     | `false`  | `inherit` | `css standard`    | Specifies the size of the icon                                             |
| **`ICON_WEIGHT`**   | `false`  | `normal`  | `css standard`    | Sets how thick or thin characters in text should be displayed              |
| **`ICON_STYLE`**    | `false`  | `normal`  | `css standard`    | Specifies the font style for the icon                                      |


## Configuration

Create one or multiple configuration files for your fonts and iconfonts.

***`multifonts.loader.js`***

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

See below [webpack-multifonts-loader#options](#options)

The configuration file defines two main sections: 

#### `fonts`

Responsible to locate and process the font families 
   to generate the respective fontfaces.
 
Optionally, you can decide to generate the fontfaces CSS and/or the SCSS 
files to a specified location for you to include in your application.
   
#### `icons`

Responsible to locate and process the svg files to generate the 
respective iconfonts.
    
Optionally, you can decide to generate the iconfont CSS and/or the SCSS 
files to a specified location for you to include in your application. 

## Setup

### Webpack Rule

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

Chain the 
***multifonts-loader*** 
with the 
[css-loader](https://www.npmjs.com/package/css-loader)
and 
[MiniCssExtractPlugin.loader](https://www.npmjs.com/package/mini-css-extract-plugin)
to generate the CSS style 
directly into the Webpack default output path.

Optionally you can also generate the css and scss files to include directly
into your application.

See below [fonts webpack-multifonts-loader#cssdest](#cssdest)

See below [fonts webpack-multifonts-loader#scssdest](#scssdest)

See below [icons webpack-multifonts-loader#cssdest](#cssdest-1)

See below [icons webpack-multifonts-loader#scssdest](#scssdest-1)

#### Loader Options

Extend the loader configuration by including all the available options
directly into the rule definition.

See below [webpack-multifonts-loader#options](#options)

*Example:*

You can override the fontFilename depending on the environment.

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

See below [fonts webpack-multifonts-loader#fontfilename](#fontfilename)

See below [icons webpack-multifonts-loader#fontfilename](#fontfilename-1)

## Integration

Include the configuration file into your app.

`app.js`

```javascript
require('multifonts.loader');
```

# APPENDINX

## Options

### `fonts`

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

#### Options

| Name                                                | Type       | Required | Default                          |
|-----------------------------------------------------|------------|----------|----------------------------------|
| **[`files`](#files)**                               | `{Array}`  | `true`   | `undefined`                      |
| **[`inputPath`](#inputpath)**                       | `{String}` | `true`   | `undefined`                      |
| **[`outputPath`](#outputpath)**                     | `{String}` | `false`  | `iconfont/`                      |
| **[`fontFilename`](#fontfilename)**                 | `{String}` | `false`  | `[fontname].[hash].[ext]`        |
| **[`cssDest`](#cssDest)**                           | `{String}` | `false`  | `false`                          |
| **[`cssFilename`](#cssfilename)**                   | `{String}` | `false`  | `iconfont`                       |
| **[`scssDest`](#scssdest)**                         | `{String}` | `false`  | `false`                          |
| **[`scssFilename`](#scssfilename)**                 | `{String}` | `false`  | `iconfont`                       |
| **[`fontfaceTemplateCSS`](#fontfacetemplatecss)**   | `{String}` | `false`  | `../templates/fontface-css.hbs`  |
| **[`fontfaceTemplateSCSS`](#fontfacetemplatescss)** | `{String}` | `false`  | `../templates/fontface-scss.hbs` |
| **[`templateOptions`](#templateoptions)**           | `{Object}` | `false`  | `{}`                             |
| **[`templateOptions.classPrefix`](#classprefix)**   | `{String}` | `false`  | `font-`                          |
| **[`templateOptions.mixinName`](#mixinname)**       | `{String}` | `false`  | `webfont`                        |

#### `files`

Required: `true`

Type: `Array`

Default: `undefined`


The <a href="https://www.npmjs.com/package/glob">Glob</a> pattern to use to find
the font files to process.

#### `inputPath`

Required: `true`

Type: `String`

Default: `undefined`

The context for the <a href="https://www.npmjs.com/package/glob">Glob</a> pattern.

#### `outputPath`

Required: `false`

Type: `String`

Default: `iconfont/`

The path relative to the default Webpack output folder where to save 
the fonts files.

#### `fontFilename`

Required: `false`

Type: `String`

Default: `[fontname].[hash].[ext]`

See [webfonts-loader#filename-string](https://github.com/jeerbl/webfonts-loader#filename-string)

The generated font file names. These elements can be used:

* `[fontname]`: the name of the font file being generated
* `[ext]`: the extension of the font file being generated (`eot`, ...)
* `[hash]`: the hash of the current compilation
* `[chunkhash]`: the hash of the SVG files

This option can be also configured globally in the webpack loader options.

#### `cssDest`

Required: `false`

Type: `String`

Default: `false`

The absolute path to use to save a copy of the CSS file being generated.

If set the CSS file will be generated at the specified destination.

#### `cssFilename`

Required: `false`

Type: `String`

Default: `iconfont`

The name CSS file being generated.

#### `scssDest`

Required: `false`

Type: `String`

Default: `false`

The absolute path to use to save a copy of the SCSS file being generated.

If set the SCSS file will be generated at the specified destination.

#### `scssFilename`

Required: `false`

Type: `String`

Default: `iconfont`

The name SCSS file being generated.

#### `fontfaceTemplateCSS`

Required: `false`

Type: `String`

Default: `../templates/fontface-css.hbs`

The template to use to generate the css.

#### `fontfaceTemplateSCSS`

Required: `false`

Type: `String`

Default: `../templates/fontface-scss.hbs`

The template to use to generate the scss.

#### `templateOptions`

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

##### `classPrefix`

Required: `false`

Type: `String`

Default: `font-`

The prefix to use for the font classes being generated.

##### `mixinName`

Required: `false`

Type: `String`

Default: `webfont`

The name of the scss mixin to call when including the font.

### `icons`

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

#### Options

| Name                                                  | Type       | Required | Default                                  |
|-------------------------------------------------------|------------|----------|------------------------------------------|
| **[`files`](#files-1)**                               | `{Array}`  | `true`   | `undefined`                              |
| **[`inputPath`](#inputpath-1)**                       | `{String}` | `true`   | `undefined`                              |
| **[`outputPath`](#outputpath-1)**                     | `{String}` | `false`  | `fonts/`                                 |
| **[`types`](#types)**                                 | `{Array}`  | `false`  | `['eot', 'woff', 'woff2', 'ttf', 'svg']` |
| **[`order`](#order)**                                 | `{Array}`  | `false`  | `['eot', 'woff', 'woff2', 'ttf', 'svg']` |
| **[`publicPath`](#publicpath)**                       | `{String}` | `false`  | `/`                                      |
| **[`fontName`](#fontname)**                           | `{String}` | `false`  | `IconFont`                               |
| **[`fontFilename`](#fontfilename-1)**                 | `{String}` | `false`  | `[fontname].[hash].[ext]`                |
| **[`cssDest`](#cssDest-1)**                           | `{String}` | `false`  | `false`                                  |
| **[`cssFilename`](#cssfilename-1)**                   | `{String}` | `false`  | `iconfont`                               |
| **[`scssDest`](#scssdest-1)**                         | `{String}` | `false`  | `false`                                  |
| **[`scssFilename`](#scssfilename-1)**                 | `{String}` | `false`  | `fonts`                                  |
| **[`cssTemplate`](#csstemplate)**                     | `{String}` | `false`  | `../templates/css.hbs`                   |
| **[`scssTemplate`](#scsstemplate)**                   | `{String}` | `false`  | `../templates/scss.hbs`                  |
| **[`templateOptions`](#templateoptions-1)**           | `{Object}` | `false`  | `{}`                                     |
| **[`templateOptions.baseSelector`](#baseselector)**   | `{String}` | `false`  | `icon`                                   |
| **[`templateOptions.classPrefix`](#classprefix-1)**   | `{String}` | `false`  | `icon-`                                  |
| **[`templateOptions.mixinName`](#mixinname-1)**       | `{String}` | `false`  | `webfont-icon`                           |

#### `files`

Required: `true`

Type: `Array`

Default: `undefined`

The <a href="https://www.npmjs.com/package/glob">Glob</a> pattern to use to find
the svg files to process.

#### `inputPath`

Required: `true`

Type: `String`

Default: `undefined`

The context for the <a href="https://www.npmjs.com/package/glob">Glob</a> pattern.

#### `outputPath`

Required: `false`

Type: `String`

Default: `fonts/`

The path relative to the default Webpack output folder where to save 
the svg iconfont files.

#### `types`

Required: `false`

Type: `Array`

Default: `['eot', 'woff', 'woff2', 'ttf', 'svg']`

See [webfonts-generator#types](https://github.com/vusion/webfonts-generator/#types)

#### `order`

Required: `false`

Type: `Array`

Default: `['eot', 'woff', 'woff2', 'ttf', 'svg']`

See [webfonts-generator#order](https://github.com/vusion/webfonts-generator/#order)

#### `publicPath`

Required: `false`

Type: `String`

Default: `/`

See [webfonts-loader#publicpath-string](https://github.com/jeerbl/webfonts-loader#publicpath-string)

#### `fontName`

Required: `false`

Type: `String`

Default: `IconFont`

See [webfonts-generator#fontname](https://github.com/vusion/webfonts-generator#fontname)

#### `fontFilename`

Required: `false`

Type: `String`

Default: `[fontname].[hash].[ext]`

See [webfonts-loader#filename-string](https://github.com/jeerbl/webfonts-loader#filename-string)

The generated font file names. These elements can be used:

* `[fontname]`: the value of the `fontName` parameter
* `[ext]`: the extension of the font file being generated (`eot`, ...)
* `[hash]`: the hash of the current compilation
* `[chunkhash]`: the hash of the SVG files

This option can be also configured globally in the webpack loader options.

#### `cssDest`

Required: `false`

Type: `String`

Default: `false`

The absolute path to use to save a copy of the CSS file being generated.

If set the CSS file will be generated at the specified destination.

#### `cssFilename`

Required: `false`

Type: `String`

Default: `fonts`

The name CSS file being generated.

#### `scssDest`

Required: `false`

Type: `String`

Default: `false`

The absolute path to use to save a copy of the SCSS file being generated.

If set the SCSS file will be generated at the specified destination.

#### `scssFilename`

Required: `false`

Type: `String`

Default: `fonts`

The name SCSS file being generated.

#### `cssTemplate`

Required: `false`

Type: `String`

Default: `../templates/css.hbs`

The template to use to generate the css.

#### `scssTemplate`

Required: `false`

Type: `String`

Default: `../templates/scss.hbs`

The template to use to generate the scss.

#### `templateOptions`

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

##### `baseSelector`

Required: `false`

Type: `String`

Default: `icon`

The class name for the css being generated.

See [webfonts-generator#templateoptions](https://github.com/vusion/webfonts-generator#templateoptions)

##### `classPrefix`

Required: `false`

Type: `String`

Default: `icon-`

The css class prefix for the css being generated.

See [webfonts-generator#templateoptions](https://github.com/vusion/webfonts-generator#templateoptions)

##### `mixinName`

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
