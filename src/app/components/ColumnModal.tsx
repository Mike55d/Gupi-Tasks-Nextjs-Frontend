'use client';
import Typography from '@mui/material/Typography'
import styles from '../page.module.css'
import { Box, Button, Modal, TextField } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from 'react-query';
import { createColumn } from '../api/column';

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

type ColumnModalType = {
    open: boolean,
    toggleModal: (value:boolean) => void;
}

const ColumnModal = ({ open, toggleModal }: ColumnModalType) => {

    const queryClient = useQueryClient()
    const { mutate } = useMutation(createColumn, {
        onSuccess: () => {
            queryClient.invalidateQueries("dataTasks");
        }
    });

    const handleSubmit = async (form: { title: string }) => {
        mutate(form);
        toggleModal(false);
    }

    return (
        <Modal
            open={open}
            onClose={() => toggleModal(false)}
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
                        <form id="columnForm" onSubmit={formik.handleSubmit} className={styles.formModal}>
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
                        </form>
                    )}
                </Formik>
                <Button
                    variant="contained"
                    color="error"
                    className={styles.buttons}
                    onClick={() => toggleModal(false)}
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