'use strict';

/* ---------- Shared helpers ---------- */

// Returns an error message, or null if the sides form a valid triangle
function triangleError(a, b, c) {
  if (a <= 0 || b <= 0 || c <= 0) {
    return 'Triangle sides must be greater than 0.';
  }
  if (a + b <= c || a + c <= b || b + c <= a) {
    return 'These sides cannot form a triangle. Each side must be shorter than the other two combined.';
  }
  return null;
}

// Heron's formula
function heron(a, b, c) {
  const s = (a + b + c) / 2;
  return Math.sqrt(s * (s - a) * (s - b) * (s - c));
}

/* ---------- Shape definitions ---------- */

const shapes2D = {
  circle: {
    label: 'Circle',
    inputs: [{ id: 'radius', label: 'Radius (r)', placeholder: 'e.g., 5' }],
    area: ({ radius }) => Math.PI * radius ** 2,
    perimeter: ({ radius }) => 2 * Math.PI * radius,
    perimeterLabel: 'Circumference',
  },
  rectangle: {
    label: 'Rectangle',
    inputs: [
      { id: 'width', label: 'Width (w)', placeholder: 'e.g., 8' },
      { id: 'height', label: 'Height (h)', placeholder: 'e.g., 4' },
    ],
    area: ({ width, height }) => width * height,
    perimeter: ({ width, height }) => 2 * (width + height),
    perimeterLabel: 'Perimeter',
  },
  square: {
    label: 'Square',
    inputs: [{ id: 'side', label: 'Side Length (s)', placeholder: 'e.g., 4' }],
    area: ({ side }) => side ** 2,
    perimeter: ({ side }) => 4 * side,
    perimeterLabel: 'Perimeter',
  },
  triangle: {
    label: 'Triangle',
    inputs: [
      { id: 'sideA', label: 'Side A (a)', placeholder: 'e.g., 3' },
      { id: 'sideB', label: 'Side B (b)', placeholder: 'e.g., 4' },
      { id: 'sideC', label: 'Side C (c)', placeholder: 'e.g., 5' },
    ],
    validate: ({ sideA, sideB, sideC }) => triangleError(sideA, sideB, sideC),
    area: ({ sideA, sideB, sideC }) => heron(sideA, sideB, sideC),
    perimeter: ({ sideA, sideB, sideC }) => sideA + sideB + sideC,
    perimeterLabel: 'Perimeter',
  },
  parallelogram: {
    label: 'Parallelogram',
    inputs: [
      { id: 'base', label: 'Base (b)', placeholder: 'e.g., 8' },
      { id: 'height', label: 'Height (h)', placeholder: 'e.g., 4' },
      { id: 'side', label: 'Slanted Side (s)', placeholder: 'e.g., 5' },
    ],
    area: ({ base, height }) => base * height,
    perimeter: ({ base, side }) => 2 * (base + side),
    perimeterLabel: 'Perimeter',
  },
  trapezoid: {
    label: 'Trapezoid',
    inputs: [
      { id: 'baseA', label: 'Base A (a)', placeholder: 'e.g., 10' },
      { id: 'baseB', label: 'Base B (b)', placeholder: 'e.g., 6' },
      { id: 'height', label: 'Height (h)', placeholder: 'e.g., 4' },
      { id: 'legA', label: 'Left Leg (c)', placeholder: 'e.g., 5' },
      { id: 'legB', label: 'Right Leg (d)', placeholder: 'e.g., 5' },
    ],
    area: ({ baseA, baseB, height }) => 0.5 * (baseA + baseB) * height,
    perimeter: ({ baseA, baseB, legA, legB }) => baseA + baseB + legA + legB,
    perimeterLabel: 'Perimeter',
  },
  rhombus: {
    label: 'Rhombus',
    inputs: [
      { id: 'diag1', label: 'Diagonal 1 (p)', placeholder: 'e.g., 8' },
      { id: 'diag2', label: 'Diagonal 2 (q)', placeholder: 'e.g., 6' },
    ],
    area: ({ diag1, diag2 }) => (diag1 * diag2) / 2,
    perimeter: ({ diag1, diag2 }) => 4 * Math.sqrt((diag1 / 2) ** 2 + (diag2 / 2) ** 2),
    perimeterLabel: 'Perimeter',
  },
  ellipse: {
    label: 'Ellipse',
    inputs: [
      { id: 'semiA', label: 'Semi-axis A (a)', placeholder: 'e.g., 6' },
      { id: 'semiB', label: 'Semi-axis B (b)', placeholder: 'e.g., 4' },
    ],
    area: ({ semiA, semiB }) => Math.PI * semiA * semiB,
    // Ramanujan's approximation
    perimeter: ({ semiA: a, semiB: b }) =>
      Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b))),
    perimeterLabel: 'Circumference (approx.)',
  },
  polygon: {
    label: 'Regular Polygon',
    inputs: [
      { id: 'sides', label: 'Number of Sides (n)', placeholder: 'e.g., 6', min: 3, step: 1 },
      { id: 'side', label: 'Side Length (s)', placeholder: 'e.g., 4' },
    ],
    validate: ({ sides }) =>
      Number.isInteger(sides) && sides >= 3
        ? null
        : 'The number of sides must be a whole number of 3 or more.',
    area: ({ sides, side }) => (sides * side ** 2) / (4 * Math.tan(Math.PI / sides)),
    perimeter: ({ sides, side }) => sides * side,
    perimeterLabel: 'Perimeter',
  },
};

