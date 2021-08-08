import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { save } from './fakeAsync';

const list = [ { name: 'Todo 1', key: 1 }, { name: 'Todo 2', key: 2 }]


const initialState = {
  list: list,
  status: false,
  visible: false
};

export const saveAsync = createAsyncThunk(
  'todos/save',
  async (data) => {
    const response = await save(data);
    return response;
  }
);

export const todos = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    deleteItem: (state, action) => {
      state.list = state.list.filter(( obj )=> {
        return obj.key !== action.payload;
      });
    },
    openModel: (state)=> {
      state.visible = true
    },
    closeModel: (state)=> {
      state.visible = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveAsync.pending, (state) => {
        state.status = true;
      })
      .addCase(saveAsync.fulfilled, (state, action) => {
        state.status = false;
        state.list = action.payload;
        state.visible = false
      });
  },
});

export const { deleteItem, openModel, closeModel } = todos.actions;

export const selectList = (state) => state.todos.list;
export const isLoading = (state) => state.todos.status;
export const visible = (state) => state.todos.visible;


export default todos.reducer;
