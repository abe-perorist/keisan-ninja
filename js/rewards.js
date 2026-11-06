/**
 * 忍者報酬・ガチャシステムデータモジュール
 * Collectible items catalog, gacha pull mechanics, duplicate bonus, and storage helpers.
 */

export const REWARD_ITEMS = [
    // --- 1-Star: ノーマル (Common) 50% 出現率 ---
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
    {
        id: 'cat_ninja',
        name: '子猫の忍び',
        emoji: '🐱',
        rarity: 1,
        rarityLabel: 'ノーマル',
        tagline: '足音を立てずにすばやく暗算するにゃんこ！',
        badgeColor: '#e67e22',
    },
    {
        id: 'bamboo_ninja',
        name: '竹林の若葉丸',
        emoji: '🎋',
        rarity: 1,
        rarityLabel: 'ノーマル',
        tagline: 'まっすぐすくすく伸びる計算力！',
        badgeColor: '#16a085',
    },
    {
        id: 'dango_ninja',
        name: 'みたらし団子丸',
        emoji: '🍡',
        rarity: 1,
        rarityLabel: 'ノーマル',
        tagline: '3つまとめて串刺しにするように一気に解く！',
        badgeColor: '#d35400',
    },
    {
        id: 'bell_ninja',
        name: '小鈴の忍',
        emoji: '🔔',
        rarity: 1,
        rarityLabel: 'ノーマル',
        tagline: '正解の合図をチリンと涼やかに鳴らす。',
        badgeColor: '#f1c40f',
    },
    {
        id: 'water_drop_ninja',
        name: '雫のしずく丸',
        emoji: '💧',
        rarity: 1,
        rarityLabel: 'ノーマル',
        tagline: '一滴のしずくのように静かに計算に集中する。',
        badgeColor: '#3498db',
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
    {
        id: 'wind_ninja',
        name: '疾風のかまいたち',
        emoji: '🌪️',
        rarity: 2,
        rarityLabel: 'レア',
        tagline: '見えぬ速さの風刃で素早く解を切り拓く！',
        badgeColor: '#00cec9',
    },
    {
        id: 'shadow_wolf_ninja',
        name: '夜霧の銀狼',
        emoji: '🐺',
        rarity: 2,
        rarityLabel: 'レア',
        tagline: '鋭い嗅覚で問題の急所を一気にかぎつける！',
        badgeColor: '#636e72',
    },
    {
        id: 'abacus_ninja',
        name: '算盤の達人 ソロ丸',
        emoji: '🧮',
        rarity: 2,
        rarityLabel: 'レア',
        tagline: '目にも留まらぬ珠算さばきで弾き出す！',
        badgeColor: '#e17055',
    },
    {
        id: 'scroll_ninja',
        name: '秘伝の巻物使い',
        emoji: '📜',
        rarity: 2,
        rarityLabel: 'レア',
        tagline: '古の忍術書から計算の秘法を読み解く！',
        badgeColor: '#fdcb6e',
    },
    {
        id: 'lightning_fox_ninja',
        name: '電光の稲荷狐',
        emoji: '🦊',
        rarity: 2,
        rarityLabel: 'レア',
        tagline: '電光石火の身のこなしで難問を化かす！',
        badgeColor: '#fd79a8',
    },

    // --- 3-Star: 激レア (Super Rare) 14% 出現率 ---
    {
        id: 'thunder_kagemaru',
        name: '雷神 影丸',
        emoji: '⚡',
        rarity: 3,
        rarityLabel: '激レア',
        tagline: '稲妻よりも素早い神速の計算神！',
        badgeColor: '#f1c40f',
    },
    {
        id: 'shadow_panther',
        name: '闇夜の黒豹',
        emoji: '🐆',
        rarity: 3,
        rarityLabel: '激レア',
        tagline: '夜陰に溶け込み、音もなく正解を射止める。',
        badgeColor: '#34495e',
    },
    {
        id: 'golden_shogun',
        name: '黄金の将軍丸',
        emoji: '👑',
        rarity: 3,
        rarityLabel: '激レア',
        tagline: '輝く甲冑をまとった無敗の計算覇者。',
        badgeColor: '#e67e22',
    },
    {
        id: 'mystic_tiger',
        name: '白虎 幻影丸',
        emoji: '🐯',
        rarity: 3,
        rarityLabel: '激レア',
        tagline: '伝説の聖獣の加護を受けし幻の忍者。',
        badgeColor: '#1abc9c',
    },
    {
        id: 'cosmic_ninja',
        name: '銀河コズミック忍者',
        emoji: '🚀',
        rarity: 3,
        rarityLabel: '激レア',
        tagline: '星々の彼方から飛来した未来の算術マスター。',
        badgeColor: '#9b59b6',
    },
    {
        id: 'frost_ninja',
        name: '氷雪の吹雪丸',
        emoji: '❄️',
        rarity: 3,
        rarityLabel: '激レア',
        tagline: '絶対零度の冷静さでどんな難問も凍結解決！',
        badgeColor: '#74b9ff',
    },
    {
        id: 'magma_ninja',
        name: '灼熱のマグマ丸',
        emoji: '🌋',
        rarity: 3,
        rarityLabel: '激レア',
        tagline: '滾る計算マグマがすべての壁を溶かし尽くす！',
        badgeColor: '#d63031',
    },
    {
        id: 'mirror_ninja',
        name: '八咫鏡の幻術師',
        emoji: '🪞',
        rarity: 3,
        rarityLabel: '激レア',
        tagline: '万物の真実を映し出し、瞬時に等式を解く！',
        badgeColor: '#a29bfe',
    },
    {
        id: 'gem_ninja',
        name: '金剛石のダイヤ丸',
        emoji: '💎',
        rarity: 3,
        rarityLabel: '激レア',
        tagline: 'ダイヤモンドのごとき堅牢な論理と輝き！',
        badgeColor: '#00b894',
    },
    {
        id: 'owl_sage_ninja',
        name: '白梟の賢者丸',
        emoji: '🦉',
        rarity: 3,
        rarityLabel: '激レア',
        tagline: '森羅万象を見通す知恵の翼で正解を導く！',
        badgeColor: '#6c5ce7',
    },

    // --- 4-Star: 超絶レジェンド (Legendary) 5% 出現率 ---
    {
        id: 'phoenix_ninja',
        name: '不死鳥 鳳凰丸',
        emoji: '🪶',
        rarity: 4,
        rarityLabel: '超絶レジェンド',
        tagline: '何度間違えても不滅の闘志で甦る伝説の火の鳥！',
        badgeColor: '#ff4757',
    },
    {
        id: 'susanoo_ninja',
        name: '嵐神 スサノオ丸',
        emoji: '🌪️',
        rarity: 4,
        rarityLabel: '超絶レジェンド',
        tagline: '大暴風を巻き起こし、難問の壁を吹き飛ばす！',
        badgeColor: '#2ed573',
    },
    {
        id: 'dragon_ninja',
        name: '蒼龍 昇竜丸',
        emoji: '🐉',
        rarity: 4,
        rarityLabel: '超絶レジェンド',
        tagline: '天へと駆け登る龍の如く、計算力を急上昇させる！',
        badgeColor: '#1e90ff',
    },
    {
        id: 'enma_ninja',
        name: '冥界閻魔 忍王',
        emoji: '👹',
        rarity: 4,
        rarityLabel: '超絶レジェンド',
        tagline: '善悪ならぬ「正解」を見通す百戦錬磨の忍王！',
        badgeColor: '#8b0000',
    },
    {
        id: 'genbu_ninja',
        name: '玄武 重甲王',
        emoji: '🐢',
        rarity: 4,
        rarityLabel: '超絶レジェンド',
        tagline: '鉄壁の守りでどんなケアレスミスも許さない大聖獣！',
        badgeColor: '#0984e3',
    },
    {
        id: 'kirin_ninja',
        name: '天帝 幻獣麒麟',
        emoji: '🦄',
        rarity: 4,
        rarityLabel: '超絶レジェンド',
        tagline: '雲海を駆け巡り、神聖な光で答えを祝福する霊獣！',
        badgeColor: '#ffeaa7',
    },
    {
        id: 'fujin_ninja',
        name: '疾風迅雷 風神丸',
        emoji: '🍃',
        rarity: 4,
        rarityLabel: '超絶レジェンド',
        tagline: '大空を支配する神風で、百の問いを一陣で吹き飛ばす！',
        badgeColor: '#00b894',
    },
    {
        id: 'raijin_ninja',
        name: '轟雷烈火 雷神丸',
        emoji: '⚡',
        rarity: 4,
        rarityLabel: '超絶レジェンド',
        tagline: '太鼓を打ち鳴らし、轟く雷撃で難題を粉砕する！',
        badgeColor: '#e17055',
    },

    // --- 5-Star: 神話ゴッド (Mythic / God) 1% 出現率 ---
    {
        id: 'amaterasu_ninja',
        name: '太陽神 アマテラス',
        emoji: '☀️',
        rarity: 5,
        rarityLabel: '神話ゴッド',
        tagline: 'すべての数字を光で照らし、真理を暴き出す最高神。',
        badgeColor: '#ffa502',
    },
    {
        id: 'creator_zero',
        name: '原初の創造神 ゼロ',
        emoji: '🌌',
        rarity: 5,
        rarityLabel: '神話ゴッド',
        tagline: 'すべての数の始まりにして終わり。全宇宙の計算を司る。',
        badgeColor: '#70a1ff',
    },
    {
        id: 'infinity_god',
        name: '無窮の極限神 インフィニティ',
        emoji: '♾️',
        rarity: 5,
        rarityLabel: '神話ゴッド',
        tagline: '無限の彼方を見通し、あらゆる数式を超越する究極神。',
        badgeColor: '#a55eea',
    },
    {
        id: 'chronos_god',
        name: '時空の支配神 クロノス丸',
        emoji: '⏳',
        rarity: 5,
        rarityLabel: '神話ゴッド',
        tagline: '時間を操り、一瞬の間に無限の計算を完了させる時空神。',
        badgeColor: '#ff7675',
    },
];

export const GACHA_PRICES = {
    SINGLE: 10,
    TEN: 90, // 10連は10%割引
};

export const DUPLICATE_REFUNDS = {
    1: 3,   // 1★ダブり: 3星お返し
    2: 5,   // 2★ダブり: 5星お返し
    3: 10,  // 3★ダブり: 10星お返し
    4: 20,  // 4★ダブり: 20星お返し
    5: 50,  // 5★ダブり: 50星お返し
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
 * ★5 (神話ゴッド): 1%
 * ★4 (超絶レジェンド): 5%
 * ★3 (激レア): 14%
 * ★2 (レア): 30%
 * ★1 (ノーマル): 50%
 */
export function pullSingleGacha() {
    const roll = Math.random() * 100;
    let targetRarity = 1;
    if (roll < 1) {
        targetRarity = 5;
    } else if (roll < 6) {
        targetRarity = 4;
    } else if (roll < 20) {
        targetRarity = 3;
    } else if (roll < 50) {
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
