import clsx from 'clsx'
import {
  ChangeEventHandler,
  FocusEventHandler,
  forwardRef,
  KeyboardEventHandler,
  MouseEventHandler,
} from 'react'

const classes = {
  container: 'form-control',
  input: 'input input-bordered',
  label: 'label',
  labelText: 'label-text',
  inputError: 'input-error',
  sizes: {
    xs: 'input-xs',
    sm: 'input-sm',
    md: 'input-md',
    lg: 'input-lg',
  },
} as const

export type InputProps = {
  label?: string
  error?: string | boolean
  type?: string
  required?: boolean
  disabled?: boolean
  name?: string
  id?: string
  onFocus?: FocusEventHandler<HTMLInputElement>
  onBlur?: FocusEventHandler<HTMLInputElement>
  onChange?: ChangeEventHandler<HTMLInputElement>
  onClick?: MouseEventHandler<HTMLInputElement>
  className?: string
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>
  onKeyUp?: KeyboardEventHandler<HTMLInputElement>
  placeholder?: string
  value?: string | number
  autoComplete?: string
  autoCorrect?: string
  inputMode?:
  | 'text'
  | 'none'
  | 'search'
  | 'email'
  | 'tel'
  | 'numeric'
  | 'decimal'
  | 'url'
  pattern?: string
  autoCapitalize?: string
  min?: number
  max?: number
  maxLength?: number
  minLength?: number
  step?: number
  readOnly?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, className, error, ...props }, ref) => (
    <div className={clsx(classes.container, className)}>
      {label ? (<label htmlFor={id} className={classes.label}>
        <span className={classes.labelText}>{label}</span>
      </label>) : null}
      <input
        className={clsx(
          classes.input,
          !error && 'focus:border-primary focus:outline-primary',
          error && classes.inputError
        )}
        {...props}
        ref={ref}
        id={id}
      />
      {error && typeof error === 'string' ? (
        <span className="label-text-alt text-error mt-1">{error}</span>
      ) : null}
    </div>
  )
)

Input.displayName = 'Input'

export default Input