const shapes3D = {
  sphere: {
    label: 'Sphere',
    inputs: [{ id: 'radius', label: 'Radius (r)', placeholder: 'e.g., 5' }],
    area: ({ radius }) => 4 * Math.PI * radius ** 2,
    volume: ({ radius }) => (4 / 3) * Math.PI * radius ** 3,
    areaLabel: 'Surface Area',
  },
  hemisphere: {
    label: 'Hemisphere',
    inputs: [{ id: 'radius', label: 'Radius (r)', placeholder: 'e.g., 5' }],
    // Curved surface (2πr²) + flat circular base (πr²)
    area: ({ radius }) => 3 * Math.PI * radius ** 2,
    volume: ({ radius }) => (2 / 3) * Math.PI * radius ** 3,
    areaLabel: 'Surface Area (incl. base)',
  },
  cube: {
    label: 'Cube',
    inputs: [{ id: 'side', label: 'Side Length (s)', placeholder: 'e.g., 4' }],
    area: ({ side }) => 6 * side ** 2,
    volume: ({ side }) => side ** 3,
    areaLabel: 'Surface Area',
  },
  rectPrism: {
    label: 'Rectangular Prism',
    inputs: [
      { id: 'length', label: 'Length (l)', placeholder: 'e.g., 8' },
      { id: 'width', label: 'Width (w)', placeholder: 'e.g., 5' },
      { id: 'height', label: 'Height (h)', placeholder: 'e.g., 3' },
    ],
    area: ({ length, width, height }) =>
      2 * (length * width + length * height + width * height),
    volume: ({ length, width, height }) => length * width * height,
    areaLabel: 'Surface Area',
  },
  triPrism: {
    label: 'Triangular Prism',
    inputs: [
      { id: 'sideA', label: 'Triangle Side A (a)', placeholder: 'e.g., 3' },
      { id: 'sideB', label: 'Triangle Side B (b)', placeholder: 'e.g., 4' },
      { id: 'sideC', label: 'Triangle Side C (c)', placeholder: 'e.g., 5' },
      { id: 'length', label: 'Prism Length (L)', placeholder: 'e.g., 10' },
    ],
    validate: ({ sideA, sideB, sideC }) => triangleError(sideA, sideB, sideC),
    area: ({ sideA, sideB, sideC, length }) =>
      2 * heron(sideA, sideB, sideC) + (sideA + sideB + sideC) * length,
    volume: ({ sideA, sideB, sideC, length }) => heron(sideA, sideB, sideC) * length,
    areaLabel: 'Surface Area',
  },
  hexPrism: {
    label: 'Hexagonal Prism',
    inputs: [
      { id: 'side', label: 'Hexagon Side (a)', placeholder: 'e.g., 4' },
      { id: 'height', label: 'Prism Height (h)', placeholder: 'e.g., 10' },
    ],
    area: ({ side, height }) => 3 * Math.sqrt(3) * side ** 2 + 6 * side * height,
    volume: ({ side, height }) => ((3 * Math.sqrt(3)) / 2) * side ** 2 * height,
    areaLabel: 'Surface Area',
  },
  cylinder: {
    label: 'Cylinder',
    inputs: [
      { id: 'radius', label: 'Radius (r)', placeholder: 'e.g., 3' },
      { id: 'height', label: 'Height (h)', placeholder: 'e.g., 7' },
    ],
    area: ({ radius, height }) => 2 * Math.PI * radius * (radius + height),
    volume: ({ radius, height }) => Math.PI * radius ** 2 * height,
    areaLabel: 'Surface Area',
  },
  cone: {
    label: 'Cone',
    inputs: [
      { id: 'radius', label: 'Radius (r)', placeholder: 'e.g., 3' },
      { id: 'height', label: 'Height (h)', placeholder: 'e.g., 6' },
    ],
    area: ({ radius, height }) => {
      const slant = Math.sqrt(radius ** 2 + height ** 2);
      return Math.PI * radius * (radius + slant);
    },
    volume: ({ radius, height }) => (1 / 3) * Math.PI * radius ** 2 * height,
    areaLabel: 'Surface Area',
  },
  squarePyramid: {
    label: 'Square Pyramid',
    inputs: [
      { id: 'base', label: 'Base Side (b)', placeholder: 'e.g., 6' },
      { id: 'height', label: 'Height (h)', placeholder: 'e.g., 4' },
    ],
    area: ({ base, height }) => {
      const slant = Math.sqrt(height ** 2 + (base / 2) ** 2);
      return base ** 2 + 2 * base * slant;
    },
    volume: ({ base, height }) => (base ** 2 * height) / 3,
    areaLabel: 'Surface Area',
  },
  torus: {
    label: 'Torus',
    inputs: [
      { id: 'majorR', label: 'Major Radius (R)', placeholder: 'e.g., 6' },
      { id: 'minorR', label: 'Minor Radius (r)', placeholder: 'e.g., 2' },
    ],
    validate: ({ majorR, minorR }) =>
      majorR >= minorR ? null : 'The major radius (R) must be at least as large as the minor radius (r).',
    area: ({ majorR, minorR }) => 4 * Math.PI ** 2 * majorR * minorR,
    volume: ({ majorR, minorR }) => 2 * Math.PI ** 2 * majorR * minorR ** 2,
    areaLabel: 'Surface Area',
  },
};

