/**
 * 忍者報酬・ガチャシステムデータモジュール
 * Collectible items catalog, gacha pull mechanics, duplicate bonus, and storage helpers.
 */

export const REWARD_ITEMS = [
    // --- 1-Star: ノーマル (Common) 60% 出現率 ---
    {
        id: 'trainee_ninja',
        name: '見習い忍者',
        emoji: '🌱',
        rarity: 1,
        rarityLabel: 'ノーマル',
        tagline: 'はじめの一歩！元気いっぱいの修行中忍者。',
        badgeColor: '#2ecc71',
    },
    {
        id: 'leaf_ninja',
        name: '木の葉隠れの術士',
        emoji: '🍃',
        rarity: 1,
        rarityLabel: 'ノーマル',
        tagline: '木の葉に隠れて計算のチャンスを狙う！',
        badgeColor: '#27ae60',
    },
    {
        id: 'tanuki_ninja',
        name: '豆だぬき忍者',
        emoji: '🦝',
        rarity: 1,
        rarityLabel: 'ノーマル',
        tagline: '頭の葉っぱで数字を化かす愛されキャラ。',
        badgeColor: '#8d6e63',
    },
    {
        id: 'shuriken_kid',
        name: '手裏剣小僧',
        emoji: '⭐',
        rarity: 1,
        rarityLabel: 'ノーマル',
        tagline: '正確無比な星型の手裏剣をビシッと投げる！',
        badgeColor: '#f39c12',
    },
    {
        id: 'onigiri_ninja',
        name: 'おにぎり忍者',
        emoji: '🍙',
        rarity: 1,
        rarityLabel: 'ノーマル',
        tagline: 'お弁当を食べて計算パワー全開！',
        badgeColor: '#7f8c8d',
    },

    // --- 2-Star: レア (Rare) 30% 出現率 ---
    {
        id: 'flame_ninja',
        name: '火遁の熱血忍者',
        emoji: '🔥',
        rarity: 2,
        rarityLabel: 'レア',
        tagline: '熱き計算魂！素早い計算で火の玉を放つ。',
        badgeColor: '#e74c3c',
    },
    {
        id: 'frog_ninja',
        name: '水遁のガマ丸',
        emoji: '🐸',
        rarity: 2,
        rarityLabel: 'レア',
        tagline: '大ジャンプ！どんな難問もひらりと交わす。',
        badgeColor: '#2ecc71',
    },
    {
        id: 'kunoichi_cherry',
        name: '桜のくのいち',
        emoji: '🌸',
        rarity: 2,
        rarityLabel: 'レア',
        tagline: '華麗に舞い踊り、数字をパッと咲かせる。',
        badgeColor: '#e91e8c',
    },
    {
        id: 'falcon_ninja',
        name: '疾風のハヤブサ',
        emoji: '🦅',
        rarity: 2,
        rarityLabel: 'レア',
        tagline: '大空から俯瞰して一瞬で答えを見抜く！',
        badgeColor: '#3498db',
    },
    {
        id: 'mecha_ninja',
        name: 'からくり忍者ギア',
        emoji: '🤖',
        rarity: 2,
        rarityLabel: 'レア',
        tagline: '超高速歯車でどんな難題もミリ秒で計算。',
        badgeColor: '#9b59b6',
    },

    // --- 3-Star: 超激レア (Super Rare / Legend) 10% 出現率 ---
    {
        id: 'thunder_kagemaru',
        name: '雷神 影丸',
        emoji: '⚡',
        rarity: 3,
        rarityLabel: '超激レア',
        tagline: '稲妻よりも素早い神速の計算神！',
        badgeColor: '#f1c40f',
    },
    {
        id: 'shadow_panther',
        name: '闇夜の黒豹',
        emoji: '🐆',
        rarity: 3,
        rarityLabel: '超激レア',
        tagline: '夜陰に溶け込み、音もなく正解を射止める。',
        badgeColor: '#34495e',
    },
    {
        id: 'golden_shogun',
        name: '黄金の将軍丸',
        emoji: '👑',
        rarity: 3,
        rarityLabel: '超激レア',
        tagline: '輝く甲冑をまとった無敗の計算覇者。',
        badgeColor: '#e67e22',
    },
    {
        id: 'mystic_tiger',
        name: '白虎 幻影丸',
        emoji: '🐯',
        rarity: 3,
        rarityLabel: '超激レア',
        tagline: '伝説の聖獣の加護を受けし幻の忍者。',
        badgeColor: '#1abc9c',
    },
    {
        id: 'cosmic_ninja',
        name: '銀河コズミック忍者',
        emoji: '🚀',
        rarity: 3,
        rarityLabel: '超激レア',
        tagline: '星々の彼方から飛来した未来の算術マスター。',
        badgeColor: '#9b59b6',
    },
];

