import { Loader as CocoLoader } from '@coco-ui/core'
import { ComponentProps } from 'react'

const Loader = ({ size }: ComponentProps<typeof CocoLoader>) => <CocoLoader size={size} />

export default Loader
