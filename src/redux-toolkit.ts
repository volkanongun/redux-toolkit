import { configureStore, createSlice, PayloadAction, getDefaultMiddleware } from "@reduxjs/toolkit"
import { v1 as uuid } from 'uuid'
import logger from 'redux-logger'
import {Todo} from './type'


// reducers
const todosInitialState: Todo[] = [
    {
        id: uuid(),
        desc: "Learn React",
        isComplete: true
    },
    {
        id: uuid(),
        desc: "Learn Redux",
        isComplete: true
    },
    {
        id: uuid(),
        desc: "Learn Redux-ToolKit",
        isComplete: false
    }
];

const todosSlice = createSlice({
    name: 'todos',
    initialState: todosInitialState,
    reducers: {
        create: {
            reducer: (state, action: PayloadAction< {id: string, desc:string, isComplete:boolean} > ) => {
                state.push(action.payload)
            },
            prepare:({ desc} : {desc:string}) => ({
                payload: {
                    id: uuid(),
                    desc: desc,
                    isComplete: false
                }
            })
        },
        edit: (state, action: PayloadAction< {id: string, desc:string} >) => {
            const todoToEdit = state.find(todo => todo.id === action.payload.id)
            if(todoToEdit){
                todoToEdit.desc = action.payload.desc;
            }
        },
        toggle: (state, action: PayloadAction< {id: string, isComplete:boolean} >) => {
            const todoToEdit = state.find(todo => todo.id === action.payload.id)
            if(todoToEdit){
                todoToEdit.isComplete = action.payload.isComplete;
            }
        },
        remove: (state, action: PayloadAction< {id: string} >) => {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            if(index !== -1){
                state.splice(index, 1)
            }
        }
    },
})

const selectedTodosSlice = createSlice({
    name: "selectedTodo",
    initialState: null as string | null,
    reducers: {
        select: (state, action: PayloadAction< {id: string} >) => action.payload.id
    }
})

const counterSlice = createSlice({
    name: 'counter',
    initialState : 0,
    reducers : {},
    extraReducers: {
        [todosSlice.actions.create.type]: state => state+1,
        [todosSlice.actions.edit.type]: state => state+1,
        [todosSlice.actions.toggle.type]: state => state+1,
        [todosSlice.actions.remove.type]: state => state+1,
    }
})

export const {
    create: createTodoActionCreator,
    edit: editTodoActionCreator,
    toggle: toggleTodoActionCreator,
    remove: deleteTodoActionCreator
} = todosSlice.actions

export const {
    select: selectTodoActionCreator
} = selectedTodosSlice.actions

const reducer = {
    todos: todosSlice.reducer,
    selectedTodo: selectedTodosSlice.reducer,
    counter: counterSlice.reducer
}

const middleware = [...getDefaultMiddleware(), logger]
export default configureStore({
    reducer,
    middleware
})