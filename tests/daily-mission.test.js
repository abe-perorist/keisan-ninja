// きょうの任務（デイリーミッション）のロジックを検証する。
// game.js は DOMContentLoaded でしか起動しないので、document と
// localStorage を最小限スタブしてからインポートする。

const store = new Map();
globalThis.localStorage = {
    getItem: k => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: k => store.delete(k),
    clear: () => store.clear(),
};
globalThis.document = { addEventListener() {}, getElementById: () => null };
globalThis.Audio = class { load() {} play() { return Promise.resolve(); } };

const { Game } = await import('../js/game.js');

let failures = 0;
function check(label, cond) {
    if (cond) {
        console.log(`  ✅ ${label}`);
    } else {
        console.error(`  ❌ ${label}`);
        failures++;
    }
}

const noScores = {
    'intro-add': 0, 'intro-sub': 0, 'intro-add-blank': 0, 'intro-sub-blank': 0,
    '+': 0, '-': 0, '×': 0, '÷': 0, special: 0, hyper: 0, master: 0,
};
const ctx = hs => ({ highScores: { ...noScores, ...hs } });

console.log('--- pickMissionOp ---');

// 入門しかやっていない子に、むずかしいモードの任務を出してはいけない
{
    const c = ctx({ 'intro-add': 80, 'intro-sub': 50 });
    const ops = new Set();
    for (let d = 1; d <= 60; d++) {
        ops.add(Game.prototype.pickMissionOp.call(c, `2026-11-${String(d).padStart(2, '0')}`));
    }
    check('入門だけの子には入門の任務しか出ない', [...ops].every(op => op.startsWith('intro-')));
    check('入門だけの子でも複数モードが出る', ops.size >= 2);
}

// 通常モードをやったことがあれば、入門は候補から外れる
{
    const c = ctx({ 'intro-add': 80, '+': 120, '×': 60, hyper: 40 });
    const ops = new Set();
    for (let d = 1; d <= 60; d++) {
        ops.add(Game.prototype.pickMissionOp.call(c, `2026-11-${String(d).padStart(2, '0')}`));
    }
    check('入門より上をやっている子に入門の任務は出ない', [...ops].every(op => !op.startsWith('intro-')));
    check('やったことのあるモードからのみ出題', [...ops].every(op => ['+', '×', 'hyper'].includes(op)));
}

// 一度もプレイしていなければ入門たしざんにフォールバック
check('未プレイなら intro-add', Game.prototype.pickMissionOp.call(ctx({}), '2026-11-06') === 'intro-add');

// 同じ日付なら何度呼んでも同じ任務
{
    const c = ctx({ '+': 100, '-': 100, '×': 100, '÷': 100 });
    const a = Game.prototype.pickMissionOp.call(c, '2026-11-06');
    const b = Game.prototype.pickMissionOp.call(c, '2026-11-06');
    check('同じ日なら任務は変わらない', a === b);
}

console.log('--- missionTarget ---');

check('ハイスコア150点(15問)なら目標9問', Game.prototype.missionTarget.call(ctx({ '+': 150 }), '+') === 9);
check('ハイスコア0でも最低3問', Game.prototype.missionTarget.call(ctx({}), '+') === 3);
check('ハイスコア30点(3問)でも最低3問', Game.prototype.missionTarget.call(ctx({ hyper: 30 }), 'hyper') === 3);

console.log('--- loadOrCreateDailyMission ---');

{
    store.clear();
    const c = ctx({ '+': 100 });
    c.todayKey = Game.prototype.todayKey;
    c.pickMissionOp = Game.prototype.pickMissionOp;
    c.missionTarget = Game.prototype.missionTarget;

    const m1 = Game.prototype.loadOrCreateDailyMission.call(c);
    check('新規作成時は未達成', m1.done === false);
    check('目標が1以上', m1.target >= 1);

    // 達成済みの状態を保存して読み直す
    m1.done = true;
    localStorage.setItem('keisanNinjaDailyMission', JSON.stringify(m1));
    const m2 = Game.prototype.loadOrCreateDailyMission.call(c);
    check('同日中は達成状態が保たれる', m2.done === true && m2.op === m1.op);

    // 日付が変わったら作り直される
    localStorage.setItem('keisanNinjaDailyMission', JSON.stringify({ ...m1, date: '2000-01-01' }));
    check('日付が変わると未達成に戻る', Game.prototype.loadOrCreateDailyMission.call(c).done === false);

    // 壊れたデータでも落ちない
    localStorage.setItem('keisanNinjaDailyMission', '{壊れたJSON');
    check('壊れたデータでも作り直せる', Game.prototype.loadOrCreateDailyMission.call(c).done === false);
}

if (failures > 0) {
    console.error(`\n${failures} 件失敗 ❌`);
    process.exit(1);
}
console.log('\nAll daily mission tests passed! ✅');
