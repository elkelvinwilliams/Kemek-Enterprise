// Lock a private HTML page with a password (AES-256-GCM, PBKDF2-SHA256 310k iterations) so it can live on GitHub Pages.
// Usage: node tools/lock-page.cjs <plain.html> <out.html> <password> ["Title"]
// The output page holds only ciphertext; the browser derives the key from the password and decrypts locally.
const crypto = require('crypto'), fs = require('fs');
const [,, src, out, password, title = 'Kemek deal room'] = process.argv;
if (!src || !out || !password) { console.error('usage: node tools/lock-page.cjs <plain.html> <out.html> <password> [title]'); process.exit(1); }
const salt = crypto.randomBytes(16), iv = crypto.randomBytes(12);
const key = crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256');
const c = crypto.createCipheriv('aes-256-gcm', key, iv);
const ct = Buffer.concat([c.update(fs.readFileSync(src)), c.final(), c.getAuthTag()]);
const b64 = b => b.toString('base64');
fs.writeFileSync(out, `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex, nofollow"><title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg,#0E2542,#0A1A30 58%,#050D1A);font-family:Jost,sans-serif;color:#F8F6F1}
.box{max-width:420px;width:92%;border:1px solid rgba(200,162,75,.5);padding:2rem}.k{width:36px;height:36px;border:1.5px solid #C8A24B;display:grid;place-items:center;font-family:'Cormorant Garamond',serif;color:#C8A24B;font-size:20px}
h1{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:1.7rem;margin:1rem 0 .3rem}p{color:rgba(255,255,255,.65);font-size:.9rem;line-height:1.5}
input{width:100%;box-sizing:border-box;padding:.75rem .9rem;margin:1rem 0 .6rem;border:1.5px solid rgba(255,255,255,.25);background:rgba(255,255,255,.05);color:#fff;font-family:Jost;font-size:1rem}
button{width:100%;padding:.8rem;background:#C8A24B;color:#050D1A;border:0;font-family:Jost;font-weight:600;letter-spacing:.12em;text-transform:uppercase;font-size:.8rem;cursor:pointer}.err{color:#F0B9B3;font-size:.85rem;min-height:1.2em}small{display:block;margin-top:1.2rem;color:rgba(255,255,255,.4);font-size:.72rem}</style></head>
<body><div class="box"><div class="k">K</div><h1>${title}</h1><p>Private. Enter the password Kemek gave you. Nothing is stored and nothing leaves your browser.</p>
<form id="f"><input id="p" type="password" placeholder="Password" autocomplete="off"><button>Open</button><div class="err" id="e"></div></form>
<small>Kemek Enterprise Ltd · Company No. 16766198 · Indicative figures only — not valuations, not advice, not an offer to the public.</small></div>
<script>
const S='${b64(salt)}',I='${b64(iv)}',C='${b64(ct)}';const u=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
document.getElementById('f').addEventListener('submit',async e=>{e.preventDefault();const err=document.getElementById('e');err.textContent='Checking…';try{
const km=await crypto.subtle.importKey('raw',new TextEncoder().encode(document.getElementById('p').value),'PBKDF2',false,['deriveKey']);
const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:u(S),iterations:310000,hash:'SHA-256'},km,{name:'AES-GCM',length:256},false,['decrypt']);
const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:u(I)},key,u(C));document.open();document.write(new TextDecoder().decode(pt));document.close();}catch(x){err.textContent='That password did not open the room.';}});
</script></body></html>`);
console.log('locked', out, Math.round(ct.length / 1024) + ' KB');
