'use strict';

const loaderUtils = require('loader-utils');
const validateOptions = require('schema-utils');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const url = require('url');
const glob = require('glob');
const _ = require('lodash');
const crypto = require('crypto');
const handlebars = require('handlebars');
const webfontsGenerator = require('@vusion/webfonts-generator');

const schema = require('./options.json');

const configuration = {
  name: 'Assets Loader'
};

/* Dependecy manager
 *
 * @description
 * Update the loader dependencies with all the files and directories found
 *
 * @return
 * The list of files and directories found
============================================================================= */
function addDependencies(loader, files, context) {
  let filesFound = [];
  let directoriesFound = [];
  files.forEach(function (file) {
    if (glob.hasMagic(file)) {
      // Loop through files
      glob.sync(file, {
        cwd: context
      }).forEach(function (file) {
        file = path.resolve(context, file);
        if (fs.existsSync(file)) {
          filesFound = _.union(filesFound, [file]);
          // Add file dependency
          loader.addDependency.bind(file);
        }
      });
      // Loop through directories
      glob.sync(`${path.dirname(file)}/`, {
        cwd: context
      }).forEach(function (dir) {
        dir = path.resolve(context, dir);
        if (fs.existsSync(dir)) {
          directoriesFound = _.union(directoriesFound, [dir]);
          // Add directory dependency
          loader.addContextDependency.bind(dir);
        }
      });
    } else {
      if(!path.isAbsolute(file)) {
        file = path.resolve(context, file);
      }
      if (fs.existsSync(file)) {
        if (fs.lstatSync(file).isFile()) {
          let dir = path.dirname(file);
          filesFound = _.union(filesFound, [file]);
          directoriesFound = _.union(directoriesFound, [dir]);
          // Add file dependency
          loader.addDependency.bind(file);
          // Add directory dependency
          loader.addContextDependency.bind(dir);
        }
      }
    }
  });
  return {
    filesFound: filesFound,
    directoriesFound: directoriesFound
  };
}

/* Generate font filename
 *
 * @tokens replacements
 *
 * [fontname]: the value of the fontName parameter
 * [ext]: the extension of the font file being generated (eot, ...)
 * [chunkhash]: the hash of the SVG files
 * [hash]: the hash of the current compilation
============================================================================= */
function generateFontFilename(loader, fontName, fileName, fileContent, ext) {
  // File hash
  let chunkHash = crypto.createHash('md5').update(fileContent).digest('hex');
  // Token replacement
  fileName = fileName
    .replace('[chunkhash]', chunkHash)
    .replace('[fontname]', fontName)
    .replace('[ext]', ext);
  // Token replacement for the compilation hash
  fileName = loaderUtils.interpolateName(
    loader,
    fileName,
    {
      context: getContext(loader),
      content: fileContent
    }
  );
  return fileName;
}

/* Get current context
============================================================================= */
function getContext(loader) {
  return loader.rootContext || loader.options.context || loader.context;
}

/* Emit the fonts into the Webpack output destination
============================================================================= */
function emitFonts(loader, fonts, inputPath, outputPath, filename) {
  let fontsDetail = {};
  fonts.forEach((file) => {
    // Generate font metadata
    let fontData = fs.readFileSync(file, null);
    let fontFile = path.basename(file);
    let fontName = path.parse(fontFile).name;
    let fontExt = path.parse(fontFile).ext.substr(1);
    let fontPath = path.dirname(path.relative(inputPath, file))+'/';
    let fontFilename = generateFontFilename(
      loader,
      fontName,
      filename,
      fontData,
      fontExt
    );
    let fontURI = outputPath.concat(fontPath).concat(fontFilename);
    let fontURL = url.resolve('/', fontURI.replace(/\\/g, '/'));
    // Aggregate font metadata
    fontsDetail[fontName] = fontsDetail[fontName] || {name: '', types: [], urls: []};
    fontsDetail[fontName]['name'] = fontName;
    fontsDetail[fontName]['types'].push(fontExt);
    fontsDetail[fontName]['urls'][fontExt] = fontURL;
    // Emith the font files
    loader.emitFile(fontURI, fontData);
  });
  return fontsDetail;
}

