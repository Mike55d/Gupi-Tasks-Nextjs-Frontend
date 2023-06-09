'use client';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import Column from "./Column";
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ColumnModal from './ColumnModal';
import { ToastContainer } from 'react-toastify';
import { useMutation, useQuery } from 'react-query';
import { changeColumnTask, changeOrderTask, getData } from "../api/task";
import { Column as ColumnModel, DataTasks, Task } from '../models';
import { changeOrderColumn } from '../api/column';
import { useTranslation } from '../i18n/client';
import Header from './Header';
import LinearProgress from '@mui/material/LinearProgress';

type HomeType = {
  lng: string
}

const Home = ({ lng }: HomeType) => {
  const [winReady, setwinReady] = useState(false);
  const [dataTasks, setDataTasks] = useState<DataTasks[]>([]);
  const [dataOrder, setDataOrder] = useState<string[]>([]);
  const [openColumnModal, setOpenColumnModal] = useState<boolean>(false);
  const {
    data,
    isLoading: isLoadingData,
  } = useQuery("dataTasks", getData);
  const {
    mutate: changeColumn,
    isLoading: isLoadingChangeColumn,
  } = useMutation(changeColumnTask);
  const {
    mutate: changeOrder,
    isLoading: isLoadingchangeOrder,
  } = useMutation(changeOrderTask);
  const {
    mutate: changeOrderCol,
    isLoading: isLoadingchangeOrderCol,
  } = useMutation(changeOrderColumn);

  const { t } = useTranslation(lng, "translation", '');
  const [showLoading, setShowLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!data) return;

    const columns = data.orderColumns.map(idColumn => data.columns.find(column => column._id == idColumn)!);
    const dataTasksParsed: DataTasks[] = columns.map(column => {
      const tasksColumn = column.taskIds.map(_id => data.tasks.find(task => task._id == _id)!);
      return {
        ...column,
        tasks: tasksColumn
      };
    });
    setDataTasks(dataTasksParsed);
    setDataOrder(data.orderColumns);
  }, [data])

  useEffect(() => {
    console.log(isLoadingChangeColumn);
    if (
      isLoadingData ||
      isLoadingChangeColumn ||
      isLoadingchangeOrder ||
      isLoadingchangeOrderCol
    ) {
      console.log("showing")
      setShowLoading(true);
    } else {
      setShowLoading(false);
    }
  }, [
    isLoadingData,
    isLoadingChangeColumn,
    isLoadingchangeOrder,
    isLoadingchangeOrderCol,
  ])

  useEffect(() => {
    setTimeout(() => setwinReady(true), 300);
  }, [lng]);

  const toggleColumnModal = (value: boolean) => {
    setOpenColumnModal(value);
  }

  const handleDragTask = (event: DropResult) => {
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
    const columns = dataOrder.map((idColumn: string) => data.columns.find(column => column._id == idColumn));
    const column = dataTasks.find((column: (DataTasks | undefined)) => column?._id == source.droppableId);
    const columnDestiny = dataTasks.find((column: (DataTasks | undefined)) => column?._id == destination.droppableId);
    if (!column || !columnDestiny) return;

    if (column === columnDestiny) {
      const columnIndex = columns.findIndex((column: ColumnModel | undefined) => column?._id == source.droppableId);
      const newTaskIds = column ? [...column.taskIds] : [];
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      const newColumn = {
        ...column,
        taskIds: newTaskIds
      }
      const tasksColumn = newColumn.taskIds.map((_id: string) => data.tasks.find((task: Task) => task._id == _id)!);
      const newColumns = [...dataTasks];
      newColumns[columnIndex] = { ...newColumn, tasks: tasksColumn }
      changeOrder({ newTaskIds, columnId: column._id });
      setDataTasks(newColumns);
      return
    }

    const columnIndex = columns.findIndex((column: ColumnModel | undefined) => column?._id == source.droppableId);
    const columnIndexDestiny = columns.findIndex((column: ColumnModel | undefined) => column?._id == destination.droppableId);
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
    const tasksColumn = newColumn.taskIds.map((_id: string) => data.tasks.find((task: Task) => task._id == _id)!);
    const tasksColumnDestiny = newColumnDestiny.taskIds.map((_id: string) => data.tasks.find((task: Task) => task._id == _id)!);
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

  const handleDragColumn = (event: DropResult) => {
    const { destination, source, draggableId } = event;
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index) ||
      !data
    ) {
      return;
    }
    const newDataOrder = [...dataOrder];
    newDataOrder.splice(source.index, 1);
    newDataOrder.splice(destination.index, 0, draggableId);
    const columns = newDataOrder.map((idColumn: string) => dataTasks.find(column => column?._id == idColumn)!);
    const dataTasksParsed: DataTasks[] = columns.map(column => {
      const tasksColumn = column.taskIds.map((_id: string) => data.tasks.find((task: Task) => task._id == _id)!);
      return { ...column, tasks: tasksColumn }
    });
    setDataTasks(dataTasksParsed);
    setDataOrder(newDataOrder);
    changeOrderCol(newDataOrder);
  }

  const handleDragEnd = (event: DropResult) => {
    const { type } = event;
    if (type == 'task') {
      handleDragTask(event);
    } else {
      handleDragColumn(event);
    }
  }

  return (
    <>
      <div style={{ height: 4 }}>
        {showLoading && <LinearProgress color="success" />}
      </div>
      <Header lng={lng} />
      <Grid container style={{ marginTop: 20, paddingLeft: 10, paddingRight: 10 }}>
        <Grid item xs={11}>
          <DragDropContext
            onDragEnd={handleDragEnd}
          >
            {winReady && (

              <Droppable droppableId='all-columns' direction='horizontal' type='column'>
                {provided => (
                  <Grid container spacing={1} {...provided.droppableProps} ref={provided.innerRef}>
                    {dataTasks.map((item: (DataTasks | undefined), index: number) => {
                      return item ? (
                        <Column {...item} key={item._id} index={index} lng={lng} setShowLoading={setShowLoading} />
                      ) : null
                    })}
                    {provided.placeholder}
                  </Grid>
                )}
              </Droppable>
            )}

          </DragDropContext>
        </Grid>
        <Grid item xs={1}>
          {winReady && (
            <Button
              variant="contained"
              color='success'
              endIcon={<AddCircleIcon />}
              onClick={() => toggleColumnModal(true)}
            >
              {t('BtnNewColumn')}
            </Button>
          )}
        </Grid>
      </Grid>
      <ColumnModal
        open={openColumnModal}
        toggleModal={toggleColumnModal}
        lng={lng}
        setShowLoading={setShowLoading}
      />
      <ToastContainer />
    </>
  )
}

export default Home;
