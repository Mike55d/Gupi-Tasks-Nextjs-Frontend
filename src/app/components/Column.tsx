
'use client';
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import { Droppable } from "react-beautiful-dnd";
import { IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Task from "./Task";
import TaskModal from "./TaskModal";
import styles from '../page.module.css';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Column = ({ tasks, title, columnId, handleCreateTask, handleDeleteTask, handleDeleteColumn }: any) => {

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleClick = () => {
        handleOpen()
    }

    const validateDelete = () => {
        if (tasks.length) {
            toast.warning("Please remove all tasks from column");
            return;
        }
        handleDeleteColumn(columnId);
    }


    return (
        <>
            <Grid item xs={2}>
                <Card className={styles.cardColumn}>
                    <CardHeader
                        title={`${title}`}
                        action={
                            <>
                                <IconButton aria-label="delete" color='success' onClick={handleClick}>
                                    <AddCircleIcon />
                                </IconButton>
                                <IconButton aria-label="delete" color='error' onClick={validateDelete}>
                                    <RemoveCircleIcon />
                                </IconButton>
                            </>

                        }
                        className={styles.cardHeader}
                    />
                    <CardContent className={styles.cardContent}>
                        <Droppable
                            droppableId={columnId}
                        >{(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {tasks.map((item: any, index: any) => (
                                    <Task
                                        title={item.title}
                                        content={item.content}
                                        _id={item._id}
                                        key={item._id}
                                        index={index}
                                        handleDeleteTask={handleDeleteTask}
                                        columnId={columnId}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                        </Droppable>
                    </CardContent>
                </Card>
            </Grid>
            <TaskModal
                open={open}
                handleClose={handleClose}
                columnId={columnId}
                handleCreateTask={handleCreateTask}
            />
        </>
    )
}

export default Column;