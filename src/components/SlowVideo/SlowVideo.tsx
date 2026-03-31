'use client'

interface SlowVideoProps {
  src: string
  className?: string | undefined
  rate?: number
}

export default function SlowVideo({ src, className, rate = 0.25 }: SlowVideoProps) {
  return (
    <video
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      ref={(el) => {
        if (el) el.playbackRate = rate
      }}
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}
