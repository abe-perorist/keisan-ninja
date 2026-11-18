/**
 * だんべつ修行（段別モード）
 *
 * 九九の「◯の段」と同じ構造を小1にも用意する。小1の山場はくり上がり・
 * くり下がりなので、そこを「たす数・ひく数」で段に割る。
 * 段ごとの問題は有限（4〜9問）で、全問を一度ずつ正解すると免許皆伝。
 * 一度クリアした問題は取り消さない（まちがえても後退しない）。
 */

const STORAGE_KEYS = {
    PROGRESS: 'keisanNinjaDanProgress',
    AWARDS: 'keisanNinjaDanAwards',
};

export const DAN_GROUPS = [
    {
        id: 'grade1',
        label: '小1の修行',
        desc: 'くり上がり・くり下がり',
        clearStars: 30,
        groupStars: 200,
        groupTitle: '十の術 皆伝',
    },
    {
        id: 'kuku',
        label: '九九の修行',
        desc: '2の段 〜 9の段',
        clearStars: 40,
        groupStars: 300,
        groupTitle: '九九 皆伝',
    },
];

export const DANS = [
    { id: 'dan-make10', group: 'grade1', label: '10をつくる', emoji: '🌰', color: '#a0522d', kind: 'make10' },
    { id: 'dan-add9', group: 'grade1', label: '9をたす', emoji: '🔥', color: '#e74c3c', kind: 'add', n: 9 },
    { id: 'dan-add8', group: 'grade1', label: '8をたす', emoji: '🔥', color: '#e67e22', kind: 'add', n: 8 },
    { id: 'dan-add7', group: 'grade1', label: '7をたす', emoji: '🔥', color: '#d35400', kind: 'add', n: 7 },
    { id: 'dan-add6', group: 'grade1', label: '6をたす', emoji: '🔥', color: '#c0392b', kind: 'add', n: 6 },
    { id: 'dan-add5', group: 'grade1', label: '5をたす', emoji: '🔥', color: '#f39c12', kind: 'add', n: 5 },
    { id: 'dan-sub9', group: 'grade1', label: '9をひく', emoji: '💧', color: '#2980b9', kind: 'sub', n: 9 },
    { id: 'dan-sub8', group: 'grade1', label: '8をひく', emoji: '💧', color: '#3498db', kind: 'sub', n: 8 },
    { id: 'dan-sub7', group: 'grade1', label: '7をひく', emoji: '💧', color: '#00a8cc', kind: 'sub', n: 7 },
    { id: 'dan-sub6', group: 'grade1', label: '6をひく', emoji: '💧', color: '#00b894', kind: 'sub', n: 6 },
    { id: 'dan-sub5', group: 'grade1', label: '5をひく', emoji: '💧', color: '#16a085', kind: 'sub', n: 5 },
    { id: 'dan-kuku2', group: 'kuku', label: '2の段', emoji: '✴️', color: '#27ae60', kind: 'kuku', n: 2 },
    { id: 'dan-kuku3', group: 'kuku', label: '3の段', emoji: '✴️', color: '#2980b9', kind: 'kuku', n: 3 },
    { id: 'dan-kuku4', group: 'kuku', label: '4の段', emoji: '✴️', color: '#8e44ad', kind: 'kuku', n: 4 },
    { id: 'dan-kuku5', group: 'kuku', label: '5の段', emoji: '✴️', color: '#e67e22', kind: 'kuku', n: 5 },
    { id: 'dan-kuku6', group: 'kuku', label: '6の段', emoji: '✴️', color: '#16a085', kind: 'kuku', n: 6 },
    { id: 'dan-kuku7', group: 'kuku', label: '7の段', emoji: '✴️', color: '#c0392b', kind: 'kuku', n: 7 },
    { id: 'dan-kuku8', group: 'kuku', label: '8の段', emoji: '✴️', color: '#2c3e50', kind: 'kuku', n: 8 },
    { id: 'dan-kuku9', group: 'kuku', label: '9の段', emoji: '✴️', color: '#d63031', kind: 'kuku', n: 9 },
];

export function isDanOp(op) {
    return typeof op === 'string' && op.startsWith('dan-');
}

export function getDanById(id) {
    return DANS.find(d => d.id === id) || null;
}

export function getDansByGroup(groupId) {
    return DANS.filter(d => d.group === groupId);
}

/**
 * その段の問題をすべて返す。段の問題は有限なので、毎回この全問を出す。
 * key は進捗の保存キー。text を変えても進捗が壊れないように別に持つ。
 */
