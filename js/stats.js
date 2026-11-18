/**
 * プレイ記録
 *
 * 忍術を「きみは◯◯が得意」と言い切るための材料を貯める。
 * モードではなく計算の種類でまとめる。小1は入門たしざん、小3は '+' を
 * 遊ぶが、どちらも「たしざんが得意」として同じ忍術にたどり着いてほしいため。
 */

const STORAGE_KEY = 'keisanNinjaStats';
const MAX_DAYS = 60;

// 「パッと答えが出た」とみなす速さ。入門モードの制限は30秒なので、
// 3秒は小1でも「覚えている問題なら届く」線。
export const FAST_MS = 3000;

export const CATEGORY_LABELS = {
    add: 'たしざん',
    sub: 'ひきざん',
    mul: 'かけざん',
    div: 'わりざん',
    mixed: 'そうごう',
};

export function categoryOf(op) {
    if (op === 'dan-make10' || op.startsWith('dan-add')) return 'add';
    if (op.startsWith('dan-sub')) return 'sub';
    if (op.startsWith('dan-kuku')) return 'mul';
    if (op === 'intro-add' || op === 'intro-add-blank' || op === '+') return 'add';
    if (op === 'intro-sub' || op === 'intro-sub-blank' || op === '-') return 'sub';
    if (op === '×') return 'mul';
    if (op === '÷') return 'div';
    return 'mixed';
}

function emptyCat() {
    return { correct: 0, fast: 0, bestStreak: 0 };
}

export function emptyStats() {
    const byCat = {};
    Object.keys(CATEGORY_LABELS).forEach(c => { byCat[c] = emptyCat(); });
    return { byCat, totalCorrect: 0, bestStreak: 0, overcome: 0, days: [] };
}

export function getStats() {
    let saved = null;
    try {
        saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch {
        saved = null;
    }
    const stats = emptyStats();
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return stats;

    if (saved.byCat && typeof saved.byCat === 'object') {
        Object.keys(stats.byCat).forEach(c => {
            const s = saved.byCat[c];
            if (!s) return;
            stats.byCat[c] = {
                correct: Number(s.correct) || 0,
                fast: Number(s.fast) || 0,
                bestStreak: Number(s.bestStreak) || 0,
            };
        });
    }
    stats.totalCorrect = Number(saved.totalCorrect) || 0;
    stats.bestStreak = Number(saved.bestStreak) || 0;
    stats.overcome = Number(saved.overcome) || 0;
    stats.days = Array.isArray(saved.days) ? saved.days.filter(d => typeof d === 'string') : [];
    return stats;
}

function saveStats(stats) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

function update(fn) {
    const stats = getStats();
    fn(stats);
    saveStats(stats);
    return stats;
}

/**
 * 正解を1問ぶん記録する。streak は「いま何問連続で正解しているか」。
 */
export function recordCorrect(op, elapsedMs, streak = 1) {
    const cat = categoryOf(op);
    return update(stats => {
        const c = stats.byCat[cat];
        c.correct++;
        if (typeof elapsedMs === 'number' && elapsedMs <= FAST_MS) c.fast++;
        if (streak > c.bestStreak) c.bestStreak = streak;
        stats.totalCorrect++;
        if (streak > stats.bestStreak) stats.bestStreak = streak;
    });
}

/**
 * 一度まちがえた問題を、あとから正解できたときに記録する。
 * 「まちがいを できるようにした」ことを忍術にするための数字。
 */
export function recordOvercome() {
    return update(stats => { stats.overcome++; });
}

export function recordPlayDay(dateKey) {
    return update(stats => {
        if (stats.days.includes(dateKey)) return;
        stats.days.push(dateKey);
        stats.days.sort();
        if (stats.days.length > MAX_DAYS) stats.days = stats.days.slice(-MAX_DAYS);
    });
}

function addDays(dateKey, diff) {
    const [y, m, d] = dateKey.split('-').map(Number);
    const dt = new Date(y, m - 1, d + diff);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

/**
 * 連続しゅぎょう日数。きょうまだ遊んでいなければ、きのうまでの連続を返す。
 * 「きょう開いた瞬間に記録が途切れて見える」のを避ける。
 */
export function consecutiveDays(todayKey, days = getStats().days) {
    const set = new Set(days);
    let cursor = set.has(todayKey) ? todayKey : addDays(todayKey, -1);
    let count = 0;
    while (set.has(cursor)) {
        count++;
        cursor = addDays(cursor, -1);
    }
    return count;
}
