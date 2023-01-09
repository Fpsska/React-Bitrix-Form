import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import formSlice from './slices/formSlice';

// /. imports

export const store = configureStore({
    reducer: { formSlice: formSlice }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
