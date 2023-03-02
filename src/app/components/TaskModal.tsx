'use client';
import Typography from '@mui/material/Typography'
import styles from '../page.module.css'
import { useState } from 'react';
import { Box, Button, Modal, TextField } from '@mui/material';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 5,
};



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

export default TaskModal;