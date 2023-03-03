'use client';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import Column from "./Column";
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ColumnModal from './ColumnModal';
import { ToastContainer } from 'react-toastify';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { changeColumnTask, changeOrderTask, getData } from "../api/task";
import { Column as ColumnModel, DataTasks, Task } from '../models';

const Home = () => {
  const [winReady, setwinReady] = useState(false);
  const [dataTasks, setDataTasks] = useState<DataTasks[]>([]);
  const [openColumnModal, setOpenColumnModal] = useState<boolean>(false);
  const { data } = useQuery("dataTasks", getData);
  const { mutate: changeColumn } = useMutation(changeColumnTask);
  const { mutate: changeOrder } = useMutation(changeOrderTask);

  useEffect(() => {
    if (!data) return;
    const dataTasksParsed: DataTasks[] = data.columns.map((column: ColumnModel) => {
      const tasksColumn = column.taskIds.map((_id: string) => data.tasks.find((task: Task) => task._id == _id));
      return { ...column, tasks: tasksColumn }
    });
    setDataTasks(dataTasksParsed);
  }, [data])

  useEffect(() => {
    setTimeout(() => setwinReady(true), 500);
  }, []);

  const toggleColumnModal = (value: boolean) => {
    setOpenColumnModal(value);
  }

  const handleDragEnd = (event: DropResult) => {
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
    if (!data) return;
    const column = dataTasks.find((column: DataTasks) => column._id == source.droppableId);
    const columnDestiny = dataTasks.find((column: DataTasks) => column._id == destination.droppableId);
    if (!column || !columnDestiny) return;

    if (column === columnDestiny) {
      const columnIndex = data.columns.findIndex((column: ColumnModel) => column._id == source.droppableId);
      const newTaskIds = column ? [...column.taskIds] : [];
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      const newColumn = {
        ...column,
        taskIds: newTaskIds
      }
      const tasksColumn = newColumn.taskIds.map((_id: string) => data.tasks.find((task: Task) => task._id == _id));
      const newColumns = [...dataTasks];
      newColumns[columnIndex] = { ...newColumn, tasks: tasksColumn }
      changeOrder({ newTaskIds, columnId: column._id });
      setDataTasks(newColumns);
      return
    }

    const columnIndex = data.columns.findIndex((column: ColumnModel) => column._id == source.droppableId);
    const columnIndexDestiny = data.columns.findIndex((column: ColumnModel) => column._id == destination.droppableId);
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
    const tasksColumn = newColumn.taskIds.map((_id: string) => data.tasks.find((task: Task) => task._id == _id));
    const tasksColumnDestiny = newColumnDestiny.taskIds.map((_id: string) => data.tasks.find((task: Task) => task._id == _id));
    const newColumns = [...dataTasks];
    newColumns[columnIndex] = { ...newColumn, tasks: tasksColumn };
    newColumns[columnIndexDestiny] = { ...newColumnDestiny, tasks: tasksColumnDestiny };
    setDataTasks(newColumns);
    changeColumn({
      columnId: column._id,
      columnIdDestiny: columnDestiny._id,
      taskId: draggableId,
      indexDestiny: destination.index
    });
  }

  return (
    <>
      <Grid container style={{ marginTop: 20, paddingLeft: 10, paddingRight: 10 }}>
        <Grid item xs={11}>
          <DragDropContext
            onDragEnd={handleDragEnd}
          >
            <Grid container spacing={1}>
              {
                winReady ? (
                  <>
                    {dataTasks.map((item: DataTasks) => (
                      <Column {...item} key={item._id} />
                    ))}
                  </>
                ) : null
              }
            </Grid>
          </DragDropContext>
        </Grid>
        <Grid item xs={1}>
          <Button
            variant="contained"
            color='success'
            endIcon={<AddCircleIcon />}
            onClick={() => toggleColumnModal(true)}
          >
            Column
          </Button>
        </Grid>
      </Grid>
      <ColumnModal
        open={openColumnModal}
        toggleModal={toggleColumnModal}
      />
      <ToastContainer />
    </>
  )
}

export default Home;
