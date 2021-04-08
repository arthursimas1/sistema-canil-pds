import React from 'react'
import ReactDOM from 'react-dom'
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

import './index.css'

import Home from './pages/Home'

const theme = createMuiTheme({
  palette: {
    primary: { main: '#fff' },
    secondary: { main: '#fff' },
    text: { primary: '#fff', secondary: '#0000008f', disabled: '#00000024' },
  },
  shape: { borderRadius: 0 },
})

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route component={Home} path='/' exact />
          <Route component={Home} path='/pet-timeline' exact />
          <Route component={Home} path='/add-pet' exact />
          <Route component={Home} path='/add-owner' exact />
          <Route component={Home} path='/add-vaccine' exact />
          <Route component={Home} path='/add-disease' exact />
          <Route component={Home} path='/finance' exact />
          <Redirect push={false} to='/' />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
  ,
  document.getElementById('root'),
)
