'use client';
import Typography from '@mui/material/Typography'
import styles from '../page.module.css'
import { Box, Button, Modal, TextField } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: 'rgb(235, 236, 240)',
    boxShadow: 24,
    p: 4,
    borderRadius: 5,
};

const initialValues = {
    title: '',
    content: ''
}

const validationSchema = Yup.object({
    title: Yup.string().required('title required'),
    content: Yup.string().required('content required'),
})

const TaskModal = ({ open, handleClose, columnId, handleCreateTask }: any) => {

    const handleCancel = () => {
        handleClose();
    }

    const handleSubmit = (form: any,formik:any) => {
        handleCreateTask(form, columnId);
        handleClose();
        formik.resetForm(initialValues);
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography className={styles.titleModal} variant='h5'>Create Task</Typography>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {formik => (
                        <form id="taskForm" onSubmit={formik.handleSubmit}>
                            <TextField
                                label="title"
                                variant="outlined"
                                className={styles.inputs}
                                size="small"
                                error={formik.touched.title && formik.errors.title ? (true) : false}
                                helperText={formik.touched.title && formik.errors.title ? (
                                    formik.errors.title
                                ) : null}
                                {...formik.getFieldProps('title')}
                            />
                            { }
                            <br />
                            <TextField
                                id="outlined-multiline-static"
                                label="content"
                                multiline
                                rows={4}
                                className={styles.inputs}
                                size="small"
                                error={formik.touched.content && formik.errors.content ? (true) : false}
                                {...formik.getFieldProps('content')}
                                helperText={formik.touched.content && formik.errors.content ? (
                                    formik.errors.content
                                ) : null}
                            />
                        </form>
                    )}
                </Formik>
                <Button
                    variant="contained"
                    color="error"
                    className={styles.buttons}
                    onClick={handleCancel}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    form="taskForm"
                    variant="contained"
                    color="success"
                    className={styles.buttons}
                >
                    Create
                </Button>
            </Box>
        </Modal>
    )
}

export default TaskModal;