/* ---------- Formulas and worked steps ---------- */

// Each function returns the steps shown under "Show formulas and steps".
// A step is { label, formula, work, value, power }.
const num = (x) => x.toLocaleString(undefined, { maximumFractionDigits: 4 });

const steps2D = {
  circle: (v) => {
    const r = num(v.radius);
    return [
      { label: 'Area', formula: 'A = π × r²', work: `A = π × ${r}²`, value: shapes2D.circle.area(v), power: 2 },
      { label: 'Circumference', formula: 'C = 2 × π × r', work: `C = 2 × π × ${r}`, value: shapes2D.circle.perimeter(v), power: 1 },
    ];
  },
  rectangle: (v) => {
    const w = num(v.width);
    const h = num(v.height);
    return [
      { label: 'Area', formula: 'A = w × h', work: `A = ${w} × ${h}`, value: shapes2D.rectangle.area(v), power: 2 },
      { label: 'Perimeter', formula: 'P = 2 × (w + h)', work: `P = 2 × (${w} + ${h})`, value: shapes2D.rectangle.perimeter(v), power: 1 },
    ];
  },
  square: (v) => {
    const s = num(v.side);
    return [
      { label: 'Area', formula: 'A = s²', work: `A = ${s}²`, value: shapes2D.square.area(v), power: 2 },
      { label: 'Perimeter', formula: 'P = 4 × s', work: `P = 4 × ${s}`, value: shapes2D.square.perimeter(v), power: 1 },
    ];
  },
  triangle: (v) => {
    const a = num(v.sideA);
    const b = num(v.sideB);
    const c = num(v.sideC);
    const s = (v.sideA + v.sideB + v.sideC) / 2;
    const sn = num(s);
    return [
      { label: 'Semi-perimeter', formula: 's = (a + b + c) / 2', work: `s = (${a} + ${b} + ${c}) / 2`, value: s, power: 1 },
      {
        label: 'Area (Heron’s formula)',
        formula: 'A = √(s × (s − a) × (s − b) × (s − c))',
        work: `A = √(${sn} × (${sn} − ${a}) × (${sn} − ${b}) × (${sn} − ${c}))`,
        value: shapes2D.triangle.area(v),
        power: 2,
      },
      { label: 'Perimeter', formula: 'P = a + b + c', work: `P = ${a} + ${b} + ${c}`, value: shapes2D.triangle.perimeter(v), power: 1 },
    ];
  },
  parallelogram: (v) => {
    const b = num(v.base);
    const h = num(v.height);
    const s = num(v.side);
    return [
      { label: 'Area', formula: 'A = b × h', work: `A = ${b} × ${h}`, value: shapes2D.parallelogram.area(v), power: 2 },
      { label: 'Perimeter', formula: 'P = 2 × (b + s)', work: `P = 2 × (${b} + ${s})`, value: shapes2D.parallelogram.perimeter(v), power: 1 },
    ];
  },
  trapezoid: (v) => {
    const a = num(v.baseA);
    const b = num(v.baseB);
    const h = num(v.height);
    const c = num(v.legA);
    const d = num(v.legB);
    return [
      { label: 'Area', formula: 'A = (1/2) × (a + b) × h', work: `A = (1/2) × (${a} + ${b}) × ${h}`, value: shapes2D.trapezoid.area(v), power: 2 },
      { label: 'Perimeter', formula: 'P = a + b + c + d', work: `P = ${a} + ${b} + ${c} + ${d}`, value: shapes2D.trapezoid.perimeter(v), power: 1 },
    ];
  },
  rhombus: (v) => {
    const p = num(v.diag1);
    const q = num(v.diag2);
    const side = Math.sqrt((v.diag1 / 2) ** 2 + (v.diag2 / 2) ** 2);
    return [
      { label: 'Area', formula: 'A = (p × q) / 2', work: `A = (${p} × ${q}) / 2`, value: shapes2D.rhombus.area(v), power: 2 },
      { label: 'Side length', formula: 's = √((p/2)² + (q/2)²)', work: `s = √((${p}/2)² + (${q}/2)²)`, value: side, power: 1 },
      { label: 'Perimeter', formula: 'P = 4 × s', work: `P = 4 × ${num(side)}`, value: shapes2D.rhombus.perimeter(v), power: 1 },
    ];
  },
  ellipse: (v) => {
    const a = num(v.semiA);
    const b = num(v.semiB);
    return [
      { label: 'Area', formula: 'A = π × a × b', work: `A = π × ${a} × ${b}`, value: shapes2D.ellipse.area(v), power: 2 },
      {
        label: 'Circumference (Ramanujan approximation)',
        formula: 'C ≈ π × [3 × (a + b) − √((3a + b) × (a + 3b))]',
        work: `C ≈ π × [3 × (${a} + ${b}) − √((3 × ${a} + ${b}) × (${a} + 3 × ${b}))]`,
        value: shapes2D.ellipse.perimeter(v),
        power: 1,
      },
    ];
  },
  polygon: (v) => {
    const n = num(v.sides);
    const s = num(v.side);
    return [
      {
        label: 'Area',
        formula: 'A = (n × s²) / (4 × tan(π / n))',
        work: `A = (${n} × ${s}²) / (4 × tan(π / ${n}))`,
        value: shapes2D.polygon.area(v),
        power: 2,
      },
      { label: 'Perimeter', formula: 'P = n × s', work: `P = ${n} × ${s}`, value: shapes2D.polygon.perimeter(v), power: 1 },
    ];
  },
};

