import clsx from 'clsx'
import { HTMLAttributes } from 'react'

const classes = {
  base: 'rounded-full flex justify-center items-center',
  withoutSrc: 'p-4 select-none bg-base-300',
}

export const getStringFromAlt = (altStr: string): string => {
  if (!altStr) return ''
  const array = altStr.split(' ')
  if (array.length > 1) {
    return `${array[0].substring(0, 1) + array[1].substring(0, 1)}`.toUpperCase()
  }
  return array.length ? `${array[0].substring(0, 1)}`.toUpperCase() : ''
}

export type AvatarProps = HTMLAttributes<HTMLImageElement | HTMLDivElement> & {
  size: number
  src?: string
  className?: string
  alt: string
}

const Avatar = ({
  size = 24,
  src,
  alt,
  className,
  ...props
}: AvatarProps) => {
  return src ? (
    <img
      src={src}
      alt={alt}
      className={clsx(classes.base, className)}
      style={{ width: size, height: size }}
      {...props}
    />
  ) : (
    <div
      className={clsx(classes.base, classes.withoutSrc, className)}
      style={{ width: size, height: size }}
      {...props}
    >
      {getStringFromAlt(alt)}
    </div>
  )
}

export default Avatar
