import React from 'react'
import ReactDOM from 'react-dom'
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

import './index.css'

import Home from './pages/Home'
import AddPetForm from './pages/AddPetForm'
import SearchPetForm from './pages/SearchPetForm'
import AddOwnerForm from './pages/AddOwnerForm'
import SearchOwnerForm from './pages/SearchOwnerForm'
import Owner from './pages/Owner'
import AddDiseaseForm from './pages/AddDiseaseForm'
import EditDiseasesForm from './pages/EditDiseasesForm'
import AddVaccineForm from './pages/AddVaccineForm'
import EditVaccinesForm from './pages/EditVaccinesForm'


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
          <Route component={SearchPetForm} path='/search-pet' exact />
          <Route component={SearchOwnerForm} path='/search-owner' exact />
          <Route component={Owner} path='/owner/:id' exact />
          <Route component={Home} path='/pet-timeline/:id' exact />
          <Route component={AddPetForm} path='/add-pet' exact />
          <Route component={AddOwnerForm} path='/add-owner' exact />
          <Route component={AddVaccineForm} path='/add-vaccine' exact />
          <Route component={AddDiseaseForm} path='/add-disease' exact />
          <Route component={EditVaccinesForm} path='/edit-vaccines' exact />
          <Route component={EditDiseasesForm} path='/edit-diseases' exact />
          <Route component={Home} path='/finance' exact />
          <Redirect push={false} to='/' />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
  ,
  document.getElementById('root'),
)
