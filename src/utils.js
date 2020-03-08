'use strict';

const loaderUtils = require('loader-utils');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const _ = require('lodash');
const crypto = require('crypto');
const handlebars = require('handlebars');

/* Exports
============================================================================= */
module.exports = {
  addDependencies,
  getContext,
  emitFonts,
  generateFontFilename,
  generateFontfaces,
  makeFontSrc
};

/* Dependecy manager
 *
 * @description
 * Update the loader dependencies with all the files and directories found
 *
 * @return
 * The list of files and directories found
============================================================================= */
function addDependencies (loader, files, context) {
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
      if (!path.isAbsolute(file)) {
        file = path.resolve(context, file);
      }
      if (fs.existsSync(file)) {
        if (fs.lstatSync(file).isFile()) {
          const dir = path.dirname(file);
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
 * [fontname]: the value of the fontName parameter
 * [ext]: the extension of the font file being generated (eot, ...)
 * [chunkhash]: the hash of the SVG files
 * [hash]: the hash of the current compilation
============================================================================= */
function generateFontFilename (loader, fontName, fileName, fileContent, ext) {
  // File hash
  const chunkHash = crypto.createHash('md5').update(fileContent).digest('hex');
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
function getContext (loader) {
  return loader.rootContext || loader.options.context || loader.context;
}

/* Emit the fonts into the Webpack output destination
============================================================================= */
function emitFonts (loader, fonts, inputPath, outputPath, filename) {
  const fontsDetail = {};
  fonts.forEach((file) => {
    // Generate font metadata
    const fontData = fs.readFileSync(file, null);
    const fontFile = path.basename(file);
    const fontName = path.parse(fontFile).name;
    const fontExt = path.parse(fontFile).ext.substr(1);
    const fontPath = path.dirname(path.relative(inputPath, file)) + '/';
    const fontFilename = generateFontFilename(
      loader,
      fontName,
      filename,
      fontData,
      fontExt
    );
    const fontURI = outputPath.concat(fontPath).concat(fontFilename);
    const fontURL = ('/').concat(fontURI.replace(/\\/g, '/'));
    // Aggregate font metadata
    fontsDetail[fontName] = fontsDetail[fontName] || { name: '', types: [], urls: [] };
    fontsDetail[fontName].name = fontName;
    fontsDetail[fontName].types.push(fontExt);
    fontsDetail[fontName].urls[fontExt] = fontURL;
    // Emith the font files
    loader.emitFile(fontURI, fontData);
  });
  return fontsDetail;
}

/* Generate the fontface from the fonts detail
============================================================================= */
function generateFontfaces (fontfaceTemplate, fontsDetail, templateOptions) {
  const fonts = [];
  Object.keys(fontsDetail).forEach((fontName) => {
    const font = fontsDetail[fontName];
    const fontSrc = makeFontSrc({
      fontName: font.name,
      order: font.types,
      types: font.types
    }, font.urls);
    const ctx = Object.assign({
      fontName: font.name,
      src: fontSrc
    }, templateOptions);
    fonts.push(ctx);
  });
  if (fonts.length > 0) {
    const template = fs.readFileSync(fontfaceTemplate, 'utf8');
    return handlebars.compile(template)(Object.assign({
      fonts: fonts
    }, templateOptions));
  }
  return '';
}

/* Make font src attribute from urls
============================================================================= */
function makeFontSrc (options, urls) {
  var templates = {
    eot: _.template('url("<%= url %>?#iefix") format("embedded-opentype")'),
    woff2: _.template('url("<%= url %>") format("woff2")'),
    woff: _.template('url("<%= url %>") format("woff")'),
    ttf: _.template('url("<%= url %>") format("truetype")'),
    svg: _.template('url("<%= url %>#<%= fontName %>") format("svg")')
  };

  return _.map(options.order, function (type) {
    return templates[type]({
      url: urls[type],
      fontName: options.fontName
    });
  }).join(',\n');
}
