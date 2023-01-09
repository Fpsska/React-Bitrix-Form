import { stat } from 'fs';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IformData } from '../../Types/formTypes';

// /. imports

interface IformSlice {
    formData: IformData;
    isFormSubmitted: boolean;
}

// /. interfaces

const initialState: IformSlice = {
    formData: {
        name: '',
        phone: '',
        email: '',
        message: '',
        url: '',
        userIP: '',
        sendingTime: ''
    },
    isFormSubmitted: false
};

// /. state

const formSlice = createSlice({
    name: 'formSlice',
    initialState,
    reducers: {
        setFormData(state, action: PayloadAction<IformData>) {
            state.formData = action.payload;
        },
        switchFormSubmittedStatus(state, action: PayloadAction<boolean>) {
            state.isFormSubmitted = action.payload;
        }
    }
});

export const { setFormData, switchFormSubmittedStatus } = formSlice.actions;

export default formSlice.reducer;
