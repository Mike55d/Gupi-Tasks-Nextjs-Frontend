import axios from "axios";
import { ColumnForm } from "../models";

export const createColumn = async (form: ColumnForm) => {
    const {data} = await axios.post('http://localhost:3001/columns', {
        ...form,
        taskIds: []
    });
    return data;
}

export const deleteColumn = async (columnId: string) => {
    const {data} = await axios.delete(`http://localhost:3001/columns/${columnId}`);
    return data;
}