import axios from "axios";
import { basePath } from "../components/constants";
import { Column, Task, TaskForm } from "../models";

export const createTask = async (params: { task: TaskForm, columnId: string }) => {
  const { task, columnId } = params;
  return await axios.post(`${basePath}/tasks`, {
    task,
    columnId
  });

}
export const changeColumnTask = async (params: {
  columnId: string,
  columnIdDestiny: string,
  taskId: string,
  indexDestiny: number
}) => {
  const { columnId, columnIdDestiny, taskId, indexDestiny } = params;
  const { data } = await axios.post(`${basePath}/tasks/changeColumn`, {
    columnIdDestiny,
    columnId,
    taskId,
    indexDestiny,
  });
  return data;
}

export const changeOrderTask = async (params: { newTaskIds: string[], columnId: string }) => {
  const { newTaskIds, columnId } = params;
  const { data } = await axios.post(`${basePath}/tasks/changeOrder`, {
    newTaskIds,
    columnId
  });
  return data;
}

export const deleteTask = async (params: { taskId: string, columnId: string }) => {
  const { taskId, columnId } = params;
  const { data } = await axios.delete(`${basePath}/tasks`, {
    data: {
      taskId,
      columnId
    }
  });
  return data;
}

export const getData = async (): Promise<{ tasks: Task[], columns: Column[] }> => {
  const { data } = await axios.get(`${basePath}/tasks`);
  return data;
}


