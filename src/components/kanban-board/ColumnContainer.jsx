import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import TaskCard from "./TaskCard";
import { IconPlus, IconTrash } from "@tabler/icons-react";

function ColumnContainer({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  tasks,
  deleteTask,
  updateTask,
}) {
  const [editMode, setEditMode] = useState(false);

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex h-[500px] max-h-[500px] w-[350px] flex-col rounded-md border-2 border-pink-500 bg-[#1c1c24] opacity-40"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex h-[500px] max-h-[500px] w-[350px] flex-col rounded-2xl bg-[#e3e3db] bg-opacity-80 shadow-lg dark:bg-[#1c1c24]"
    >
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className="text-md m-2 flex h-[60px] cursor-grab items-center justify-between rounded-xl bg-[#f5f5f5] p-3 font-bold text-gray-800 dark:bg-[#13131a] dark:text-white"
      >
        <div className="flex gap-2">
          {!editMode && column.title}
          {editMode && (
            <input
              className="rounded border bg-black px-2 outline-none focus:border-green-500"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          onClick={() => {
            deleteColumn(column.id);
          }}
          className="rounded stroke-gray-500 px-1 py-2 hover:bg-[#e3e3db] dark:hover:bg-columnBackgroundColor dark:hover:stroke-white"
        >
          <IconTrash />
        </button>
      </div>

      <div className="scrollable flex flex-grow flex-col gap-4 overflow-y-auto overflow-x-hidden p-2">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>

      <button
        className="flex items-center gap-2 rounded-md border-2 p-4 text-gray-800 hover:bg-[#f5f5f5] hover:text-gray-900 active:bg-white dark:border-columnBackgroundColor dark:border-x-columnBackgroundColor dark:text-white dark:hover:bg-mainBackgroundColor dark:hover:text-green-500 dark:active:bg-black"
        onClick={() => {
          createTask(column.id);
        }}
      >
        <IconPlus />
        Add task
      </button>
    </div>
  );
}

export default ColumnContainer;
