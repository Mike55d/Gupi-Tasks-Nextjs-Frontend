import axios from "axios";
import { basePath } from "../components/constants";
import { ColumnForm } from "../models";

export const createColumn = async (form: ColumnForm) => {
    const {data} = await axios.post(`${basePath}/columns`, {
        ...form,
        taskIds: []
    });
    return data;
}

export const changeOrderColumn = async (order: string[]) => {
    const {data} = await axios.post(`${basePath}/columns/changeOrder`,order);
    return data;
}

export const deleteColumn = async (columnId: string) => {
    const {data} = await axios.delete(`${basePath}/columns/${columnId}`);
    return data;
}