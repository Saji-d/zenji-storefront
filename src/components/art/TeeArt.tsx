import { useId } from 'react'

export type ArtKey = 'flame' | 'blood' | 'sun' | 'spirit' | 'vow' | 'vanguard'

const ART_BY_ID: Record<string, ArtKey> = {
  'blue-flame-tee': 'flame',
  'demon-blood-tee': 'blood',
  'will-of-the-sun-tee': 'sun',
  'warrior-spirit-tee': 'spirit',
  'shadow-vow-tee': 'vow',
  'ember-vanguard-tee': 'vanguard',
}

export const artKeyFor = (productId: string): ArtKey =>
  ART_BY_ID[productId] ?? 'flame'

interface TeeArtProps {
  productId: string
  accent: string
  className?: string
}

const SIZE = 560 // viewBox coordinate space

/**
 * Original, generated product artwork: a heavyweight tee silhouette on a
 * grid backdrop, with one of six geometric motifs screen-printed on the chest.
 * `accent` drives both the backdrop glow and the print color.
 */
export function TeeArt({ productId, accent, className }: TeeArtProps) {
  const uid = useId()
  const key = artKeyFor(productId)
  const shirtId = `shirt-${uid}`
  const glowId = `glow-${uid}`
  const clipId = `clip-${uid}`

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={shirtId} cx="50%" cy="34%" r="80%">
          <stop offset="0%" stopColor="#26262e" />
          <stop offset="100%" stopColor="#0e0e12" />
        </radialGradient>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.45" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <clipPath id={clipId}>
          <rect x="0" y="0" width={SIZE} height={SIZE} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        <circle cx={SIZE / 2} cy={SIZE / 2} r={230} fill={`url(#${glowId})`} />

        {/* giant kanji watermark — echo of the ZENJI mark behind each product */}
        <text
          x={SIZE / 2}
          y={SIZE / 2 + 60}
          textAnchor="middle"
          fontSize="300"
          fontFamily="'Hiragino Mincho ProN', 'Yu Mincho', serif"
          fill={accent}
          opacity="0.14"
        >
          禅
        </text>

        {/* backdrop grid */}
        <g stroke="#1d1d24" strokeWidth="1">
          {Array.from({ length: 9 }, (_, i) => (
            <line key={`h${i}`} x1="90" y1={92 + i * 46} x2={SIZE - 90} y2={92 + i * 46} />
          ))}
          {Array.from({ length: 9 }, (_, i) => (
            <line key={`v${i}`} x1={92 + i * 46} y1="92" x2={92 + i * 46} y2={SIZE - 92} />
          ))}
        </g>

        {/* tee silhouette */}
        <path
          d="M214 118c14-10 34-16 66-16s52 6 66 16l52 26c6 3 8 10 5 16l-22 44c-3 6-10 8-16 5l-24-12v250c0 8-6 14-14 14H235c-8 0-14-6-14-14v-250l-24 12c-6 3-13 1-16-5l-22-44c-3-6-1-13 5-16z"
          fill={`url(#${shirtId})`}
          stroke="#3a3a44"
          strokeWidth="2"
        />
        {/* collar */}
        <path
          d="M244 110c14 12 44 18 72 18s58-6 72-18"
          fill="none"
          stroke="#4a4a55"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* sleeve seams */}
        <path
          d="M159 223l52-27M453 223l-52-27"
          stroke="#3a3a44"
          strokeWidth="2"
        />

        {/* chest print */}
        {key === 'flame' && <Flame accent={accent} />}
        {key === 'blood' && <Blood accent={accent} />}
        {key === 'sun' && <Sun accent={accent} />}
        {key === 'spirit' && <Spirit accent={accent} />}
        {key === 'vow' && <Vow accent={accent} />}
        {key === 'vanguard' && <Vanguard accent={accent} />}

        {/* center fold shading */}
        <path d="M280 150v280" stroke="#1a1a20" strokeWidth="30" opacity="0.3" />
      </g>
    </svg>
  )
}

/* ---------------- motif glyphs (all original) ---------------- */

interface MotifProps {
  accent: string
}

function Flame({ accent }: MotifProps) {
  return (
    <g>
      <path
        d="M280 196c-28 37-54 57-54 94 0 37 24 63 54 63s54-26 54-63c0-37-26-57-54-94z"
        fill={accent}
        opacity="0.92"
      />
      <path
        d="M280 248c-13 17-23 27-23 44 0 19 10 32 23 32s23-13 23-32c0-17-10-27-23-44z"
        fill="#0e0e12"
      />
      <text x="280" y="386" className="tee-caption" fill={accent}>
        BLUE FLAME
      </text>
    </g>
  )
}

function Blood({ accent }: MotifProps) {
  return (
    <g>
      <path
        d="M280 188c-31 43-57 69-57 106 0 37 26 63 57 63s57-26 57-63c0-37-26-63-57-106z"
        fill={accent}
      />
      <circle cx="263" cy="296" r="10" fill="#0e0e12" />
      <circle cx="297" cy="296" r="10" fill="#0e0e12" />
      <path d="M280 306l-9 22h18z" fill="#0e0e12" />
      <text x="280" y="386" className="tee-caption" fill={accent}>
        DEMON BLOOD
      </text>
    </g>
  )
}

function Sun({ accent }: MotifProps) {
  return (
    <g>
      <circle cx="280" cy="288" r="58" fill={accent} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6
        return (
          <line
            key={i}
            x1={280 + Math.cos(a) * 70}
            y1={288 + Math.sin(a) * 70}
            x2={280 + Math.cos(a) * 94}
            y2={288 + Math.sin(a) * 94}
            stroke={accent}
            strokeWidth="8"
            strokeLinecap="round"
          />
        )
      })}
      <text x="280" y="386" className="tee-caption" fill={accent}>
        WILL OF THE SUN
      </text>
    </g>
  )
}

function Spirit({ accent }: MotifProps) {
  return (
    <g>
      <path
        d="M280 178l38 62h-27l32 58h-30l36 62h-98l36-62h-30l32-58h-27z"
        fill={accent}
      />
      <text x="280" y="386" className="tee-caption" fill={accent}>
        WARRIOR SPIRIT
      </text>
    </g>
  )
}

function Vow({ accent }: MotifProps) {
  return (
    <g>
      <circle cx="280" cy="284" r="62" fill="none" stroke={accent} strokeWidth="10" />
      <path
        d="M280 234v50l34 24"
        stroke={accent}
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />
      <text x="280" y="386" className="tee-caption" fill={accent}>
        SHADOW VOW
      </text>
    </g>
  )
}

function Vanguard({ accent }: MotifProps) {
  return (
    <g>
      <path
        d="M280 176l76 48v98l-76 54-76-54v-98z"
        fill="none"
        stroke={accent}
        strokeWidth="11"
      />
      <circle cx="280" cy="276" r="20" fill={accent} />
      <text x="280" y="386" className="tee-caption" fill={accent}>
        EMBER VANGUARD
      </text>
    </g>
  )
}
