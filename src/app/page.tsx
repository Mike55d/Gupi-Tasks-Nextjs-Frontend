'use client';
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography'
import styles from './page.module.css'
import { tasks, columns } from './components/tasks-list';
import { useEffect, useMemo, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const Task = ({ title, content, id, index }: any) => {
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
        >
          <Card variant="outlined" className={styles.card}>
            <CardHeader
              title={title}
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

const Column = ({ tasks, title, columnId }: any) => {
  return (

    <Grid item xs={3}>
      <Card variant="outlined">
        <CardHeader
          title={`${title}`}
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
                <Task title={item.title} content={item.content} id={item.id} key={item.id} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
          </Droppable>
        </CardContent>
      </Card>
    </Grid>

  )
}

const Home = () => {
  const [winReady, setwinReady] = useState(false);
  const [dataTasks, setDataTasks] = useState<any>([]);

  useEffect(() => {
    const dataTasksParsed = columns.map(column => {
      const tasksColumn = column.taskIds.map(id => tasks.find(task => task.id == id));
      return { ...column, tasks: tasksColumn }
    });
    setDataTasks(dataTasksParsed);
  }, [columns, tasks]);

  useEffect(() => {
    setTimeout(() => setwinReady(true), 500);
  }, []);

  const handleDragEnd = (event: any) => {
    const { destination, source, draggableId } = event;

    if(!destination){
      return;
    }
    if(
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ){
      return;
    }

    const column = dataTasks.find((column:any) => parseInt(column.id) == source.droppableId);
    const columnIndex = columns.findIndex(column => parseInt(column.id) == source.droppableId);
    const newTaskIds = column ? [...column.taskIds] : [];
    newTaskIds.splice(source.index,1);
    newTaskIds.splice(destination.index,0,draggableId);
    const newColumn = {
      ...column,
      taskIds: newTaskIds
    }
    const tasksColumn = newColumn.taskIds.map((id:any) => tasks.find(task => task.id == id));
    const newColumns = [...dataTasks];
    newColumns[columnIndex] = {...newColumn,tasks: tasksColumn}
    setDataTasks(newColumns);
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
                <Column tasks={item.tasks} title={item.title} columnId={item.id} key={item.id} />
              ))}
            </>
          ) : null
        }
      </Grid>
    </DragDropContext>
  )
}

export default Home;
