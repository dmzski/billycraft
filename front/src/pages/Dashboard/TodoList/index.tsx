import { Button, Input, useToast } from '@coco-ui/core'
import { TodoApi } from 'api/TodoApi'
import clsx from 'clsx'
import { STRINGS } from 'constants/strings'
// eslint-disable-next-line import/no-duplicates
import { formatRelative } from 'date-fns'
// eslint-disable-next-line import/no-duplicates
import { fr } from 'date-fns/locale'
import { Todo } from 'models/Todo'
import * as React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { sendErrorToSentry } from 'utils/errors'

type TodoListProps = {
  data?: Todo[]
  onSubmitSuccess?: () => void
}
const TodoList = ({ data, onSubmitSuccess }: TodoListProps): JSX.Element => {
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
          onSubmitSuccess?.()
          toast.success(STRINGS.SAVE_SUCCESS)
        } catch (error) {
          sendErrorToSentry(error)
          toast.error(STRINGS.SAVE_ERROR)
        }
      }
      fn()
    },
    [toast, onSubmitSuccess],
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
          onSubmitSuccess?.()
          toast.success(STRINGS.SAVE_SUCCESS)
        } catch (error) {
          sendErrorToSentry(error)
          toast.error(STRINGS.SAVE_ERROR)
        }
      }
      fn()
    },
    [toast, onSubmitSuccess, reset],
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
        onSubmitSuccess?.()
        toast.success(STRINGS.SAVE_SUCCESS)
      } catch {
        toast.error(STRINGS.SAVE_ERROR)
      }
    }
    fn()
  }, [toast, onSubmitSuccess, editTodo, editMode])

  const handleCancelEdit = React.useCallback(() => {
    setEditMode(undefined)
    setEditTodo('')
  }, [])

  return (
    <div>
      <div className="mb-4 px-4 grid md:grid-cols-12 font-semibold">
        <div className="md:col-span-2">Crée le</div>
        <div className="md:col-span-2">Crée par</div>
        <div className="md:col-span-4">Description</div>
        <div className="md:col-span-4" />
      </div>
      <form className="flex mb-4" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="description"
          control={control}
          defaultValue=""
          rules={{ required: true, minLength: 3 }}
          render={({ field, fieldState }) => (
            <Input
              className="mr-4 flex-grow"
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
      {data && data.length === 0 ? <div>Aucune tâche à faire</div> : null}
      {data && data.length > 0 ? (
        <div className="flex flex-col">
          {data?.map((todo, index) => (
            <div
              key={todo.id}
              className={clsx('border-b grid md:grid-cols-12 p-4 items-center', {
                'bg-gray-50': index % 2 === 0,
              })}
            >
              <div className="md:col-span-2">
                {formatRelative(new Date(todo.createdAt), Date.now(), {
                  locale: fr,
                })}
              </div>
              <div className="md:col-span-2">{todo.createdBy}</div>
              <div className="md:col-span-4 break-all">
                {editMode !== todo.id ? (
                  todo.description
                ) : (
                  <Input
                    onChange={handleChangeEdit}
                    value={editTodo}
                    name={`description-${todo.id}`}
                  />
                )}
              </div>
              <div className="md:col-span-4">
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
                    <Button
                      onClick={handleCancelEdit}
                      variant="error"
                      size="sm"
                      iconSize={18}
                      icon="x"
                    >
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
                  <div className="text-success-600 py-2">
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
      ) : null}
    </div>
  )
}

export default TodoList