/* Generate the fontface from the fonts detail
============================================================================= */
function generateFontfacesCSS(fontsDetail, fontfaceTemplate) {
  let fontfaces = [];
  Object.keys(fontsDetail).forEach((fontName) => {
    let font = fontsDetail[fontName];
    let fontSrc = makeSrc({
      fontName: font.name,
      order: font.types,
      types: font.types
    }, font.urls);
    let ctx = {
      fontName: font.name,
      src: fontSrc
    };
    let source = fs.readFileSync(fontfaceTemplate, 'utf8');
    let fontface = handlebars.compile(source)(ctx);
    fontfaces.push(fontface);
  });
  if (fontfaces.length > 0) {
    return fontfaces.join('\n');
  }
  return '';
}

/* Make font src attribute from urls
============================================================================= */
function makeSrc(options, urls) {
  var templates = {
    eot: _.template('url("<%= url %>?#iefix") format("embedded-opentype")'),
    woff2: _.template('url("<%= url %>") format("woff2")'),
    woff: _.template('url("<%= url %>") format("woff")'),
    ttf: _.template('url("<%= url %>") format("truetype")'),
    svg: _.template('url("<%= url %>#<%= fontName %>") format("svg")')
  };

  return _.map(options.order, function(type) {
    return templates[type]({
      url: urls[type],
      fontName: options.fontName
    });
  }).join(',\n');
}

