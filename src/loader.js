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
   * fontfaceTemplate:
   * inputPath:
   * outputPath:
   * fontFilename:
   * cssDest:
   * cssFilename:
   * scssDest:
   * scssFilename:
  ============================================================================= */
  const fontfaceTemplate = assetConfig.fonts.fontfaceTemplate || path.resolve(__dirname, '../templates', 'fontface.hbs');
  let inputPath = assetConfig.fonts.inputPath || false;
  let outputPath = assetConfig.fonts.outputPath || 'fonts';
  let fontFilename = assetConfig.fonts.fontFilename || '[fontname].[hash].[ext]';
  let cssDest = assetConfig.fonts.cssDest || false;
  const cssFilename = assetConfig.fonts.cssFilename || 'fonts';
  let scssDest = assetConfig.fonts.scssDest || false;
  const scssFilename = assetConfig.fonts.scssFilename || 'fonts';

  // Override options with the one provided by the loader webpack main configuration
  if (typeof options.fonts.fontFilename === 'string') {
    fontFilename = options.fonts.fontFilename;
  }

  // Add trailing slash to paths
  if (inputPath !== false && inputPath.substr(-1) !== '/') inputPath += '/';
  if (outputPath !== false && outputPath.substr(-1) !== '/') outputPath += '/';
  if (cssDest !== false && cssDest.substr(-1) !== '/') cssDest += '/';
  if (scssDest !== false && scssDest.substr(-1) !== '/') scssDest += '/';

  // Update files dependency
  this.addDependency.bind(fontfaceTemplate);

  let fontfacesCSS = '';
  if (inputPath !== false) {
    /* Emit fonts files
    ============================================================================= */
    const fontsDetail = utils.emitFonts(this, fonts.filesFound, inputPath, outputPath, fontFilename);

    /* Generate the fontfaces CSS
    ============================================================================= */
    fontfacesCSS = utils.generateFontfacesCSS(fontsDetail, fontfaceTemplate);

    /* Write to disk the SCSS file (OPTIONAL)
    ============================================================================= */
    if (scssDest && fontfacesCSS.length > 0) {
      // Create the destination folder
      mkdirp.sync(scssDest);
      const fontsScssFilename = scssDest.concat(`${scssFilename}.scss`);
      fs.writeFileSync(fontsScssFilename, fontfacesCSS);
    }

    /* Write to disk the CSS file (OPTIONAL)
    ============================================================================= */
    if (cssDest && fontfacesCSS.length > 0) {
      // Create the destination folder
      mkdirp.sync(cssDest);
      const fontsCssFilename = cssDest.concat(`${cssFilename}.css`);
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
   * cssTemplate:
   * scssFilename:
   * scssDest:
   * scssTemplate:
  ============================================================================= */
  const cssTemplate = path.resolve(__dirname, '../templates', 'css.hbs');
  const scssTemplate = path.resolve(__dirname, '../templates', 'scss.hbs');
  const webfontsOptions = {
    files: icons.filesFound,
    types: assetConfig.icons.types || ['eot', 'woff', 'woff2', 'ttf', 'svg'],
    order: assetConfig.icons.order || ['eot', 'woff', 'woff2', 'ttf', 'svg'],
    fontName: assetConfig.icons.fontName || 'IconFont',
    fileName: assetConfig.icons.fontFilename || '[fontname].[hash].[ext]',
    writeFiles: false, /* always keep it to false */
    dest: assetConfig.icons.outputPath || 'iconfont', /* relative to the Webpack output folder */
    publicPath: assetConfig.icons.publicPath || '/',
    /* extension */cssFilename: assetConfig.icons.cssFilename || false,
    cssDest: assetConfig.icons.cssDest || false,
    cssTemplate: assetConfig.icons.cssTemplate || cssTemplate,
    /* extension */scssFilename: assetConfig.icons.scssFilename || 'iconfont',
    /* extension */scssDest: assetConfig.icons.scssDest || 'iconfont',
    /* extension */scssTemplate: assetConfig.icons.scssTemplate || scssTemplate,
    templateOptions: {
      baseSelector: assetConfig.classSelector || 'icon',
      classPrefix: 'classPrefix' in assetConfig ? assetConfig.classPrefix : 'icon-'
    },
  };

  // Override options with the one provided by the loader webpack main configuration
  if (typeof options.icons.fontFilename === 'string') {
    webfontsOptions.fileName = options.icons.fontFilename;
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