const steps3D = {
  sphere: (v) => {
    const r = num(v.radius);
    return [
      { label: 'Surface Area', formula: 'SA = 4 × π × r²', work: `SA = 4 × π × ${r}²`, value: shapes3D.sphere.area(v), power: 2 },
      { label: 'Volume', formula: 'V = (4/3) × π × r³', work: `V = (4/3) × π × ${r}³`, value: shapes3D.sphere.volume(v), power: 3 },
    ];
  },
  hemisphere: (v) => {
    const r = num(v.radius);
    return [
      {
        label: 'Surface Area (curved + flat base)',
        formula: 'SA = 2 × π × r² + π × r² = 3 × π × r²',
        work: `SA = 3 × π × ${r}²`,
        value: shapes3D.hemisphere.area(v),
        power: 2,
      },
      { label: 'Volume', formula: 'V = (2/3) × π × r³', work: `V = (2/3) × π × ${r}³`, value: shapes3D.hemisphere.volume(v), power: 3 },
    ];
  },
  cube: (v) => {
    const s = num(v.side);
    return [
      { label: 'Surface Area', formula: 'SA = 6 × s²', work: `SA = 6 × ${s}²`, value: shapes3D.cube.area(v), power: 2 },
      { label: 'Volume', formula: 'V = s³', work: `V = ${s}³`, value: shapes3D.cube.volume(v), power: 3 },
    ];
  },
  rectPrism: (v) => {
    const l = num(v.length);
    const w = num(v.width);
    const h = num(v.height);
    return [
      {
        label: 'Surface Area',
        formula: 'SA = 2 × (l × w + l × h + w × h)',
        work: `SA = 2 × (${l} × ${w} + ${l} × ${h} + ${w} × ${h})`,
        value: shapes3D.rectPrism.area(v),
        power: 2,
      },
      { label: 'Volume', formula: 'V = l × w × h', work: `V = ${l} × ${w} × ${h}`, value: shapes3D.rectPrism.volume(v), power: 3 },
    ];
  },
  triPrism: (v) => {
    const a = num(v.sideA);
    const b = num(v.sideB);
    const c = num(v.sideC);
    const L = num(v.length);
    const s = (v.sideA + v.sideB + v.sideC) / 2;
    const sn = num(s);
    const base = heron(v.sideA, v.sideB, v.sideC);
    return [
      { label: 'Semi-perimeter of triangle', formula: 's = (a + b + c) / 2', work: `s = (${a} + ${b} + ${c}) / 2`, value: s, power: 1 },
      {
        label: 'Triangle base area (Heron’s formula)',
        formula: 'B = √(s × (s − a) × (s − b) × (s − c))',
        work: `B = √(${sn} × (${sn} − ${a}) × (${sn} − ${b}) × (${sn} − ${c}))`,
        value: base,
        power: 2,
      },
      {
        label: 'Surface Area',
        formula: 'SA = 2 × B + (a + b + c) × L',
        work: `SA = 2 × ${num(base)} + (${a} + ${b} + ${c}) × ${L}`,
        value: shapes3D.triPrism.area(v),
        power: 2,
      },
      { label: 'Volume', formula: 'V = B × L', work: `V = ${num(base)} × ${L}`, value: shapes3D.triPrism.volume(v), power: 3 },
    ];
  },
  hexPrism: (v) => {
    const a = num(v.side);
    const h = num(v.height);
    const base = ((3 * Math.sqrt(3)) / 2) * v.side ** 2;
    return [
      { label: 'Hexagon base area', formula: 'B = (3√3 / 2) × a²', work: `B = (3√3 / 2) × ${a}²`, value: base, power: 2 },
      {
        label: 'Surface Area',
        formula: 'SA = 2 × B + 6 × a × h',
        work: `SA = 2 × ${num(base)} + 6 × ${a} × ${h}`,
        value: shapes3D.hexPrism.area(v),
        power: 2,
      },
      { label: 'Volume', formula: 'V = B × h', work: `V = ${num(base)} × ${h}`, value: shapes3D.hexPrism.volume(v), power: 3 },
    ];
  },
  cylinder: (v) => {
    const r = num(v.radius);
    const h = num(v.height);
    return [
      { label: 'Surface Area', formula: 'SA = 2 × π × r × (r + h)', work: `SA = 2 × π × ${r} × (${r} + ${h})`, value: shapes3D.cylinder.area(v), power: 2 },
      { label: 'Volume', formula: 'V = π × r² × h', work: `V = π × ${r}² × ${h}`, value: shapes3D.cylinder.volume(v), power: 3 },
    ];
  },
  cone: (v) => {
    const r = num(v.radius);
    const h = num(v.height);
    const slant = Math.sqrt(v.radius ** 2 + v.height ** 2);
    return [
      { label: 'Slant height', formula: 'l = √(r² + h²)', work: `l = √(${r}² + ${h}²)`, value: slant, power: 1 },
      { label: 'Surface Area', formula: 'SA = π × r × (r + l)', work: `SA = π × ${r} × (${r} + ${num(slant)})`, value: shapes3D.cone.area(v), power: 2 },
      { label: 'Volume', formula: 'V = (1/3) × π × r² × h', work: `V = (1/3) × π × ${r}² × ${h}`, value: shapes3D.cone.volume(v), power: 3 },
    ];
  },
  squarePyramid: (v) => {
    const b = num(v.base);
    const h = num(v.height);
    const slant = Math.sqrt(v.height ** 2 + (v.base / 2) ** 2);
    return [
      { label: 'Slant height', formula: 'l = √(h² + (b/2)²)', work: `l = √(${h}² + (${b}/2)²)`, value: slant, power: 1 },
      {
        label: 'Surface Area',
        formula: 'SA = b² + 2 × b × l',
        work: `SA = ${b}² + 2 × ${b} × ${num(slant)}`,
        value: shapes3D.squarePyramid.area(v),
        power: 2,
      },
      { label: 'Volume', formula: 'V = (1/3) × b² × h', work: `V = (1/3) × ${b}² × ${h}`, value: shapes3D.squarePyramid.volume(v), power: 3 },
    ];
  },
  torus: (v) => {
    const R = num(v.majorR);
    const r = num(v.minorR);
    return [
      { label: 'Surface Area', formula: 'SA = 4 × π² × R × r', work: `SA = 4 × π² × ${R} × ${r}`, value: shapes3D.torus.area(v), power: 2 },
      { label: 'Volume', formula: 'V = 2 × π² × R × r²', work: `V = 2 × π² × ${R} × ${r}²`, value: shapes3D.torus.volume(v), power: 3 },
    ];
  },
};

