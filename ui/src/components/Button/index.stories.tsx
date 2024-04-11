import { StoryObj } from '@storybook/react'
import Button, { ButtonProps } from '.'

export default {
  title: 'Components/Button',
  component: Button,
}
type Story = StoryObj<typeof Button>

const BUTTON_SIZES = {
  lg: 'btn-lg',
  md: 'btn-md',
  sm: 'btn-sm',
  xs: 'btn-xs',
} as const

const BUTTON_VARIANTS = {
  default: '',
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  accent: 'btn-accent',
  info: 'btn-info',
  success: 'btn-success',
  warning: 'btn-warning',
  error: 'btn-error',
  ghost: 'btn-ghost',
  link: 'btn-link',
  glass: 'glass',
} as const

export const Basic: Story = {
  args: {
    children: 'Basic',
    size: 'md',
  },
}

export const Variants = () => (
  <div style={{ display: 'flex', gap: 4 }}>
    {Object.keys(BUTTON_VARIANTS).map(variant => (
      <Button key={variant} variant={variant as ButtonProps['variant']}>
        {variant}
      </Button>
    ))}
  </div>
)

export const Outlined = () => (
  <div style={{ display: 'flex', gap: 4 }}>
    {Object.keys(BUTTON_VARIANTS).map(variant => (
      <Button key={variant} outline variant={variant as ButtonProps['variant']}>
        {variant}
      </Button>
    ))}
  </div>
)

export const Rounded = () => (
  <div style={{ display: 'flex', gap: 4 }}>
    {Object.keys(BUTTON_VARIANTS).map(variant => (
      <Button key={variant} rounded variant={variant as ButtonProps['variant']}>
        {variant.slice(0, 3)}
      </Button>
    ))}
  </div>
)

export const Square = () => (
  <div style={{ display: 'flex', gap: 4 }}>
    {Object.keys(BUTTON_VARIANTS).map(variant => (
      <Button key={variant} square variant={variant as ButtonProps['variant']}>
        X
      </Button>
    ))}
  </div>
)

export const Block = () => (
  <>
    {Object.keys(BUTTON_VARIANTS).map(variant => (
      <Button key={variant} className="mt-2" block variant={variant as ButtonProps['variant']}>
        {variant}
      </Button>
    ))}
  </>
)

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 4 }}>
    {Object.keys(BUTTON_SIZES).map(size => (
      <Button key={size} size={size as ButtonProps['size']}>
        {size}
      </Button>
    ))}
  </div>
)

export const Disabled = () => (
  <div style={{ display: 'flex', gap: 4 }}>
    {Object.keys(BUTTON_VARIANTS).map(variant => (
      <Button key={variant} variant={variant as ButtonProps['variant']} disabled>
        {variant}
      </Button>
    ))}
  </div>
)
