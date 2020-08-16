import { configureStore } from '@reduxjs/toolkit';
import homeReducer from '../features/homeSlice';

export default configureStore({
  reducer: {
    home: homeReducer,
  },
});