/* Loader
============================================================================= */
function loader(content, map, meta) {
  this.cacheable();

  /* Callback
  ============================================================================= */
  let callback = this.async();

  /* Validate the options
  ============================================================================= */
  const options = loaderUtils.getOptions(this) || {};
  validateOptions(schema, options, configuration);

  /* Read the asset config file
  ============================================================================= */
  let assetConfig;
  try {
    // First Loader: the resource is a string
    assetConfig = JSON.parse(content);
  } catch (ex) {
    // Chained Loader: the resource is
    assetConfig = this.exec(content, this.resourcePath);
  }

  /* Load icons asset
  ============================================================================= */
  let icons = addDependencies(
    this,
    assetConfig.icons.files,
    assetConfig.icons.inputPath
  );

  /* Load fonts asset
  ============================================================================= */
  let fonts = addDependencies(
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
   * cssDest:
   * scssDest:
  ============================================================================= */
  let fontfaceTemplate = assetConfig.fonts.fontfaceTemplate || path.resolve(__dirname, '../templates', 'fontface.hbs');
  let inputPath = assetConfig.fonts.inputPath || false;
  let outputPath = assetConfig.fonts.outputPath || 'fonts';
  let fontFilename = assetConfig.fonts.fontFilename || '[fontname].[hash].[ext]';
  let cssDest = assetConfig.fonts.cssDest || false;
  let scssDest = assetConfig.fonts.scssDest || false;

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
    let fontsDetail = emitFonts(this, fonts.filesFound, inputPath, outputPath, fontFilename);

    /* Generate the fontfaces CSS
    ============================================================================= */
    fontfacesCSS = generateFontfacesCSS(fontsDetail, fontfaceTemplate);

    /* Write to disk the SCSS file (OPTIONAL)
    ============================================================================= */
    if (scssDest && fontfacesCSS.length > 0) {
      // Create the destination folder
      mkdirp.sync(scssDest);
      let fontsScssFilename = scssDest.concat(`fonts.scss`);
      fs.writeFileSync(fontsScssFilename, fontfacesCSS);
    }

    /* Return the fontface CSS string if there are not icons to process
    ============================================================================= */
    if (icons.filesFound.length === 0) {
      callback(null, [
        `${ fontfacesCSS }`
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
  let cssTemplate = path.resolve(__dirname, '../templates', 'css.hbs');
  let scssTemplate = path.resolve(__dirname, '../templates', 'scss.hbs');
  let webfontsOptions = {
    files: icons.filesFound,
    types: assetConfig.icons.types || ['eot', 'woff', 'woff2', 'ttf', 'svg'],
    order: assetConfig.icons.order || ['eot', 'woff', 'woff2', 'ttf', 'svg'],
    fontName: assetConfig.icons.font || 'IconFont',
    fileName: assetConfig.icons.fontFilename || '[fontname].[hash].[ext]',
    writeFiles: false, /* always keep it to false */
    dest: assetConfig.icons.outputPath || 'iconfont', /* relative to the Webpack output folder */
    publicPath: assetConfig.icons.publicPath || '/',
    /* extension */cssFilename: assetConfig.icons.cssFilename || false,
    cssDest: assetConfig.icons.cssDest || false,
    cssTemplate: assetConfig.icons.cssTemplate || cssTemplate,
    /* extension */scssFilename: assetConfig.icons.scssFilename || 'iconfont',
    /* extension */scssDest: assetConfig.icons.scssDest || 'iconfont',
    /* extension */scssTemplate: assetConfig.icons.scssTemplate || scssTemplate
  };

  // Override options with the one provided by the loader webpack main configuration
  if (typeof options.icons.fontFilename === 'string') {
    webfontsOptions.fileName = options.icons.fontFilename;
  }

  // Add trailing slash to paths
  if (webfontsOptions.dest.substr(-1) !== '/') webfontsOptions.dest += '/';
  if (webfontsOptions.publicPath.substr(-1) !== '/') webfontsOptions.publicPath += '/';
  if (webfontsOptions.cssDest !== false && webfontsOptions.cssDest.substr(-1) !== '/') webfontsOptions.cssDest += '/';
  if (webfontsOptions.scssDest !== false && webfontsOptions.scssDest.substr(-1) !== '/') webfontsOptions.scssDest += '/';

  // Update files dependency
  this.addDependency.bind(webfontsOptions.cssTemplate);
  this.addDependency.bind(webfontsOptions.scssTemplate);

  /* Generate CSS iconfonts
  ============================================================================= */
  webfontsGenerator(webfontsOptions, (err, result) => {
    if (err)
      return callback(err);

    let urls = {};
    let formats = webfontsOptions.types;

    /* Emit the font files to the output Webpack destination
    ============================================================================= */
    formats.forEach((format) => {
      let filename = generateFontFilename(
        this,
        webfontsOptions.fontName,
        webfontsOptions.fileName,
        result[format],
        format
      );
      let fontFilename = webfontsOptions.dest.concat(filename);
      urls[format] = url.resolve(webfontsOptions.publicPath, fontFilename.replace(/\\/g, '/'));
      this.emitFile(fontFilename, result[format]);
    });

    /* Generate the CSS string
    ============================================================================= */
    let css = result.generateCss(urls);

    /* Write to disk the CSS file (OPTIONAL)
    ============================================================================= */
    if (webfontsOptions.cssDest) {

      // Create the destination folder
      mkdirp.sync(webfontsOptions.cssDest);

      // Write to disk the CSS file
      let name = webfontsOptions.cssFilename || webfontsOptions.fontName;
      let cssFilename = webfontsOptions.cssDest.concat(`${name}.css`);
      fs.writeFileSync(cssFilename, result.generateCss(urls));
    }

    /* Write to disk the SCSS file (OPTIONAL)
    ============================================================================= */
    if (webfontsOptions.scssDest) {
      webfontsGenerator(Object.assign(webfontsOptions, {
        cssTemplate: webfontsOptions.scssTemplate
      }), (err, result) => {
        if (err)
          return callback(err);

        // Create the destination folder
        mkdirp.sync(webfontsOptions.scssDest);

        // Write to disk the SCSS file
        let scss = result.generateCss(urls);
        let name = webfontsOptions.scssFilename || webfontsOptions.fontName;
        let scssFilename = webfontsOptions.scssDest.concat(`${name}.scss`);
        fs.writeFileSync(scssFilename, scss);

    /* Always return the CSS string
    ============================================================================= */
        callback(null, [
          `${ fontfacesCSS }`,
          `${ css }`
        ].join('\n'));
      });
    } else {
      callback(null, [
        `${ fontfacesCSS }`,
        `${ css }`
      ].join('\n'));
    }
  });
}

exports.default = loader;
