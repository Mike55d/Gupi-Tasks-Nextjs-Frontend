'use client';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import { DragDropContext } from "react-beautiful-dnd";
import axios from 'axios';
import Column from "./components/Column";

const Home = () => {
  const [winReady, setwinReady] = useState(false);
  const [dataTasks, setDataTasks] = useState<any>([]);
  const [currentTasks, setCurrentTasks] = useState<any>([]);
  const [currentColumns, setCurrentColumns] = useState<any>([]);

  const getData = async () => {
    const res = await axios.get('http://localhost:3001/tasks');
    const dataTasksParsed = res.data.columns.map((column: any) => {
      const tasksColumn = column.taskIds.map((_id: any) => res.data.tasks.find((task: any) => task._id == _id));
      return { ...column, tasks: tasksColumn }
    });
    setDataTasks(dataTasksParsed);
    setCurrentTasks(res.data.tasks);
    setCurrentColumns(res.data.columns);
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setTimeout(() => setwinReady(true), 500);
  }, []);

  const changeColumn = async (columnId: string, columnIdDestiny: string, taskId: string, indexDestiny: any) => {
    await axios.post('http://localhost:3001/tasks/changeColumn', {
      columnIdDestiny,
      columnId,
      taskId,
      indexDestiny,
    });
  }

  const changeOrder = async (newTaskIds: string[], columnId: string) => {
    await axios.post('http://localhost:3001/tasks/changeOrder', {
      newTaskIds,
      columnId
    });
  }

  const handleDragEnd = (event: any) => {
    const { destination, source, draggableId } = event;

    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const column = dataTasks.find((column: any) => column._id == source.droppableId);
    const columnDestiny = dataTasks.find((column: any) => column._id == destination.droppableId);

    if (column === columnDestiny) {
      const columnIndex = currentColumns.findIndex((column: any) => column._id == source.droppableId);
      const newTaskIds = column ? [...column.taskIds] : [];
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      const newColumn = {
        ...column,
        taskIds: newTaskIds
      }
      const tasksColumn = newColumn.taskIds.map((_id: any) => currentTasks.find((task: any) => task._id == _id));
      const newColumns = [...dataTasks];
      newColumns[columnIndex] = { ...newColumn, tasks: tasksColumn }
      changeOrder(newTaskIds, column._id);
      setDataTasks(newColumns);
      return
    }

    const columnIndex = currentColumns.findIndex((column: any) => column._id == source.droppableId);
    const columnIndexDestiny = currentColumns.findIndex((column: any) => column._id == destination.droppableId);
    const newTaskIds = column ? [...column.taskIds] : [];
    newTaskIds.splice(source.index, 1);
    const newTaskIdsDestiny = columnDestiny ? [...columnDestiny.taskIds] : [];
    newTaskIdsDestiny.splice(destination.index, 0, draggableId);
    const newColumn = {
      ...column,
      taskIds: newTaskIds
    }
    const newColumnDestiny = {
      ...columnDestiny,
      taskIds: newTaskIdsDestiny
    }
    const tasksColumn = newColumn.taskIds.map((_id: any) => currentTasks.find((task: any) => task._id == _id));
    const tasksColumnDestiny = newColumnDestiny.taskIds.map((_id: any) => currentTasks.find((task: any) => task._id == _id));
    const newColumns = [...dataTasks];
    newColumns[columnIndex] = { ...newColumn, tasks: tasksColumn };
    newColumns[columnIndexDestiny] = { ...newColumnDestiny, tasks: tasksColumnDestiny };
    setDataTasks(newColumns);
    changeColumn(column._id, columnDestiny._id, draggableId, destination.index)
  }

  const handleCreateTask = async (task: any, columnId: string) => {
    await axios.post('http://localhost:3001/tasks', {
      task,
      columnId
    });
    getData();
  }

  const handleDeleteTask = async (taskId: string, columnId: string) => {
    await axios.delete('http://localhost:3001/tasks', {
      data: {
        taskId,
        columnId
      }
    });
    getData();
  }


  return (
    <DragDropContext
      onDragEnd={handleDragEnd}
    >
      <Grid container spacing={2}>
        {
          winReady ? (
            <>
              {dataTasks.map((item: any) => (
                <Column tasks={item.tasks} title={item.title} columnId={item._id} key={item._id} handleCreateTask={handleCreateTask} handleDeleteTask={handleDeleteTask} />
              ))}
            </>
          ) : null
        }
      </Grid>
    </DragDropContext>
  )
}

export default Home;
