import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { save } from './fakeAsync';

const list = [ { name: 'John Brown', key: 1 }, { name: 'Jim Green', key: 2 }, { name: 'Joy Green', key: 3 }]


const initialState = {
  list: list,
  status: false,
  visible: false
};

export const saveAsync = createAsyncThunk(
  'users/save',
  async (data) => {
    const response = await save(data);
    return response;
  }
);

export const users = createSlice({
  name: 'users',
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

export const { deleteItem, openModel, closeModel } = users.actions;

export const selectList = (state) => state.users.list;
export const isLoading = (state) => state.users.status;
export const visible = (state) => state.users.visible;


export default users.reducer;

