import { Alert } from '@coco-ui/core'
import { useFormContext } from 'react-hook-form'

export const FormErrorAlert = () => {
  const {
    formState: { errors },
  } = useFormContext()

  if (errors.root?.message) {
    return <Alert variant="error">{errors.root.message}</Alert>
  }

  return null
}
