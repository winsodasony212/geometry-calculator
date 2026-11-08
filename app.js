'use strict';
(() => {
  const { shapes, units, compute, num } = GEOMETRY;
  const $ = (id) => document.getElementById(id);
  const el = { shape: $('shape'), from: $('unit-in'), to: $('unit-out'), inputs: $('inputs'),
    msg: $('message'), res: $('results'), steps: $('steps'), sc: $('steps-content'),
    b2: $('btn-2d'), b3: $('btn-3d'), fig: $('diagram'), copy: $('copy') };
  const sup = (p) => (p === 2 ? '²' : p === 3 ? '³' : '');
  const KEY = 'geometry-calc:v1';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify({ dim, shape: el.shape.value, from: el.from.value, to: el.to.value })); } catch { /* storage unavailable */ } };
  const saved = load();
  let dim = saved.dim === 3 ? 3 : 2, timer, lastText = '';

  const opt = (value, text, parent) => {
    const o = document.createElement('option');
    o.value = value; o.textContent = text; parent.appendChild(o);
  };
  Object.keys(units).forEach((u) => { opt(u, u, el.from); opt(u, u, el.to); });
  el.to.insertBefore(Object.assign(document.createElement('option'), { value: 'same', textContent: 'Same as input' }), el.to.firstChild);
  el.from.value = units[saved.from] ? saved.from : 'cm';
  el.to.value = saved.to === 'same' || units[saved.to] ? saved.to : 'same';

  const show = (text) => { el.msg.textContent = text; el.msg.hidden = !text; };
  const clear = () => { el.res.replaceChildren(); el.sc.replaceChildren(); el.steps.hidden = true; el.copy.hidden = true; };
  const current = () => shapes[el.shape.value];

  function renderInputs() {
    el.inputs.replaceChildren();
    el.fig.innerHTML = GEOMETRY_DIAGRAMS.svg(el.shape.value, current().label); // static, trusted markup
    current().inputs.forEach(({ id, label, ph, min = 0, step = 'any' }) => {
      const g = document.createElement('div'); g.className = 'field';
      const l = document.createElement('label'); l.htmlFor = 'in-' + id; l.textContent = label;
      const inp = Object.assign(document.createElement('input'), { type: 'number', id: 'in-' + id,
        min, step, placeholder: 'e.g., ' + ph, inputMode: 'decimal', autocomplete: 'off' });
      inp.dataset.key = id;
      inp.addEventListener('input', () => { calculate(false); clearTimeout(timer); timer = setTimeout(() => calculate(true), 600); });
      inp.addEventListener('blur', () => calculate(true));
      g.append(l, inp); el.inputs.appendChild(g);
    });
    show(''); clear(); save();
  }

  function setShapes(preferred) {
    el.shape.replaceChildren();
    Object.entries(shapes).filter(([, s]) => s.dim === dim).forEach(([k, s]) => opt(k, s.label, el.shape));
    if (preferred && shapes[preferred] && shapes[preferred].dim === dim) el.shape.value = preferred;
    renderInputs();
  }

  function calculate(showErrors) {
    const values = {}; let missing = false, bad = false;
    el.inputs.querySelectorAll('input').forEach((inp) => {
      const raw = inp.value.trim();
      if (raw === '') { missing = true; return; }
      const n = Number(raw);
      values[inp.dataset.key] = n;
      if (!Number.isFinite(n) || n < 0) bad = true;
    });
    clear();
    if (bad) return show(showErrors ? 'Enter a non-negative number.' : '');
    if (missing) return show('');
    const out = compute(current(), values);
    if (out.error) return show(showErrors ? out.error : '');
    if (out.steps.some((s) => !Number.isFinite(s.value))) return show('That number is too large to calculate.');
    show('');

    const from = el.from.value, to = el.to.value === 'same' ? from : el.to.value;
    const given = Object.entries(values).map(([k, v]) => `${k} = ${num(v)} ${from}`).join(', ');
    const lines = [`${current().label} (${given})`];
    out.steps.forEach((s) => {
      const line = document.createElement('div'); line.className = 'step';
      line.innerHTML = '<p class="step-label"></p><p class="step-formula"></p><p class="step-work"></p>';
      const [a, b, c] = line.children;
      a.textContent = s.name; b.textContent = `${s.sym} = ${s.expr}`;
      c.textContent = `${s.sym} = ${s.work} = ${num(s.value)} ${from}${sup(s.p)}`;
      el.sc.appendChild(line);
      if (!s.out) return;
      const k = (units[from] / units[to]) ** s.p;
      const row = document.createElement('div'); row.className = 'result';
      const dt = document.createElement('dt'); dt.textContent = s.name;
      const dd = document.createElement('dd'); dd.textContent = `${num(s.value * k)} ${to}${sup(s.p)}`;
      row.append(dt, dd); el.res.appendChild(row);
      lines.push(`${s.name}: ${dd.textContent}`);
    });
    lastText = lines.join('\n');
    el.steps.hidden = false; el.copy.hidden = false;
  }

  function applyMode() {
    [[el.b2, 2], [el.b3, 3]].forEach(([b, d]) => { b.classList.toggle('active', dim === d); b.setAttribute('aria-pressed', String(dim === d)); });
  }
  function setMode(next) { if (dim !== next) { dim = next; applyMode(); setShapes(); } }

  el.b2.addEventListener('click', () => setMode(2));
  el.b3.addEventListener('click', () => setMode(3));
  el.shape.addEventListener('change', renderInputs);
  [el.from, el.to].forEach((s) => s.addEventListener('change', () => { save(); calculate(true); }));
  el.copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(lastText); el.copy.textContent = 'Copied!'; }
    catch { el.copy.textContent = 'Copy failed'; }
    setTimeout(() => { el.copy.textContent = 'Copy results'; }, 1500);
  });
  $('form').addEventListener('submit', (e) => e.preventDefault());
  applyMode();
  setShapes(saved.shape);
})();
