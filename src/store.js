import { configureStore } from '@reduxjs/toolkit';
import departmentsReducer from './features/departaments/departamentsSlice';

const store = configureStore({
  reducer: {
    departments: departmentsReducer,
  },
});

export default store;
