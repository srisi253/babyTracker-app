import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchDepartments = createAsyncThunk('departments/fetchDepartments', async () => {
  const response = await axios.get('https://babytracker.develotion.com/departamentos.php', {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data.departamentos;
});

export const fetchCities = createAsyncThunk('departments/fetchCities', async (departmentId) => {
  const response = await axios.get(`https://babytracker.develotion.com/ciudades.php?idDepartamento=${departmentId}`, {
    headers: { 'Content-Type': 'application/json' }
  });
  return { departmentId, cities: response.data.ciudades };
});

const departmentsSlice = createSlice({
  name: 'departments',
  initialState: {
    departments: [],
    citiesByDepartment: {},
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchCities.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.citiesByDepartment[action.payload.departmentId] = action.payload.cities;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default departmentsSlice.reducer;
