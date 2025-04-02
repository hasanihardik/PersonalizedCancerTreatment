import React, { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import ColumnContainer from "./ColumnContainer";
import TaskCard from "./TaskCard";
import { IconPlus } from "@tabler/icons-react";
import { useEffect } from "react"; // Import useEffect

// Helper to parse initial data safely
const parseInitialData = (data) => {
  if (!data || typeof data !== 'object') {
    return { columns: [], tasks: [] };
  }

  // Assuming data structure is { "Column Title 1": ["Task 1", "Task 2"], "Column Title 2": [...] }
  // Or potentially { columns: [...], tasks: [...] } if the AI returns that structure
  let parsedColumns = [];
  let parsedTasks = [];

  if (Array.isArray(data.columns) && Array.isArray(data.tasks)) {
      // Handle { columns: [...], tasks: [...] } structure
      parsedColumns = data.columns.map(col => ({ id: col?.id || generateId(), title: col?.title || "Untitled" }));
      const columnIdMap = new Map(parsedColumns.map(col => [col.title, col.id])); // Map title to ID for task assignment

      parsedTasks = data.tasks.map(task => ({
          id: task?.id || generateId(),
          // Ensure columnId exists, fallback if needed
          columnId: task?.columnId || columnIdMap.get(task?.columnTitle) || parsedColumns[0]?.id, // Fallback logic might need adjustment
          content: task?.content || "Untitled Task"
      }));

  } else {
      // Handle { "Column Title": ["Task Content", ...] } structure
      let taskCounter = 0;
      Object.entries(data).forEach(([columnTitle, taskContents], index) => {
          const columnId = generateId(); // Generate ID for column
          parsedColumns.push({ id: columnId, title: columnTitle });

          if (Array.isArray(taskContents)) {
              taskContents.forEach((content) => {
                  parsedTasks.push({
                      id: generateId(), // Generate ID for task
                      columnId: columnId,
                      content: content,
                  });
                  taskCounter++;
              });
          }
      });
  }


  // Basic validation/fallback
  if (parsedColumns.length === 0) {
      parsedColumns = [{ id: 'todo', title: 'To Do' }];
  }
  // Ensure all tasks have a valid columnId
  const validColumnIds = new Set(parsedColumns.map(c => c.id));
  parsedTasks = parsedTasks.filter(t => validColumnIds.has(t.columnId));


  return { columns: parsedColumns, tasks: parsedTasks };
};


function KanbanBoard({ initialData, recordId }) { // Accept initialData and recordId props
  // Initialize state based on parsed initialData
  const { columns: initialColumns, tasks: initialTasks } = useMemo(() => parseInitialData(initialData), [initialData]);

  const [columns, setColumns] = useState(initialColumns);
  const [tasks, setTasks] = useState(initialTasks);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [activeColumn, setActiveColumn] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  // Update state if initialData prop changes (new record selected)
  useEffect(() => {
    console.log("KanbanBoard: initialData prop changed for recordId:", recordId);
    const { columns: newColumns, tasks: newTasks } = parseInitialData(initialData);
    setColumns(newColumns);
    setTasks(newTasks);
  }, [initialData, recordId]); // Dependency array includes initialData and recordId

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }), // Reduced distance for easier drag start
  );

  return (
    <div className="mt-5 min-h-screen w-72 text-white">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => createNewColumn()}
            className="flex h-[60px] w-[350px] min-w-[350px] cursor-pointer gap-2 rounded-lg border-2 bg-[#f5f5f5] p-4 font-medium text-black ring-green-500 hover:ring-2 dark:border-columnBackgroundColor dark:bg-mainBackgroundColor dark:text-white"
          >
            <IconPlus />
            Add Column
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id,
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </div>
  );

  function createTask(columnId) {
    const newTask = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };
    setTasks([...tasks, newTask]);
  }

  function deleteTask(id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  function updateTask(id, content) {
    const newTasks = tasks.map((task) =>
      task.id === id ? { ...task, content } : task,
    );
    setTasks(newTasks);
  }

  function createNewColumn() {
    const newColumn = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, newColumn]);
  }

  function deleteColumn(id) {
    setColumns(columns.filter((col) => col.id !== id));
    setTasks(tasks.filter((task) => task.columnId !== id));
  }

  function updateColumn(id, title) {
    setColumns(columns.map((col) => (col.id === id ? { ...col, title } : col)));
  }

  function onDragStart(event) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
    } else if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  }

  function onDragEnd(event) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    if (active.id === over.id) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (isActiveAColumn) {
      setColumns((columns) => {
        const activeIndex = columns.findIndex((col) => col.id === active.id);
        const overIndex = columns.findIndex((col) => col.id === over.id);
        return arrayMove(columns, activeIndex, overIndex);
      });
    } else {
      const isActiveATask = active.data.current?.type === "Task";
      const isOverATask = over.data.current?.type === "Task";
      if (isActiveATask && isOverATask) {
        setTasks((tasks) => {
          const activeIndex = tasks.findIndex((t) => t.id === active.id);
          const overIndex = tasks.findIndex((t) => t.id === over.id);
          if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
            tasks[activeIndex].columnId = tasks[overIndex].columnId;
            return arrayMove(tasks, activeIndex, overIndex - 1);
          }
          return arrayMove(tasks, activeIndex, overIndex);
        });
      } else if (isActiveATask) {
        setTasks((tasks) => {
          const activeIndex = tasks.findIndex((t) => t.id === active.id);
          tasks[activeIndex].columnId = over.id;
          return arrayMove(tasks, activeIndex, activeIndex);
        });
      }
    }
  }

  function onDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    if (active.id === over.id) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === active.id);
        const overIndex = tasks.findIndex((t) => t.id === over.id);
        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }
        return arrayMove(tasks, activeIndex, overIndex);
      });
    } else if (isActiveATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === active.id);
        tasks[activeIndex].columnId = over.id;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

function generateId() {
  return Math.floor(Math.random() * 10001);
}

export default KanbanBoard;
