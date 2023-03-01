'use client';
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography'
import styles from './page.module.css'
import { tasks, columns } from './components/tasks-list';
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Box, Button, IconButton, Modal, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { v4 as uuidv4 } from 'uuid';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Task = ({ title, content, id, index, handleDeleteTask, columnId }: any) => {

  const handleDelete = () => {
    handleDeleteTask(id, columnId)
  }

  return (
    <Draggable
      draggableId={id}
      index={index}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={styles.card}
        >
          <Card variant="outlined" >
            <CardHeader
              title={title}
              action={
                <IconButton aria-label="delete" onClick={handleDelete}>
                  <DeleteIcon />
                </IconButton>
              }
            />
            <CardContent >
              <Typography>{content}</Typography>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  )
}

const TaskModal = ({ open, handleClose, columnId, handleCreateTask }: any) => {

  const [newTask, setNewTask] = useState({
    title: "",
    content: ""
  });

  const clearForm = () => {
    setNewTask({
      title: "",
      content: ""
    });
  }

  const handleCancel = () => {
    clearForm();
    handleClose();
  }

  const handleCreate = () => {
    handleCreateTask(newTask, columnId);
    handleClose();
    clearForm();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography variant='h5'>Create Task</Typography>
        <form>
          <TextField
            label="title"
            variant="outlined"
            className={styles.inputs}
            onChange={(event) => setNewTask({ ...newTask, title: event.target.value })}
            value={newTask.title}
          />
          <br />
          <TextField
            id="outlined-multiline-static"
            label="content"
            multiline
            rows={4}
            className={styles.inputs}
            onChange={(event) => setNewTask({ ...newTask, content: event.target.value })}
            value={newTask.content}
          />
        </form>
        <Button variant="contained" color="error" className={styles.buttons} onClick={handleCancel}>Cancel</Button>
        <Button variant="contained" color="success" className={styles.buttons} onClick={handleCreate}>Create</Button>
      </Box>
    </Modal>
  )
}

const Column = ({ tasks, title, columnId, handleCreateTask, handleDeleteTask }: any) => {

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClick = () => {
    handleOpen()
  }
  return (
    <>
      <Grid item xs={3}>
        <Card variant="outlined">
          <CardHeader
            title={`${title}`}
            action={
              <IconButton aria-label="delete" onClick={handleClick}>
                <AddCircleIcon />
              </IconButton>
            }
          />
          <CardContent>
            <Droppable
              droppableId={columnId}
            >{(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {tasks.map((item: any, index: any) => (
                  <Task title={item.title} content={item.content} id={item.id} key={item.id} index={index} handleDeleteTask={handleDeleteTask} columnId={columnId} />
                ))}
                {provided.placeholder}
              </div>
            )}
            </Droppable>
          </CardContent>
        </Card>
      </Grid>
      <TaskModal open={open} handleClose={handleClose} columnId={columnId} handleCreateTask={handleCreateTask} />
    </>
  )
}

const Home = () => {
  const [winReady, setwinReady] = useState(false);
  const [dataTasks, setDataTasks] = useState<any>([]);
  const [currentTasks, setCurrentTasks] = useState<any>([]);

  useEffect(() => {
    const dataTasksParsed = columns.map(column => {
      const tasksColumn = column.taskIds.map(id => tasks.find(task => task.id == id));
      return { ...column, tasks: tasksColumn }
    });
    setDataTasks(dataTasksParsed);
    setCurrentTasks(tasks);
  }, [columns, tasks]);

  useEffect(() => {
    setTimeout(() => setwinReady(true), 500);
  }, []);

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

    const column = dataTasks.find((column: any) => parseInt(column.id) == source.droppableId);
    const columnDestiny = dataTasks.find((column: any) => parseInt(column.id) == destination.droppableId);

    if (column === columnDestiny) {
      const columnIndex = columns.findIndex(column => parseInt(column.id) == source.droppableId);
      const newTaskIds = column ? [...column.taskIds] : [];
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      const newColumn = {
        ...column,
        taskIds: newTaskIds
      }
      const tasksColumn = newColumn.taskIds.map((id: any) => currentTasks.find((task: any) => task.id == id));
      const newColumns = [...dataTasks];
      newColumns[columnIndex] = { ...newColumn, tasks: tasksColumn }
      setDataTasks(newColumns);
      return
    }

    const columnIndex = columns.findIndex(column => parseInt(column.id) == source.droppableId);
    const columnIndexDestiny = columns.findIndex(column => parseInt(column.id) == destination.droppableId);
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
    const tasksColumn = newColumn.taskIds.map((id: any) => currentTasks.find((task: any) => task.id == id));
    const tasksColumnDestiny = newColumnDestiny.taskIds.map((id: any) => currentTasks.find((task: any) => task.id == id));
    const newColumns = [...dataTasks];
    newColumns[columnIndex] = { ...newColumn, tasks: tasksColumn };
    newColumns[columnIndexDestiny] = { ...newColumnDestiny, tasks: tasksColumnDestiny };
    setDataTasks(newColumns);
    return

  }

  const handleCreateTask = (task: any, columnId: any) => {
    const taskId = uuidv4();
    const newTask = { ...task, id: taskId };
    const newColumn = dataTasks.find((column: any) => column.id === columnId);
    const columnIndex = dataTasks.findIndex((column: any) => column.id === columnId);
    newColumn.tasks.push(newTask);
    newColumn.taskIds.push(taskId);
    const newDataTasks = [...dataTasks];
    newDataTasks[columnIndex] = newColumn;
    setDataTasks(newDataTasks);
    const newCurrentTasks = [...currentTasks];
    newCurrentTasks.push(newTask);
    setCurrentTasks(newCurrentTasks);
  }

  const handleDeleteTask = (taskId: any, columnId: any) => {
    console.log(taskId, columnId)
    const newCurrentTasks = [...currentTasks];
    const taskIndex = newCurrentTasks.findIndex(item => item.id === taskId);
    newCurrentTasks.splice(taskIndex, 1);
    console.log(newCurrentTasks);
    setCurrentTasks(newCurrentTasks);
    const newColumn = dataTasks.find((column: any) => column.id === columnId);
    const columnIndex = dataTasks.findIndex((column: any) => column.id === columnId);
    const taskColumnIndex = newColumn.tasks.findIndex((item: any) => item.id === taskId);
    const taskIdsColumnIndex = newColumn.taskIds.findIndex((item: any) => item === taskId);
    newColumn.tasks.splice(taskColumnIndex, 1);
    newColumn.taskIds.splice(taskIdsColumnIndex, 1);
    const newDataTasks = [...dataTasks];
    newDataTasks[columnIndex] = newColumn;
    setDataTasks(newDataTasks);
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
                <Column tasks={item.tasks} title={item.title} columnId={item.id} key={item.id} handleCreateTask={handleCreateTask} handleDeleteTask={handleDeleteTask} />
              ))}
            </>
          ) : null
        }
      </Grid>
    </DragDropContext>
  )
}

export default Home;
