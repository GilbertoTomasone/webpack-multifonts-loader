var test = require('ava');
var fs = require('fs');
var glob = require('glob');

test('check fonts creation', function (t) {
  const expected = 40;
  let count = 0;
  glob.sync('**/*.+(woff|woff2|eot|ttf|otf|svg)', {
    cwd: './dist/fonts'
  }).forEach(function (file) {
    count++;
  });
  t.is(count, expected);
});

test('check fonts css creation', function (t) {
  const expected = true;
  let exists = false;
  if (fs.existsSync('./styles/fonts/fonts.css')) {
    exists = true;
  }
  t.is(exists, expected);
});

test('check fonts scss creation', function (t) {
  const expected = true;
  let exists = false;
  if (fs.existsSync('./styles/fonts/fonts.scss')) {
    exists = true;
  }
  t.is(exists, expected);
});

test('check iconfont creation', function (t) {
  const expected = 5;
  let count = 0;
  glob.sync('**/*.+(woff|woff2|eot|ttf|otf|svg)', {
    cwd: './dist/iconfont'
  }).forEach(function (file) {
    count++;
  });
  t.is(count, expected);
});

test('check icons css creation', function (t) {
  const expected = true;
  let exists = false;
  if (fs.existsSync('./styles/iconfont/iconfont.css')) {
    exists = true;
  }
  t.is(exists, expected);
});

test('check icons scss creation', function (t) {
  const expected = true;
  let exists = false;
  if (fs.existsSync('./styles/iconfont/iconfont.scss')) {
    exists = true;
  }
  t.is(exists, expected);
});
