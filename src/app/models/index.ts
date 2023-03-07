export type Task = {
    _id: string,
    title: string,
    content: string,
}

export type TaskForm = {
    title: string,
    content: string,
}

export type Column = {
    _id: string,
    title: string,
    taskIds: string[],
}

export type ColumnForm = {
    title: string,
}

export type DataTasks = {
    _id: string,
    title: string,
    taskIds: string[],
    tasks: Task[]
}

export interface ColumnTask {
    tasks: Task[],
    columns: Column[],
    orderColumns: string[],
}