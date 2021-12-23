import { Button, Input } from '@coco-ui/core'
import { OutgoingApi } from 'api/OutgoingApi'
import { STRINGS } from 'constants/strings'
import { endOfMonth, format, formatRFC3339 } from 'date-fns'
import { OutgoingRequest, OutgoingResponse } from 'models/Outgoing'
import { useToast } from 'providers/ToastProvider'
import { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import OutgoingLinesTable from './OutgoingLinesTable'

type FormProps = {
  outgoing?: OutgoingResponse
  onSubmitSuccess?: (res: OutgoingResponse) => void | Promise<void>
  disabledFields?: string[]
}
const Form = ({ outgoing, onSubmitSuccess, disabledFields }: FormProps): JSX.Element => {
  const toast = useToast()
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValid },
    reset,
  } = useForm<OutgoingRequest>({
    mode: 'onBlur',
  })

  const onSubmit = useCallback(
    async ({ name, lines, startDate }: OutgoingRequest) => {
      const data = {
        lines: lines.map((line, index) => ({
          ...line,
          line: index + 1,
          totalHT: Number(line.totalHT) || 0,
          vat: Number(line.vat) || 0,
        })),
        name,
        startDate: formatRFC3339(Date.parse(startDate)),
        endDate: formatRFC3339(endOfMonth(Date.parse(startDate))),
      } as OutgoingRequest
      try {
        const res = outgoing?.id
          ? await OutgoingApi.update(outgoing.id, data)
          : await OutgoingApi.create(data)
        toast.show({
          variant: 'success',
          message: outgoing?.id ? STRINGS.OUTGOING_UPDATED : STRINGS.OUTGOING_CREATED,
        })
        onSubmitSuccess?.(res)
      } catch {
        toast.show({ variant: 'error', message: STRINGS.SAVE_ERROR })
      }
    },
    [outgoing, reset],
  )

  useEffect(() => {
    if (reset && outgoing) {
      reset({
        ...outgoing,
        startDate: outgoing.startDate
          ? format(Date.parse(outgoing.startDate), 'yyyy-MM')
          : undefined,
      })
    }
  }, [reset, outgoing])

  return (
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        rules={{ required: true }}
        control={control}
        render={({ field, fieldState: { invalid } }) => (
          <Input
            className="mb-4"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref}
            error={invalid}
            required
            label="Nom du livret"
            variant="outside"
          />
        )}
      />
      <Controller
        name="startDate"
        rules={{
          required: true,
          validate: async value => {
            if (disabledFields?.includes('startDate')) return undefined

            const date = Date.parse(value)
            try {
              await OutgoingApi.findFirstWithDateIn(date)
              return "Un livret d'achat pour cette période existe déjà"
            } catch {
              return undefined
            }
          },
        }}
        control={control}
        render={({ field, fieldState: { invalid, error } }) => (
          <div className="flex flex-col mb-4">
            <Input
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              error={invalid}
              required
              label="Période du livret"
              variant="outside"
              type="month"
              disabled={disabledFields?.includes(field.name)}
            />
            {error ? <span className="text-error-600 text-xs">{error.message}</span> : null}
          </div>
        )}
      />
      <OutgoingLinesTable control={control} />
      <Button className="mt-4" disabled={isSubmitting || !isValid} type="submit" variant="primary">
        Enregistrer les modifications
      </Button>
    </form>
  )
}

export default Form
