import { createSlice, configureStore } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "selectedChat",
    initialState: {
        chat: []
    },
    reducers: {
        select(state, chat) {
            state.chat = chat;
        },
        deselect(state) {
            state.chat = [];
        }
    }
});

export const store = configureStore({
    reducer: chatSlice.reducer
});

export const chatActions = chatSlice.actions;