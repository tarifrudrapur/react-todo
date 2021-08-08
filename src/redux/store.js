import { configureStore } from '@reduxjs/toolkit';
import todosReducer from '../redux/todos.reducer';
import usersReducer from '../redux/users.reducer';


export const store = configureStore({
  reducer: {
    todos: todosReducer,
    users: usersReducer
  },
});
