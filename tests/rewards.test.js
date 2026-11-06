import assert from 'node:assert';
import {
    REWARD_ITEMS,
    DUPLICATE_REFUNDS,
    getOwnedItemIds,
    saveOwnedItemIds,
    getEquippedItemId,
    setEquippedItemId,
    getItemById,
    pullSingleGacha,
    pullMultipleGacha,
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
assert.strictEqual(REWARD_ITEMS.length, 42, 'REWARD_ITEMS pool should contain 42 items (doubled)');

const ids = new Set();
const names = new Set();
const rarityCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

for (const reward of REWARD_ITEMS) {
    assert.ok(reward.id && typeof reward.id === 'string', `Item id must be a non-empty string: ${reward.id}`);
    assert.ok(!ids.has(reward.id), `Item id must be unique: ${reward.id}`);
    ids.add(reward.id);

    assert.ok(reward.name && typeof reward.name === 'string', `Item name must be a non-empty string: ${reward.name}`);
    assert.ok(!names.has(reward.name), `Item name must be unique: ${reward.name}`);
    names.add(reward.name);

    assert.ok(reward.emoji && typeof reward.emoji === 'string', `Item emoji must be non-empty string for ${reward.id}`);
    assert.ok([1, 2, 3, 4, 5].includes(reward.rarity), `Item rarity must be 1-5 for ${reward.id}`);
    assert.ok(reward.rarityLabel && typeof reward.rarityLabel === 'string', `Item rarityLabel required for ${reward.id}`);
    assert.ok(reward.badgeColor && /^#[0-9a-fA-F]{6}$/.test(reward.badgeColor), `Item badgeColor must be hex color for ${reward.id}`);
    assert.ok(reward.tagline && typeof reward.tagline === 'string', `Item tagline required for ${reward.id}`);

    rarityCounts[reward.rarity] = (rarityCounts[reward.rarity] || 0) + 1;
}

assert.deepStrictEqual(rarityCounts, { 1: 10, 2: 10, 3: 10, 4: 8, 5: 4 }, 'Rarity distribution should be doubled proportionally');

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
let hasNew = false;
let hasDuplicate = false;

const raritiesSeen = new Set();
for (let i = 0; i < 1000; i++) {
    const res = pullSingleGacha();
    assert.ok(res.item, 'Pulled item must exist');
    assert.ok([1, 2, 3, 4, 5].includes(res.item.rarity), 'Rarity must be 1, 2, 3, 4, or 5');
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

console.log('All reward logic tests passed! ✅');
