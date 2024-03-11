import { Button, Input, useToast } from '@coco-ui/core'
import { TodoApi } from '@/api/TodoApi'
import clsx from 'clsx'
import { STRINGS } from '@/constants/strings'
import { formatRelative } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Todo } from '@/models/Todo'
import { Controller, useForm } from 'react-hook-form'
import { ChangeEventHandler, useCallback, useState } from 'react'
import { ArchiveBoxArrowDownIcon, CheckIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/solid'

type TodoFormValues = { description: string }

type TodoListProps = {
  data?: Todo[]
  onSubmitSuccess?: () => void
}
const TodoList = ({ data, onSubmitSuccess }: TodoListProps) => {
  const [editMode, setEditMode] = useState<number>()
  const [editTodo, setEditTodo] = useState('')
  const toast = useToast()

  const { handleSubmit, control, reset, formState } = useForm<TodoFormValues>({
    mode: 'all',
  })

  const handleDone = useCallback(
    (id: number) => () => {
      const fn = async () => {
        try {
          await TodoApi.done(id)
          onSubmitSuccess?.()
          toast.success(STRINGS.SAVE_SUCCESS)
        } catch {
          toast.error(STRINGS.SAVE_ERROR)
        }
      }
      fn()
    },
    [toast, onSubmitSuccess],
  )

  const handleChangeEdit: ChangeEventHandler<HTMLInputElement> = useCallback(event => {
    setEditTodo(event.target.value)
  }, [])

  const onSubmit = useCallback(
    (values: TodoFormValues) => {
      const fn = async () => {
        try {
          await TodoApi.create(values)
          reset({ description: '' })
          onSubmitSuccess?.()
          toast.success(STRINGS.SAVE_SUCCESS)
        } catch {
          toast.error(STRINGS.SAVE_ERROR)
        }
      }
      fn()
    },
    [toast, onSubmitSuccess, reset],
  )

  const handleEdit = useCallback(
    (id: number, description: string) => () => {
      setEditMode(id)
      setEditTodo(description)
    },
    [],
  )

  const handleEditTodo = useCallback(() => {
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

  const handleCancelEdit = useCallback(() => {
    setEditMode(undefined)
    setEditTodo('')
  }, [])

  return (
    <div className="border rounded flex flex-col">
      <div className="px-2 py-4 grid md:grid-cols-12 bg-base-300 rounded-t ">
        <div className="md:col-span-2">Crée le</div>
        <div className="md:col-span-2">Crée par</div>
        <div className="md:col-span-4">Description</div>
        <div className="md:col-span-4" />
      </div>
      <form className="p-2 flex justify-between gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="description"
          control={control}
          defaultValue=""
          rules={{ required: true, minLength: 3 }}
          render={({ field, fieldState }) => (
            <Input
              type="text"
              className="flex-grow"
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
          variant="primary"
          size="md"
        >
          Ajouter
        </Button>
      </form>
      {data && data.length === 0 ? <div className='p-2'>Aucune tâche à faire</div> : null}
      {data && data.length > 0 ? (
        <div className="flex flex-col">
          {data?.map((todo, index) => (
            <div
              key={todo.id}
              className={clsx('grid gap-2 md:grid-cols-12 py-3 px-4 items-center', {
                'bg-base-200': index % 2 === 0,
              })}
            >
              <div className="md:col-span-2">
                {formatRelative(new Date(todo.createdAt), Date.now(), {
                  locale: fr,
                })}
              </div>
              <div className="md:col-span-2">{todo.createdBy}</div>
              <div className="md:col-span-6 break-all">
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
              <div className="md:col-span-2 justify-end items-end flex">
                {!todo.doneAt && editMode === todo.id ? (
                  <div className="flex gap-2 items-center">
                    <Button variant="success" onClick={handleEditTodo}>
                      <CheckIcon className='w-5' />
                    </Button>
                    <Button onClick={handleCancelEdit} variant="error">
                      <XMarkIcon className='w-5' />
                    </Button>
                  </div>
                ) : null}
                {!todo.doneAt && editMode !== todo.id ? (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleEdit(todo.id, todo.description)}
                      variant="info"
                      outline
                    >
                      <PencilIcon className='w-5' />
                    </Button>
                    <Button outline onClick={handleDone(todo.id)} variant="primary">
                      <ArchiveBoxArrowDownIcon className='w-5' />
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
