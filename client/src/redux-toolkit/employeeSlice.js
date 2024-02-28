
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    employees: [],
    loading: false,
    error: null
};

export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async () => {
    const response = await axios.get('http://localhost:3001/employees');
    return response.data;
});

export const addEmployee = createAsyncThunk('employees/addEmployee', async (employeeData) => {
    const response = await axios.post('http://localhost:3001/employees', employeeData);
    return response.data;
});

export const updateEmployee = createAsyncThunk('employees/updateEmployee', async ({ id, data }) => {
    const response = await axios.put(`http://localhost:3001/employees/${id}`, data);
    return response.data;
});

export const deleteEmployee = createAsyncThunk('employees/deleteEmployee', async (id) => {
    await axios.delete(`http://localhost:3001/employees/${id}`);
    return id;
});

const employeeSlice = createSlice({
    name: 'employees',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployees.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.loading = false;
                state.employees = action.payload;
            })
            .addCase(fetchEmployees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addEmployee.fulfilled, (state, action) => {
                state.employees.push(action.payload);
            })
            .addCase(updateEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.employees = action.payload;
            })
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                state.employees = state.employees.filter(emp => emp.empid !== action.payload);
            });
    }
});

export default employeeSlice.reducer;
