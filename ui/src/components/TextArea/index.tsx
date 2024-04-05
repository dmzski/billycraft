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
  input: 'textarea textarea-bordered',
  label: 'label',
  labelText: 'label-text',
  inputError: 'textarea-error',
  sizes: {
    xs: 'textarea-xs',
    sm: 'textarea-sm',
    md: 'textarea-md',
    lg: 'textarea-lg',
  },
} as const

export type TextAreaProps = {
  label?: string
  error?: string | boolean
  required?: boolean
  readOnly?: boolean
  disabled?: boolean
  className?: string
  id?: string
  name?: string
  onBlur?: FocusEventHandler<HTMLTextAreaElement>
  onChange?: ChangeEventHandler<HTMLTextAreaElement>
  onClick?: MouseEventHandler<HTMLTextAreaElement>
  onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>
  onKeyUp?: KeyboardEventHandler<HTMLTextAreaElement>
  placeholder?: string
  value?: string
  rows?: number
}



const TextArea = forwardRef<
  HTMLTextAreaElement,
  TextAreaProps
>(
  ({ className, label, error, id, ...props }, ref) => {

    return (
    <div className={clsx(classes.container, className)}>
      {label ? (<label htmlFor={id} className={classes.label}>
        <span className={classes.labelText}>{label}</span>
      </label>) : null}
      <textarea
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
  }
)

TextArea.displayName = 'TextArea'
export default TextArea
