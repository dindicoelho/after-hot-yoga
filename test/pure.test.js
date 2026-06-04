/* Testes de função pura — shade() é importável direto (guard CommonJS em art.js) */
const { test } = require('node:test');
const assert = require('node:assert');
const { shade } = require('../js/art.js');

test('shade clampeia no preto', () => {
  assert.strictEqual(shade('#000000', -40), '#000000');
});
test('shade clampeia no branco', () => {
  assert.strictEqual(shade('#ffffff', 40), '#ffffff');
});
test('shade clareia cinza médio', () => {
  assert.strictEqual(shade('#808080', 16), '#909090');
});
test('shade escurece cinza médio', () => {
  assert.strictEqual(shade('#808080', -16), '#707070');
});
test('shade preserva os 6 dígitos do hex', () => {
  assert.strictEqual(shade('#010203', 0), '#010203');
});
