import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { newsAPI } from '../../services';

// Async thunk'lar - API çağrıları için
export const fetchAllNews = createAsyncThunk(
  'news/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await newsAPI.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchNewsByGuid = createAsyncThunk(
  'news/fetchByGuid',
  async (guid, { rejectWithValue }) => {
    try {
      const response = await newsAPI.getByGuid(guid);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createNews = createAsyncThunk(
  'news/create',
  async (newsData, { rejectWithValue }) => {
    try {
      const response = await newsAPI.create(newsData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateNews = createAsyncThunk(
  'news/update',
  async ({ guid, newsData }, { rejectWithValue }) => {
    try {
      const response = await newsAPI.update(guid, newsData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteNews = createAsyncThunk(
  'news/delete',
  async (guid, { rejectWithValue }) => {
    try {
      await newsAPI.delete(guid);
      return guid;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  news: [],
  selectedNews: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  filters: {
    category: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setSelectedNews: (state, action) => {
      state.selectedNews = action.payload;
    },
    clearSelectedNews: (state) => {
      state.selectedNews = null;
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
      // Fetch All News
      .addCase(fetchAllNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload;
      })
      .addCase(fetchAllNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch News By Guid
      .addCase(fetchNewsByGuid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsByGuid.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedNews = action.payload;
      })
      .addCase(fetchNewsByGuid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create News
      .addCase(createNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news.unshift(action.payload);
      })
      .addCase(createNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update News
      .addCase(updateNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNews.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.news.findIndex(news => news.guid === action.payload.guid);
        if (index !== -1) {
          state.news[index] = action.payload;
        }
        if (state.selectedNews && state.selectedNews.guid === action.payload.guid) {
          state.selectedNews = action.payload;
        }
      })
      .addCase(updateNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete News
      .addCase(deleteNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = state.news.filter(news => news.guid !== action.payload);
        if (state.selectedNews && state.selectedNews.guid === action.payload) {
          state.selectedNews = null;
        }
      })
      .addCase(deleteNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedNews,
  clearSelectedNews,
  setFilters,
  clearFilters,
  setPagination,
  clearError,
} = newsSlice.actions;

export default newsSlice.reducer;
