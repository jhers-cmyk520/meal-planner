// Generates the PWA / Apple touch icons as PNGs with no external deps.
// Run: npm run icons  (also runs automatically before build)
import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../public/icons')
mkdirSync(OUT, { recursive: true })

const BG = [0xc2, 0x57, 0x1f] // accent
const PLATE = [0xfa, 0xf7, 0xf2] // warm white
const FORK = [0xc2, 0x57, 0x1f]

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})
const crc32 = (buf) => {
  let c = 0xffffffff
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

const chunk = (type, data) => {
  const typed = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(typed))
  return Buffer.concat([len, typed, crc])
}

function png(size, { maskable = false } = {}) {
  const px = Buffer.alloc(size * size * 4)
  const c = size / 2
  const plateR = size * (maskable ? 0.3 : 0.34)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      let [r, g, b] = BG
      const d = Math.hypot(x - c, y - c)

      if (d < plateR) {
        ;[r, g, b] = PLATE
      }
      // fork: three short tines + a handle, left of centre
      const fx = x - c * 0.78
      const fy = y - c
      const tine =
        fy > -plateR * 0.5 &&
        fy < -plateR * 0.05 &&
        (Math.abs(fx + plateR * 0.16) < plateR * 0.04 ||
          Math.abs(fx) < plateR * 0.04 ||
          Math.abs(fx - plateR * 0.16) < plateR * 0.04)
      const handle = fy >= -plateR * 0.05 && fy < plateR * 0.55 && Math.abs(fx) < plateR * 0.06
      if (d < plateR && (tine || handle)) [r, g, b] = FORK

      px[i] = r
      px[i + 1] = g
      px[i + 2] = b
      px[i + 3] = 255
    }
  }

  // add filter byte 0 at the start of each scanline
  const raw = Buffer.alloc((size * 4 + 1) * size)
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0
    px.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4)
  }

  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // colour type RGBA
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const PUBLIC = resolve(OUT, '..')
const targets = [
  [resolve(OUT, 'icon-192.png'), 192, {}],
  [resolve(OUT, 'icon-512.png'), 512, {}],
  [resolve(OUT, 'icon-maskable-512.png'), 512, { maskable: true }],
  // Safari looks for this at the site root for "Add to Home Screen".
  [resolve(PUBLIC, 'apple-touch-icon.png'), 180, {}],
]

for (const [path, size, opts] of targets) {
  writeFileSync(path, png(size, opts))
  console.log('wrote', path.replace(`${PUBLIC}/`, 'public/'))
}
