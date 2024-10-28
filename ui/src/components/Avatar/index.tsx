import { tw } from 'lib/utils'
import { HTMLAttributes, useState } from 'react'

const classes = {
  base: 'relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full',
}

export type AvatarProps = HTMLAttributes<HTMLImageElement | HTMLDivElement> & {
  src?: string
  className?: string
  alt?: string
  charCount?: number
}

export const Avatar = ({ src, alt, className, charCount = 1, ...props }: AvatarProps) => {
  const [displayImg, setDisplayImg] = useState(src !== undefined)
  return src && displayImg ? (
    <img
      src={src}
      alt={alt}
      className={tw(classes.base, className)}
      onError={() => {
        setDisplayImg(false)
      }}
      {...props}
    />
  ) : (
    <div className={tw(classes.base, 'border', className)} {...props}>
      {`${alt}`.slice(0, charCount).toUpperCase()}
    </div>
  )
}
