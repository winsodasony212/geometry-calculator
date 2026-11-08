const test = require('node:test');
const assert = require('node:assert');
const { shapes, compute } = require('./shapes.js');

const out = (key, v, role) => compute(shapes[key], v).steps.find((s) => s.out === role).value;
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} !~ ${b}`);

test('circle', () => { close(out('circle', { r: 1 }, 'area'), Math.PI); close(out('circle', { r: 1 }, 'perim'), 2 * Math.PI); });
test('3-4-5 triangle', () => { close(out('triangle', { a: 3, b: 4, c: 5 }, 'area'), 6); close(out('triangle', { a: 3, b: 4, c: 5 }, 'perim'), 12); });
test('impossible triangle is rejected', () => assert.ok(compute(shapes.triangle, { a: 1, b: 1, c: 5 }).error));
test('square hexagon check: polygon n=4 equals square', () => close(out('polygon', { n: 4, s: 3 }, 'area'), 9));
test('polygon rejects n<3 and non-integers', () => { assert.ok(compute(shapes.polygon, { n: 2, s: 1 }).error); assert.ok(compute(shapes.polygon, { n: 4.5, s: 1 }).error); });
test('unit sphere', () => { close(out('sphere', { r: 1 }, 'vol'), (4 / 3) * Math.PI); close(out('sphere', { r: 1 }, 'area'), 4 * Math.PI); });
test('cube', () => { close(out('cube', { s: 2 }, 'area'), 24); close(out('cube', { s: 2 }, 'vol'), 8); });
test('3-4-5 triangular prism', () => { close(out('triPrism', { a: 3, b: 4, c: 5, L: 10 }, 'vol'), 60); close(out('triPrism', { a: 3, b: 4, c: 5, L: 10 }, 'area'), 132); });
test('hexagonal prism volume', () => close(out('hexPrism', { a: 2, h: 1 }, 'vol'), 6 * Math.sqrt(3)));
test('square pyramid 6x4 has slant 5', () => { close(out('squarePyramid', { b: 6, h: 4 }, 'area'), 96); close(out('squarePyramid', { b: 6, h: 4 }, 'vol'), 48); });
test('torus', () => { close(out('torus', { R: 3, r: 1 }, 'vol'), 6 * Math.PI ** 2); assert.ok(compute(shapes.torus, { R: 1, r: 2 }).error); });
test('every shape has exactly the expected outputs', () => {
  for (const s of Object.values(shapes)) {
    const roles = s.steps.filter((x) => x.out).map((x) => x.out);
    assert.deepStrictEqual(roles, s.dim === 2 ? ['area', 'perim'] : ['area', 'vol']);
  }
});

test('every shape has a diagram labeling each of its input symbols', () => {
  const { art, svg } = require('./diagrams.js');
  for (const [key, s] of Object.entries(shapes)) {
    assert.ok(svg(key, s.label).includes('<svg'), key);
    for (const { id } of s.inputs) assert.match(art[key], new RegExp(`>${id}[ <]`), `${key} is missing label ${id}`);
  }
});
