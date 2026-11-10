/**
 * 忍者報酬・ガチャシステムデータモジュール
 * Collectible items catalog, gacha pull mechanics, duplicate bonus, and storage helpers.
 */

export const REWARD_ITEMS = [
    // --- 1-Star: ノーマル (Common) 49.5% 出現率 ---
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
    {
        id: 'mouse_ninja',
        name: 'ちょろ丸',
        emoji: '🐭',
        rarity: 1,
        rarityLabel: 'ノーマル',
        tagline: '小さな体でちょこまか、数字のすきまをすり抜ける！',
        badgeColor: '#95a5a6',
    },
    {
        id: 'acorn_ninja',
        name: 'どんぐり忍者',
        emoji: '🌰',
        rarity: 1,
        rarityLabel: 'ノーマル',
        tagline: 'ころころ転がって、答えまでたどりつく。',
        badgeColor: '#a0522d',
    },
    {
        id: 'kappa_ninja',
        name: 'かっぱの皿丸',
        emoji: '🥒',
        rarity: 1,
        rarityLabel: 'ノーマル',
        tagline: 'お皿の水がこぼれないよう、落ち着いて計算する。',
        badgeColor: '#55efc4',
    },
    {
        id: 'lantern_ninja',
        name: 'ちょうちん灯丸',
        emoji: '🏮',
        rarity: 1,
        rarityLabel: 'ノーマル',
        tagline: '暗い夜道も答えへの道も、ぽっと照らす。',
        badgeColor: '#e74c3c',
    },
    {
        id: 'tea_ninja',
        name: '茶坊主 のみ丸',
        emoji: '🍵',
        rarity: 1,
        rarityLabel: 'ノーマル',
        tagline: '一服してから、じっくり考える慎重派。',
        badgeColor: '#00b894',
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
    {
        id: 'monkey_ninja',
        name: '木登りサル丸',
        emoji: '🐵',
        rarity: 2,
        rarityLabel: 'レア',
        tagline: 'するする登って、高い所から問題を見下ろす！',
        badgeColor: '#e17055',
    },
    {
        id: 'umbrella_ninja',
        name: '唐傘の雨月',
        emoji: '🌂',
        rarity: 2,
        rarityLabel: 'レア',
        tagline: '雨の日も傘をくるりと回して、まちがいを弾き返す。',
        badgeColor: '#6c5ce7',
    },
    {
        id: 'tengu_ninja',
        name: '鞍馬の小天狗',
        emoji: '👺',
        rarity: 2,
        rarityLabel: 'レア',
        tagline: '天狗の団扇で、立ちはだかる式を一気に吹き飛ばす！',
        badgeColor: '#d63031',
    },
    {
        id: 'koinobori_ninja',
        name: '鯉のぼり昇り丸',
        emoji: '🎏',
        rarity: 2,
        rarityLabel: 'レア',
        tagline: '流れに逆らって、難問の滝をぐんぐん登る！',
        badgeColor: '#0984e3',
    },
    {
        id: 'haze_ninja',
        name: '霞隠れの陽炎',
        emoji: '🌫️',
        rarity: 2,
        rarityLabel: 'レア',
        tagline: 'かすみに紛れて、気づけば答えのとなりに立っている。',
        badgeColor: '#b2bec3',
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
    {
        id: 'ghost_samurai_ninja',
        name: '幽世の侍 影斬り',
        emoji: '🗡️',
        rarity: 3,
        rarityLabel: '激レア',
        tagline: '一太刀で式を真っ二つに断ち切る、亡霊の剣客。',
        badgeColor: '#2d3436',
    },
    {
        id: 'peacock_ninja',
        name: '極彩の孔雀丸',
        emoji: '🦚',
        rarity: 3,
        rarityLabel: '激レア',
        tagline: '七色の羽を広げ、解き方を一瞬で展開する。',
        badgeColor: '#00b894',
    },
    {
        id: 'drum_oni_ninja',
        name: '鬼太鼓の雷蔵',
        emoji: '🥁',
        rarity: 3,
        rarityLabel: '激レア',
        tagline: '打ち鳴らす太鼓の拍が、計算のリズムを刻む！',
        badgeColor: '#e84393',
    },
    {
        id: 'lotus_ninja',
        name: '蓮華の浄心尼',
        emoji: '🪷',
        rarity: 3,
        rarityLabel: '激レア',
        tagline: '泥の中でも心を乱さず、澄んだ答えを咲かせる。',
        badgeColor: '#fd79a8',
    },
    {
        id: 'comet_ninja',
        name: '流星の彗丸',
        emoji: '☄️',
        rarity: 3,
        rarityLabel: '激レア',
        tagline: '夜空を裂いて、まばたきの間に解答へ到達する。',
        badgeColor: '#fab1a0',
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
    {
        id: 'suzaku_ninja',
        name: '朱雀 炎翼王',
        emoji: '🔥',
        rarity: 4,
        rarityLabel: '超絶レジェンド',
        tagline: '南方を守る聖獣。燃える翼のひと羽ばたきで難問を灰にする！',
        badgeColor: '#ff6348',
    },
    {
        id: 'kaguya_ninja',
        name: '月光姫 かぐや',
        emoji: '🌙',
        rarity: 4,
        rarityLabel: '超絶レジェンド',
        tagline: '月の都より降臨。やわらかな光がすべての答えを指し示す。',
        badgeColor: '#dfe6e9',
    },
    {
        id: 'orochi_ninja',
        name: '八岐大蛇 オロチ王',
        emoji: '🐍',
        rarity: 4,
        rarityLabel: '超絶レジェンド',
        tagline: '八つの頭が、八通りの解き方を同時に導き出す大蛇神！',
        badgeColor: '#6c5ce7',
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
    {
        id: 'tsukuyomi_god',
        name: '月読神 ツクヨミ',
        emoji: '🌕',
        rarity: 5,
        rarityLabel: '神話ゴッド',
        tagline: '夜を統べる月の神。静寂の中で万象の数を読み切る。',
        badgeColor: '#dfe6e9',
    },
    {
        id: 'akasha_god',
        name: '全知の記録神 アカシャ',
        emoji: '📖',
        rarity: 5,
        rarityLabel: '神話ゴッド',
        tagline: 'この世のすべての答えが記された本を持つ、記録の神。',
        badgeColor: '#fdcb6e',
    },

    // --- 6-Star: 幻の龍神 (Dragon God) 0.5% 出現率 ---
    {
        id: 'dragon_god_ninja',
        name: '龍神忍者 ドラゴニンジャ',
        emoji: '🐲',
        rarity: 6,
        rarityLabel: '幻の龍神',
        tagline: '忍と龍が合体した究極の姿。吐く炎が数式ごと焼きつくす！',
        badgeColor: '#ff4757',
    },
];

export const GACHA_PRICES = {
    SINGLE: 10,
    TEN: 90, // 10連は10%割引
};

export const DUPLICATE_REFUNDS = {
    1: 3,    // 1★ダブり: 3星お返し
    2: 5,    // 2★ダブり: 5星お返し
    3: 10,   // 3★ダブり: 10星お返し
    4: 20,   // 4★ダブり: 20星お返し
    5: 50,   // 5★ダブり: 50星お返し
    6: 100,  // 6★ダブり: 100星お返し
};

// 天井（忍法ゲージ）。★6は0.5%しかないので、引き続ければ必ず出る保証を付ける。
// 「ハズレた回も前進している」と目に見えることが、小さい子には何より大事。
export const PITY_THRESHOLD = 100;

// 図鑑コンプリート報酬。上から順に判定するので、★6を配る comp_tier123 は
// ★4/★5コンプより前に置いて「先に確定入手できる道」にしてある。
export const COMPLETION_AWARDS = [
    { id: 'comp_r1', rarities: [1], title: 'ノーマル制覇', stars: 50 },
    { id: 'comp_r2', rarities: [2], title: 'レア制覇', stars: 100 },
    { id: 'comp_r3', rarities: [3], title: '激レア制覇', stars: 200 },
    { id: 'comp_tier123', rarities: [1, 2, 3], title: '里の守り人', stars: 0, grantItemId: 'dragon_god_ninja' },
    { id: 'comp_r4', rarities: [4], title: '超絶レジェンド制覇', stars: 500 },
    { id: 'comp_r5', rarities: [5], title: '神話ゴッド制覇', stars: 1500 },
    { id: 'comp_all', rarities: [1, 2, 3, 4, 5, 6], title: '計算忍界の覇者', stars: 0 },
];

const STORAGE_KEYS = {
    OWNED: 'keisanNinjaOwnedItems',
    EQUIPPED: 'keisanNinjaEquippedItem',
    PITY: 'keisanNinjaGachaPity',
    AWARDS: 'keisanNinjaClaimedAwards',
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
 * 忍法ゲージ（天井カウンタ）。★6が出た時点で0に戻る。
 */
export function getPityCount() {
    return parseInt(localStorage.getItem(STORAGE_KEYS.PITY), 10) || 0;
}

export function savePityCount(count) {
    localStorage.setItem(STORAGE_KEYS.PITY, String(count));
}

/**
 * ガチャ抽選ロジック（重み付き確率）
 * ★6 (幻の龍神): 0.5%
 * ★5 (神話ゴッド): 1%
 * ★4 (超絶レジェンド): 5%
 * ★3 (激レア): 14%
 * ★2 (レア): 30%
 * ★1 (ノーマル): 49.5%
 * ★6の0.5%は★1ノーマルから捻出しているので、合計は100%のまま。
 */
export function pullSingleGacha() {
    const pity = getPityCount() + 1;

    const roll = Math.random() * 100;
    let targetRarity = 1;
    if (roll < 0.5) {
        targetRarity = 6;
    } else if (roll < 1.5) {
        targetRarity = 5;
    } else if (roll < 6.5) {
        targetRarity = 4;
    } else if (roll < 20.5) {
        targetRarity = 3;
    } else if (roll < 50.5) {
        targetRarity = 2;
    } else {
        targetRarity = 1;
    }

    // 天井に到達したら★6を確定排出する
    const isPity = targetRarity !== 6 && pity >= PITY_THRESHOLD;
    if (isPity) {
        targetRarity = 6;
    }

    savePityCount(targetRarity === 6 ? 0 : pity);

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
        isPity,
        pity: getPityCount(),
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

// ===== 図鑑コンプリート報酬 =====

export function getClaimedAwardIds() {
    try {
        const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.AWARDS));
        return Array.isArray(list) ? list : [];
    } catch {
        return [];
    }
}

export function saveClaimedAwardIds(ids) {
    localStorage.setItem(STORAGE_KEYS.AWARDS, JSON.stringify(ids));
}

/**
 * 指定レアリティ帯をすべて集めきっているか
 */
export function isTierComplete(rarities, owned = getOwnedItemIds()) {
    return REWARD_ITEMS
        .filter(item => rarities.includes(item.rarity))
        .every(item => owned.includes(item.id));
}

/**
 * 未受取のコンプリート報酬を判定して受け取る。
 * 星の加算は game.js 側（totalStars を持っているのが向こうのため）。
 */
export function claimCompletionAwards() {
    const owned = getOwnedItemIds();
    const claimed = getClaimedAwardIds();
    const newly = [];

    for (const award of COMPLETION_AWARDS) {
        if (claimed.includes(award.id)) continue;
        if (!isTierComplete(award.rarities, owned)) continue;

        claimed.push(award.id);
        newly.push(award);
        // ★6を配る報酬は、その場で所持に加えて以降の判定にも反映させる
        if (award.grantItemId && !owned.includes(award.grantItemId)) {
            owned.push(award.grantItemId);
        }
    }

    if (newly.length > 0) {
        saveOwnedItemIds(owned);
        saveClaimedAwardIds(claimed);
    }
    return newly;
}

// ===== はじめての修行ボーナス =====

/**
 * まだ持っていない忍者を1体プレゼントする。
 * ★6は天井とコンプリート報酬でしか手に入らないので、ここでは配らない。
 * 配れるものが無ければ null（呼び出し側で星にフォールバックする）。
 */
export function grantRandomUnownedItem(maxRarity = 5) {
    const owned = getOwnedItemIds();
    const pool = REWARD_ITEMS.filter(item => item.rarity <= maxRarity && !owned.includes(item.id));
    if (pool.length === 0) return null;

    const item = pool[Math.floor(Math.random() * pool.length)];
    owned.push(item.id);
    saveOwnedItemIds(owned);
    return item;
}
