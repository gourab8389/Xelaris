import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  sidebarOpen: boolean;
  theme: "light" | "dark";
  currentProject: string | null;
}

const initialState: UIState = {
  sidebarOpen: true,
  theme: "light",
  currentProject: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
    setCurrentProject: (state, action: PayloadAction<string | null>) => {
      state.currentProject = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setTheme, setCurrentProject } = uiSlice.actions;
export default uiSlice.reducer;