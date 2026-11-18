// 忍術とプレイ記録のロジックを検証する。

import assert from 'node:assert';

const store = new Map();
globalThis.localStorage = {
    getItem: k => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: k => store.delete(k),
    clear: () => store.clear(),
};

const {
    categoryOf, getStats, recordCorrect, recordOvercome, recordPlayDay, consecutiveDays, FAST_MS,
} = await import('../js/stats.js');
const {
    JUTSU_LIST, JUTSU_GROUPS, getJutsuById, getJutsuByGroup, getLearnedJutsuIds,
    claimNewJutsu, buildJutsuContext, jutsuProgress,
} = await import('../js/jutsu.js');
const { DANS, danProblems, markDanProblemCleared } = await import('../js/dans.js');

function check(label, cond) {
    assert.ok(cond, label);
    console.log(`  ✅ ${label}`);
}

const TODAY = '2026-11-19';

console.log('--- 計算の種類わけ ---');

// 小1の入門たしざんと小3の足し算が同じ「たしざん」に入らないと、
// どちらの子も同じ忍術にたどり着けない
check('入門たしざんも + も たしざん',
    categoryOf('intro-add') === 'add' && categoryOf('intro-add-blank') === 'add' && categoryOf('+') === 'add');
check('入門ひきざんも - も ひきざん',
    categoryOf('intro-sub') === 'sub' && categoryOf('intro-sub-blank') === 'sub' && categoryOf('-') === 'sub');
check('段も計算の種類に入る',
    categoryOf('dan-make10') === 'add' && categoryOf('dan-add9') === 'add'
    && categoryOf('dan-sub9') === 'sub' && categoryOf('dan-kuku7') === 'mul');
check('× ÷ はそれぞれ', categoryOf('×') === 'mul' && categoryOf('÷') === 'div');
check('特訓・ハイパー・マスターはそうごう',
    ['special', 'hyper', 'master'].every(op => categoryOf(op) === 'mixed'));

console.log('--- 記録 ---');

store.clear();
{
    recordCorrect('+', 1200, 1);
    recordCorrect('intro-add', 2000, 2);
    recordCorrect('+', 9000, 3);           // おそい
    const s = getStats();
    check('たしざんの正解が3問', s.byCat.add.correct === 3);
    check('3秒いないは2問だけ', s.byCat.add.fast === 2);
    check('ちょうど3秒はセーフ', (recordCorrect('+', FAST_MS, 4), getStats().byCat.add.fast === 3));
    check('連続正解の最高が記録される', getStats().bestStreak === 4 && getStats().byCat.add.bestStreak === 4);
    check('総正解数がたまる', getStats().totalCorrect === 4);

    recordCorrect('×', 1000, 1);
    check('連続が途切れても最高は下がらない', getStats().bestStreak === 4);
    check('種類ごとに分かれている', getStats().byCat.mul.correct === 1 && getStats().byCat.add.correct === 4);

    recordOvercome();
    recordOvercome();
    check('克服した数がたまる', getStats().overcome === 2);
}

// 壊れたデータでも落ちない
{
    localStorage.setItem('keisanNinjaStats', '{壊れたJSON');
    check('壊れた記録でも空で返る', getStats().totalCorrect === 0 && getStats().byCat.add.correct === 0);
    localStorage.setItem('keisanNinjaStats', '"文字列"');
    check('型がちがっても落ちない', getStats().byCat.div.fast === 0);
}

console.log('--- 連続しゅぎょう日数 ---');

store.clear();
{
    check('一度も遊んでいなければ0', consecutiveDays(TODAY, []) === 0);
    check('きょうだけなら1', consecutiveDays(TODAY, ['2026-11-19']) === 1);
    check('3日つづけば3', consecutiveDays(TODAY, ['2026-11-17', '2026-11-18', '2026-11-19']) === 3);
    // きょうまだ遊んでいないだけで記録が途切れて見えるのは避けたい
    check('きょう未プレイでも、きのうまでの連続は保たれる',
        consecutiveDays(TODAY, ['2026-11-17', '2026-11-18']) === 2);
    check('1日あくと そこで切れる',
        consecutiveDays(TODAY, ['2026-11-15', '2026-11-18', '2026-11-19']) === 2);
    check('月をまたいでも数えられる',
        consecutiveDays('2026-12-01', ['2026-11-29', '2026-11-30', '2026-12-01']) === 3);

    recordPlayDay('2026-11-19');
    recordPlayDay('2026-11-19');
    check('同じ日を二重に記録しない', getStats().days.length === 1);
}

