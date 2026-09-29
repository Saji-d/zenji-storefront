/* Compact summary of qa/pixel-report.json */
import { readFileSync } from 'node:fs'
const r = JSON.parse(readFileSync('qa/pixel-report.json', 'utf8'))
for (const [f, d] of Object.entries(r)) {
  console.log(`== ${f}  avgLum=${d.avgLum} bright%=${d.brightShare} dark%=${d.darkShare}`)
  console.log('   top: ' + d.topColors.slice(0, 4).map((c) => `${c.hex} ${c.share}%`).join(' | '))
  console.log('   accent% per band: ' + d.bands.map((b) => b.accentPct).join(','))
}
