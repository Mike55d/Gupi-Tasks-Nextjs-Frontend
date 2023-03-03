
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
import { useMutation, useQueryClient } from 'react-query';
import { deleteColumn } from '../api/column';
import { DataTasks, Task as TaskModel } from '../models';


const Column = ({ _id, tasks, title }: DataTasks) => {

    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient()
    const { mutate } = useMutation(deleteColumn, {
        onSuccess: () => {
            queryClient.invalidateQueries("dataTasks");
        }
    });

    const validateDelete = () => {
        if (tasks.length) {
            toast.warning("Please remove all tasks from column");
            return;
        }
        mutate(_id)
    }

    return (
        <>
            <Grid item xs={2}>
                <Card className={styles.cardColumn}>
                    <CardHeader
                        title={`${title}`}
                        action={
                            <>
                                <IconButton aria-label="delete" color='success' onClick={() => setOpen(true)}>
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
                            droppableId={_id}
                        >{(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {tasks.map((item: TaskModel | undefined, index: number) => {
                                    return item ? (
                                        <Task
                                            {...item}
                                            key={item._id}
                                            index={index}
                                            columnId={_id}
                                        />
                                    ) : null
                                })}
                                {provided.placeholder}
                            </div>
                        )}
                        </Droppable>
                    </CardContent>
                </Card>
            </Grid>
            <TaskModal
                open={open}
                handleClose={() => setOpen(false)}
                columnId={_id}
            />
        </>
    )
}

export default Column;