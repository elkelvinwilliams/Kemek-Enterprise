/* ═════════════════════════════════════════════════════════════════════
   Kemek deal rooms — open a password-locked room file in the browser.
   Shared by deal.html and the tests (Node has the same WebCrypto API).

   v1 file: { salt, iv, ct } — the room is AES-256-GCM encrypted under a key
            derived from the password (PBKDF2-SHA256, 310,000 rounds).
   v2 file: v1 plus keys: [{ salt, iv, wk }] — each further holder's password
            wraps the same room key, so every holder has a password of their
            own and the first password still opens the room in a v1 reader.
   Written by tools/lock-page.cjs --fragment. Nothing leaves the browser.
   ═════════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  const ROUNDS = 310000;
  const bytes = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));

  async function open(room, password) {
    const subtle = global.crypto.subtle;
    const material = await subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
    const derive = salt => subtle.deriveKey({ name: 'PBKDF2', salt: bytes(salt), iterations: ROUNDS, hash: 'SHA-256' }, material, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    const read = async key => new TextDecoder().decode(await subtle.decrypt({ name: 'AES-GCM', iv: bytes(room.iv) }, key, bytes(room.ct)));

    try { return await read(await derive(room.salt)); } catch (e) { /* not the first holder's password: try the other key slots */ }
    for (const slot of room.keys || []) {
      let raw;
      try { raw = await subtle.decrypt({ name: 'AES-GCM', iv: bytes(slot.iv) }, await derive(slot.salt), bytes(slot.wk)); } catch (e) { continue; }
      return read(await subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['decrypt']));
    }
    throw new Error('That password did not open the room.');
  }

  global.KemekRoom = { open };
})(typeof window !== 'undefined' ? window : globalThis);
