'use strict';

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
  triangle: {
    label: 'Triangle',
    inputs: [
      { id: 'sideA', label: 'Side A (a)', placeholder: 'e.g., 3' },
      { id: 'sideB', label: 'Side B (b)', placeholder: 'e.g., 4' },
      { id: 'sideC', label: 'Side C (c)', placeholder: 'e.g., 5' },
    ],
    // Returns an error message, or null if the sides form a valid triangle
    validate: ({ sideA: a, sideB: b, sideC: c }) => {
      if (a <= 0 || b <= 0 || c <= 0) {
        return 'Triangle sides must be greater than 0.';
      }
      if (a + b <= c || a + c <= b || b + c <= a) {
        return 'These sides cannot form a triangle. Each side must be shorter than the other two combined.';
      }
      return null;
    },
    // Heron's formula
    area: ({ sideA: a, sideB: b, sideC: c }) => {
      const s = (a + b + c) / 2;
      return Math.sqrt(s * (s - a) * (s - b) * (s - c));
    },
    perimeter: ({ sideA, sideB, sideC }) => sideA + sideB + sideC,
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
  cube: {
    label: 'Cube',
    inputs: [{ id: 'side', label: 'Side Length (s)', placeholder: 'e.g., 4' }],
    area: ({ side }) => 6 * side ** 2,
    volume: ({ side }) => side ** 3,
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
};

const steps3D = {
  sphere: (v) => {
    const r = num(v.radius);
    return [
      { label: 'Surface Area', formula: 'SA = 4 × π × r²', work: `SA = 4 × π × ${r}²`, value: shapes3D.sphere.area(v), power: 2 },
      { label: 'Volume', formula: 'V = (4/3) × π × r³', work: `V = (4/3) × π × ${r}³`, value: shapes3D.sphere.volume(v), power: 3 },
    ];
  },
  cube: (v) => {
    const s = num(v.side);
    return [
      { label: 'Surface Area', formula: 'SA = 6 × s²', work: `SA = 6 × ${s}²`, value: shapes3D.cube.area(v), power: 2 },
      { label: 'Volume', formula: 'V = s³', work: `V = ${s}³`, value: shapes3D.cube.volume(v), power: 3 },
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
  shape.inputs.forEach(({ id, label, placeholder }) => {
    const group = document.createElement('div');
    group.className = 'form-group';
    group.innerHTML = `
      <label for="input-${id}">${label}</label>
      <input type="number" id="input-${id}" placeholder="${placeholder}"
             min="0" step="any" inputmode="decimal">
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
