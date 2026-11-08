'use strict';
/* Inline SVG diagrams. Labels use the same symbols as the input fields and formulas. */
(() => {
  const T = (x, y, s, a) => `<text x="${x}" y="${y}"${a ? ` text-anchor="${a}"` : ''}>${s}</text>`;
  const P = (d) => `<path d="${d}"/>`;
  const D = (d) => `<path class="d" d="${d}"/>`;
  const E = (cx, cy, rx, ry, c = '') => `<ellipse${c ? ` class="${c}"` : ''} cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>`;

  const art = {
    circle: `<circle cx="70" cy="50" r="36"/>${D('M70 50h36')}${T(88, 45, 'r')}`,
    rectangle: `<rect x="25" y="22" width="90" height="56"/>${T(70, 94, 'w')}${T(18, 54, 'h', 'end')}`,
    square: `<rect x="40" y="15" width="64" height="64"/>${T(72, 95, 's')}`,
    triangle: `${P('M20 82L110 82L68 20Z')}${T(65, 97, 'c')}${T(98, 48, 'a', 'start')}${T(36, 48, 'b', 'end')}`,
    parallelogram: `${P('M30 80H115L100 25H15Z')}${D('M100 25V80')}${T(72, 95, 'b')}${T(94, 56, 'h', 'end')}${T(16, 56, 'c', 'end')}`,
    trapezoid: `${P('M15 80H125L100 25H40Z')}${D('M40 25V80')}${T(70, 95, 'a')}${T(70, 19, 'b')}${T(46, 56, 'h', 'start')}${T(20, 52, 'c', 'end')}${T(122, 52, 'd', 'start')}`,
    rhombus: `${P('M70 10L125 50L70 90L15 50Z')}${D('M15 50H125M70 10V90')}${T(100, 45, 'p')}${T(75, 30, 'q', 'start')}`,
    ellipse: `${E(70, 50, 52, 32)}${D('M70 50H122M70 50V18')}${T(98, 45, 'a')}${T(75, 38, 'b', 'start')}`,
    polygon: `${P('M70 10L112 34V66L70 90L28 66V34Z')}${T(70, 55, 'n sides')}${T(120, 52, 's', 'start')}`,

    sphere: `<circle cx="70" cy="52" r="36"/>${E(70, 52, 36, 11, 'd')}${D('M70 52H106')}${T(89, 48, 'r')}`,
    hemisphere: `${P('M30 58A40 40 0 0 1 110 58')}${E(70, 58, 40, 11)}${D('M70 58H110')}${T(90, 54, 'r')}`,
    cube: `<rect x="25" y="38" width="55" height="55"/>${P('M25 38L45 18H100L80 38M80 38L100 18V73L80 93')}${T(52, 104, 's')}`,
    rectPrism: `<rect x="15" y="42" width="70" height="46"/>${P('M15 42L40 22H110L85 42M85 42L110 22V68L85 88')}${T(50, 101, 'l')}${T(8, 68, 'h', 'end')}${T(104, 86, 'w', 'start')}`,
    triPrism: `${P('M20 82H70L45 42ZM45 42L90 17M70 82L115 57M90 17L115 57')}${D('M20 82L65 57H115M65 57L90 17')}${T(45, 97, 'c')}${T(62, 58, 'a', 'start')}${T(30, 58, 'b', 'end')}${T(100, 76, 'L', 'start')}`,
    hexPrism: `${P('M45 20H95L115 32L95 44H45L25 32ZM25 32V77M115 32V77M45 44V89M95 44V89M25 77L45 89H95L115 77')}${T(112, 22, 'a', 'start')}${T(121, 64, 'h', 'start')}`,
    cylinder: `${E(70, 24, 36, 10)}${P('M34 24V80M106 24V80M34 80A36 10 0 0 0 106 80')}${D('M70 24H106')}${T(88, 21, 'r')}${T(112, 56, 'h', 'start')}`,
    cone: `${P('M30 80L70 12L110 80M30 80A40 10 0 0 0 110 80')}${D('M30 80A40 10 0 0 1 110 80M70 12V80M70 80H110')}${T(64, 46, 'h', 'end')}${T(90, 76, 'r')}`,
    squarePyramid: `${P('M20 80H80L110 64M65 12L20 80M65 12L80 80M65 12L110 64')}${D('M20 80L50 64H110M65 12L50 64M65 12V72')}${T(50, 95, 'b')}${T(60, 46, 'h', 'end')}`,
    torus: `${E(70, 52, 54, 32)}${E(70, 52, 20, 10)}${D('M70 52H107M107 52H124')}${T(88, 47, 'R')}${T(115, 47, 'r')}`,
  };

  const svg = (key, label) =>
    `<svg viewBox="0 0 140 105" role="img" aria-label="${label} with labeled dimensions">${art[key] || ''}</svg>`;

  const api = { art, svg };
  if (typeof module !== 'undefined') module.exports = api;
  else globalThis.GEOMETRY_DIAGRAMS = api;
})();
