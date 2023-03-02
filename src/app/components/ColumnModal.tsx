'use client';
import Typography from '@mui/material/Typography'
import styles from '../page.module.css'
import { Box, Button, Modal, TextField } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from "axios";

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
}

const validationSchema = Yup.object({
    title: Yup.string().required('title required'),
})

const ColumnModal = ({ open, handleClose, reloadData }: any) => {

    const handleCancel = () => {
        handleClose();
    }

    const handleSubmit = async (form: {title:string}) => {
        await axios.post('http://localhost:3001/columns', {
            ...form,
            taskIds:[]
        });
        reloadData();
        handleClose();
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography className={styles.titleModal} variant='h5'>Create Column</Typography>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {formik => (
                        <form id="columnForm" onSubmit={formik.handleSubmit}>
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
                    form="columnForm"
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

export default ColumnModal;