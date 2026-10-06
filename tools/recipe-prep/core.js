(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PrepCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const numericSource = '[+-]?(?:(?:\\d{1,3}(?:,\\d{3})+|\\d+)(?:\\.\\d+)?|\\.\\d+)';
  const massAtEnd = new RegExp('^(.+?)\\s*[:：]?\\s*(' + numericSource + ')\\s*(?:g|그램|그람)\\s*$', 'i');
  const massAtStart = new RegExp('^(' + numericSource + ')\\s*(?:g|그램|그람)\\s+(.+)$', 'i');
  const otherMass = /\d\s*(?:g\b|그램|그람|kg\b|mg\b|ml\b|l\b|㎖|컵|개|스푼|큰술|작은술|tsp\b|tbsp\b|cups?\b|oz\b)/i;
  function normalize(value) { return String(value == null ? '' : value).normalize('NFKC').trim(); }
  function number(value) {
    const text = normalize(value);
    if (!new RegExp('^' + numericSource + '$').test(text)) return NaN;
    return Number(text.replaceAll(',', ''));
  }
  function validateIngredient(name, grams) {
    const n = normalize(name), amount = number(grams);
    if (!n || !/[\p{L}\p{N}]/u.test(n)) return '재료 이름을 입력해 주세요.';
    if (n.length > 200) return '재료 이름은 200자 이내로 입력해 주세요.';
    if (normalize(grams).length > 40) return '그램 수는 40자 이내로 입력해 주세요.';
    if (!Number.isFinite(amount) || amount <= 0) return '그램 수는 0보다 큰 숫자로 입력해 주세요.';
    return '';
  }
  function parseLine(raw, lineNumber) {
    const source = normalize(raw).replace(/^(?:[-*•]\s+)/, '');
    let name = '', grams = '', error = '';
    const end = source.match(massAtEnd), start = source.match(massAtStart);
    if (end) { name = end[1].replace(/[\s:：]+$/, ''); grams = end[2]; }
    else if (start) { grams = start[1]; name = start[2]; }
    else error = '“재료 이름 120g” 형식으로 고치거나, 아래 칸에 직접 입력해 주세요.';
    // A second quantity or a malformed trailing numeric token must never hide inside the name.
    if (!error && (/\d/.test(name.replace(/\d+(?:\.\d+)?\s*%/g, '')) || otherMass.test(name) || /[\d.,+\-−–—/⁄∕~×*±]\s*$/.test(name) || /\d[eE]\s*$/.test(name))) {
      error = '한 줄에 재료와 그램 수를 하나씩 입력해 주세요. 숫자·쉼표 형식도 확인해 주세요.';
      name = ''; grams = '';
    }
    if (!error) error = validateIngredient(name, grams);
    return { id: lineNumber, lineNumber, raw: String(raw), name, grams: String(grams), error, excluded: false };
  }
  function parseRecipe(text) {
    return String(text).split(/\r?\n/).map((line, i) => [line, i + 1])
      .filter(([line]) => normalize(line) !== '').map(([line, i]) => parseLine(line, i));
  }
  function panArea(pan) {
    if (!pan || !['round', 'rectangle'].includes(pan.shape)) throw new Error('틀 모양을 선택해 주세요.');
    if (normalize(pan.count).length > 40) throw new Error('틀 개수 입력이 너무 길어요.');
    const count = number(pan.count);
    if (!Number.isSafeInteger(count) || count < 1) throw new Error('틀 개수는 1 이상의 정수로 입력해 주세요.');
    const positive = (value, label) => {
      if (normalize(value).length > 40) throw new Error(label + ' 입력은 40자 이내로 입력해 주세요.');
      const n = number(value);
      if (!Number.isFinite(n) || n <= 0) throw new Error(label + '은(는) 0보다 큰 숫자로 입력해 주세요.');
      return n;
    };
    const area = pan.shape === 'round'
      ? Math.PI * Math.pow(positive(pan.diameter, '지름') / 2, 2) * count
      : positive(pan.width, '가로') * positive(pan.length, '세로') * count;
    if (!Number.isFinite(area) || area <= 0) throw new Error('틀 크기가 계산 범위를 벗어났어요. 입력값을 확인해 주세요.');
    return area;
  }
  function calculate(original, target, rows) {
    const from = panArea(original), to = panArea(target), ratio = to / from;
    if (!Number.isFinite(ratio) || ratio <= 0) throw new Error('배율을 계산할 수 없어요. 틀 크기를 확인해 주세요.');
    const active = rows.filter(row => !row.excluded);
    if (!active.length) throw new Error('준비표에 넣을 재료를 하나 이상 확인해 주세요.');
    const ingredients = active.map(row => {
      const error = validateIngredient(row.name, row.grams);
      if (error) throw new Error(row.lineNumber + '번째 줄: ' + error);
      const grams = number(row.grams), scaled = grams * ratio;
      if (!Number.isFinite(scaled) || scaled <= 0) throw new Error('재료의 계산값이 범위를 벗어났어요. 입력값을 확인해 주세요.');
      return { id: row.id, name: normalize(row.name), originalGrams: grams, grams: scaled, checked: false };
    });
    return { ratio, originalArea: from, targetArea: to, ingredients, excludedCount: rows.length - active.length };
  }
  function formatMass(value) {
    if (!Number.isFinite(value)) return '계산 불가';
    if (value > 0 && value < 0.001) return value.toExponential(3);
    return value.toLocaleString('ko-KR', { maximumFractionDigits: 3 });
  }
  const sample = '박력분 120g\n설탕 75g\n무염 버터 60g\n풀어 둔 달걀 90g\n우유 45g\n베이킹파우더 2.5g';
  return { number, validateIngredient, parseLine, parseRecipe, panArea, calculate, formatMass, sample };
});
