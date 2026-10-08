(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const languageKey = 'recipepilot.language.v1';
  function initialLanguage() {
    try { const saved = localStorage.getItem(languageKey); if (saved === 'ko' || saved === 'en') return saved; } catch (_) { /* Storage is optional. */ }
    try { return /^ko(?:-|$)/i.test(navigator.language || '') ? 'ko' : 'en'; } catch (_) { return 'en'; }
  }
  let language = initialLanguage(), refreshLanguage = () => {};
  const translatedNodes = [];
  for (const attribute of ['text', 'placeholder', 'aria-label', 'content']) {
    document.querySelectorAll('[data-ko-' + attribute + ']').forEach(node => {
      translatedNodes.push({ node, attribute, ko: node.getAttribute('data-ko-' + attribute), en: attribute === 'text' ? node.textContent : node.getAttribute(attribute) });
    });
  }
  function applyLanguage() {
    document.documentElement.lang = language;
    for (const entry of translatedNodes) {
      const value = entry[language];
      if (entry.attribute === 'text') entry.node.textContent = value;
      else entry.node.setAttribute(entry.attribute, value);
    }
    $('site-language').value = language;
    document.documentElement.setAttribute('data-i18n-ready', '');
  }
  $('site-language').addEventListener('change', () => {
    const next = $('site-language').value;
    if (next !== 'ko' && next !== 'en') return;
    language = next; applyLanguage(); refreshLanguage();
    try { localStorage.setItem(languageKey, language); } catch (_) { /* The current page still works. */ }
  });
  applyLanguage();
  // The same existing asset localizes the four information pages without loading the calculator.
  if (!$('recipe-text')) return;
  const C = window.PrepCore;
  if (!C) {
    document.documentElement.setAttribute('data-calculator-unavailable', '');
    document.querySelectorAll('button,input,textarea').forEach(node => { node.disabled = true; });
    return;
  }
  const EN = {
  "배율": "Ratio",
  "재료와 그램 수": "Ingredients and grams",
  "선택": "Optional",
  "이 재료로 확인": "Confirm ingredients",
  "원형": "Round",
  "사각형": "Rectangle",
  "지름": "Diameter",
  "가로": "Width",
  "세로": "Length",
  "개수": "Count",
  "개": "pans",
  "베이킹 준비표": "Baking checklist",
  "이 브라우저에 저장": "Save in this browser",
  "저장본 삭제": "Delete saved copy",
  "를 확인해 주세요.": ".",
  "재료 이름을 입력해 주세요.": "Enter an ingredient name.",
  "재료 이름은 200자 이내로 입력해 주세요.": "Ingredient names must be 200 characters or fewer.",
  "그램 수는 40자 이내로 입력해 주세요.": "Gram amounts must be 40 characters or fewer.",
  "그램 수는 0보다 큰 숫자로 입력해 주세요.": "Enter a gram amount greater than 0.",
  "“재료 이름 120g” 형식으로 고치거나, 아래 칸에 직접 입력해 주세요.": "Use “Ingredient name 120g”, or fill in the fields below.",
  "한 줄에 재료와 그램 수를 하나씩 입력해 주세요. 숫자·쉼표 형식도 확인해 주세요.": "Enter one ingredient and one gram amount per line. Check the number and comma format too.",
  "틀 모양을 선택해 주세요.": "Choose a pan shape.",
  "틀 개수 입력이 너무 길어요.": "The pan count input is too long.",
  "틀 개수는 1 이상의 정수로 입력해 주세요.": "Enter a whole-number pan count of at least 1.",
  "틀 크기가 계산 범위를 벗어났어요. 입력값을 확인해 주세요.": "The pan area is outside the calculation range. Check your inputs.",
  "배율을 계산할 수 없어요. 틀 크기를 확인해 주세요.": "The ratio cannot be calculated. Check the pan dimensions.",
  "준비표에 넣을 재료를 하나 이상 확인해 주세요.": "Confirm at least one ingredient for the checklist.",
  "재료의 계산값이 범위를 벗어났어요. 입력값을 확인해 주세요.": "A scaled ingredient is outside the calculation range. Check your inputs.",
  "계산 불가": "Cannot calculate",
  "{count}줄 · 제외 {excluded}줄": "{count} lines · {excluded} excluded",
  "재료 확인 완료 ✓": "Ingredients confirmed ✓",
  "이름과 그램 수를 확인했어요. 이제 틀을 맞춰 주세요.": "Names and grams confirmed. Now choose your pans.",
  "{count}줄을 직접 고치거나 제외해 주세요.": "Correct or exclude {count} lines.",
  "최소 한 재료가 필요해요.": "At least one ingredient is needed.",
  "{count}개 재료를 눈으로 확인한 뒤 버튼을 눌러 주세요.": "Review all {count} ingredients, then press Confirm.",
  "{line}번째 줄": "Line {line}",
  "재료 이름": "Ingredient name",
  "그램 수 (g)": "Grams (g)",
  "{line}번째 줄 제외": "Exclude line {line}",
  "이 줄 제외": "Exclude this line",
  "한 번에 500줄, 100,000자까지 읽을 수 있어요. 입력을 나누어 주세요.": "The limit is 500 lines and 100,000 characters at a time. Split your input into smaller parts.",
  "먼저 재료와 그램 수를 붙여넣어 주세요.": "Paste your ingredients and gram amounts first.",
  "틀 크기를 확인해 주세요.": "Check the pan dimensions.",
  "재료의 양은 ": "Ingredient amounts will be scaled to ",
  "{ratio}배": "{ratio}×",
  "로 맞춰져요.": " of the original.",
  "원형 {diameter}cm × {count}개": "Round {diameter} cm × {count} pans",
  "사각형 {width} × {length}cm × {count}개": "Rectangle {width} × {length} cm × {count} pans",
  "{total}개 재료, 준비 끝 ✓": "All {total} ingredients ready ✓",
  "{checked} / {total}개 준비": "{checked} / {total} ingredients ready",
  "직접 제외한 {count}줄은 계산에 포함하지 않았어요.": "The {count} lines you excluded are not included in the calculation.",
  "확인한 모든 재료가 준비표에 들어 있어요.": "All confirmed ingredients are in the checklist.",
  "{name} 준비 완료": "{name} ready",
  "원래 {grams}g": "Originally {grams}g",
  "반올림 전 계산값: {grams}g": "Unrounded calculated value: {grams}g",
  "먼저 읽어 온 재료를 확인하고 “이 재료로 확인”을 눌러 주세요.": "Review the parsed ingredients and choose “Confirm ingredients” first.",
  "기능 확인용 예제": "Feature demonstration",
  "이 브라우저에 준비표 1개를 저장했어요. 이후 수정과 체크는 다시 저장해야 남아요.": "One checklist saved in this browser. Save again to keep later edits and checkmarks.",
  "저장하지 못했어요. {error} 화면에서 계속 사용하거나 인쇄할 수 있어요.": "Could not save. {error} You can keep using the current page or print the checklist.",
  "저장본을 읽을 수 없어요.": "The saved copy cannot be read.",
  "저장본 형식이 맞지 않아요. 현재 입력은 유지했어요.": "The saved format is invalid. Your current inputs were kept.",
  "저장된 재료 형식이 맞지 않아요. 현재 입력은 유지했어요.": "The saved ingredient format is invalid. Your current inputs were kept.",
  "저장된 틀 형식이 맞지 않아요.": "The saved pan format is invalid.",
  "아직 이 브라우저에 저장한 준비표가 없어요.": "There is no saved checklist in this browser yet.",
  "저장한 입력과 체크를 불러왔어요.": "Saved inputs and checkmarks loaded.",
  "저장본을 불러오지 못했어요. {error}": "Could not load the saved copy. {error}",
  "저장 형식이 손상되었어요.": "The saved data is damaged.",
  "이 브라우저의 저장본을 삭제했어요.": "The saved checklist in this browser was deleted.",
  "브라우저가 저장본 삭제를 허용하지 않았어요.": "The browser did not allow the saved copy to be deleted.",
  "문제가 생겼어요. 입력값과 브라우저 저장 설정을 확인해 주세요.": "Something went wrong. Check your inputs and browser storage settings."
};
  function t(source, values = {}) {
    let message = language === 'en' ? (EN[source] || source) : source;
    for (const [key, value] of Object.entries(values)) message = message.replaceAll('{' + key + '}', () => String(value));
    return message;
  }
  function errorText(source) {
    if (!source) return '';
    if (language === 'ko') return source;
    if (EN[source]) return EN[source];
    const row = /^(\d+)번째 줄: (.*)$/.exec(source);
    if (row) return 'Line ' + row[1] + ': ' + errorText(row[2]);
    const dimension = /^(지름|가로|세로)( 입력은 40자 이내로 입력해 주세요\.|은\(는\) 0보다 큰 숫자로 입력해 주세요\.)$/.exec(source);
    if (dimension) return EN[dimension[1]] + (dimension[2].startsWith(' 입력') ? ' must be 40 characters or fewer.' : ' must be a number greater than 0.');
    return t('문제가 생겼어요. 입력값과 브라우저 저장 설정을 확인해 주세요.');
  }
  const englishSample = 'Cake flour 120g\nSugar 75g\nUnsalted butter 60g\nBeaten egg 90g\nMilk 45g\nBaking powder 2.5g';
  let noticeSource = '', calculationErrorSource = '';
  const storageKey = 'hanteuldeoh.prep.v1';
  let rows = [], confirmed = false, result = null;
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };
  function notify(message, scroll = false, values = {}) {
    noticeSource = { message, values }; $('notice').textContent = t(message, { ...values, ...(values.error ? { error: errorText(values.error) } : {}) });
    $('notice').hidden = false;
    if (scroll) $('notice').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function hideResult() { result = null; $('result').hidden = true; $('result-empty').hidden = false; $('checklist').replaceChildren(); }
  function invalidateIngredients() {
    confirmed = false; hideResult(); updateReviewStatus();
  }
  function rowError(row) { return row.excluded ? '' : C.validateIngredient(row.name, row.grams); }
  function updateReviewStatus() {
    const excluded = rows.filter(row => row.excluded).length;
    const errors = rows.filter(row => rowError(row)).length;
    $('review-summary').textContent = t('{count}줄 · 제외 {excluded}줄', { count: rows.length, excluded });
    $('confirm').disabled = !rows.length || rows.length === excluded || errors > 0 || confirmed;
    $('confirm').textContent = t(confirmed ? '재료 확인 완료 ✓' : '이 재료로 확인');
    $('review-status').textContent = !rows.length ? '' : confirmed
      ? t('이름과 그램 수를 확인했어요. 이제 틀을 맞춰 주세요.')
      : errors ? t('{count}줄을 직접 고치거나 제외해 주세요.', { count: errors })
      : rows.length === excluded ? t('최소 한 재료가 필요해요.')
      : t('{count}개 재료를 눈으로 확인한 뒤 버튼을 눌러 주세요.', { count: rows.length - excluded });
  }
  function renderReview() {
    $('review').hidden = !rows.length;
    $('review-rows').replaceChildren();
    for (const row of rows) {
      const wrap = make('div', 'review-row'); wrap.dataset.rowId = row.id;
      const raw = make('div', 'raw-line'); raw.append(make('span', 'line-num', t('{line}번째 줄', { line: row.lineNumber })), make('span', '', row.raw));
      const nameWrap = make('div'), gramsWrap = make('div');
      const nameLabel = make('label', '', t('재료 이름')), gramsLabel = make('label', '', t('그램 수 (g)'));
      const nameInput = make('input'), gramsInput = make('input');
      nameInput.id = 'ingredient-name-' + row.id; nameInput.value = row.name; nameInput.maxLength = 200;
      gramsInput.id = 'ingredient-grams-' + row.id; gramsInput.value = row.grams; gramsInput.inputMode = 'decimal'; gramsInput.maxLength = 40;
      nameLabel.htmlFor = nameInput.id; gramsLabel.htmlFor = gramsInput.id;
      nameWrap.append(nameLabel, nameInput); gramsWrap.append(gramsLabel, gramsInput);
      const excludeLabel = make('label', 'exclude-label'), exclude = make('input');
      exclude.type = 'checkbox'; exclude.checked = row.excluded; exclude.setAttribute('aria-label', t('{line}번째 줄 제외', { line: row.lineNumber }));
      excludeLabel.append(exclude, document.createTextNode(t('이 줄 제외')));
      const error = make('p', 'row-error'); error.id = 'row-error-' + row.id;
      nameInput.setAttribute('aria-describedby', error.id); gramsInput.setAttribute('aria-describedby', error.id);
      const refresh = (initial = false) => {
        const problem = row.excluded ? '' : (initial && row.error ? row.error : rowError(row));
        error.textContent = errorText(problem); error.hidden = !problem;
        wrap.classList.toggle('excluded', row.excluded); wrap.classList.toggle('has-error', !!problem);
        nameInput.disabled = row.excluded; gramsInput.disabled = row.excluded;
        nameInput.setAttribute('aria-invalid', String(!row.excluded && !row.name.trim()));
        gramsInput.setAttribute('aria-invalid', String(!row.excluded && (!Number.isFinite(C.number(row.grams)) || C.number(row.grams) <= 0)));
      };
      nameInput.addEventListener('input', () => { row.name = nameInput.value; row.error = ''; refresh(); invalidateIngredients(); });
      gramsInput.addEventListener('input', () => { row.grams = gramsInput.value; row.error = ''; refresh(); invalidateIngredients(); });
      exclude.addEventListener('change', () => { row.excluded = exclude.checked; refresh(); invalidateIngredients(); });
      wrap.append(raw, nameWrap, gramsWrap, excludeLabel, error); $('review-rows').append(wrap); refresh(true);
    }
    updateReviewStatus();
  }
  function parse() {
    hideResult(); confirmed = false;
    const text = $('recipe-text').value;
    if (text.length > 100000 || text.split(/\r?\n/).length > 500) {
      rows = []; renderReview(); notify('한 번에 500줄, 100,000자까지 읽을 수 있어요. 입력을 나누어 주세요.', true); return;
    }
    rows = C.parseRecipe(text); renderReview();
    if (!rows.length) { notify('먼저 재료와 그램 수를 붙여넣어 주세요.', true); $('recipe-text').focus(); return; }
    $('notice').hidden = true; $('review').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function pan(prefix) {
    const value = key => $(prefix + '-' + key).value;
    return { shape: document.querySelector('input[name="' + prefix + '-shape"]:checked').value,
      diameter: value('diameter'), width: value('width'), length: value('length'), count: value('count') };
  }
  function setPan(prefix, values) {
    document.querySelector('input[name="' + prefix + '-shape"][value="' + values.shape + '"]').checked = true;
    for (const key of ['diameter', 'width', 'length', 'count']) $(prefix + '-' + key).value = values[key];
    showShape(prefix);
  }
  function showShape(prefix) {
    const shape = pan(prefix).shape;
    for (const value of ['round', 'rectangle']) document.querySelector('[data-shape-fields="' + prefix + '-' + value + '"]').hidden = shape !== value;
  }
  function updateRatio() {
    $('calculation-error').hidden = true;
    try {
      const ratio = C.panArea(pan('target')) / C.panArea(pan('original'));
      if (!Number.isFinite(ratio) || ratio <= 0) throw new Error('틀 크기를 확인해 주세요.');
      const text = make('span', '', t('재료의 양은 ')), strong = make('strong', '', t('{ratio}배', { ratio: C.formatMass(ratio) }));
      $('ratio-preview').replaceChildren(text, strong, document.createTextNode(t('로 맞춰져요.')));
    } catch (error) { $('ratio-preview').textContent = errorText(error.message); }
  }
  function panLabel(p) {
    return p.shape === 'round' ? t('원형 {diameter}cm × {count}개', p)
      : t('사각형 {width} × {length}cm × {count}개', p);
  }
  function updateProgress() {
    if (!result) return;
    const total = result.ingredients.length, checked = result.ingredients.filter(row => row.checked).length;
    $('check-progress').textContent = checked === total ? t('{total}개 재료, 준비 끝 ✓', { total }) : t('{checked} / {total}개 준비', { checked, total });
    $('prep-progress').max = total; $('prep-progress').value = checked;
  }
  function renderResult() {
    $('result-empty').hidden = true; $('result').hidden = false;
    $('result-title').textContent = $('recipe-name').value.trim() || t('베이킹 준비표');
    $('result-ratio').textContent = t('{ratio}배', { ratio: C.formatMass(result.ratio) });
    $('result-pan-summary').textContent = panLabel(pan('original')) + ' → ' + panLabel(pan('target'));
    $('excluded-note').textContent = result.excludedCount ? t('직접 제외한 {count}줄은 계산에 포함하지 않았어요.', { count: result.excludedCount }) : t('확인한 모든 재료가 준비표에 들어 있어요.');
    $('checklist').replaceChildren();
    for (const ingredient of result.ingredients) {
      const li = make('li'), label = make('label'), input = make('input'); input.type = 'checkbox'; input.checked = ingredient.checked;
      input.setAttribute('aria-label', t('{name} 준비 완료', { name: ingredient.name }));
      const name = make('span', 'ingredient-title', ingredient.name);
      name.append(make('small', '', t('원래 {grams}g', { grams: C.formatMass(ingredient.originalGrams) })));
      const amount = make('span', 'ingredient-mass', C.formatMass(ingredient.grams)); amount.append(make('small', '', 'g'));
      amount.title = t('반올림 전 계산값: {grams}g', { grams: ingredient.grams });
      input.addEventListener('change', () => { ingredient.checked = input.checked; updateProgress(); });
      label.append(input, name, amount); li.append(label); $('checklist').append(li);
    }
    updateProgress();
  }
  function calculate(scroll = true) {
    $('calculation-error').hidden = true;
    try {
      if (!confirmed) throw new Error('먼저 읽어 온 재료를 확인하고 “이 재료로 확인”을 눌러 주세요.');
      const previousChecks = new Set(result ? result.ingredients.filter(row => row.checked).map(row => row.id) : []);
      result = C.calculate(pan('original'), pan('target'), rows);
      result.ingredients.forEach(row => { row.checked = previousChecks.has(row.id); }); renderResult();
      if (scroll) $('result-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
      return true;
    } catch (error) {
      hideResult(); calculationErrorSource = error.message; $('calculation-error').textContent = errorText(error.message); $('calculation-error').hidden = false; return false;
    }
  }
  $('sample').addEventListener('click', () => {
    $('recipe-text').value = language === 'ko' ? C.sample : englishSample; $('recipe-name').value = t('기능 확인용 예제');
    setPan('original', { shape: 'round', diameter: '18', width: '18', length: '18', count: '1' });
    setPan('target', { shape: 'round', diameter: '21', width: '20', length: '20', count: '1' });
    updateRatio(); parse();
  });
  $('parse').addEventListener('click', parse);
  $('recipe-text').addEventListener('input', () => { rows = []; confirmed = false; hideResult(); renderReview(); });
  $('recipe-name').addEventListener('input', () => { if (result) $('result-title').textContent = $('recipe-name').value.trim() || t('베이킹 준비표'); });
  $('confirm').addEventListener('click', () => {
    if (!rows.length || rows.every(row => row.excluded) || rows.some(row => rowError(row))) return;
    confirmed = true; $('calculation-error').hidden = true; updateReviewStatus(); $('pan-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  for (const prefix of ['original', 'target']) {
    document.querySelectorAll('input[name="' + prefix + '-shape"]').forEach(input => input.addEventListener('change', () => { showShape(prefix); hideResult(); updateRatio(); }));
    for (const key of ['diameter', 'width', 'length', 'count']) $(prefix + '-' + key).addEventListener('input', () => { hideResult(); updateRatio(); });
  }
  $('calculate').addEventListener('click', () => calculate());
  $('uncheck').addEventListener('click', () => { if (!result) return; result.ingredients.forEach(row => { row.checked = false; }); renderResult(); });
  $('print').addEventListener('click', () => { if (result) window.print(); });
  $('save').addEventListener('click', () => {
    if (!result) return;
    const data = { version: 1, name: $('recipe-name').value, text: $('recipe-text').value, rows,
      original: pan('original'), target: pan('target'), checkedIds: result.ingredients.filter(row => row.checked).map(row => row.id) };
    try { const payload = JSON.stringify(data); checkedSavedData(payload); localStorage.setItem(storageKey, payload); notify('이 브라우저에 준비표 1개를 저장했어요. 이후 수정과 체크는 다시 저장해야 남아요.', true); }
    catch (error) { notify('저장하지 못했어요. {error} 화면에서 계속 사용하거나 인쇄할 수 있어요.', true, { error: error.message }); }
  });
  function checkedSavedData(raw) {
    if (typeof raw !== 'string' || raw.length > 600000) throw new Error('저장본을 읽을 수 없어요.');
    const data = JSON.parse(raw);
    if (!data || data.version !== 1 || typeof data.name !== 'string' || data.name.length > 80 ||
      typeof data.text !== 'string' || data.text.length > 100000 || !Array.isArray(data.rows) || !data.rows.length || data.rows.length > 500 ||
      !Array.isArray(data.checkedIds)) throw new Error('저장본 형식이 맞지 않아요. 현재 입력은 유지했어요.');
    const ids = new Set();
    data.rows.forEach(row => {
      if (!row || !Number.isSafeInteger(row.id) || row.id < 1 || ids.has(row.id) || row.lineNumber !== row.id ||
        typeof row.raw !== 'string' || row.raw.length > 100000 || typeof row.name !== 'string' || row.name.length > 100000 ||
        typeof row.grams !== 'string' || row.grams.length > 100000 || typeof row.excluded !== 'boolean') throw new Error('저장된 재료 형식이 맞지 않아요. 현재 입력은 유지했어요.');
      ids.add(row.id);
    });
    for (const p of [data.original, data.target]) {
      if (!p || !['round', 'rectangle'].includes(p.shape) || ['diameter', 'width', 'length', 'count'].some(key => typeof p[key] !== 'string' || p[key].length > 40)) throw new Error('저장된 틀 형식이 맞지 않아요.');
    }
    C.calculate(data.original, data.target, data.rows);
    return data;
  }
  $('load').addEventListener('click', () => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) { notify('아직 이 브라우저에 저장한 준비표가 없어요.', true); return; }
      const data = checkedSavedData(raw);
      $('recipe-text').value = data.text; $('recipe-name').value = data.name;
      hideResult(); rows = data.rows.map(row => ({ ...row, error: '' })); confirmed = true; renderReview();
      setPan('original', data.original); setPan('target', data.target); updateRatio();
      calculate(false); result.ingredients.forEach(row => { row.checked = data.checkedIds.includes(row.id); }); renderResult();
      notify('저장한 입력과 체크를 불러왔어요.'); $('result-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) { notify('저장본을 불러오지 못했어요. {error}', true, { error: error instanceof SyntaxError ? '저장 형식이 손상되었어요.' : error.message }); }
  });
  $('delete-save').addEventListener('click', () => $('delete-dialog').showModal());
  $('delete-cancel').addEventListener('click', () => $('delete-dialog').close());
  $('delete-confirm').addEventListener('click', () => {
    $('delete-dialog').close();
    try { localStorage.removeItem(storageKey); notify('이 브라우저의 저장본을 삭제했어요.', true); }
    catch (_) { notify('브라우저가 저장본 삭제를 허용하지 않았어요.', true); }
  });
  $('reset').addEventListener('click', () => $('reset-dialog').showModal());
  $('reset-cancel').addEventListener('click', () => $('reset-dialog').close());
  $('reset-confirm').addEventListener('click', () => {
    $('reset-dialog').close(); $('recipe-name').value = ''; $('recipe-text').value = '';
    rows = []; confirmed = false; hideResult(); renderReview();
    setPan('original', { shape: 'round', diameter: '18', width: '18', length: '18', count: '1' });
    setPan('target', { shape: 'round', diameter: '21', width: '20', length: '20', count: '1' });
    updateRatio(); $('notice').hidden = true; $('recipe-text').focus(); window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  refreshLanguage = () => {
    const errorVisible = !$('calculation-error').hidden;
    renderReview(); updateRatio();
    if (result) renderResult();
    if (errorVisible) { $('calculation-error').textContent = errorText(calculationErrorSource); $('calculation-error').hidden = false; }
    if (!$('notice').hidden && noticeSource) notify(noticeSource.message, false, noticeSource.values);
  };
  showShape('original'); showShape('target'); updateRatio();
})();
