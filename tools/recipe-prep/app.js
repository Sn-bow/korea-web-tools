(function () {
  'use strict';
  const C = window.PrepCore, $ = id => document.getElementById(id);
  const storageKey = 'hanteuldeoh.prep.v1';
  let rows = [], confirmed = false, result = null;
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };
  function notify(message, scroll = false) {
    $('notice').textContent = message;
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
    $('review-summary').textContent = rows.length + '줄 · 제외 ' + excluded + '줄';
    $('confirm').disabled = !rows.length || rows.length === excluded || errors > 0 || confirmed;
    $('confirm').textContent = confirmed ? '재료 확인 완료 ✓' : '이 재료로 확인';
    $('review-status').textContent = !rows.length ? '' : confirmed
      ? '이름과 그램 수를 확인했어요. 이제 틀을 맞춰 주세요.'
      : errors ? errors + '줄을 직접 고치거나 제외해 주세요.'
      : rows.length === excluded ? '최소 한 재료가 필요해요.'
      : (rows.length - excluded) + '개 재료를 눈으로 확인한 뒤 버튼을 눌러 주세요.';
  }
  function renderReview() {
    $('review').hidden = !rows.length;
    $('review-rows').replaceChildren();
    for (const row of rows) {
      const wrap = make('div', 'review-row'); wrap.dataset.rowId = row.id;
      const raw = make('div', 'raw-line'); raw.append(make('span', 'line-num', row.lineNumber + '번째 줄'), make('span', '', row.raw));
      const nameWrap = make('div'), gramsWrap = make('div');
      const nameLabel = make('label', '', '재료 이름'), gramsLabel = make('label', '', '그램 수 (g)');
      const nameInput = make('input'), gramsInput = make('input');
      nameInput.id = 'ingredient-name-' + row.id; nameInput.value = row.name; nameInput.maxLength = 200;
      gramsInput.id = 'ingredient-grams-' + row.id; gramsInput.value = row.grams; gramsInput.inputMode = 'decimal'; gramsInput.maxLength = 40;
      nameLabel.htmlFor = nameInput.id; gramsLabel.htmlFor = gramsInput.id;
      nameWrap.append(nameLabel, nameInput); gramsWrap.append(gramsLabel, gramsInput);
      const excludeLabel = make('label', 'exclude-label'), exclude = make('input');
      exclude.type = 'checkbox'; exclude.checked = row.excluded; exclude.setAttribute('aria-label', row.lineNumber + '번째 줄 제외');
      excludeLabel.append(exclude, document.createTextNode('이 줄 제외'));
      const error = make('p', 'row-error'); error.id = 'row-error-' + row.id;
      nameInput.setAttribute('aria-describedby', error.id); gramsInput.setAttribute('aria-describedby', error.id);
      const refresh = (initial = false) => {
        const problem = row.excluded ? '' : (initial && row.error ? row.error : rowError(row));
        error.textContent = problem; error.hidden = !problem;
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
      const text = make('span', '', '재료의 양은 '), strong = make('strong', '', C.formatMass(ratio) + '배');
      $('ratio-preview').replaceChildren(text, strong, document.createTextNode('로 맞춰져요.'));
    } catch (error) { $('ratio-preview').textContent = error.message; }
  }
  function panLabel(p) {
    return p.shape === 'round' ? '원형 ' + p.diameter + 'cm × ' + p.count + '개'
      : '사각형 ' + p.width + ' × ' + p.length + 'cm × ' + p.count + '개';
  }
  function updateProgress() {
    if (!result) return;
    const total = result.ingredients.length, checked = result.ingredients.filter(row => row.checked).length;
    $('check-progress').textContent = checked === total ? total + '개 재료, 준비 끝 ✓' : checked + ' / ' + total + '개 준비';
    $('prep-progress').max = total; $('prep-progress').value = checked;
  }
  function renderResult() {
    $('result-empty').hidden = true; $('result').hidden = false;
    $('result-title').textContent = $('recipe-name').value.trim() || '베이킹 준비표';
    $('result-ratio').textContent = C.formatMass(result.ratio) + '배';
    $('result-pan-summary').textContent = panLabel(pan('original')) + ' → ' + panLabel(pan('target'));
    $('excluded-note').textContent = result.excludedCount ? '직접 제외한 ' + result.excludedCount + '줄은 계산에 포함하지 않았어요.' : '확인한 모든 재료가 준비표에 들어 있어요.';
    $('checklist').replaceChildren();
    for (const ingredient of result.ingredients) {
      const li = make('li'), label = make('label'), input = make('input'); input.type = 'checkbox'; input.checked = ingredient.checked;
      input.setAttribute('aria-label', ingredient.name + ' 준비 완료');
      const name = make('span', 'ingredient-title', ingredient.name);
      name.append(make('small', '', '원래 ' + C.formatMass(ingredient.originalGrams) + 'g'));
      const amount = make('span', 'ingredient-mass', C.formatMass(ingredient.grams)); amount.append(make('small', '', 'g'));
      amount.title = '반올림 전 계산값: ' + ingredient.grams + 'g';
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
      hideResult(); $('calculation-error').textContent = error.message; $('calculation-error').hidden = false; return false;
    }
  }
  $('sample').addEventListener('click', () => {
    $('recipe-text').value = C.sample; $('recipe-name').value = '기능 확인용 예제';
    setPan('original', { shape: 'round', diameter: '18', width: '18', length: '18', count: '1' });
    setPan('target', { shape: 'round', diameter: '21', width: '20', length: '20', count: '1' });
    updateRatio(); parse();
  });
  $('parse').addEventListener('click', parse);
  $('recipe-text').addEventListener('input', () => { rows = []; confirmed = false; hideResult(); renderReview(); });
  $('recipe-name').addEventListener('input', () => { if (result) $('result-title').textContent = $('recipe-name').value.trim() || '베이킹 준비표'; });
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
    catch (error) { notify('저장하지 못했어요. ' + error.message + ' 화면에서 계속 사용하거나 인쇄할 수 있어요.', true); }
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
    } catch (error) { notify('저장본을 불러오지 못했어요. ' + (error instanceof SyntaxError ? '저장 형식이 손상되었어요.' : error.message), true); }
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
  showShape('original'); showShape('target'); updateRatio();
})();
