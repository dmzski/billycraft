import { Button, Input } from '@coco-ui/core'
import { TodoApi } from 'api/TodoApi'
import { STRINGS } from 'constants/strings'
// eslint-disable-next-line import/no-duplicates
import { formatRelative } from 'date-fns'
// eslint-disable-next-line import/no-duplicates
import { fr } from 'date-fns/locale'
import { useToast } from 'providers/ToastProvider'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useQuery } from 'react-query'

const dateOffset = 24 * 60 * 60 * 1000 * 7 // 5 days

const TodoList = (): JSX.Element => {
  const { data, refetch } = useQuery(
    'todos-dashboard',
    () => TodoApi.findAllFinishedAfter(new Date(Date.now() - dateOffset)),
    {
      refetchOnWindowFocus: false,
    },
  )
  const [editMode, setEditMode] = React.useState<number>()
  const [editTodo, setEditTodo] = React.useState('')
  const toast = useToast()

  const { handleSubmit, control, reset, formState } = useForm({
    mode: 'all',
  })

  const handleDone = React.useCallback(
    (id: number) => () => {
      const fn = async () => {
        try {
          await TodoApi.done(id)
          refetch()
          toast.show({ message: STRINGS.SAVE_SUCCESS, variant: 'success' })
        } catch {
          toast.show({ message: STRINGS.SAVE_ERROR, variant: 'error' })
        }
      }
      fn()
    },
    [toast, refetch],
  )

  const handleChangeEdit: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(event => {
    setEditTodo(event.target.value)
  }, [])

  const onSubmit = React.useCallback(
    (values: { description: string }) => {
      const fn = async () => {
        try {
          await TodoApi.create(values)
          reset({ description: '' })
          refetch()
          toast.show({ message: STRINGS.SAVE_SUCCESS, variant: 'success' })
        } catch {
          toast.show({
            message: STRINGS.SAVE_ERROR,
            variant: 'error',
          })
        }
      }
      fn()
    },
    [toast, refetch, reset],
  )

  const handleEdit = React.useCallback(
    (id: number, description: string) => () => {
      setEditMode(id)
      setEditTodo(description)
    },
    [],
  )

  const handleEditTodo = React.useCallback(() => {
    const fn = async () => {
      try {
        await TodoApi.update(editMode as number, { description: editTodo })
        setEditTodo('')
        setEditMode(undefined)
        refetch()
        toast.show({ message: STRINGS.SAVE_SUCCESS, variant: 'success' })
      } catch {
        toast.show({
          message: STRINGS.SAVE_ERROR,
          variant: 'error',
        })
      }
    }
    fn()
  }, [toast, refetch, editTodo, editMode])

  const handleCancelEdit = React.useCallback(() => {
    setEditMode(undefined)
    setEditTodo('')
  }, [])

  return (
    <div>
      <div className="mb-4 flex font-semibold">
        <div className="ml-4 w-2/12">Crée le</div>
        <div className="ml-2 w-2/12">Crée par</div>
        <div className="ml-2 w-4/12">Description</div>
        <div className="ml-2 w-4/12" />
      </div>
      <form className="flex mb-4" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="description"
          control={control}
          defaultValue=""
          rules={{ required: true, minLength: 3 }}
          render={({ field, fieldState }) => (
            <Input
              className="mr-4 w-full"
              placeholder="Nouveau todo"
              name={field.name}
              onChange={field.onChange}
              onBlur={field.onBlur}
              value={field.value}
              error={fieldState.invalid}
            />
          )}
        />
        <Button
          type="submit"
          disabled={!formState.isValid || formState.isSubmitting}
          variant="inverted-primary"
          size="md"
        >
          Ajouter
        </Button>
      </form>
      {data?.map(todo => (
        <div key={todo.id} className="shadow mb-4 flex py-1 items-center">
          <div className="ml-2 w-2/12">
            {formatRelative(new Date(todo.createdAt), Date.now(), {
              locale: fr,
            })}
          </div>
          <div className="ml-2 w-2/12">{todo.createdBy}</div>
          <div className="mx-2 w-4/12 break-all">
            {editMode !== todo.id ? (
              todo.description
            ) : (
              <Input onChange={handleChangeEdit} value={editTodo} name={`description-${todo.id}`} />
            )}
          </div>
          <div className="w-4/12">
            {!todo.doneAt && editMode === todo.id ? (
              <div className="flex items-center">
                <Button
                  className="mr-4"
                  variant="success"
                  size="sm"
                  iconSize={18}
                  icon="save"
                  onClick={handleEditTodo}
                >
                  Enregistrer
                </Button>
                <Button onClick={handleCancelEdit} variant="error" size="sm" iconSize={18} icon="x">
                  Annuler
                </Button>
              </div>
            ) : null}
            {!todo.doneAt && editMode !== todo.id ? (
              <div className="flex">
                <Button
                  onClick={handleEdit(todo.id, todo.description)}
                  className="mr-4"
                  variant="info"
                  size="sm"
                  iconSize={18}
                  icon="pencil"
                >
                  Modifier
                </Button>
                <Button
                  onClick={handleDone(todo.id)}
                  variant="success"
                  size="sm"
                  iconSize={18}
                  icon="check"
                >
                  Fait
                </Button>
              </div>
            ) : null}
            {todo.doneAt ? (
              <div className="flex py-1 text-success-600">
                <div>
                  Fait&nbsp;
                  {formatRelative(new Date(todo.doneAt), Date.now(), {
                    locale: fr,
                  })}
                  &nbsp; par <span className="font-bold">{todo.doneBy}</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}

export default TodoList
