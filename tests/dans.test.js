// だんべつ修行のロジックを検証する。localStorage だけスタブすればよい。

import assert from 'node:assert';

const store = new Map();
globalThis.localStorage = {
    getItem: k => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: k => store.delete(k),
    clear: () => store.clear(),
};

const {
    DANS,
    DAN_GROUPS,
    isDanOp,
    getDanById,
    getDansByGroup,
    danProblems,
    markDanProblemCleared,
    getDanStatus,
    getGroupStatus,
    claimDanAwards,
} = await import('../js/dans.js');

function check(label, cond) {
    assert.ok(cond, label);
    console.log(`  ✅ ${label}`);
}

console.log('--- カタログ ---');

check('段は19個（小1が11、九九が8）', DANS.length === 19);
check('小1の段は11個', getDansByGroup('grade1').length === 11);
check('九九の段は8個', getDansByGroup('kuku').length === 8);
check('段IDに重複がない', new Set(DANS.map(d => d.id)).size === DANS.length);
check('全ての段がグループに属している', DANS.every(d => DAN_GROUPS.some(g => g.id === d.group)));
check('isDanOp は段IDだけ true', DANS.every(d => isDanOp(d.id)) && !isDanOp('+') && !isDanOp('intro-add'));

console.log('--- 問題の中身 ---');

// 答えが正しいことは全段でまとめて確認する
for (const dan of DANS) {
    const problems = danProblems(dan);
    assert.ok(problems.length > 0, `${dan.label} に問題がある`);
    assert.ok(new Set(problems.map(p => p.key)).size === problems.length, `${dan.label} のキーが重複しない`);
    assert.ok(problems.every(p => Number.isInteger(p.answer) && p.answer > 0), `${dan.label} の答えが正の整数`);
}
check('全19段の問題がユニークで答えが正の整数', true);

{
    const p = danProblems(getDanById('dan-make10'));
    check('10をつくるは9問', p.length === 9);
    check('10をつくるは足して10になる', p.every(q => q.text.startsWith(`${10 - q.answer} ＋`)));
}

{
    // くり上がりが起きない組み合わせを混ぜてはいけない
    const add9 = danProblems(getDanById('dan-add9'));
    check('9をたすは8問（9+2〜9+9）', add9.length === 8);
    check('9をたすは全てくり上がりがある', add9.every(q => q.answer > 10));

    const add5 = danProblems(getDanById('dan-add5'));
    check('5をたすは4問（5+6〜5+9）', add5.length === 4);
    check('5をたすは全てくり上がりがある', add5.every(q => q.answer > 10));
}

{
    // くり下がりが起きない組み合わせを混ぜてはいけない
    const sub9 = danProblems(getDanById('dan-sub9'));
    check('9をひくは8問（11-9〜18-9）', sub9.length === 8);
    check('9をひくの答えは1〜9', sub9.every(q => q.answer >= 1 && q.answer <= 9));
    check('9をひくは全てくり下がりがある', sub9.every(q => Number(q.key.split('-')[0]) > 10));

    const sub5 = danProblems(getDanById('dan-sub5'));
    check('5をひくは4問（11-5〜14-5）', sub5.length === 4);
    check('5をひくは全てくり下がりがある', sub5.every(q => Number(q.key.split('-')[0]) > 10));
}

{
    const kuku7 = danProblems(getDanById('dan-kuku7'));
    check('7の段は9問', kuku7.length === 9);
    check('7の段の答えは7の倍数', kuku7.every(q => q.answer % 7 === 0));
}

console.log('--- 進捗 ---');

store.clear();
{
    const dan = getDanById('dan-add5');
    const problems = danProblems(dan);

    check('はじめは0問クリア', getDanStatus(dan.id).cleared === 0);
    check('はじめは皆伝していない', getDanStatus(dan.id).mastered === false);

    check('新しくクリアすると true', markDanProblemCleared(dan.id, problems[0].key) === true);
    check('同じ問題をもう一度正解しても false', markDanProblemCleared(dan.id, problems[0].key) === false);
    check('クリア数が増える', getDanStatus(dan.id).cleared === 1);
    check('他の段には影響しない', getDanStatus('dan-add6').cleared === 0);

    problems.slice(1).forEach(p => markDanProblemCleared(dan.id, p.key));
    check('全問クリアで皆伝', getDanStatus(dan.id).mastered === true);
    check('クリア数は総数を超えない', getDanStatus(dan.id).cleared === problems.length);
}

// 壊れたデータでも落ちない
{
    localStorage.setItem('keisanNinjaDanProgress', '{壊れたJSON');
    check('壊れた進捗でも0問扱いで落ちない', getDanStatus('dan-kuku2').cleared === 0);
    localStorage.setItem('keisanNinjaDanProgress', '["配列はダメ"]');
    check('配列が入っていても落ちない', getDanStatus('dan-kuku2').cleared === 0);
}

console.log('--- 皆伝の褒美 ---');

store.clear();
{
    check('何もしていなければ褒美なし', claimDanAwards().length === 0);

    const dan = getDanById('dan-sub5');
    danProblems(dan).forEach(p => markDanProblemCleared(dan.id, p.key));

    const first = claimDanAwards();
    check('皆伝した段の褒美が1件出る', first.length === 1 && first[0].id === 'dan_master_dan-sub5');
    check('段の褒美は星のみ（忍者は配らない）', first[0].grantNinja === false && first[0].stars === 30);
    check('同じ褒美は二度もらえない', claimDanAwards().length === 0);
}

// グループ制覇
store.clear();
{
    getDansByGroup('kuku').forEach(d => danProblems(d).forEach(p => markDanProblemCleared(d.id, p.key)));
    check('九九を全段皆伝するとグループ制覇', getGroupStatus('kuku').complete === true);
    check('小1はまだ制覇していない', getGroupStatus('grade1').complete === false);

    const awards = claimDanAwards();
    check('8段ぶん＋グループ制覇で9件', awards.length === 9);
    const groupAward = awards.find(a => a.id === 'dan_group_kuku');
    check('グループ制覇は忍者つき', groupAward && groupAward.grantNinja === true && groupAward.stars === 300);
    check('まとめて受け取った後は空', claimDanAwards().length === 0);
}

console.log('\nAll dan tests passed! ✅');
