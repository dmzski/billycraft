export type ToastVariant = 'success' | 'warning' | 'error' | 'info' | 'default'
export class Toast {
  static nextId = 0

  id: number

  message: string

  open: boolean

  duration: number

  vertical?: 'top' | 'bottom'

  horizontal?: 'left' | 'center' | 'right'

  variant: ToastVariant

  callback?: () => unknown

  constructor() {
    this.id = Toast.nextId
    this.message = ''
    this.variant = 'default'
    this.open = true
    this.duration = 5000
    Toast.nextId += 1
  }
}
