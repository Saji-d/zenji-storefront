interface SmartImageProps {
  src: string
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
  sizes?: string
  /** intrinsic ratio, so the browser can reserve space before the bytes land */
  width?: number
  height?: number
}

/**
 * Thin wrapper over <img> enforcing lazy-loading, async decoding and
 * non-draggable media.
 *
 * `sizes` is only useful when width/height are present too: without a real
 * intrinsic size the browser cannot pick a source, so both are forwarded
 * together and the CSS side owns the rendered box.
 */
export function SmartImage({
  src,
  alt,
  className,
  loading = 'lazy',
  fetchPriority = 'auto',
  sizes,
  width,
  height,
}: SmartImageProps) {
  const hasIntrinsic = typeof width === 'number' && typeof height === 'number'

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      draggable={false}
      {...(hasIntrinsic ? { width, height, ...(sizes ? { sizes } : {}) } : {})}
    />
  )
}
