'use strict';

const loaderUtils = require('loader-utils');
const validateOptions = require('schema-utils');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const webfontsGenerator = require('@vusion/webfonts-generator');
const utils = require('./utils');

const schema = require('./options.json');

const configuration = {
  name: 'Fonts Loader'
};

/* Loader
============================================================================= */
function loader (content, map, meta) {
  this.cacheable();

  /* Callback
  ============================================================================= */
  const callback = this.async();

  /* Validate the options
  ============================================================================= */
  const options = loaderUtils.getOptions(this) || {};
  validateOptions(schema, options, configuration);

  /* Read the config file
  ============================================================================= */
  let assetConfig;
  try {
    // First Loader: the resource is a string
    assetConfig = JSON.parse(content);
  } catch (ex) {
    // Chained Loader: the resource is
    assetConfig = this.exec(content, this.resourcePath);
  }

  /* Load icons
  ============================================================================= */
  const icons = utils.addDependencies(
    this,
    assetConfig.icons.files,
    assetConfig.icons.inputPath
  );

  /* Load fonts
  ============================================================================= */
  const fonts = utils.addDependencies(
    this,
    assetConfig.fonts.files,
    assetConfig.fonts.inputPath
  );

  /* FONTS
  ============================================================================= */

  /* Initialise fonts options
   *
   * inputPath:
   * outputPath:
   * fontFilename:
   * cssDest:
   * cssFilename:
   * scssDest:
   * scssFilename:
   * fontfaceTemplateCSS:
   * fontfaceTemplateSCSS:
   * templateOptions:
   * - classPrefix:
   * - mixinName:
  ============================================================================= */
  let fontsOptions = {
    fontfaceTemplateCSS: assetConfig.fonts.fontfaceTemplateCSS || path.resolve(__dirname, '../templates', 'fontface-css.hbs'),
    fontfaceTemplateSCSS: assetConfig.fonts.fontfaceTemplateSCSS || path.resolve(__dirname, '../templates', 'fontface-scss.hbs'),
    inputPath: assetConfig.fonts.inputPath || false,
    outputPath: assetConfig.fonts.outputPath || 'fonts',
    fontFilename: assetConfig.fonts.fontFilename || '[fontname].[hash].[ext]',
    cssDest: assetConfig.fonts.cssDest || false,
    cssFilename: assetConfig.fonts.cssFilename || 'fonts',
    scssDest: assetConfig.fonts.scssDest || false,
    scssFilename: assetConfig.fonts.scssFilename || 'fonts',
    templateOptions: Object.assign({
      classPrefix: assetConfig.fonts.templateOptions.classPrefix || 'font-',
      mixinName: assetConfig.fonts.templateOptions.mixinName || 'webfont'
    }, assetConfig.fonts.templateOptions)
  };

  // Override options with the one provided by the loader webpack main configuration
  if (typeof options.fonts === 'object') {
    fontsOptions = Object.assign(fontsOptions, options.fonts);
  }

  // Add trailing slash to paths
  if (fontsOptions.inputPath !== false && fontsOptions.inputPath.substr(-1) !== '/') fontsOptions.inputPath += '/';
  if (fontsOptions.outputPath !== false && fontsOptions.outputPath.substr(-1) !== '/') fontsOptions.outputPath += '/';
  if (fontsOptions.cssDest !== false && fontsOptions.cssDest.substr(-1) !== '/') fontsOptions.cssDest += '/';
  if (fontsOptions.scssDest !== false && fontsOptions.scssDest.substr(-1) !== '/') fontsOptions.scssDest += '/';

  // Update files dependency
  this.addDependency.bind(fontsOptions.fontfaceTemplateCSS);
  this.addDependency.bind(fontsOptions.fontfaceTemplateSCSS);

  let fontfacesCSS = '';
  let fontfacesSCSS = '';
  if (fontsOptions.inputPath !== false) {
    /* Emit fonts files
    ============================================================================= */
    const fontsDetail = utils.emitFonts(this, fonts.filesFound, fontsOptions.inputPath, fontsOptions.outputPath, fontsOptions.fontFilename);

    /* Generate the fontfaces CSS and SCSS
    ============================================================================= */
    fontfacesCSS = utils.generateFontfaces(fontsOptions.fontfaceTemplateCSS, fontsDetail, fontsOptions.templateOptions);
    fontfacesSCSS = utils.generateFontfaces(fontsOptions.fontfaceTemplateSCSS, fontsDetail, fontsOptions.templateOptions);

    /* Write to disk the SCSS file (OPTIONAL)
    ============================================================================= */
    if (fontsOptions.scssDest && fontfacesCSS.length > 0) {
      // Create the destination folder
      mkdirp.sync(fontsOptions.scssDest);
      const fontsScssFilename = fontsOptions.scssDest.concat(`${fontsOptions.scssFilename}.scss`);
      fs.writeFileSync(fontsScssFilename, fontfacesSCSS);
    }

    /* Write to disk the CSS file (OPTIONAL)
    ============================================================================= */
    if (fontsOptions.cssDest && fontfacesCSS.length > 0) {
      // Create the destination folder
      mkdirp.sync(fontsOptions.cssDest);
      const fontsCssFilename = fontsOptions.cssDest.concat(`${fontsOptions.cssFilename}.css`);
      fs.writeFileSync(fontsCssFilename, fontfacesCSS);
    }

    /* Return the fontface CSS string if there are not icons to process
    ============================================================================= */
    if (icons.filesFound.length === 0) {
      callback(null, [
        `${fontfacesCSS}`
      ].join('\n'));
    }
  }

  /* ICONS
  ============================================================================= */

  /* Initialise webfontsGenerator options
   *
   * files:
   * types:
   * order:
   * fontName:
   * fileName:
   * writeFiles:
   * dest:
   * publicPath:
   * cssFilename:
   * cssDest:
   * scssFilename:
   * scssDest:
   * cssTemplate:
   * scssTemplate:
   * templateOptions:
   * - baseSelector:
   * - classPrefix:
   * - mixinName
  ============================================================================= */
  const cssTemplate = path.resolve(__dirname, '../templates', 'css.hbs');
  const scssTemplate = path.resolve(__dirname, '../templates', 'scss.hbs');
  let webfontsOptions = {
    files: icons.filesFound,
    types: assetConfig.icons.types || ['eot', 'woff', 'woff2', 'ttf', 'svg'],
    order: assetConfig.icons.order || ['eot', 'woff', 'woff2', 'ttf', 'svg'],
    fontName: assetConfig.icons.fontName || 'IconFont',
    fileName: assetConfig.icons.fontFilename || '[fontname].[hash].[ext]',
    writeFiles: false, /* always keep it to false */
    dest: assetConfig.icons.outputPath || 'iconfont', /* relative to the Webpack output folder */
    publicPath: assetConfig.icons.publicPath || '/',
    /* extension */cssFilename: assetConfig.icons.cssFilename || 'iconfont',
    cssDest: assetConfig.icons.cssDest || false,
    cssTemplate: assetConfig.icons.cssTemplate || cssTemplate,
    /* extension */scssFilename: assetConfig.icons.scssFilename || 'iconfont',
    /* extension */scssDest: assetConfig.icons.scssDest || 'iconfont',
    /* extension */scssTemplate: assetConfig.icons.scssTemplate || scssTemplate,
    templateOptions: Object.assign({
      baseSelector: assetConfig.icons.templateOptions.cssClassSelector || 'icon',
      classPrefix: assetConfig.icons.templateOptions.cssClassPrefix || 'icon-',
      /* extension */mixinName: assetConfig.icons.templateOptions.scssMixinName || 'webfont-icon'
    }, assetConfig.icons.templateOptions)
  };

  // Override options with the one provided by the loader webpack main configuration
  if (typeof options.icons === 'object') {
    webfontsOptions = Object.assign(webfontsOptions, options.icons);
  }

  // Add trailing slash to paths
  if (webfontsOptions.dest.substr(-1) !== '/') webfontsOptions.dest += '/';
  if (webfontsOptions.cssDest !== false && webfontsOptions.cssDest.substr(-1) !== '/') webfontsOptions.cssDest += '/';
  if (webfontsOptions.scssDest !== false && webfontsOptions.scssDest.substr(-1) !== '/') webfontsOptions.scssDest += '/';

  // Calculate publicPath
  var publicPath;
  if (typeof webfontsOptions.publicPath === 'string') {
    if (webfontsOptions.publicPath === '' || webfontsOptions.publicPath.endsWith('/')) {
      publicPath = webfontsOptions.publicPath;
    } else {
      publicPath = `${webfontsOptions.publicPath}/`;
    }
  } else {
    if (typeof webfontsOptions.publicPath === 'function') {
      publicPath = webfontsOptions.publicPath(this.resourcePath, this.rootContext);
    } else {
      publicPath = this._compilation.outputOptions.publicPath || '/';
    }
  }
  webfontsOptions.publicPath = publicPath;

  // Update files dependency
  this.addDependency.bind(webfontsOptions.cssTemplate);
  this.addDependency.bind(webfontsOptions.scssTemplate);

  /* Generate CSS iconfonts
  ============================================================================= */
  webfontsGenerator(webfontsOptions, (err, result) => {
    if (err) {
      return callback(err);
    }

    const urls = {};
    const formats = webfontsOptions.types;

    /* Emit the font files to the output Webpack destination
    ============================================================================= */
    formats.forEach((format) => {
      const filename = utils.generateFontFilename(
        this,
        webfontsOptions.fontName,
        webfontsOptions.fileName,
        result[format],
        format
      );
      const fontFilename = webfontsOptions.dest.concat(filename);
      urls[format] = webfontsOptions.publicPath.concat(fontFilename.replace(/\\/g, '/'));
      this.emitFile(fontFilename, result[format]);
    });

    /* Generate the CSS string
    ============================================================================= */
    const css = result.generateCss(urls);

    /* Write to disk the CSS file (OPTIONAL)
    ============================================================================= */
    if (webfontsOptions.cssDest) {
      // Create the destination folder
      mkdirp.sync(webfontsOptions.cssDest);

      // Write to disk the CSS file
      const name = webfontsOptions.cssFilename || webfontsOptions.fontName;
      const cssFilename = webfontsOptions.cssDest.concat(`${name}.css`);
      fs.writeFileSync(cssFilename, result.generateCss(urls));
    }

    /* Write to disk the SCSS file (OPTIONAL)
    ============================================================================= */
    if (webfontsOptions.scssDest) {
      webfontsGenerator(Object.assign(webfontsOptions, {
        cssTemplate: webfontsOptions.scssTemplate
      }), (err, result) => {
        if (err) {
          return callback(err);
        }

        // Create the destination folder
        mkdirp.sync(webfontsOptions.scssDest);

        // Write to disk the SCSS file
        const scss = result.generateCss(urls);
        const name = webfontsOptions.scssFilename || webfontsOptions.fontName;
        const scssFilename = webfontsOptions.scssDest.concat(`${name}.scss`);
        fs.writeFileSync(scssFilename, scss);

        /* Always return the CSS string
        ============================================================================= */
        callback(null, [
          `${fontfacesCSS}`,
          `${css}`
        ].join('\n'));
      });
    } else {
      callback(null, [
        `${fontfacesCSS}`,
        `${css}`
      ].join('\n'));
    }
  });
}

exports.default = loader;