console.log('--- 忍術カタログ ---');

check('忍術は19個', JUTSU_LIST.length === 19);
check('IDに重複がない', new Set(JUTSU_LIST.map(j => j.id)).size === JUTSU_LIST.length);
check('全ての忍術がグループに属している',
    JUTSU_LIST.every(j => JUTSU_GROUPS.some(g => g.id === j.group)));
check('空のグループがない', JUTSU_GROUPS.every(g => getJutsuByGroup(g.id).length > 0));

// 技名だけでは何が得意か分からないので、説明は必須
check('全ての忍術に「きみは〜」の言い切りがある',
    JUTSU_LIST.every(j => typeof j.praise === 'string' && j.praise.startsWith('きみは')));
check('全ての忍術に、何をして覚えたかの説明がある',
    JUTSU_LIST.every(j => typeof j.condition === 'string' && j.condition.length > 0));
check('苦手・だめ・できないという言葉を使っていない',
    JUTSU_LIST.every(j => !/苦手|にがて|だめ|ダメ|できない|よわい/.test(j.praise + j.condition)));

console.log('--- 忍術をおぼえる ---');

store.clear();
{
    check('はじめは何もおぼえていない', getLearnedJutsuIds().length === 0);
    check('何もしていなければ覚えない', claimNewJutsu(TODAY).length === 0);

    // たしざんを3秒いないに30問
    for (let i = 1; i <= 29; i++) recordCorrect('intro-add', 1000, 1);
    check('29問ではまだ覚えない', claimNewJutsu(TODAY).length === 0);

    recordCorrect('+', 1000, 1);
    const fresh = claimNewJutsu(TODAY);
    check('30問で疾風の術を覚える', fresh.length === 1 && fresh[0].id === 'shippu');
    check('技名と得意分野がむすびついている',
        fresh[0].name === '疾風の術' && fresh[0].praise.includes('たしざん'));
    check('同じ忍術を二度は覚えない', claimNewJutsu(TODAY).length === 0);
    check('覚えた忍術は保存される', getLearnedJutsuIds().includes('shippu'));
}

// 段から覚える忍術
store.clear();
{
    DANS.filter(d => d.kind === 'add').forEach(d =>
        danProblems(d).forEach(p => markDanProblemCleared(d.id, p.key)));
    const fresh = claimNewJutsu(TODAY);
    const katon = fresh.find(j => j.id === 'katon');
    check('くり上がりの段を全部皆伝で火遁の術', !!katon);
    check('火遁の術はくり上がりが得意だと言っている', katon.praise.includes('くり上がり'));

    DANS.filter(d => d.id === 'dan-kuku7').forEach(d =>
        danProblems(d).forEach(p => markDanProblemCleared(d.id, p.key)));
    check('7の段 皆伝で七星の術', claimNewJutsu(TODAY).some(j => j.id === 'shichisei'));
}

// 一度覚えた忍術は、あとで条件を下回っても消えない
store.clear();
{
    for (let i = 0; i < 20; i++) recordOvercome();
    check('まちがいを20問できるようにして不屈の術', claimNewJutsu(TODAY).some(j => j.id === 'fukutsu'));
    localStorage.setItem('keisanNinjaStats', JSON.stringify({ ...getStats(), overcome: 0 }));
    claimNewJutsu(TODAY);
    check('記録が下がっても覚えた忍術は消えない', getLearnedJutsuIds().includes('fukutsu'));
}

console.log('--- あと何問で覚えられるか ---');

store.clear();
{
    for (let i = 0; i < 12; i++) recordCorrect('×', 1000, 1);
    const ctx = buildJutsuContext(TODAY);
    const p = jutsuProgress(getJutsuById('shinsoku'), ctx);
    check('神速の術は 12/30', p.now === 12 && p.goal === 30);
    check('目標をこえても はみ出さない',
        jutsuProgress(getJutsuById('hyakuren'), buildJutsuContext(TODAY)).now <= 100);
    check('できた/まだ だけの忍術は進み具合を持たない',
        jutsuProgress(getJutsuById('shichisei'), ctx) === null);
}

console.log('\nAll jutsu tests passed! ✅');
