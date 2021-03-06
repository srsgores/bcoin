/*!
 * layout-browser.js - walletdb and txdb layout for browser.
 * Copyright (c) 2014-2016, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

var utils = require('../utils/utils');
var pad32 = utils.pad32;
var layout = exports;

layout.walletdb = {
  p: function(hash) {
    return 'p' + hash;
  },
  pp: function(key) {
    return key.slice(1);
  },
  P: function(wid, hash) {
    return 'p' + pad32(wid) + hash;
  },
  Pp: function(key) {
    return key.slice(11);
  },
  w: function(wid) {
    return 'w' + pad32(wid);
  },
  ww: function(key) {
    return +key.slice(1);
  },
  l: function(id) {
    return 'l' + id;
  },
  ll: function(key) {
    return key.slice(1);
  },
  a: function a(wid, index) {
    return 'a' + pad32(wid) + pad32(index);
  },
  i: function i(wid, name) {
    return 'i' + pad32(wid) + name;
  },
  ii: function ii(key) {
    return [+key.slice(1, 11), key.slice(11)];
  },
  R: 'R',
  b: function b(hash) {
    return 'b' + hash;
  },
  e: function e(hash) {
    return 'e' + hash;
  }
};

layout.txdb = {
  prefix: function prefix(wid, key) {
    return 't' + pad32(wid) + key;
  },
  pre: function prefix(key) {
    return +key.slice(1, 11);
  },
  hi: function hi(ch, hash, index) {
    return ch + hash + pad32(index);
  },
  hii: function hii(key) {
    key = key.slice(12);
    return [key.slice(0, 64), +key.slice(64)];
  },
  ih: function ih(ch, index, hash) {
    return ch + pad32(index) + hash;
  },
  ihh: function ihh(key) {
    key = key.slice(12);
    return [+key.slice(0, 10), key.slice(10)];
  },
  iih: function iih(ch, index, num, hash) {
    return ch + pad32(index) + pad32(num) + hash;
  },
  iihh: function iihh(key) {
    key = key.slice(12);
    return [+key.slice(0, 10), +key.slice(10, 20), key.slice(20)];
  },
  ihi: function ihi(ch, index, hash, num) {
    return ch + pad32(index) + hash + pad32(num);
  },
  ihii: function ihii(key) {
    key = key.slice(12);
    return [+key.slice(0, 10), key.slice(10, 74), +key.slice(74)];
  },
  ha: function ha(ch, hash) {
    return ch + hash;
  },
  haa: function haa(key) {
    key = key.slice(12);
    return key;
  },
  t: function t(hash) {
    return this.ha('t', hash);
  },
  tt: function tt(key) {
    return this.haa(key);
  },
  c: function c(hash, index) {
    return this.hi('c', hash, index);
  },
  cc: function cc(key) {
    return this.hii(key);
  },
  d: function d(hash, index) {
    return this.hi('d', hash, index);
  },
  dd: function dd(key) {
    return this.hii(key);
  },
  s: function s(hash, index) {
    return this.hi('s', hash, index);
  },
  ss: function ss(key) {
    return this.hii(key);
  },
  o: function o(hash, index) {
    return this.hi('o', hash, index);
  },
  oo: function oo(key) {
    return this.hii(key);
  },
  p: function p(hash) {
    return this.ha('p', hash);
  },
  pp: function pp(key) {
    return this.haa(key);
  },
  m: function m(time, hash) {
    return this.ih('m', time, hash);
  },
  mm: function mm(key) {
    return this.ihh(key);
  },
  h: function h(height, hash) {
    return this.ih('h', height, hash);
  },
  hh: function hh(key) {
    return this.ihh(key);
  },
  T: function T(account, hash) {
    return this.ih('T', account, hash);
  },
  Tt: function Tt(key) {
    return this.ihh(key);
  },
  P: function P(account, hash) {
    return this.ih('P', account, hash);
  },
  Pp: function Pp(key) {
    return this.ihh(key);
  },
  M: function M(account, time, hash) {
    return this.iih('M', account, time, hash);
  },
  Mm: function Mm(key) {
    return this.iihh(key);
  },
  H: function H(account, height, hash) {
    return this.iih('H', account, height, hash);
  },
  Hh: function Hh(key) {
    return this.iihh(key);
  },
  C: function C(account, hash, index) {
    return this.ihi('C', account, hash, index);
  },
  Cc: function Cc(key) {
    return this.ihii(key);
  }
};

/*
 * Expose
 */

module.exports = layout;
