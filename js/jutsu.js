/**
 * 忍術
 *
 * 集めるコレクション。ねらいは記録の表示ではなく「自信を持ってもらうこと」。
 * そのため1つの忍術は必ず3点セットで持つ:
 *   name    … かっこいい技名
 *   praise  … 「きみは◯◯が得意」という言い切り（これが主役）
 *   condition … 何をしたから覚えたのか（技名と得意分野を結びつける）
 *
 * 苦手・できていないことは一切出さない。覚えていない忍術も「？」ではなく
 * 「どうすれば覚えられるか」として見せる。
 */

import { getStats, consecutiveDays } from './stats.js';
import { DANS, getDanStatus, getGroupStatus } from './dans.js';

const STORAGE_KEY = 'keisanNinjaJutsu';

export const JUTSU_GROUPS = [
    { id: 'speed', label: 'はやさの術', desc: 'こたえが パッと 出てくる' },
    { id: 'focus', label: 'ねばりの術', desc: 'さいごまで 手が ゆるまない' },
    { id: 'keisan', label: 'けいさんの術', desc: 'この計算は まかせろ' },
    { id: 'tsumi', label: 'つみかさねの術', desc: 'れんしゅうの あと' },
    { id: 'kokoro', label: 'こころの術', desc: 'つづける ちから' },
];

const allDansMastered = kind =>
    DANS.filter(d => d.kind === kind).every(d => getDanStatus(d.id).mastered);

export const JUTSU_LIST = [
    // --- はやさの術 ---
    {
        id: 'shippu', group: 'speed', name: '疾風の術', emoji: '⚡', color: '#f39c12',
        praise: 'きみは たしざんの こたえが パッと 出てくる！',
        condition: 'たしざんを 3びょう いないに 30もん せいかい',
        check: c => c.cat('add').fast >= 30,
        progress: c => [c.cat('add').fast, 30],
    },
    {
        id: 'senko', group: 'speed', name: '閃光の術', emoji: '✨', color: '#3498db',
        praise: 'きみは ひきざんを 見た しゅんかんに こたえが 分かる！',
        condition: 'ひきざんを 3びょう いないに 30もん せいかい',
        check: c => c.cat('sub').fast >= 30,
        progress: c => [c.cat('sub').fast, 30],
    },
    {
        id: 'shinsoku', group: 'speed', name: '神速の術', emoji: '💨', color: '#e67e22',
        praise: 'きみは かけざんが 口から すぐ 出てくる！',
        condition: 'かけざんを 3びょう いないに 30もん せいかい',
        check: c => c.cat('mul').fast >= 30,
        progress: c => [c.cat('mul').fast, 30],
    },
    {
        id: 'shunei', group: 'speed', name: '瞬影の術', emoji: '🌑', color: '#8e44ad',
        praise: 'きみは わりざんを 一しゅんで 見ぬける！',
        condition: 'わりざんを 3びょう いないに 30もん せいかい',
        check: c => c.cat('div').fast >= 30,
        progress: c => [c.cat('div').fast, 30],
    },

    // --- ねばりの術 ---
    {
        id: 'fudoshin', group: 'focus', name: '不動心の術', emoji: '🧘', color: '#16a085',
        praise: 'きみは しゅうちゅうが きれない！',
        condition: '10もん れんぞくで せいかい',
        check: c => c.bestStreak >= 10,
        progress: c => [c.bestStreak, 10],
    },
    {
        id: 'issen', group: 'focus', name: '一閃の術', emoji: '🗡️', color: '#c0392b',
        praise: 'きみは さいごまで 手が ゆるまない！',
        condition: '20もん れんぞくで せいかい',
        check: c => c.bestStreak >= 20,
        progress: c => [c.bestStreak, 20],
    },

    // --- けいさんの術（だんべつ修行から） ---
    {
        id: 'too', group: 'keisan', name: '十の術', emoji: '🌰', color: '#a0522d',
        praise: 'きみは 10の まとまりが 目に 見えている！',
        condition: 'だんべつ修行「10をつくる」を 免許皆伝',
        check: () => getDanStatus('dan-make10').mastered,
    },
    {
        id: 'katon', group: 'keisan', name: '火遁の術', emoji: '🔥', color: '#e74c3c',
        praise: 'きみは くり上がりの たしざんが とくい！',
        condition: '「9をたす」〜「5をたす」を ぜんぶ 免許皆伝',
        check: () => allDansMastered('add'),
        progress: () => [DANS.filter(d => d.kind === 'add' && getDanStatus(d.id).mastered).length, 5],
    },
    {
        id: 'suiton', group: 'keisan', name: '水遁の術', emoji: '💧', color: '#2980b9',
        praise: 'きみは くり下がりの ひきざんが とくい！',
        condition: '「9をひく」〜「5をひく」を ぜんぶ 免許皆伝',
        check: () => allDansMastered('sub'),
        progress: () => [DANS.filter(d => d.kind === 'sub' && getDanStatus(d.id).mastered).length, 5],
    },
    {
        id: 'daichi', group: 'keisan', name: '大地の術', emoji: '🏔️', color: '#d35400',
        praise: 'きみは 小1の けいさんを ぜんぶ せいはした！',
        condition: 'だんべつ修行「小1の修行」を 全段 免許皆伝',
        check: () => getGroupStatus('grade1').complete,
        progress: () => [getGroupStatus('grade1').mastered, getGroupStatus('grade1').total],
    },
    {
        id: 'shichisei', group: 'keisan', name: '七星の術', emoji: '✴️', color: '#c0392b',
        praise: 'きみは いちばん むずかしいと言われる 7の段を せいあつした！',
        condition: 'だんべつ修行「7の段」を 免許皆伝',
        check: () => getDanStatus('dan-kuku7').mastered,
    },
    {
        id: 'hachimon', group: 'keisan', name: '八門の術', emoji: '🎴', color: '#2c3e50',
        praise: 'きみは 8の段を かんぺきに おぼえた！',
        condition: 'だんべつ修行「8の段」を 免許皆伝',
        check: () => getDanStatus('dan-kuku8').mastered,
    },
    {
        id: 'kuyo', group: 'keisan', name: '九曜の術', emoji: '☀️', color: '#d63031',
        praise: 'きみは 9の段を かんぺきに おぼえた！',
        condition: 'だんべつ修行「9の段」を 免許皆伝',
        check: () => getDanStatus('dan-kuku9').mastered,
    },
    {
        id: 'kuku_ougi', group: 'keisan', name: '九九奥義', emoji: '🎖️', color: '#f39c12',
        praise: 'きみは 九九が ぜんぶ 入っている。もう どこからでも 出てくる！',
        condition: 'だんべつ修行「九九の修行」を 全段 免許皆伝',
        check: () => getGroupStatus('kuku').complete,
        progress: () => [getGroupStatus('kuku').mastered, getGroupStatus('kuku').total],
    },

    // --- つみかさねの術 ---
    {
        id: 'hyakuren', group: 'tsumi', name: '百錬の術', emoji: '💯', color: '#27ae60',
        praise: 'きみは 100もん せいかいした。れんしゅうの あとが ちゃんと のこっている！',
        condition: 'ぜんぶで 100もん せいかい',
        check: c => c.totalCorrect >= 100,
        progress: c => [c.totalCorrect, 100],
    },
    {
        id: 'senren', group: 'tsumi', name: '千錬の術', emoji: '🏆', color: '#f39c12',
        praise: 'きみは 1000もん せいかいした。これは ほんものの しゅぎょうだ！',
        condition: 'ぜんぶで 1000もん せいかい',
        check: c => c.totalCorrect >= 1000,
        progress: c => [c.totalCorrect, 1000],
    },

    // --- こころの術 ---
    {
        id: 'fukutsu', group: 'kokoro', name: '不屈の術', emoji: '💪', color: '#e74c3c',
        praise: 'きみは まちがえた もんだいを できるように した。これが いちばん すごい！',
        condition: 'まえに まちがえた もんだいを 20もん せいかい',
        check: c => c.overcome >= 20,
        progress: c => [c.overcome, 20],
    },
    {
        id: 'nissan', group: 'kokoro', name: '日参の術', emoji: '📅', color: '#3498db',
        praise: 'きみは 3日 つづけて しゅぎょうした！',
        condition: '3日 つづけて しゅぎょう',
        check: c => c.days >= 3,
        progress: c => [c.days, 3],
    },
    {
        id: 'kaikin', group: 'kokoro', name: '皆勤の術', emoji: '🗓️', color: '#9b59b6',
        praise: 'きみは 7日 つづけて しゅぎょうした！',
        condition: '7日 つづけて しゅぎょう',
        check: c => c.days >= 7,
        progress: c => [c.days, 7],
    },
];

