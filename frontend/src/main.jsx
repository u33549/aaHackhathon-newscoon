import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
<<<<<<< HEAD
import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { store } from './store'
=======
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
import { newscoonTheme } from './theme/theme.js'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
<<<<<<< HEAD
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={newscoonTheme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
=======
    <BrowserRouter>
      <ThemeProvider theme={newscoonTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
  </React.StrictMode>,
)
