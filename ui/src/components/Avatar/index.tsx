import { tw } from "lib/utils"
import { type HTMLAttributes, useEffect, useState } from "react"

const classes = {
	base: "relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full",
}

export type AvatarProps = HTMLAttributes<HTMLImageElement | HTMLDivElement> & {
	src?: string
	className?: string
	alt?: string
	charCount?: number
}

export const Avatar = ({
	src,
	alt,
	className,
	charCount = 1,
	...props
}: AvatarProps) => {
	const [displayImg, setDisplayImg] = useState(src !== undefined)

	useEffect(() => {
		setDisplayImg(src !== undefined)
	}, [src])

	return src && displayImg ? (
		<img
			{...props}
			src={src}
			alt={alt ?? ""}
			className={tw(classes.base, className)}
			onError={() => {
				setDisplayImg(false)
			}}
		/>
	) : (
		<div className={tw(classes.base, "border", className)} {...props}>
			{`${alt}`.slice(0, charCount).toUpperCase()}
		</div>
	)
}