export function danProblems(dan) {
    const list = [];

    if (dan.kind === 'make10') {
        // 10の補数。たしざんの土台なので、答えを問う形に固定する。
        for (let a = 1; a <= 9; a++) {
            list.push({ key: `m${a}`, text: `${a} ＋ ？ ＝ 10`, answer: 10 - a });
        }
        return list;
    }

    if (dan.kind === 'add') {
        // くり上がりが起きる組み合わせだけ。b は 11-n 以上。
        for (let b = Math.max(1, 11 - dan.n); b <= 9; b++) {
            list.push({ key: `${dan.n}+${b}`, text: `${dan.n} ＋ ${b} ＝ ？`, answer: dan.n + b });
        }
        return list;
    }

    if (dan.kind === 'sub') {
        // くり下がりが起きる組み合わせだけ。被減数は 11 以上、答えは 1〜9。
        for (let a = 11; a <= dan.n + 9; a++) {
            list.push({ key: `${a}-${dan.n}`, text: `${a} ー ${dan.n} ＝ ？`, answer: a - dan.n });
        }
        return list;
    }

    for (let b = 1; b <= 9; b++) {
        list.push({ key: `${dan.n}x${b}`, text: `${dan.n} × ${b} ＝ ？`, answer: dan.n * b });
    }
    return list;
}

export function danProblemCount(dan) {
    return danProblems(dan).length;
}

// ===== 進捗 =====

export function getDanProgress() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
        const data = raw ? JSON.parse(raw) : null;
        return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
    } catch {
        return {};
    }
}

export function saveDanProgress(progress) {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
}

export function getClearedKeys(danId) {
    const keys = getDanProgress()[danId];
    return Array.isArray(keys) ? keys : [];
}

/**
 * 正解した問題を記録する。新しくクリアできたときだけ true。
 */
export function markDanProblemCleared(danId, key) {
    const progress = getDanProgress();
    const keys = Array.isArray(progress[danId]) ? progress[danId] : [];
    if (keys.includes(key)) return false;
    keys.push(key);
    progress[danId] = keys;
    saveDanProgress(progress);
    return true;
}

export function getDanStatus(danId) {
    const dan = getDanById(danId);
    if (!dan) return { cleared: 0, total: 0, mastered: false };
    const problems = danProblems(dan);
    const keys = new Set(getClearedKeys(danId));
    const cleared = problems.filter(p => keys.has(p.key)).length;
    return { cleared, total: problems.length, mastered: cleared === problems.length };
}

export function isDanMastered(danId) {
    return getDanStatus(danId).mastered;
}

export function getGroupStatus(groupId) {
    const dans = getDansByGroup(groupId);
    const mastered = dans.filter(d => isDanMastered(d.id)).length;
    return { mastered, total: dans.length, complete: mastered === dans.length };
}

// ===== 皆伝の褒美 =====

export function getClaimedDanAwardIds() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.AWARDS);
        const list = raw ? JSON.parse(raw) : null;
        return Array.isArray(list) ? list : [];
    } catch {
        return [];
    }
}

function saveClaimedDanAwardIds(ids) {
    localStorage.setItem(STORAGE_KEYS.AWARDS, JSON.stringify(ids));
}

/**
 * まだ受け取っていない皆伝の褒美をまとめて確定する。
 * 段の皆伝は星のみ、グループ制覇は星と忍者1体（忍者を配るのは呼び出し側）。
 */
export function claimDanAwards() {
    const claimed = getClaimedDanAwardIds();
    const earned = [];

    for (const dan of DANS) {
        const awardId = `dan_master_${dan.id}`;
        if (claimed.includes(awardId)) continue;
        if (!isDanMastered(dan.id)) continue;
        const group = DAN_GROUPS.find(g => g.id === dan.group);
        earned.push({
            id: awardId,
            title: `${dan.label} 免許皆伝`,
            emoji: dan.emoji,
            stars: group.clearStars,
            grantNinja: false,
        });
        claimed.push(awardId);
    }

    for (const group of DAN_GROUPS) {
        const awardId = `dan_group_${group.id}`;
        if (claimed.includes(awardId)) continue;
        if (!getGroupStatus(group.id).complete) continue;
        earned.push({
            id: awardId,
            title: group.groupTitle,
            emoji: '🎖️',
            stars: group.groupStars,
            grantNinja: true,
        });
        claimed.push(awardId);
    }

    if (earned.length > 0) saveClaimedDanAwardIds(claimed);
    return earned;
}
