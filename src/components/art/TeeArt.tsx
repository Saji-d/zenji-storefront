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
        <circle cx={SIZE / 2} cy={SIZE / 2} r={200} fill={`url(#${glowId})`} />

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
        d="M280 232c-20 26-38 40-38 66 0 26 17 44 38 44s38-18 38-44c0-26-18-40-38-66z"
        fill={accent}
        opacity="0.92"
      />
      <path
        d="M280 268c-9 12-16 19-16 31 0 13 7 22 16 22s16-9 16-22c0-12-7-19-16-31z"
        fill="#0e0e12"
      />
      <text x="280" y="392" className="tee-caption" fill={accent}>
        BLUE FLAME
      </text>
    </g>
  )
}

function Blood({ accent }: MotifProps) {
  return (
    <g>
      <path
        d="M280 224c-22 30-40 48-40 74 0 26 18 44 40 44s40-18 40-44c0-26-18-44-40-74z"
        fill={accent}
      />
      <circle cx="268" cy="300" r="7" fill="#0e0e12" />
      <circle cx="292" cy="300" r="7" fill="#0e0e12" />
      <text x="280" y="392" className="tee-caption" fill={accent}>
        DEMON BLOOD
      </text>
    </g>
  )
}

function Sun({ accent }: MotifProps) {
  return (
    <g>
      <circle cx="280" cy="300" r="46" fill={accent} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6
        return (
          <line
            key={i}
            x1={280 + Math.cos(a) * 56}
            y1={300 + Math.sin(a) * 56}
            x2={280 + Math.cos(a) * 72}
            y2={300 + Math.sin(a) * 72}
            stroke={accent}
            strokeWidth="6"
            strokeLinecap="round"
          />
        )
      })}
      <text x="280" y="392" className="tee-caption" fill={accent}>
        WILL OF THE SUN
      </text>
    </g>
  )
}

function Spirit({ accent }: MotifProps) {
  return (
    <g>
      <path
        d="M280 224l28 46h-20l24 42h-22l26 44h-72l26-44h-22l24-42h-20z"
        fill={accent}
      />
      <text x="280" y="392" className="tee-caption" fill={accent}>
        WARRIOR SPIRIT
      </text>
    </g>
  )
}

function Vow({ accent }: MotifProps) {
  return (
    <g>
      <circle cx="280" cy="300" r="44" fill="none" stroke={accent} strokeWidth="7" />
      <path
        d="M280 262v38l26 18"
        stroke={accent}
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
      />
      <text x="280" y="392" className="tee-caption" fill={accent}>
        SHADOW VOW
      </text>
    </g>
  )
}

function Vanguard({ accent }: MotifProps) {
  return (
    <g>
      <path
        d="M280 224l54 34v70l-54 38-54-38v-70z"
        fill="none"
        stroke={accent}
        strokeWidth="8"
      />
      <circle cx="280" cy="295" r="14" fill={accent} />
      <text x="280" y="392" className="tee-caption" fill={accent}>
        EMBER VANGUARD
      </text>
    </g>
  )
}
