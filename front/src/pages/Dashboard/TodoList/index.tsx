import { Button, TextInput } from "@coco-ui/core";
import { TodoApi } from "api/TodoApi";
import { formatRelative } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "providers/ToastProvider";
import React from "react";
import { useQuery } from "react-query";

const TodoList = (): JSX.Element => {
  const { data, refetch } = useQuery("todos", TodoApi.findAll, {
    refetchOnWindowFocus: false,
  });
  const [editMode, setEditMode] = React.useState<number>();
  const [newTodo, setNewTodo] = React.useState("");
  const [editTodo, setEditTodo] = React.useState("");
  const toast = useToast();

  const handleDone = React.useCallback(
    (id: number) => () => {
      const fn = async () => {
        try {
          await TodoApi.done(id);
          refetch();
          toast.show({ message: "Tâche mise à jour", variant: "success" });
        } catch (err) {
          toast.show({ message: "Une erreur est survenue", variant: "error" });
        }
      };
      fn();
    },
    [toast, refetch]
  );

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
    (event) => {
      setNewTodo(event.target.value);
    },
    []
  );

  const handleChangeEdit: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
    (event) => {
      setEditTodo(event.target.value);
    },
    []
  );

  const handleAddTodo = React.useCallback(() => {
    const fn = async () => {
      try {
        await TodoApi.create({ description: newTodo });
        setNewTodo("");
        refetch();
        toast.show({ message: "Tâche crée", variant: "success" });
      } catch {
        toast.show({
          message: "Une erreur est survenue",
          variant: "error",
        });
      }
    };
    fn();
  }, [toast, refetch, newTodo]);

  const handleEdit = React.useCallback(
    (id: number, description: string) => () => {
      setEditMode(id);
      setEditTodo(description);
    },
    []
  );

  const handleEditTodo = React.useCallback(() => {
    const fn = async () => {
      try {
        await TodoApi.update(editMode as number, { description: editTodo });
        setEditTodo("");
        setEditMode(undefined);
        refetch();
        toast.show({ message: "Tâche modifiée", variant: "success" });
      } catch {
        toast.show({
          message: "Une erreur est survenue",
          variant: "error",
        });
      }
    };
    fn();
  }, [toast, refetch, editTodo, editMode]);

  const handleCancelEdit = React.useCallback(() => {
    setEditMode(undefined);
    setEditTodo("");
  }, []);

  return (
    <div>
      <div className="mb-4 flex font-semibold">
        <div className="ml-4 w-2/12">Crée le</div>
        <div className="ml-2 w-2/12">Crée par</div>
        <div className="ml-2 w-4/12">Description</div>
        <div className="ml-2 w-4/12" />
      </div>
      {data?.map((todo) => (
        <div key={todo.id} className={`shadow mb-4 p-2 flex`}>
          <div className="ml-2 w-2/12">
            {formatRelative(new Date(todo.createdAt), Date.now(), {
              locale: fr,
            })}
          </div>
          <div className="ml-2 w-2/12">{todo.createdBy}</div>
          <div className="ml-2 w-4/12">
            {editMode !== todo.id ? (
              todo.description
            ) : (
              <TextInput
                onChange={handleChangeEdit as any}
                value={editTodo}
                name={`description-${todo.id}`}
              />
            )}
          </div>
          <div className="ml-2 w-4/12">
            {!todo.doneAt && editMode === todo.id ? (
              <div className="flex items-center">
                <Button
                  className="mr-4"
                  variant="success"
                  size="md"
                  icon="save"
                  onClick={handleEditTodo}
                >
                  Enregistrer
                </Button>
                <Button
                  onClick={handleCancelEdit}
                  variant="error"
                  size="md"
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
                  iconSize={18}
                  className="mr-4"
                  variant="info"
                  size="md"
                  icon="pencil"
                >
                  Modifier
                </Button>
                <Button
                  onClick={handleDone(todo.id)}
                  variant="success"
                  size="md"
                  icon="check"
                >
                  Fait
                </Button>
              </div>
            ) : null}
            {todo.doneAt ? (
              <div className="flex text-success-700 font-bold">
                <div>
                  Fait&nbsp;
                  {formatRelative(new Date(todo.doneAt), Date.now(), {
                    locale: fr,
                  })}
                  &nbsp; par {todo.doneBy}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ))}
      <div className="flex mt-4">
        <TextInput
          className="mr-4 w-full"
          placeholder="Nouveau todo"
          name="newTodo"
          onChange={handleChange as any}
          value={newTodo}
        />
        <Button
          onClick={handleAddTodo}
          disabled={newTodo.length === 0}
          variant="inverted-primary"
          size="md"
        >
          Ajouter
        </Button>
      </div>
    </div>
  );
};

export default TodoList;
