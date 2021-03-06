/*!
 * payment.js - bip70 payment for bcoin
 * Copyright (c) 2016, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

var assert = require('assert');
var Output = require('../primitives/output');
var TX = require('../primitives/tx');
var Script = require('../script/script');
var protobuf = require('./protobuf');
var PaymentDetails = require('./paymentdetails');
var ProtoReader = protobuf.ProtoReader;
var ProtoWriter = protobuf.ProtoWriter;

function Payment(options) {
  if (!(this instanceof Payment))
    return new Payment(options);

  this.merchantData = null;
  this.transactions = [];
  this.refundTo = [];
  this.memo = null;

  if (options)
    this.fromOptions(options);
}

Payment.prototype.fromOptions = function fromOptions(options) {
  var i, tx, output;

  if (options.merchantData)
    this.setData(options.merchantData);

  if (options.transactions) {
    assert(Array.isArray(options.transactions));
    for (i = 0; i < options.transactions.length; i++) {
      tx = new TX(options.transactions[i]);
      this.transactions.push(tx);
    }
  }

  if (options.refundTo) {
    assert(Array.isArray(options.refundTo));
    for (i = 0; i < options.refundTo.length; i++) {
      output = new Output(options.refundTo[i]);
      this.refundTo.push(output);
    }
  }

  if (options.memo != null) {
    assert(typeof options.memo === 'string');
    this.memo = options.memo;
  }

  return this;
};

Payment.fromOptions = function fromOptions(options) {
  return new Payment().fromOptions(options);
};

Payment.prototype.setData = PaymentDetails.prototype.setData;
Payment.prototype.getData = PaymentDetails.prototype.getData;

Payment.prototype.fromRaw = function fromRaw(data) {
  var p = new ProtoReader(data);
  var tx, op, output;

  this.merchantData = p.readFieldBytes(1, true);

  while (p.nextTag() === 2) {
    tx = TX.fromRaw(p.readFieldBytes(2));
    this.transactions.push(tx);
  }

  while (p.nextTag() === 3) {
    op = new ProtoReader(p.readFieldBytes(3));
    output = new Output();
    output.value = op.readFieldU64(1, true);
    output.script = Script.fromRaw(op.readFieldBytes(2, true));
    this.refundTo.push(output);
  }

  this.memo = p.readFieldString(4, true);

  return this;
};

Payment.fromRaw = function fromRaw(data, enc) {
  if (typeof data === 'string')
    data = new Buffer(data, enc);
  return new Payment().fromRaw(data);
};

Payment.prototype.toRaw = function toRaw(writer) {
  var p = new ProtoWriter(writer);
  var i, tx, op, output;

  if (this.merchantData)
    p.writeFieldBytes(1, this.merchantData);

  for (i = 0; i < this.transactions.length; i++) {
    tx = this.transactions[i];
    this.writeFieldBytes(2, tx.toRaw());
  }

  for (i = 0; i < this.refundTo.length; i++) {
    op = new ProtoWriter();
    output = this.refundTo[i];
    op.writeFieldU64(1, output.value);
    op.writeFieldBytes(2, output.script.toRaw());
    p.writeFieldBytes(3, op.render());
  }

  if (this.memo != null)
    p.writeFieldString(4, this.memo);

  if (!writer)
    p = p.render();

  return p;
};

module.exports = Payment;
