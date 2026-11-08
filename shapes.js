'use strict';
/* Pure data + math (no DOM). Every formula is defined ONCE as a step; results
   and the worked-steps panel are both generated from it, so they cannot drift. */
(() => {
  const { PI } = Math, sq = Math.sqrt;
  const num = (x) => x.toLocaleString('en-US', { maximumFractionDigits: 4 });
  const units = { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144 };

  // Input: id doubles as the symbol used in formulas.
  const i = (id, label, ph, o = {}) => ({ id, label, ph, ...o });
  // Step: name, symbol, readable formula, function of the scope, unit power, output role.
  const S = (name, sym, expr, f, p, out) => ({ name, sym, expr, f, p, out });

  const triErr = ({ a, b, c }) =>
    a <= 0 || b <= 0 || c <= 0 ? 'Triangle sides must be greater than 0.'
    : a + b <= c || a + c <= b || b + c <= a ? 'These sides cannot form a triangle. Each side must be shorter than the other two combined.'
    : null;
  const semi = S('Semi-perimeter', 's', '(a + b + c) / 2', ({ a, b, c }) => (a + b + c) / 2, 1);
  const HERON = '√(s × (s − a) × (s − b) × (s − c))';
  const heron = ({ a, b, c, s }) => sq(s * (s - a) * (s - b) * (s - c));
  const ABC = [i('a', 'Side A (a)', '3'), i('b', 'Side B (b)', '4'), i('c', 'Side C (c)', '5')];
  const hexB = S('Hexagon base area', 'B', '(3√3 / 2) × a²', ({ a }) => 1.5 * sq(3) * a ** 2, 2);

  const shapes = {
    circle: { dim: 2, label: 'Circle', inputs: [i('r', 'Radius (r)', '5')], steps: [
      S('Area', 'A', 'π × r²', ({ r }) => PI * r ** 2, 2, 'area'),
      S('Circumference', 'C', '2 × π × r', ({ r }) => 2 * PI * r, 1, 'perim')] },
    rectangle: { dim: 2, label: 'Rectangle', inputs: [i('w', 'Width (w)', '8'), i('h', 'Height (h)', '4')], steps: [
      S('Area', 'A', 'w × h', ({ w, h }) => w * h, 2, 'area'),
      S('Perimeter', 'P', '2 × (w + h)', ({ w, h }) => 2 * (w + h), 1, 'perim')] },
    square: { dim: 2, label: 'Square', inputs: [i('s', 'Side Length (s)', '4')], steps: [
      S('Area', 'A', 's²', ({ s }) => s ** 2, 2, 'area'),
      S('Perimeter', 'P', '4 × s', ({ s }) => 4 * s, 1, 'perim')] },
    triangle: { dim: 2, label: 'Triangle', inputs: ABC, validate: triErr, steps: [semi,
      S('Area (Heron’s formula)', 'A', HERON, heron, 2, 'area'),
      S('Perimeter', 'P', 'a + b + c', ({ a, b, c }) => a + b + c, 1, 'perim')] },
    parallelogram: { dim: 2, label: 'Parallelogram', inputs: [i('b', 'Base (b)', '8'), i('h', 'Height (h)', '4'), i('c', 'Slanted Side (c)', '5')], steps: [
      S('Area', 'A', 'b × h', ({ b, h }) => b * h, 2, 'area'),
      S('Perimeter', 'P', '2 × (b + c)', ({ b, c }) => 2 * (b + c), 1, 'perim')] },
    trapezoid: { dim: 2, label: 'Trapezoid', inputs: [i('a', 'Base A (a)', '10'), i('b', 'Base B (b)', '6'), i('h', 'Height (h)', '4'), i('c', 'Left Leg (c)', '5'), i('d', 'Right Leg (d)', '5')], steps: [
      S('Area', 'A', '(1/2) × (a + b) × h', ({ a, b, h }) => 0.5 * (a + b) * h, 2, 'area'),
      S('Perimeter', 'P', 'a + b + c + d', ({ a, b, c, d }) => a + b + c + d, 1, 'perim')] },
    rhombus: { dim: 2, label: 'Rhombus', inputs: [i('p', 'Diagonal 1 (p)', '8'), i('q', 'Diagonal 2 (q)', '6')], steps: [
      S('Area', 'A', '(p × q) / 2', ({ p, q }) => (p * q) / 2, 2, 'area'),
      S('Side length', 's', '√((p/2)² + (q/2)²)', ({ p, q }) => sq((p / 2) ** 2 + (q / 2) ** 2), 1),
      S('Perimeter', 'P', '4 × s', ({ s }) => 4 * s, 1, 'perim')] },
    ellipse: { dim: 2, label: 'Ellipse', inputs: [i('a', 'Semi-axis A (a)', '6'), i('b', 'Semi-axis B (b)', '4')], steps: [
      S('Area', 'A', 'π × a × b', ({ a, b }) => PI * a * b, 2, 'area'),
      S('Circumference (Ramanujan approx.)', 'C', 'π × (3 × (a + b) − √((3 × a + b) × (a + 3 × b)))',
        ({ a, b }) => PI * (3 * (a + b) - sq((3 * a + b) * (a + 3 * b))), 1, 'perim')] },
    polygon: { dim: 2, label: 'Regular Polygon', inputs: [i('n', 'Number of Sides (n)', '6', { min: 3, step: 1 }), i('s', 'Side Length (s)', '4')],
      validate: ({ n }) => (Number.isInteger(n) && n >= 3 ? null : 'The number of sides must be a whole number of 3 or more.'), steps: [
      S('Area', 'A', '(n × s²) / (4 × tan(π / n))', ({ n, s }) => (n * s ** 2) / (4 * Math.tan(PI / n)), 2, 'area'),
      S('Perimeter', 'P', 'n × s', ({ n, s }) => n * s, 1, 'perim')] },

    sphere: { dim: 3, label: 'Sphere', inputs: [i('r', 'Radius (r)', '5')], steps: [
      S('Surface Area', 'SA', '4 × π × r²', ({ r }) => 4 * PI * r ** 2, 2, 'area'),
      S('Volume', 'V', '(4/3) × π × r³', ({ r }) => (4 / 3) * PI * r ** 3, 3, 'vol')] },
    hemisphere: { dim: 3, label: 'Hemisphere', inputs: [i('r', 'Radius (r)', '5')], steps: [
      S('Surface Area (incl. base)', 'SA', '3 × π × r²', ({ r }) => 3 * PI * r ** 2, 2, 'area'),
      S('Volume', 'V', '(2/3) × π × r³', ({ r }) => (2 / 3) * PI * r ** 3, 3, 'vol')] },
    cube: { dim: 3, label: 'Cube', inputs: [i('s', 'Side Length (s)', '4')], steps: [
      S('Surface Area', 'SA', '6 × s²', ({ s }) => 6 * s ** 2, 2, 'area'),
      S('Volume', 'V', 's³', ({ s }) => s ** 3, 3, 'vol')] },
    rectPrism: { dim: 3, label: 'Rectangular Prism', inputs: [i('l', 'Length (l)', '8'), i('w', 'Width (w)', '5'), i('h', 'Height (h)', '3')], steps: [
      S('Surface Area', 'SA', '2 × (l × w + l × h + w × h)', ({ l, w, h }) => 2 * (l * w + l * h + w * h), 2, 'area'),
      S('Volume', 'V', 'l × w × h', ({ l, w, h }) => l * w * h, 3, 'vol')] },
    triPrism: { dim: 3, label: 'Triangular Prism', inputs: [...ABC, i('L', 'Prism Length (L)', '10')], validate: triErr, steps: [semi,
      S('Triangle base area (Heron’s formula)', 'B', HERON, heron, 2),
      S('Surface Area', 'SA', '2 × B + (a + b + c) × L', ({ B, a, b, c, L }) => 2 * B + (a + b + c) * L, 2, 'area'),
      S('Volume', 'V', 'B × L', ({ B, L }) => B * L, 3, 'vol')] },
    hexPrism: { dim: 3, label: 'Hexagonal Prism', inputs: [i('a', 'Hexagon Side (a)', '4'), i('h', 'Prism Height (h)', '10')], steps: [hexB,
      S('Surface Area', 'SA', '2 × B + 6 × a × h', ({ B, a, h }) => 2 * B + 6 * a * h, 2, 'area'),
      S('Volume', 'V', 'B × h', ({ B, h }) => B * h, 3, 'vol')] },
    cylinder: { dim: 3, label: 'Cylinder', inputs: [i('r', 'Radius (r)', '3'), i('h', 'Height (h)', '7')], steps: [
      S('Surface Area', 'SA', '2 × π × r × (r + h)', ({ r, h }) => 2 * PI * r * (r + h), 2, 'area'),
      S('Volume', 'V', 'π × r² × h', ({ r, h }) => PI * r ** 2 * h, 3, 'vol')] },
    cone: { dim: 3, label: 'Cone', inputs: [i('r', 'Radius (r)', '3'), i('h', 'Height (h)', '6')], steps: [
      S('Slant height', 'l', '√(r² + h²)', ({ r, h }) => sq(r ** 2 + h ** 2), 1),
      S('Surface Area', 'SA', 'π × r × (r + l)', ({ r, l }) => PI * r * (r + l), 2, 'area'),
      S('Volume', 'V', '(1/3) × π × r² × h', ({ r, h }) => (PI * r ** 2 * h) / 3, 3, 'vol')] },
    squarePyramid: { dim: 3, label: 'Square Pyramid', inputs: [i('b', 'Base Side (b)', '6'), i('h', 'Height (h)', '4')], steps: [
      S('Slant height', 'l', '√(h² + (b/2)²)', ({ b, h }) => sq(h ** 2 + (b / 2) ** 2), 1),
      S('Surface Area', 'SA', 'b² + 2 × b × l', ({ b, l }) => b ** 2 + 2 * b * l, 2, 'area'),
      S('Volume', 'V', '(1/3) × b² × h', ({ b, h }) => (b ** 2 * h) / 3, 3, 'vol')] },
    torus: { dim: 3, label: 'Torus', inputs: [i('R', 'Major Radius (R)', '6'), i('r', 'Minor Radius (r)', '2')],
      validate: ({ R, r }) => (R >= r ? null : 'The major radius (R) must be at least as large as the minor radius (r).'), steps: [
      S('Surface Area', 'SA', '4 × π² × R × r', ({ R, r }) => 4 * PI ** 2 * R * r, 2, 'area'),
      S('Volume', 'V', '2 × π² × R × r²', ({ R, r }) => 2 * PI ** 2 * R * r ** 2, 3, 'vol')] },
  };

  // Evaluates a shape. Returns { error } or { steps: [{...step, value, work}] }.
  function compute(shape, values) {
    const error = shape.validate ? shape.validate(values) : null;
    if (error) return { error };
    const scope = { ...values };
    const steps = shape.steps.map((s) => {
      const value = s.f(scope);
      const work = s.expr.replace(/(?<![A-Za-z])[A-Za-z](?![A-Za-z])/g, (m) =>
        typeof scope[m] === 'number' ? num(scope[m]) : m);
      scope[s.sym] = value;
      return { ...s, value, work };
    });
    return { steps };
  }

  const api = { shapes, units, compute, num };
  if (typeof module !== 'undefined') module.exports = api;
  else globalThis.GEOMETRY = api;
})();
