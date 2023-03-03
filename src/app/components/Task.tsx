'use client';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import styles from '../page.module.css';
import { Draggable } from "react-beautiful-dnd";
import { IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useMutation, useQueryClient } from 'react-query';
import { deleteTask } from '../api/task';
import { Task as TaskModel } from '../models';

const Task = ({
    _id,
    columnId,
    content,
    index,
    title
}: (TaskModel & { columnId: string, index: number })) => {

    const queryClient = useQueryClient()
    const { mutate } = useMutation(deleteTask, {
        onSuccess: () => {
            queryClient.invalidateQueries("dataTasks");
        }
    });

    const handleDelete = () => {
        mutate({ taskId: _id, columnId })
    }

    return (
        <Draggable
            draggableId={_id}
            index={index}
        >
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={styles.card}
                >
                    <Card variant='outlined' className={styles.cardTask} >
                        <CardHeader
                            title={title}
                            action={
                                <IconButton size='small' aria-label="delete" color='error' onClick={handleDelete}>
                                    <ClearIcon fontSize='small' />
                                </IconButton>
                            }
                            className={styles.cardHeaderTask}
                            titleTypographyProps={{ variant: 'h6' }}
                        />
                        <CardContent className={styles.cardContentTask}>
                            <Typography className={styles.contentTask}>{content}</Typography>
                        </CardContent>
                    </Card>
                </div>
            )}
        </Draggable>
    )
}

export default Task;