export const GACHA_PRICES = {
    SINGLE: 10,
    TEN: 90, // 10連は10%割引
};

export const DUPLICATE_REFUNDS = {
    1: 3,   // 1★ダブり: 3星お返し
    2: 5,   // 2★ダブり: 5星お返し
    3: 10,  // 3★ダブり: 10星お返し (全額キャッシュバック)
};

const STORAGE_KEYS = {
    OWNED: 'keisanNinjaOwnedItems',
    EQUIPPED: 'keisanNinjaEquippedItem',
};

/**
 * 初期所有アイテム（見習い忍者は最初から所持）
 */
export function getOwnedItemIds() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.OWNED);
        if (stored) {
            const list = JSON.parse(stored);
            if (Array.isArray(list) && list.length > 0) {
                return list;
            }
        }
    } catch {
        // ignore JSON error
    }
    const initial = ['trainee_ninja'];
    saveOwnedItemIds(initial);
    return initial;
}

export function saveOwnedItemIds(ids) {
    localStorage.setItem(STORAGE_KEYS.OWNED, JSON.stringify(ids));
}

export function getEquippedItemId() {
    const stored = localStorage.getItem(STORAGE_KEYS.EQUIPPED);
    const owned = getOwnedItemIds();
    if (stored && owned.includes(stored)) {
        return stored;
    }
    const fallback = owned[0] || 'trainee_ninja';
    localStorage.setItem(STORAGE_KEYS.EQUIPPED, fallback);
    return fallback;
}

export function setEquippedItemId(id) {
    const owned = getOwnedItemIds();
    if (owned.includes(id)) {
        localStorage.setItem(STORAGE_KEYS.EQUIPPED, id);
        return true;
    }
    return false;
}

export function getItemById(id) {
    return REWARD_ITEMS.find(item => item.id === id) || REWARD_ITEMS[0];
}

/**
 * ガチャ抽選ロジック（重み付き確率）
 * ★1: 60%, ★2: 30%, ★3: 10%
 */
export function pullSingleGacha() {
    const roll = Math.random() * 100;
    let targetRarity = 1;
    if (roll < 10) {
        targetRarity = 3;
    } else if (roll < 40) {
        targetRarity = 2;
    } else {
        targetRarity = 1;
    }

    const pool = REWARD_ITEMS.filter(item => item.rarity === targetRarity);
    const item = pool[Math.floor(Math.random() * pool.length)];

    const owned = getOwnedItemIds();
    const isNew = !owned.includes(item.id);
    let refundStars = 0;

    if (isNew) {
        owned.push(item.id);
        saveOwnedItemIds(owned);
    } else {
        refundStars = DUPLICATE_REFUNDS[item.rarity] || 2;
    }

    return {
        item,
        isNew,
        refundStars,
    };
}

/**
 * 複数回ガチャを引く
 */
export function pullMultipleGacha(count) {
    const results = [];
    let totalRefund = 0;
    for (let i = 0; i < count; i++) {
        const res = pullSingleGacha();
        totalRefund += res.refundStars;
        results.push(res);
    }
    return {
        results,
        totalRefund,
    };
}
