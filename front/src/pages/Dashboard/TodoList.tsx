import { Button, Input, useToast } from '@coco-ui/core'
import { TodoApi } from '@/api/TodoApi'
import clsx from 'clsx'
import { formatRelative } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Todo } from '@/models/Todo'
import { Controller, useForm } from 'react-hook-form'
import { useState } from 'react'
import { CheckIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useI18n } from '@/i18n'

type TodoFormValues = { description: string }

type TodoListProps = {
  data?: Todo[]
  onSubmitSuccess?: () => Promise<void>
}
const TodoList = ({ data, onSubmitSuccess }: TodoListProps) => {
  const { t } = useI18n()
  const [editMode, setEditMode] = useState<string>()
  const toast = useToast()

  const methodsCreate = useForm<TodoFormValues>({
    mode: 'onChange',
    values: {
      description: '',
    },
  })

  const methodsUpdate = useForm<TodoFormValues>({
    mode: 'onChange',
    values: {
      description: '',
    },
  })

  const handleDone = (id: string) => async () => {
    try {
      await TodoApi.done(id)
      await onSubmitSuccess?.()
      toast.success(t('dashboard.todos.form.submit.edit.success'))
    } catch {
      toast.error(t('genericFormError'))
    }
  }

  const onSubmit = async (values: TodoFormValues) => {
    try {
      await TodoApi.create(values)
      await onSubmitSuccess?.()
      methodsCreate.reset({ description: '' })
      toast.success(t('dashboard.todos.form.submit.success'))
    } catch {
      toast.error(t('genericFormError'))
    }
  }

  const handleEdit = (id: string, description: string) => () => {
    setEditMode(id)
    methodsUpdate.reset({ description })
  }

  const onSubmitUpdate = async ({ description }: TodoFormValues) => {
    try {
      if (editMode) {
        await TodoApi.update(editMode, { description })
        await onSubmitSuccess?.()
        setEditMode(undefined)
        toast.success(t('dashboard.todos.form.submit.edit.success'))
      }
    } catch {
      toast.error(t('genericFormError'))
    }
  }

  const handleCancelEdit = () => {
    setEditMode(undefined)
    methodsUpdate.reset({ description: '' })
  }

  return (
    <div className="border rounded flex flex-col">
      <div className="px-2 py-4 grid md:grid-cols-12 bg-base-300 rounded-t ">
        <div className="md:col-span-2">{t('dashboard.todos.headers.createdAt')}</div>
        <div className="md:col-span-2">{t('dashboard.todos.headers.createdBy')}</div>
        <div className="md:col-span-4">{t('dashboard.todos.headers.description')}</div>
        <div className="md:col-span-2">{t('dashboard.todos.headers.doneAt')}</div>
        <div className="md:col-span-2">{t('dashboard.todos.headers.doneBy')}</div>
      </div>
      <form
        className="p-2 flex justify-between gap-4"
        onSubmit={methodsCreate.handleSubmit(onSubmit)}
      >
        <Controller
          name="description"
          control={methodsCreate.control}
          rules={{ required: true, minLength: 3 }}
          render={({ field, fieldState }) => (
            <Input
              type="text"
              className="flex-grow"
              placeholder={t('dashboard.todos.form.fields.description.placeholder')}
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
          disabled={!methodsCreate.formState.isValid || methodsCreate.formState.isSubmitting}
          variant="primary"
          size="md"
        >
          Ajouter
        </Button>
      </form>
      {data && data.length === 0 ? <div className="p-2">{t('dashboard.todos.empty')}</div> : null}
      {data && data.length > 0 ? (
        <div className="flex flex-col">
          {data?.map(todo =>
            editMode === todo.id && !todo.doneAt ? (
              <form
                onSubmit={methodsUpdate.handleSubmit(onSubmitUpdate)}
                name={`edit-todo-${todo.id}`}
                key={todo.id}
                className={clsx('grid gap-2 md:grid-cols-12 py-3 px-4 items-center', {
                  'bg-success bg-opacity-50 text-success-content': !!todo.doneAt,
                })}
              >
                <div className="md:col-span-2">
                  {formatRelative(new Date(todo.createdAt), Date.now(), {
                    locale: fr,
                  })}
                </div>
                <div className="md:col-span-2">{todo.createdBy}</div>
                <div className="md:col-span-6">
                  <Controller
                    name="description"
                    rules={{ required: true, minLength: 3 }}
                    control={methodsUpdate.control}
                    render={({ field, fieldState }) => (
                      <Input
                        type="text"
                        placeholder={t('dashboard.todos.form.fields.description.placeholder')}
                        name={field.name}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        value={field.value}
                        error={fieldState.invalid}
                      />
                    )}
                  />
                </div>
                <div className="md:col-span-2 justify-end items-center flex gap-2">
                  <Button
                    variant="success"
                    type="submit"
                    disabled={
                      !methodsUpdate.formState.isValid || methodsUpdate.formState.isSubmitting
                    }
                  >
                    <CheckIcon className="w-5" />
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    type="button"
                    variant="error"
                    disabled={methodsUpdate.formState.isSubmitting}
                  >
                    <XMarkIcon className="w-5" />
                  </Button>
                </div>
              </form>
            ) : (
              <div
                key={todo.id}
                className={clsx('grid gap-2 min-h-16 md:grid-cols-12 py-3 px-4 items-center', {
                  'bg-success bg-opacity-50 text-success-content': !!todo.doneAt,
                })}
              >
                <div className="md:col-span-2">
                  {formatRelative(new Date(todo.createdAt), Date.now(), {
                    locale: fr,
                  })}
                </div>
                <div className="md:col-span-2">{todo.createdBy}</div>
                <div className="md:col-span-4 break-all">{todo.description}</div>
                {!todo.doneAt ? (
                  <div className="md:col-span-4 justify-end items-center flex gap-2">
                    <Button onClick={handleEdit(todo.id, todo.description)} variant="info" outline>
                      <PencilIcon className="w-5" />
                    </Button>
                    <Button outline onClick={handleDone(todo.id)} variant="success">
                      <CheckIcon className="w-5" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="md:col-span-2">
                      {formatRelative(new Date(todo.doneAt), Date.now(), {
                        locale: fr,
                      })}
                    </div>
                    <div className="md:col-span-2">{todo.doneBy}</div>
                  </>
                )}
              </div>
            ),
          )}
        </div>
      ) : null}
    </div>
  )
}

export default TodoList
