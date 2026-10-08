(function () {
  'use strict';
  const C = window.PartnerCore, $ = id => document.getElementById(id);
  const STORE = 'partner-rotation:session:v1';
  const COPY = {
    ko: {
      skip:'본문으로 건너뛰기',brandSub:'주간 성인 연습 모임',eyebrow:'함께 이어 가는 주간 연습',
      title:'오늘 모인 사람들과,<br>다음 짝을.',lede:'참석을 체크하고, 짝을 미리 보고, 끝난 라운드만 기록하세요.<br> 작은 연습 모임의 다음 만남을 준비하는 도구입니다.',privacyPill:'참가자 정보는 이 브라우저 안에',
      step1:'01 / 참석 확인',rosterTitle:'우리 모임',rosterHelp:'등록은 최대 40명, 오늘 참석은 4–20명입니다. 불참은 과거 기록에 영향을 주지 않습니다.',selectNone:'모두 불참',addNames:'이름 / 별명 등록',namesLabel:'한 줄에 한 명씩',namesHelp:'동명이인은 ‘민지 A’, ‘민지 B’처럼 구분하세요. 이름 옆 수정 버튼으로 이름을 바꿔도 기록은 유지됩니다.',addButton:'명단에 추가',sample:'7명 예시 체험',
      step2:'02 / 미리보기 → 완료',roundTitle:'다음 라운드',waiting:'준비 중',generate:'다음 짝 미리보기 ↗',regenerate:'미리보기 다시 만들기',complete:'라운드 완료 · 기록',previewHelp:'미리보기는 기록을 바꾸지 않습니다. 실제로 끝난 뒤 ‘완료’를 누르세요.',
      step3:'03 / 이어 가는 기록',recordTitle:'모임 기록',undo:'마지막 완료 되돌리기',metricRounds:'완료 라운드',metricRepeats:'다시 만난 짝',metricByes:'참석자 휴식 범위',metricsHelp:'반복은 이전에 만났던 짝이 다시 배정된 횟수입니다. 휴식은 현재 참석자의 누적 횟수이며, 불참은 휴식에 포함하지 않습니다.',distribution:'참가자별 만남 · 휴식',name:'이름',rounds:'참여',partners:'만난 사람',rests:'휴식',history:'완료 기록 보기',copy:'미리보기 + 기록 복사',print:'인쇄 / PDF',
      storageTitle:'다음 모임에도 이어서',storageHelp:'저장은 직접 선택합니다. 명단·참석 상태·완료 기록 1개를 이 브라우저에 저장하며, 미리보기는 저장하지 않습니다. 변경 후 다시 저장하세요.',save:'이 기기에 저장',restore:'저장한 기록 복원',reset:'모두 초기화',backupTitle:'선택 사항: 백업 파일',backupHelp:'브라우저 데이터 삭제에 대비해 JSON 파일로 보관할 수 있습니다. 이름과 기록이 담긴 일반 텍스트 파일이므로 직접 관리해 주세요. 복원은 현재 모임을 교체합니다.',backup:'백업 내려받기',import:'백업 파일 복원',
      methodTitle:'짝 배정과 기록은 어떻게 작동하나요?',methodBody:'<p>현재 참석자와 완료 기록을 바탕으로 이전 짝의 반복이 적은 조합을 찾습니다. 홀수 명이면 지금 참석한 사람 중 누적 휴식이 가장 적은 사람에게 휴식을 배정합니다. 조건이 같은 조합은 무작위로 정해집니다.</p><p>참석자와 과거 배정에 따라 새 상대가 부족할 수 있습니다. 모든 상대를 이미 만났다면 반복은 불가피합니다. 이후 모든 라운드의 무반복이나 최적 결과를 보장하지 않습니다. 불참자는 다음 모임에 다시 체크하면 됩니다.</p><p>이름은 화면 표시용이며 내부 참가자 ID로 기록을 연결합니다. 이름을 수정해도 이력이 유지됩니다. 기록된 이름은 현재 이름으로 표시됩니다. 완료한 마지막 라운드만 되돌릴 수 있습니다. 한 모임에 최대 2,000라운드를 기록합니다.</p><p>참가자 데이터는 서버로 전송하지 않습니다. 로그인, 외부 분석, 외부 폰트, 광고 없이 이 브라우저에서 동작합니다. 페이지 제공 서버의 일반 요청 처리는 별개입니다. 작은 성인 모임을 위한 초기 실험 도구입니다.</p>',
      footer:'성인 모임을 위한 작은 진행 도구 · KO / EN',renameTitle:'이름 수정',renameHelp:'이 참가자의 ID와 이전 기록은 그대로 유지됩니다.',apply:'변경 적용',cancel:'취소',copyFallbackTitle:'직접 복사하기',copyFallbackHelp:'자동 복사를 사용할 수 없습니다. 아래 내용을 선택해 복사하세요.',close:'닫기',edit:'수정',editAria:'{name} 이름 수정',presentAria:'{name} 참석',attendance:'오늘 {n}명 참석',absent:'불참',emptyTitle:'첫 라운드를 준비해 볼까요?',emptyBody:'왼쪽 명단에 이름을 추가한 뒤 오늘 참석하는 사람을 체크하세요. 4명부터 시작할 수 있습니다.',emptyBodyMobile:'명단에 이름을 추가한 뒤 오늘 참석하는 사람을 체크하세요. 4명부터 시작할 수 있습니다.',noHistory:'아직 완료한 라운드가 없습니다.',noPeople:'명단을 등록하면 참가자별 기록이 표시됩니다.',roundN:'라운드 {n}',meta:'{n}명 참석 · {pairs}개 짝',previewState:'미리보기 · 미기록',doneState:'완료 기록',pairN:'짝 {n}',pastTimes:'이전 {n}회',newPair:'첫 만남',bye:'이번 라운드 휴식',byeTimes:'완료 기록에 휴식 {n}회',repeatWarning:'이번 미리보기에는 이전에 만난 짝 {n}개가 있습니다. 참석자·이전 기록·휴식 기준에 따라 새 짝의 선택지가 줄어듭니다. 모든 상대를 이미 만났다면 반복은 불가피합니다.',fairBye:'홀수 참석: 누적 휴식이 가장 적은 참석자 중에서 휴식을 배정합니다.',
      empty:'한 줄에 한 명씩 이름을 입력해 주세요.',tooMany:'등록 명단은 최대 40명입니다.',invalidName:'이름은 보이는 글자 1–60자로 입력해 주세요. 제어 문자와 보이지 않는 방향 문자는 사용할 수 없습니다.',duplicate:'같은 이름이 있습니다. 공백·대소문자·전각 차이는 구분하지 않습니다. ‘민지 A’, ‘민지 B’처럼 다른 별명을 써 주세요.',attendanceRange:'오늘 참석자를 4–20명으로 맞춰 주세요.',historyFull:'완료 기록이 2,000라운드에 도달했습니다. 백업을 내려받은 뒤 새 모임으로 초기화해 주세요.',generationFailed:'짝을 만들지 못했습니다. 참석 명단을 확인한 뒤 다시 시도해 주세요.',invalidBackup:'올바른 Partner Rotation 백업이 아닙니다. 현재 모임은 변경하지 않았습니다.',
      added:'{n}명을 등록했습니다. 현재 {present}명이 참석으로 체크되어 있습니다.',invalidated:'참석자 또는 이름이 바뀌어 미리보기를 지웠습니다. 완료 기록은 유지됩니다.',previewMade:'라운드 {n} 미리보기를 만들었습니다. 완료 기록은 바뀌지 않았습니다.',completed:'라운드 {n}을 완료 기록에 추가했습니다. 다음 모임까지 보관하려면 다시 저장하세요.',undoConfirm:'마지막 완료 라운드를 되돌릴까요? 해당 라운드의 짝·휴식 집계를 제거합니다.',undone:'마지막 완료를 되돌렸습니다. 이전 미리보기는 복원하지 않습니다.',renameDone:'이름을 수정했습니다. 참가자 ID와 기록은 유지됩니다.',notSaved:'저장한 모임이 있다면 복원을 누르세요. 변경은 자동 저장하지 않습니다.',unsaved:'저장하지 않은 변경이 있습니다. 새로고침 전에 저장하세요.',saved:'현재 명단·참석 상태·완료 기록이 이 기기에 저장되어 있습니다.',saveFailed:'저장하지 못했습니다. 브라우저 저장소가 차단되었거나 공간이 부족할 수 있습니다. 현재 화면은 유지됩니다. 백업 파일로 보관해 주세요.',saveSuccess:'이 기기에 저장했습니다. 미리보기는 저장하지 않습니다.',nothingSave:'먼저 참가자를 등록해 주세요.',pendingNames:'입력 중인 이름을 명단에 추가하거나 지운 뒤 저장·백업해 주세요.',restoreMissing:'이 브라우저에 저장한 모임이 없습니다.',restoreFailed:'저장한 기록을 읽을 수 없습니다. 현재 모임은 유지됩니다.',restoreConfirm:'저장한 기록으로 현재 모임을 교체할까요? 저장하지 않은 변경과 미리보기는 사라집니다.',restored:'저장한 모임을 복원했습니다. 다음 라운드는 새로 미리 보세요.',overwriteConfirm:'이 브라우저에 다른 저장 내용이 있습니다. 현재 모임으로 덮어쓸까요?',resetConfirm:'현재 명단·완료 기록·이 기기에 저장한 모임을 모두 지울까요? 내려받은 백업 파일은 남습니다.',resetFailed:'기기 저장본을 지우지 못해 초기화를 중단했습니다. 브라우저 저장소 설정을 확인해 주세요. 현재 모임은 유지됩니다.',resetDone:'현재 모임과 기기 저장본을 지웠습니다.',copied:'미리보기와 완료 기록을 복사했습니다.',exportEmpty:'아직 짝이나 완료 기록이 없습니다.',exportTitle:'Partner Rotation · 모임 기록',exportPreview:'미리보기 · 아직 완료하지 않음',exportHistory:'완료한 라운드',exportNames:'이름은 현재 등록 명단 기준입니다. 참여에는 휴식 라운드도 포함합니다.',exportSummary:'완료 {rounds}라운드 · 반복 짝 {repeated}회',printNote:'미리보기는 완료 기록에 포함하지 않았습니다. 공유할 대상과 이름을 확인하세요.',backupDownloaded:'백업 파일을 내려받았습니다. 기기 저장본은 바꾸지 않았습니다.',backupFailed:'백업 파일을 만들지 못했습니다. 다시 시도하거나 기록을 복사해 주세요.',importConfirm:'백업 파일로 현재 모임을 교체할까요? 기기 저장본은 자동으로 덮어쓰지 않습니다.',imported:'백업을 복원했습니다. 이 기기에 보관하려면 저장을 누르세요.',previousPage:'이전 기록',nextPage:'다음 기록',pageN:'{page} / {total}',description:'성인 주간 연습 모임을 위한 참석 체크와 짝 배정. 오늘의 짝을 미리 보고 완료한 라운드만 이 브라우저에 기록하세요. 한국어·영어 지원.',placeholder:'예: 민지 A\n준호\n수빈\nAlex'
    },
    en: {
      skip:'Skip to content',brandSub:'Weekly practice for adults',eyebrow:'WEEKLY PRACTICE, TOGETHER',title:'A familiar group.<br>A fresh pairing.',lede:'Check who’s here, preview the pairs, and record each finished round.<br> A small tool for your next practice together.',privacyPill:'Participant data stays in this browser',
      step1:'01 / CHECK ATTENDANCE',rosterTitle:'Your group',rosterHelp:'Register up to 40 people. Check in 4–20 for today. Absences leave past records intact.',selectNone:'Uncheck all',addNames:'Register names / nicknames',namesLabel:'One person per line',namesHelp:'Give people with the same name distinct labels, such as “Alex A” and “Alex B”. Use Edit next to a name to rename them without losing history.',addButton:'Add to group',sample:'Try 7 sample names',step2:'02 / PREVIEW → COMPLETE',roundTitle:'Your next round',waiting:'Getting ready',generate:'Preview next pairs ↗',regenerate:'Regenerate preview',complete:'Complete & record round',previewHelp:'Previews do not change history. Press Complete only after the round is finished.',
      step3:'03 / KEEP THE HISTORY',recordTitle:'Group history',undo:'Undo last completion',metricRounds:'Completed rounds',metricRepeats:'Repeat pairings',metricByes:'Attendees’ rest range',metricsHelp:'A repeat counts each time a pair meets again. The rest range uses the current attendees’ lifetime totals. Absences are not counted as rests.',distribution:'Meetings & rests by person',name:'Name',rounds:'Rounds',partners:'Partners met',rests:'Rests',history:'View completed rounds',copy:'Copy preview + history',print:'Print / PDF',storageTitle:'Pick up next time',storageHelp:'Saving is your choice. Save one group, its attendance and completed history in this browser. Previews are excluded. Save again after changes.',save:'Save on this device',restore:'Restore saved group',reset:'Reset everything',backupTitle:'Optional: a backup file',backupHelp:'Keep a JSON file in case browser data is cleared. It contains names and records as plain text, so manage it yourself. Restoring a file replaces the current group.',backup:'Download backup',import:'Restore backup file',methodTitle:'How do pairings and records work?',
      methodBody:'<p>The tool uses today’s attendees and completed history to look for pairings with fewer previous meetings. With an odd number, someone with the fewest completed rests among today’s attendees rests. Equivalent choices are randomized.</p><p>Attendance and past choices can limit new partners. Repeats become unavoidable once everyone has met every available partner. The tool does not guarantee repeat-free future rounds or an optimal result. Check returning participants in again at your next meeting.</p><p>Names are display labels; a stable participant ID links records. Renaming keeps history, and records display current names. Only the last completed round can be undone. One group can hold up to 2,000 rounds.</p><p>Participant data is not sent to a server. This tool runs in your browser without accounts, external analytics, external fonts, or ads. The page server’s normal request handling is separate. This is an early experiment for small adult groups.</p>',
      footer:'A small facilitation tool for adult groups · KO / EN',renameTitle:'Edit name',renameHelp:'This person’s ID and previous records stay the same.',apply:'Apply change',cancel:'Cancel',copyFallbackTitle:'Copy manually',copyFallbackHelp:'Automatic copying is unavailable. Select and copy the text below.',close:'Close',edit:'Edit',editAria:'Edit {name}',presentAria:'{name} is attending',attendance:'{n} attending today',absent:'Absent',emptyTitle:'Ready for your first round?',emptyBody:'Add names to your group, then check who’s here today. Start with at least 4 people.',emptyBodyMobile:'Add names to your group, then check who’s here today. Start with at least 4 people.',noHistory:'No completed rounds yet.',noPeople:'Add your group to see records for each person.',roundN:'Round {n}',meta:'{n} attending · {pairs} pairs',previewState:'Preview · unrecorded',doneState:'Completed',pairN:'Pair {n}',pastTimes:'{n} past meetings',newPair:'First meeting',bye:'Rest this round',byeTimes:'{n} recorded rests',repeatWarning:'This preview has {n} pair(s) who have met before. Today’s attendance, earlier rounds and the rest rule limit new pairings. Repeats become unavoidable once all available partners have met.',fairBye:'Odd attendance: a person with the fewest recorded rests among today’s attendees rests.',
      empty:'Enter one name per line.',tooMany:'You can register up to 40 people.',invalidName:'Use a visible name of 1–60 characters. Control characters and invisible direction markers are not supported.',duplicate:'Some names match. Spaces, letter case and full-width variants do not distinguish people. Use distinct labels, such as “Alex A” and “Alex B”.',attendanceRange:'Check in 4–20 people for today.',historyFull:'This group has reached 2,000 completed rounds. Download a backup, then reset to start a new group.',generationFailed:'Could not make pairs. Check attendance and try again.',invalidBackup:'This is not a valid Partner Rotation backup. Your current group was not changed.',added:'Added {n} people. {present} are checked in.',invalidated:'Attendance or names changed, so the preview was cleared. Completed history is unchanged.',previewMade:'Created a preview for round {n}. Completed history is unchanged.',completed:'Recorded round {n} as completed. Save again to keep it for next time.',undoConfirm:'Undo the last completed round? Its pairings and rest counts will be removed.',undone:'Undid the last completion. Its old preview was not restored.',renameDone:'Updated the name. The participant ID and history are unchanged.',notSaved:'Have a saved group? Press Restore. Changes are not saved automatically.',unsaved:'There are unsaved changes. Save before refreshing.',saved:'The current group, attendance and completed history are saved on this device.',saveFailed:'Could not save. Browser storage may be blocked or full. Your current group is still on screen. Download a backup to keep it.',saveSuccess:'Saved on this device. Previews are not saved.',nothingSave:'Register your group first.',pendingNames:'Add the names you are typing to the group, or clear them, before saving or backing up.',restoreMissing:'There is no saved group in this browser.',restoreFailed:'Could not read the saved group. Your current group is unchanged.',restoreConfirm:'Replace the current group with the saved copy? Unsaved changes and previews will be lost.',restored:'Restored your saved group. Preview the next round again when ready.',overwriteConfirm:'This browser has a different saved copy. Overwrite it with the current group?',resetConfirm:'Delete the current group, completed history, and saved copy on this device? Downloaded backup files will remain.',resetFailed:'Could not delete the saved copy, so reset was stopped. Check browser storage settings. Your current group is unchanged.',resetDone:'Cleared the current group and its saved copy.',copied:'Copied the preview and completed history.',exportEmpty:'There are no pairings or completed rounds yet.',exportTitle:'Partner Rotation · Group record',exportPreview:'Preview · not completed yet',exportHistory:'Completed rounds',exportNames:'Names reflect the current roster. Round counts include rest rounds.',exportSummary:'{rounds} completed rounds · {repeated} repeat pairings',printNote:'The preview is excluded from completed history. Check the names and intended audience before sharing.',backupDownloaded:'Downloaded a backup. The saved browser copy was not changed.',backupFailed:'Could not create the backup. Try again, or copy your records.',importConfirm:'Replace the current group with this backup? The saved browser copy will not be overwritten automatically.',imported:'Restored the backup. Press Save to keep it on this device.',previousPage:'Newer records',nextPage:'Older records',pageN:'{page} / {total}',description:'Attendance and partner rotation for weekly adult practice groups. Preview today’s pairs and record only completed rounds in your browser. English and Korean.',placeholder:'e.g. Alex A\nJordan\nMorgan\nMinji'
    }
  };
  let state = { version: 1, lang: navigator.language.toLowerCase().startsWith('ko') ? 'ko' : 'en', roster: [], history: [] };
  let pending = null, savedJSON = null, lastStored = null, renameId = null, historyPage = 0;
  let noticeKey = '', noticeArgs = {}, saveErrorKey = '', rosterError = '', roundError = '';
  const t = (key, args = {}) => (COPY[state.lang][key] || key).replace(/\{(\w+)\}/g, (_, name) => String(args[name] ?? ''));
  const el = (tag, text, className) => { const node = document.createElement(tag); if (text !== undefined) node.textContent = text; if (className) node.className = className; return node; };
  const uid = () => window.crypto?.randomUUID ? crypto.randomUUID() : 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2);
  function random() { if (window.crypto?.getRandomValues) return crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296; return Math.random(); }
  const json = () => JSON.stringify(state);
  const attendeeCount = () => state.roster.filter(p => p.present).length;
  const personName = id => state.roster.find(p => p.id === id)?.name || '';
  const fingerprint = () => JSON.stringify([state.roster, state.history.map(r => r.id)]);
  const hasUnsaved = () => (state.roster.length > 0 && json() !== savedJSON) || $('names').value.trim().length > 0;
  function announce(key, args = {}) { noticeKey = key; noticeArgs = args; $('announcement').textContent = t(key, args); }
  function errorAt(id, key) { $(id).textContent = key ? t(key) : ''; $(id).hidden = !key; }
  function invalidate() { const existed = !!pending; pending = null; saveErrorKey = ''; roundError = ''; if (existed) announce('invalidated'); return existed; }
  function translate() {
    document.documentElement.lang = state.lang;
    document.title = state.lang === 'ko' ? '모임 짝 배정 · Partner Rotation' : 'Partner Rotation · Weekly practice groups';
    document.querySelector('meta[name=description]').content = t('description');
    // Only this fixed translation dictionary may use markup. User names never do.
    document.querySelectorAll('[data-i]').forEach(node => { node.innerHTML = t(node.dataset.i); });
    $('language').value = state.lang; $('names').placeholder = t('placeholder');
    $('announcement').textContent = noticeKey ? t(noticeKey, noticeArgs) : '';
    $('copy-text').setAttribute('aria-label', t('copyFallbackTitle'));
    $('print-output').setAttribute('aria-label', t('print'));
  }
  function renderRoster() {
    const list = $('roster-list'); list.replaceChildren();
    state.roster.forEach(person => {
      const row = el('div', undefined, 'person'), label = el('label'), checkbox = el('input');
      checkbox.type = 'checkbox'; checkbox.checked = person.present; checkbox.dataset.person = person.id;
      checkbox.setAttribute('aria-label', t('presentAria', {name:person.name}));
      checkbox.addEventListener('change', () => { person.present = checkbox.checked; invalidate(); render(false); });
      label.append(checkbox, el('span', person.name, 'person-name'));
      const edit = el('button', t('edit'), 'edit-button'); edit.type = 'button'; edit.setAttribute('aria-label', t('editAria', {name:person.name}));
      edit.addEventListener('click', () => { renameId = person.id; $('rename-input').value = person.name; errorAt('rename-error', ''); $('rename-dialog').showModal(); $('rename-input').focus(); $('rename-input').select(); });
      row.append(label, edit); list.append(row);
    });
    $('roster-count').textContent = state.roster.length;
    $('attendance-footer').hidden = !state.roster.length;
    $('attendance-count').textContent = t('attendance', {n:attendeeCount()});
    $('sample').hidden = state.roster.length > 0;
  }
  function roundCard(round, isPreview) {
    const section = el('div'), grid = el('div', undefined, 'pair-grid');
    const relevantHistory = isPreview ? state.history : state.history.slice(0, -1);
    const summary = C.stats(state.roster, relevantHistory);
    round.pairs.forEach(([a,b], i) => {
      const times = summary.pairs.get(C.key(a,b)) || 0;
      const card = el('div', undefined, 'pair' + (times ? ' repeat' : ''));
      const label = el('div', undefined, 'pair-label'); label.append(el('span', t('pairN', {n:String(i+1).padStart(2,'0')})), el('span', times ? t('pastTimes',{n:times}) : t('newPair'), times ? 'repeat-count' : ''));
      const names = el('div', undefined, 'pair-names'); names.append(el('span',personName(a)),el('span','×','join'),el('span',personName(b)));
      card.append(label,names); grid.append(card);
    });
    section.append(grid);
    if (round.bye) {
      const rest = el('div',undefined,'bye'), info = el('div'); info.append(el('strong',personName(round.bye)),el('div',t('byeTimes',{n:summary.people.get(round.bye).byes + (isPreview ? 0 : 1)}),'helper'));
      rest.append(el('span',t('bye')),info); section.append(rest);
    }
    return section;
  }
  function renderRound() {
    const count = attendeeCount(), last = state.history.at(-1), showing = pending || last;
    $('round-content').replaceChildren();
    $('round-title').textContent = showing ? t('roundN',{n:pending ? state.history.length+1 : state.history.length}) : t('roundTitle');
    $('round-state').textContent = pending ? t('previewState') : last ? t('doneState') : t('waiting');
    $('round-state').className = 'status-badge' + (pending ? ' preview' : last ? ' done' : '');
    $('round-meta').textContent = showing ? t('meta',{n:showing.pairs.length*2+(showing.bye ? 1 : 0),pairs:showing.pairs.length}) : '';
    if (showing) $('round-content').append(roundCard(showing,!!pending));
    else { const empty = el('div',undefined,'empty'); empty.append(el('div','↔','empty-symbol'),el('h3',t('emptyTitle')),el('p',t('emptyBodyMobile'))); $('round-content').append(empty); }
    const warning = pending?.repeated ? t('repeatWarning',{n:pending.repeated}) : pending?.bye ? t('fairBye') : '';
    $('preview-warning').textContent = warning; $('preview-warning').hidden = !warning;
    $('generate').textContent = t(pending ? 'regenerate' : 'generate');
    $('generate').disabled = count < 4 || count > 20 || state.history.length >= C.MAX_HISTORY;
    $('complete').hidden = !pending; $('complete').disabled = !pending;
    errorAt('round-error',roundError || (state.history.length >= C.MAX_HISTORY ? 'historyFull' : state.roster.length && (count<4 || count>20) ? 'attendanceRange' : ''));
  }
  function renderRecords() {
    const summary = C.stats(state.roster,state.history), active = state.roster.filter(p=>p.present);
    $('metric-rounds').textContent = state.history.length; $('metric-repeats').textContent = summary.repeated;
    const byes = active.map(p=>summary.people.get(p.id).byes);
    $('metric-byes').textContent = byes.length ? Math.min(...byes)+'–'+Math.max(...byes) : '—';
    $('undo').disabled = !state.history.length;
    $('copy').disabled = $('print').disabled = !pending && !state.history.length;
    const body = $('distribution-body'); body.replaceChildren();
    state.roster.forEach(p=>{ const s=summary.people.get(p.id),row=el('tr'); row.className = p.present ? '' : 'absent'; row.append(el('td',p.name+(p.present?'':' · '+t('absent'))),el('td',s.rounds),el('td',s.partners.size),el('td',s.byes)); body.append(row); });
    if (!state.roster.length) { const row=el('tr'),cell=el('td',t('noPeople')); cell.colSpan=4; row.append(cell); body.append(row); }
    const history = $('history-list'); history.replaceChildren();
    if (!state.history.length) history.append(el('p',t('noHistory'),'helper'));
    const totalPages = Math.max(1,Math.ceil(state.history.length/10)); historyPage=Math.min(historyPage,totalPages-1);
    const start=state.history.length-1-historyPage*10;
    for(let i=start;i>=Math.max(0,start-9);i--){ const round=state.history[i],row=el('div',undefined,'history-round'),heading=el('h3',t('roundN',{n:i+1})); const time=el('time',new Date(round.at).toLocaleString(state.lang==='ko'?'ko-KR':'en-US',{dateStyle:'medium',timeStyle:'short'})); time.dateTime=round.at; heading.append(time); row.append(heading); round.pairs.forEach(([a,b])=>row.append(el('p',personName(a)+' × '+personName(b)))); if(round.bye)row.append(el('p',t('bye')+': '+personName(round.bye))); history.append(row); }
    if(totalPages>1){ const nav=el('div',undefined,'history-pagination'); const prev=el('button',t('previousPage'),'text-button'),next=el('button',t('nextPage'),'text-button'); prev.disabled=historyPage===0;next.disabled=historyPage===totalPages-1;prev.onclick=()=>{historyPage--;renderRecords();};next.onclick=()=>{historyPage++;renderRecords();};nav.append(prev,el('span',t('pageN',{page:historyPage+1,total:totalPages})),next);history.append(nav); }
  }
  function renderSaveStatus() {
    const dirty=hasUnsaved(); $('save-status').className='save-status'+(dirty||saveErrorKey?' unsaved':'');
    $('save-status').textContent=t(saveErrorKey || (dirty?'unsaved':savedJSON?'saved':'notSaved'));
  }
  function render(rebuildRoster=true) { if(rebuildRoster) renderRoster(); else $('attendance-count').textContent=t('attendance',{n:attendeeCount()}); renderRound();renderRecords();renderSaveStatus();errorAt('roster-error',rosterError); }
  function addNames(value) {
    try { const names=C.parseNames(value,state.roster);let checked=attendeeCount();names.forEach(name=>state.roster.push({id:uid(),name,present:checked++<20})); invalidate();rosterError='';$('names').value='';$('add-details').open=false;render();announce('added',{n:names.length,present:attendeeCount()});$('names').blur(); }
    catch(error){rosterError=error.message;errorAt('roster-error',rosterError);}
  }
  $('roster-form').addEventListener('submit',e=>{e.preventDefault();addNames($('names').value);});
  $('sample').addEventListener('click',()=>addNames(state.lang==='ko'?'민지\n준호\n수빈\n지우\nAlex\n지훈\n서연':'Alex\nJordan\nMorgan\nSam\nMinji\nRobin\nTaylor'));
  $('names').addEventListener('input',()=>{rosterError='';errorAt('roster-error','');renderSaveStatus();});
  $('select-none').addEventListener('click',()=>{state.roster.forEach(p=>p.present=false);invalidate();render();});
  $('language').addEventListener('change',()=>{state.lang=$('language').value;translate();render();});
  $('generate').addEventListener('click',()=>{
    try { const result=C.preview(state.roster,state.history,random); pending={...result,id:uid(),fingerprint:fingerprint()};roundError='';render();announce('previewMade',{n:state.history.length+1});$('complete').focus({preventScroll:true}); }
    catch(error){roundError=error.message;renderRound();}
  });
  $('complete').addEventListener('click',()=>{
    if(!pending) return;
    if(pending.fingerprint!==fingerprint()){invalidate();render();announce('invalidated');return;}
    const done=pending;pending=null; // Consume before any rendering or second click.
    if(state.history.some(r=>r.id===done.id)) return;
    state.history.push({id:done.id,at:new Date().toISOString(),pairs:done.pairs.map(p=>p.slice()),bye:done.bye});historyPage=0;saveErrorKey='';render();announce('completed',{n:state.history.length});$('generate').focus({preventScroll:true});
  });
  $('undo').addEventListener('click',()=>{if(!state.history.length||!confirm(t('undoConfirm')))return;state.history.pop();invalidate();render();announce('undone');});
  $('rename-form').addEventListener('submit',e=>{
    e.preventDefault(); const person=state.roster.find(p=>p.id===renameId);if(!person)return;
    try {const names=C.parseNames($('rename-input').value,state.roster.filter(p=>p.id!==renameId));if(names.length!==1)throw new Error('invalidName');person.name=names[0];invalidate();$('rename-dialog').close();render();announce('renameDone');}
    catch(error){errorAt('rename-error',error.message);}
  });
  $('rename-cancel').addEventListener('click',()=>$('rename-dialog').close());
  function canSave(){if($('names').value.trim()){announce('pendingNames');return false;}if(!state.roster.length){announce('nothingSave');return false;}return true;}
  $('save').addEventListener('click',()=>{
    if(!canSave())return;
    try {const previous=localStorage.getItem(STORE);if(previous && previous!==lastStored && !confirm(t('overwriteConfirm')))return;const data=json();localStorage.setItem(STORE,data);if(localStorage.getItem(STORE)!==data)throw new Error('verify');savedJSON=data;lastStored=data;saveErrorKey='';renderSaveStatus();announce('saveSuccess');}
    catch(_){saveErrorKey='saveFailed';renderSaveStatus();announce('saveFailed');}
  });
  function parseBackup(text){if(typeof text!=='string'||text.length>4_000_000)throw new Error('invalidBackup');return C.validateSnapshot(JSON.parse(text));}
  function replaceState(next){state=next;pending=null;renameId=null;historyPage=0;saveErrorKey='';rosterError='';roundError='';$('names').value='';$('add-details').open=!state.roster.length;translate();render();}
  $('restore').addEventListener('click',()=>{
    let raw,next;
    try{raw=localStorage.getItem(STORE);if(!raw){announce('restoreMissing');return;}}catch(_){announce('restoreFailed');return;}
    try{next=parseBackup(raw);}catch(_){announce('invalidBackup');return;}
    if((state.roster.length||$('names').value.trim()||pending)&&!confirm(t('restoreConfirm')))return;
    replaceState(next);savedJSON=json();lastStored=raw;renderSaveStatus();announce('restored');
  });
  $('reset').addEventListener('click',()=>{
    if(!confirm(t('resetConfirm')))return;
    try{localStorage.removeItem(STORE);if(localStorage.getItem(STORE)!==null)throw new Error('verify');}catch(_){announce('resetFailed');return;}
    const lang=state.lang;savedJSON=null;lastStored=null;replaceState({version:1,lang,roster:[],history:[]});announce('resetDone');
  });
  function exportText(){
    const summary=C.stats(state.roster,state.history),lines=[t('exportTitle'),t('exportSummary',{rounds:state.history.length,repeated:summary.repeated}),t('exportNames'),''];
    function addRound(round,label){lines.push(label);round.pairs.forEach(([a,b],i)=>lines.push(t('pairN',{n:i+1})+': '+personName(a)+' × '+personName(b)));if(round.bye)lines.push(t('bye')+': '+personName(round.bye));lines.push('');}
    if(pending)addRound(pending,t('exportPreview')+' · '+t('roundN',{n:state.history.length+1}));
    lines.push(t('exportHistory'));
    state.history.forEach((r,i)=>addRound(r,t('roundN',{n:i+1})+' · '+new Date(r.at).toLocaleString(state.lang==='ko'?'ko-KR':'en-US')));
    lines.push(t('distribution'));state.roster.forEach(p=>{const s=summary.people.get(p.id);lines.push(p.name+' · '+t('rounds')+' '+s.rounds+' · '+t('partners')+' '+s.partners.size+' · '+t('rests')+' '+s.byes);});
    lines.push('',t('printNote'));return lines.join('\n');
  }
  $('copy').addEventListener('click',async()=>{if(!pending&&!state.history.length){announce('exportEmpty');return;}const text=exportText();try{await navigator.clipboard.writeText(text);announce('copied');}catch(_){$('copy-text').value=text;$('copy-dialog').showModal();$('copy-text').focus();$('copy-text').select();}});
  $('copy-close').addEventListener('click',()=>$('copy-dialog').close());
  function preparePrint(){const output=$('print-output');output.replaceChildren();output.append(el('h1',t('exportTitle')),el('p',t('exportNames'),'print-note'),el('p',t('printNote'),'print-note'));const summary=C.stats(state.roster,state.history);output.append(el('p',t('exportSummary',{rounds:state.history.length,repeated:summary.repeated})));
    function addRound(round,label){const block=el('div',undefined,'print-round');block.append(el('h3',label));round.pairs.forEach(([a,b],i)=>block.append(el('p',t('pairN',{n:i+1})+': '+personName(a)+' × '+personName(b))));if(round.bye)block.append(el('p',t('bye')+': '+personName(round.bye)));output.append(block);}
    if(pending)addRound(pending,t('exportPreview')+' · '+t('roundN',{n:state.history.length+1}));
    output.append(el('h2',t('exportHistory')));if(!state.history.length)output.append(el('p',t('noHistory')));state.history.forEach((r,i)=>addRound(r,t('roundN',{n:i+1})+' · '+new Date(r.at).toLocaleString(state.lang==='ko'?'ko-KR':'en-US')));
    output.append(el('h2',t('distribution')),document.querySelector('.table-scroll table').cloneNode(true));
  }
  window.addEventListener('beforeprint',preparePrint);$('print').addEventListener('click',()=>{preparePrint();window.print();});
  $('backup').addEventListener('click',()=>{if(!canSave())return;let url;try{url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));const a=el('a');a.href=url;a.download='partner-rotation-'+new Date().toISOString().slice(0,10)+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);announce('backupDownloaded');}catch(_){if(url)URL.revokeObjectURL(url);announce('backupFailed');}});
  $('import').addEventListener('click',()=>$('import-file').click());
  $('import-file').addEventListener('change',async()=>{const file=$('import-file').files[0];$('import-file').value='';if(!file)return;try{if(file.size>4_000_000)throw new Error('invalidBackup');const next=parseBackup(await file.text());if(!confirm(t('importConfirm')))return;replaceState(next);savedJSON=null;renderSaveStatus();announce('imported');}catch(_){announce('invalidBackup');}});
  window.addEventListener('beforeunload',e=>{if(hasUnsaved()){e.preventDefault();e.returnValue='';}});
  window.addEventListener('storage',e=>{if(e.key===STORE && e.newValue!==lastStored){savedJSON=null;renderSaveStatus();}});
  translate();render();
})();
