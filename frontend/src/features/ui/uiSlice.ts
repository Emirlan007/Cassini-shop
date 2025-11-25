import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  isSearchOpen: boolean;
  searchQuery: string;
}

const initialState: UiState = {
  isSearchOpen: false,
  searchQuery: "",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSearch: (state, {payload}) => {
      state.isSearchOpen = payload
    },
    setSearchQuery: (state, { payload }) => {
      state.searchQuery = payload;
    },
  },

  selectors: {
    selectIsSearchOpen: (state) => state.isSearchOpen,
    selectSearchQuery: (state) => state.searchQuery,
  },
});

export const { toggleSearch, setSearchQuery } = uiSlice.actions;
export const { selectIsSearchOpen, selectSearchQuery } = uiSlice.selectors;

export default uiSlice.reducer;
