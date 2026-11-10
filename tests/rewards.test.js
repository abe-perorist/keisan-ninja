import assert from 'node:assert';
import {
    REWARD_ITEMS,
    DUPLICATE_REFUNDS,
    COMPLETION_AWARDS,
    PITY_THRESHOLD,
    getOwnedItemIds,
    saveOwnedItemIds,
    getEquippedItemId,
    setEquippedItemId,
    getItemById,
    pullSingleGacha,
    pullMultipleGacha,
    getPityCount,
    savePityCount,
    isTierComplete,
    claimCompletionAwards,
    saveClaimedAwardIds,
    grantRandomUnownedItem,
} from '../js/rewards.js';

// Polyfill minimal localStorage for testing
const mockStorage = {};
globalThis.localStorage = {
    getItem: (key) => mockStorage[key] || null,
    setItem: (key, val) => { mockStorage[key] = String(val); },
    removeItem: (key) => { delete mockStorage[key]; },
    clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); },
};

console.log('--- Testing rewards.js ---');

// Catalog integrity and size
assert.strictEqual(REWARD_ITEMS.length, 63, 'REWARD_ITEMS pool should contain 63 items (62 + the 6-star dragon god)');

const ids = new Set();
const names = new Set();
const rarityCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

for (const reward of REWARD_ITEMS) {
    assert.ok(reward.id && typeof reward.id === 'string', `Item id must be a non-empty string: ${reward.id}`);
    assert.ok(!ids.has(reward.id), `Item id must be unique: ${reward.id}`);
    ids.add(reward.id);

    assert.ok(reward.name && typeof reward.name === 'string', `Item name must be a non-empty string: ${reward.name}`);
    assert.ok(!names.has(reward.name), `Item name must be unique: ${reward.name}`);
    names.add(reward.name);

    assert.ok(reward.emoji && typeof reward.emoji === 'string', `Item emoji must be non-empty string for ${reward.id}`);
    assert.ok([1, 2, 3, 4, 5, 6].includes(reward.rarity), `Item rarity must be 1-6 for ${reward.id}`);
    assert.ok(reward.rarityLabel && typeof reward.rarityLabel === 'string', `Item rarityLabel required for ${reward.id}`);
    assert.ok(reward.badgeColor && /^#[0-9a-fA-F]{6}$/.test(reward.badgeColor), `Item badgeColor must be hex color for ${reward.id}`);
    assert.ok(reward.tagline && typeof reward.tagline === 'string', `Item tagline required for ${reward.id}`);

    rarityCounts[reward.rarity] = (rarityCounts[reward.rarity] || 0) + 1;
}

assert.deepStrictEqual(rarityCounts, { 1: 15, 2: 15, 3: 15, 4: 11, 5: 6, 6: 1 }, 'Rarity distribution after adding 20 items plus the 6-star');
assert.strictEqual(rarityCounts[6], 1, '6-star tier must hold exactly one item so its rate is exactly 0.5%');

// 1. Initial State
mockStorage.keisanNinjaOwnedItems = undefined;
mockStorage.keisanNinjaEquippedItem = undefined;
const initialOwned = getOwnedItemIds();
assert.deepStrictEqual(initialOwned, ['trainee_ninja'], 'Initial owned items should be trainee_ninja');

const initialEquipped = getEquippedItemId();
assert.strictEqual(initialEquipped, 'trainee_ninja', 'Initial equipped item should be trainee_ninja');

// 2. Equip functionality
const setOk = setEquippedItemId('flame_ninja');
assert.strictEqual(setOk, false, 'Should not allow equipping unowned item');

saveOwnedItemIds(['trainee_ninja', 'flame_ninja']);
const setOk2 = setEquippedItemId('flame_ninja');
assert.strictEqual(setOk2, true, 'Should allow equipping owned item');
assert.strictEqual(getEquippedItemId(), 'flame_ninja');

// 3. Item retrieval
const item = getItemById('flame_ninja');
assert.strictEqual(item.name, '火遁の熱血忍者');
assert.strictEqual(item.rarity, 2);

// 4. Single Pull & Duplicate refund
saveOwnedItemIds(['trainee_ninja', 'flame_ninja']);
savePityCount(0);
let hasNew = false;
let hasDuplicate = false;

const raritiesSeen = new Set();
for (let i = 0; i < 1000; i++) {
    const res = pullSingleGacha();
    assert.ok(res.item, 'Pulled item must exist');
    assert.ok([1, 2, 3, 4, 5, 6].includes(res.item.rarity), 'Rarity must be 1 through 6');
    raritiesSeen.add(res.item.rarity);
    if (res.isNew) {
        hasNew = true;
        assert.strictEqual(res.refundStars, 0, 'New item should have 0 refund');
    } else {
        hasDuplicate = true;
        assert.strictEqual(res.refundStars, DUPLICATE_REFUNDS[res.item.rarity], `Duplicate refund for ${res.item.rarity}★ must match table`);
    }
}
assert.ok(hasNew, 'Should draw new items over 1000 pulls');
assert.ok(hasDuplicate, 'Should draw duplicate items over 1000 pulls');
assert.ok(raritiesSeen.has(1), 'Must see 1-star');
assert.ok(raritiesSeen.has(2), 'Must see 2-star');
assert.ok(raritiesSeen.has(3), 'Must see 3-star');
assert.ok(raritiesSeen.has(4), 'Must see 4-star');

// 5. Multiple pull (10x pull)
const multi = pullMultipleGacha(10);
assert.strictEqual(multi.results.length, 10, 'Must return 10 results');
const expectedRefund = multi.results.reduce((acc, r) => acc + r.refundStars, 0);
assert.strictEqual(multi.totalRefund, expectedRefund, 'Total refund must match sum of individual refunds');

// 6. 排出率の境界（Math.random をスタブして帯の切り分けを確認）
const realRandom = Math.random;
const rollToRarity = (roll) => {
    Math.random = () => roll / 100;
    savePityCount(0);
    const r = pullSingleGacha().item.rarity;
    return r;
};
assert.strictEqual(rollToRarity(0.1), 6, 'roll 0.1% must land in the 6-star band');
assert.strictEqual(rollToRarity(0.9), 5, 'roll 0.9% must land in the 5-star band');
assert.strictEqual(rollToRarity(3), 4, 'roll 3% must land in the 4-star band');
assert.strictEqual(rollToRarity(10), 3, 'roll 10% must land in the 3-star band');
assert.strictEqual(rollToRarity(30), 2, 'roll 30% must land in the 2-star band');
assert.strictEqual(rollToRarity(90), 1, 'roll 90% must land in the 1-star band');
Math.random = realRandom;

// 7. 天井（忍法ゲージ）
Math.random = () => 0.9; // 放っておけば必ず★1になるロール
savePityCount(PITY_THRESHOLD - 1);
const pityPull = pullSingleGacha();
assert.strictEqual(pityPull.item.rarity, 6, 'Reaching the pity threshold must force a 6-star');
assert.strictEqual(pityPull.isPity, true, 'Pity pull must be flagged');
assert.strictEqual(getPityCount(), 0, 'Pity counter resets after a 6-star');

savePityCount(0);
pullSingleGacha();
assert.strictEqual(getPityCount(), 1, 'A non-6-star pull advances the pity counter by 1');

// ★6を自然排出したときもカウンタはリセットされる
Math.random = () => 0.001;
savePityCount(42);
const naturalSix = pullSingleGacha();
assert.strictEqual(naturalSix.item.rarity, 6, 'roll 0.1% is a natural 6-star');
assert.strictEqual(naturalSix.isPity, false, 'A natural 6-star is not a pity pull');
assert.strictEqual(getPityCount(), 0, 'A natural 6-star also resets the pity counter');
Math.random = realRandom;

// 8. 図鑑コンプリート報酬
const idsOfRarity = (r) => REWARD_ITEMS.filter(i => i.rarity === r).map(i => i.id);

saveClaimedAwardIds([]);
saveOwnedItemIds(idsOfRarity(1));
assert.strictEqual(isTierComplete([1]), true, 'Owning every 1-star completes the tier');
assert.strictEqual(isTierComplete([2]), false, 'The 2-star tier is not complete yet');

let awards = claimCompletionAwards();
assert.deepStrictEqual(awards.map(a => a.id), ['comp_r1'], 'Only the 1-star award should fire');
assert.strictEqual(claimCompletionAwards().length, 0, 'Awards must not be handed out twice');

// ★1〜★3をそろえると龍神忍者が確定でもらえる
saveOwnedItemIds([...idsOfRarity(1), ...idsOfRarity(2), ...idsOfRarity(3)]);
awards = claimCompletionAwards();
assert.deepStrictEqual(
    awards.map(a => a.id),
    ['comp_r2', 'comp_r3', 'comp_tier123'],
    'Completing 1-3 star tiers fires the remaining tier awards and the dragon god grant'
);
assert.ok(getOwnedItemIds().includes('dragon_god_ninja'), 'comp_tier123 must grant the 6-star');

// 全部そろえば最高称号まで出る
saveClaimedAwardIds([]);
saveOwnedItemIds(REWARD_ITEMS.map(i => i.id));
const allAwards = claimCompletionAwards();
assert.deepStrictEqual(
    allAwards.map(a => a.id),
    COMPLETION_AWARDS.map(a => a.id),
    'A full collection claims every award'
);

// 9. はじめての修行ボーナス（未所持から1体プレゼント）
saveOwnedItemIds(['trainee_ninja']);
const gift = grantRandomUnownedItem();
assert.ok(gift, 'Should hand out an unowned ninja');
assert.ok(gift.rarity <= 5, 'The 6-star must never be given away as a daily bonus');
assert.ok(getOwnedItemIds().includes(gift.id), 'The gift is added to the collection');

// ★6以外を集めきっていたら配るものが無い＝null（呼び出し側が星にフォールバックする）
saveOwnedItemIds(REWARD_ITEMS.filter(i => i.rarity <= 5).map(i => i.id));
assert.strictEqual(grantRandomUnownedItem(), null, 'Returns null when only the 6-star is missing');

console.log('All reward logic tests passed! ✅');