export function getJutsuById(id) {
    return JUTSU_LIST.find(j => j.id === id) || null;
}

export function getJutsuByGroup(groupId) {
    return JUTSU_LIST.filter(j => j.group === groupId);
}

export function getLearnedJutsuIds() {
    try {
        const list = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(list) ? list.filter(id => typeof id === 'string') : [];
    } catch {
        return [];
    }
}

function saveLearnedJutsuIds(ids) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function buildJutsuContext(todayKey) {
    const stats = getStats();
    return {
        cat: name => stats.byCat[name],
        totalCorrect: stats.totalCorrect,
        bestStreak: stats.bestStreak,
        overcome: stats.overcome,
        days: consecutiveDays(todayKey, stats.days),
    };
}

/**
 * 条件を満たした忍術の、いまの進み具合。[いま, 目標] を返す。
 * 条件が「できたか / まだか」だけの忍術は null。
 */
export function jutsuProgress(jutsu, ctx) {
    if (!jutsu.progress) return null;
    const [now, goal] = jutsu.progress(ctx);
    return { now: Math.min(now, goal), goal };
}

export function isJutsuLearned(id, learned = getLearnedJutsuIds()) {
    return learned.includes(id);
}

/**
 * まだ覚えていない忍術のうち、条件を満たしたものを覚える。
 * 覚えた忍術は二度と消えない（一度できたことは、取り消さない）。
 */
export function claimNewJutsu(todayKey) {
    const learned = getLearnedJutsuIds();
    const ctx = buildJutsuContext(todayKey);
    const fresh = [];

    for (const jutsu of JUTSU_LIST) {
        if (learned.includes(jutsu.id)) continue;
        if (!jutsu.check(ctx)) continue;
        learned.push(jutsu.id);
        fresh.push(jutsu);
    }

    if (fresh.length > 0) saveLearnedJutsuIds(learned);
    return fresh;
}
