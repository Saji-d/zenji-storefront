interface SmartImageProps {
  src: string
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
  sizes?: string
}

/**
 * Thin wrapper over <img> enforcing lazy-loading, async decoding and
 * non-draggable media. Containers own aspect-ratio, so no CLS.
 */
export function SmartImage({
  src,
  alt,
  className,
  loading = 'lazy',
  fetchPriority = 'auto',
}: SmartImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      draggable={false}
    />
  )
}