/* ---------- DOM references ---------- */

let is3D = false;

const btn2D = document.getElementById('btn-2d');
const btn3D = document.getElementById('btn-3d');
const shapeSelect = document.getElementById('shape-select');
const unitSelect = document.getElementById('unit-select');
const dynamicInputs = document.getElementById('dynamic-inputs');
const messageEl = document.getElementById('message');
const stepsEl = document.getElementById('steps');
const stepsContent = document.getElementById('steps-content');

const areaContainer = document.getElementById('area-container');
const perimeterContainer = document.getElementById('perimeter-container');
const volumeContainer = document.getElementById('volume-container');

const resultArea = document.getElementById('result-area');
const resultPerimeter = document.getElementById('result-perimeter');
const resultVolume = document.getElementById('result-volume');

/* ---------- Helpers ---------- */

function currentShapes() {
  return is3D ? shapes3D : shapes2D;
}

function currentShape() {
  return currentShapes()[shapeSelect.value];
}

function fmt(val, power) {
  const sup = power === 2 ? '²' : power === 3 ? '³' : '';
  const num = val.toLocaleString(undefined, { maximumFractionDigits: 4 });
  return `${num} ${unitSelect.value}${sup}`;
}

function showMessage(text) {
  messageEl.textContent = text;
  messageEl.classList.remove('hidden');
}

