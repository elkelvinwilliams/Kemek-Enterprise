// Deal-room lock and unlock. The lock tool (Node crypto) and the deal page's opener (js/deal-room.js, WebCrypto)
// must agree; a second holder's password must not change how the first one opens a room; and every published
// room file must be a well-formed locked payload. Test passwords only — real passwords are never committed.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');

const { lockFragment } = require(path.join(__dirname, '..', 'tools', 'lock-page.cjs'));
require(path.join(__dirname, '..', 'js', 'deal-room.js'));
const { open } = globalThis.KemekRoom;
const ROOM = Buffer.from('<p>Kemek test room · £165,000 · Flat 53</p>');
const bytes = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));

// The opener deal.html used before rooms could hold more than one password (v1 only), kept to prove old pages still work.
async function openV1(payload, password) {
  const subtle = globalThis.crypto.subtle;
  const km = await subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await subtle.deriveKey({ name: 'PBKDF2', salt: bytes(payload.salt), iterations: 310000, hash: 'SHA-256' }, km, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
  return new TextDecoder().decode(await subtle.decrypt({ name: 'AES-GCM', iv: bytes(payload.iv) }, key, bytes(payload.ct)));
}

test('one password: a v1 room that opens with it and refuses another', async () => {
  const room = lockFragment(ROOM, ['test-first-holder']);
  assert.equal(room.v, 1); assert.ok(!('keys' in room));
  assert.equal(await open(room, 'test-first-holder'), ROOM.toString());
  await assert.rejects(open(room, 'test-not-a-holder'));
});

test('two passwords: each holder opens the room, anyone else is refused', async () => {
  const room = lockFragment(ROOM, ['test-first-holder', 'test-second-holder']);
  assert.equal(room.v, 2); assert.equal(room.keys.length, 1);
  assert.equal(await open(room, 'test-first-holder'), ROOM.toString());
  assert.equal(await open(room, 'test-second-holder'), ROOM.toString());
  await assert.rejects(open(room, 'test-not-a-holder'));
  await assert.rejects(open(room, ''));
});

test('two passwords: the first still opens the room with the old v1-only opener', async () => {
  const room = lockFragment(ROOM, ['test-first-holder', 'test-second-holder']);
  assert.equal(await openV1(room, 'test-first-holder'), ROOM.toString());
  await assert.rejects(openV1(room, 'test-second-holder'));
});

test('the lock tool refuses a repeated or empty password', () => {
  assert.throws(() => lockFragment(ROOM, ['test-same', 'test-same']));
  assert.throws(() => lockFragment(ROOM, []));
  assert.throws(() => lockFragment(ROOM, ['test-first-holder', '']));
});

test('every published room file is a well-formed locked payload with no readable content', () => {
  const dir = path.join(__dirname, '..', 'deal-room');
  const files = fs.readdirSync(dir);
  assert.ok(files.length > 0);
  for (const f of files) {
    assert.match(f, /\.json$/, `${f}: only locked JSON payloads belong in deal-room/`);
    const room = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    assert.ok([1, 2].includes(room.v), `${f}: version`);
    assert.equal(room.kdf, 'PBKDF2-SHA256-310000', `${f}: kdf`);
    assert.equal(bytes(room.salt).length, 16, `${f}: salt`); assert.equal(bytes(room.iv).length, 12, `${f}: iv`);
    assert.ok(bytes(room.ct).length > 16, `${f}: ciphertext`);
    for (const k of room.keys || []) {
      assert.equal(bytes(k.salt).length, 16, `${f}: slot salt`); assert.equal(bytes(k.iv).length, 12, `${f}: slot iv`);
      assert.equal(bytes(k.wk).length, 48, `${f}: a wrapped 256-bit key plus its tag`);
    }
    assert.equal(room.v === 2, Array.isArray(room.keys), `${f}: v2 exactly when there are extra key slots`);
  }
});
