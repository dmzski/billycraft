import clsx from 'clsx'
import {
  ChangeEventHandler,
  FocusEventHandler,
  forwardRef,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  useId,
} from 'react'

const classes = {
  container: 'form-control',
  input: 'input input-bordered',
  label: 'label py-1',
  labelText: 'label-text inline-flex gap-1',
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
  inputMode?: 'text' | 'none' | 'search' | 'email' | 'tel' | 'numeric' | 'decimal' | 'url'
  pattern?: string
  autoCapitalize?: string
  min?: number
  max?: number
  maxLength?: number
  minLength?: number
  step?: number
  readOnly?: boolean
  prefix?: ReactNode
  suffix?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id: idProp, className, error, prefix, suffix, required, ...props }, ref) => {
    const generatedId = useId()
    const id = idProp ?? generatedId

    return (
      <div className={clsx(classes.container, className)}>
        {label ? (
          <label htmlFor={id} className={classes.label}>
            <span className={classes.labelText}>
              {label}
              {required ? <span className="text-error">*</span> : null}
            </span>
          </label>
        ) : null}
        <div
          className={clsx(
            classes.input,
            'flex items-center gap-2',
            !error ? 'focus:border-primary focus:outline-primary' : 'input-error',
          )}
        >
          {prefix ? <div className="border-r pr-4 h-full flex items-center">{prefix}</div> : null}
          <input className="grow" {...props} ref={ref} required={required} id={id} />
          {required && !label ? <span className="text-error">*</span> : null}
          {suffix ? <div className="border-l pl-4 h-full flex items-center">{suffix}</div> : null}
        </div>
        {error && typeof error === 'string' ? (
          <span className="label-text-alt text-error mt-1">{error}</span>
        ) : null}
      </div>
    )
  },
)

Input.displayName = 'Input'

export default Input