function clearMessage() {
  messageEl.textContent = '';
  messageEl.classList.add('hidden');
}

function hideSteps() {
  stepsEl.classList.add('hidden');
  stepsContent.innerHTML = '';
}

function renderSteps(values) {
  const buildSteps = (is3D ? steps3D : steps2D)[shapeSelect.value];
  if (!buildSteps) {
    hideSteps();
    return;
  }

  stepsContent.innerHTML = '';
  buildSteps(values).forEach(({ label, formula, work, value, power }) => {
    const item = document.createElement('div');
    item.className = 'step';

    const title = document.createElement('p');
    title.className = 'step-label';
    title.textContent = label;

    const formulaEl = document.createElement('p');
    formulaEl.className = 'step-formula';
    formulaEl.textContent = formula;

    const workEl = document.createElement('p');
    workEl.className = 'step-work';
    workEl.textContent = `${work} = ${fmt(value, power)}`;

    item.append(title, formulaEl, workEl);
    stepsContent.appendChild(item);
  });

  stepsEl.classList.remove('hidden');
}

function resetResults() {
  hideSteps();
  resultArea.textContent = '—';
  resultPerimeter.textContent = '—';
  resultVolume.textContent = '—';
}

/* ---------- Rendering ---------- */

function populateShapeSelect() {
  shapeSelect.innerHTML = '';
  Object.entries(currentShapes()).forEach(([value, { label }]) => {
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = label;
    shapeSelect.appendChild(opt);
  });
}

