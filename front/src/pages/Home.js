import React from 'react'
import styles from 'styled-components'
import { Link } from 'react-router-dom'

import Header from '../components/Header'
import Box from '../components/Box'
import { IsLogged } from '../api/AccountController'
import { can } from '../api/authenticate'

const Main = styles.main`
  //background-color: red;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
`

const Menu = styles.div`
  display: flex;
  width: 200px;
  margin: 0 auto;
  flex-direction: column;
  //background: pink;
  place-content: center;

  h3 {
    margin-bottom: 0;
  }
`

export default function Home() {
  if (!IsLogged())
    return this.props.history.push('/login')

  return (
    <Main>
      <Header />

      <Box>
        <Menu>
          <h3>Frequentes</h3>
          <Link to='/search-pet'>PETs</Link>
          <Link to='/search-owner'>Donos</Link>

          <h3>Interno</h3>
          <Link to='/edit-diseases'>Controle de Doenças</Link>
          <Link to='/edit-vaccines'>Controle de Vacina</Link>

          <h3>Gerência</h3>
          <Link to='/finance'>Finanças</Link>
          <Link to='/users-management' hidden={!can().readAny('user').granted}>Usuários</Link>
          <Link to='/my-account'>Minha Conta</Link>
        </Menu>
      </Box>
    </Main>
  )
}

