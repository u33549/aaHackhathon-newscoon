import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { stacksAPI } from '../../services';

// Async thunk'lar - Stack API çağrıları için
export const fetchAllStacks = createAsyncThunk(
  'stacks/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await stacksAPI.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchStackById = createAsyncThunk(
  'stacks/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await stacksAPI.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createStack = createAsyncThunk(
  'stacks/create',
  async (stackData, { rejectWithValue }) => {
    try {
      const response = await stacksAPI.create(stackData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateStack = createAsyncThunk(
  'stacks/update',
  async ({ id, stackData }, { rejectWithValue }) => {
    try {
      const response = await stacksAPI.update(id, stackData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteStack = createAsyncThunk(
  'stacks/delete',
  async (id, { rejectWithValue }) => {
    try {
      await stacksAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchFeaturedStacks = createAsyncThunk(
  'stacks/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const response = await stacksAPI.getFeatured();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPopularStacks = createAsyncThunk(
  'stacks/fetchPopular',
  async (limit = 20, { rejectWithValue }) => {
    try {
      const response = await stacksAPI.getPopular(limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchLatestStacks = createAsyncThunk(
  'stacks/fetchLatest',
  async (limit = 20, { rejectWithValue }) => {
    try {
      const response = await stacksAPI.getLatest(limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  stacks: [],
  featuredStacks: [],
  popularStacks: [],
  latestStacks: [],
  selectedStack: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  filters: {
    name: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
};

const stackSlice = createSlice({
  name: 'stacks',
  initialState,
  reducers: {
    setSelectedStack: (state, action) => {
      state.selectedStack = action.payload;
    },
    clearSelectedStack: (state) => {
      state.selectedStack = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Stacks
      .addCase(fetchAllStacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllStacks.fulfilled, (state, action) => {
        state.loading = false;
        state.stacks = action.payload;
      })
      .addCase(fetchAllStacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Stack By ID
      .addCase(fetchStackById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStackById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStack = action.payload;
      })
      .addCase(fetchStackById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Stack
      .addCase(createStack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStack.fulfilled, (state, action) => {
        state.loading = false;
        state.stacks.unshift(action.payload);
      })
      .addCase(createStack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Stack
      .addCase(updateStack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStack.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.stacks.findIndex(stack => stack._id === action.payload._id);
        if (index !== -1) {
          state.stacks[index] = action.payload;
        }
        if (state.selectedStack && state.selectedStack._id === action.payload._id) {
          state.selectedStack = action.payload;
        }
      })
      .addCase(updateStack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Stack
      .addCase(deleteStack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStack.fulfilled, (state, action) => {
        state.loading = false;
        state.stacks = state.stacks.filter(stack => stack._id !== action.payload);
        if (state.selectedStack && state.selectedStack._id === action.payload) {
          state.selectedStack = null;
        }
      })
      .addCase(deleteStack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Featured Stacks
      .addCase(fetchFeaturedStacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedStacks.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredStacks = action.payload;
      })
      .addCase(fetchFeaturedStacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Popular Stacks
      .addCase(fetchPopularStacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularStacks.fulfilled, (state, action) => {
        state.loading = false;
        state.popularStacks = action.payload;
      })
      .addCase(fetchPopularStacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Latest Stacks
      .addCase(fetchLatestStacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLatestStacks.fulfilled, (state, action) => {
        state.loading = false;
        state.latestStacks = action.payload;
      })
      .addCase(fetchLatestStacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedStack,
  clearSelectedStack,
  setFilters,
  clearFilters,
  setPagination,
  clearError,
} = stackSlice.actions;

export default stackSlice.reducer;