function renderInputs() {
  const shape = currentShape();
  if (!shape) return;

  // Inputs (all strings here come from the static config above, not from users)
  dynamicInputs.innerHTML = '';
  shape.inputs.forEach(({ id, label, placeholder, min = 0, step = 'any' }) => {
    const group = document.createElement('div');
    group.className = 'form-group';
    group.innerHTML = `
      <label for="input-${id}">${label}</label>
      <input type="number" id="input-${id}" placeholder="${placeholder}"
             min="${min}" step="${step}" inputmode="decimal">
    `;
    dynamicInputs.appendChild(group);
  });
  dynamicInputs.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', calculate);
  });

  // Result boxes
  areaContainer.querySelector('.result-label').textContent =
    shape.areaLabel || 'Area';

  volumeContainer.classList.toggle('hidden', !is3D);
  perimeterContainer.classList.toggle('hidden', is3D);
  if (!is3D) {
    perimeterContainer.querySelector('.result-label').textContent =
      shape.perimeterLabel || 'Perimeter';
  }

  clearMessage();
  resetResults();
}

/* ---------- Calculation ---------- */

function readInputs() {
  const values = {};
  let filled = 0;
  let total = 0;
  let invalid = false;

  dynamicInputs.querySelectorAll('input').forEach((input) => {
    const key = input.id.replace('input-', '');
    const raw = input.value.trim();
    total += 1;

    if (raw === '') {
      values[key] = NaN;
      return;
    }
    const num = Number(raw);
    values[key] = num;
    filled += 1;
    if (!Number.isFinite(num) || num < 0) invalid = true;
  });

  return { values, filled, total, invalid };
}

function calculate() {
  const shape = currentShape();
  if (!shape) return;

  const { values, filled, total, invalid } = readInputs();

  if (invalid) {
    showMessage('Enter a non-negative number.');
    resetResults();
    return;
  }

  clearMessage();

  // Still waiting for the user to fill in the remaining fields
  if (filled < total) {
    resetResults();
    return;
  }

  // Shape-specific validation (e.g. triangle inequality)
  const error = shape.validate ? shape.validate(values) : null;
  if (error) {
    showMessage(error);
    resetResults();
    return;
  }

  const area = shape.area(values);
  const extra = is3D ? shape.volume(values) : shape.perimeter(values);

  if (!Number.isFinite(area) || !Number.isFinite(extra)) {
    showMessage('That number is too large to calculate.');
    resetResults();
    return;
  }

  resultArea.textContent = fmt(area, 2);
  if (is3D) {
    resultVolume.textContent = fmt(extra, 3);
  } else {
    resultPerimeter.textContent = fmt(extra, 1);
  }

  renderSteps(values);
}

/* ---------- Events ---------- */

function setMode(next3D) {
  if (is3D === next3D) return;
  is3D = next3D;

  btn2D.classList.toggle('active', !is3D);
  btn3D.classList.toggle('active', is3D);
  btn2D.setAttribute('aria-pressed', String(!is3D));
  btn3D.setAttribute('aria-pressed', String(is3D));

  populateShapeSelect();
  renderInputs();
}

btn2D.addEventListener('click', () => setMode(false));
btn3D.addEventListener('click', () => setMode(true));
shapeSelect.addEventListener('change', renderInputs);
unitSelect.addEventListener('change', calculate);

/* ---------- Init ---------- */

populateShapeSelect();
renderInputs();
