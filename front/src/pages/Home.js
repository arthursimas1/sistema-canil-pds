import React from 'react'
import styles from 'styled-components'
import { Link } from 'react-router-dom'

import Header from '../components/Header'
import Search from '../components/Search'
import Box from '../components/Box'

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
  return (
    <Main>
      <Header />

      <Box>
        <Search />
        <Menu>
          <h3>Core</h3>
          <Link to='/add-pet'>Adicionar PET</Link>
          <Link to='/add-owner'>Adicionar Dono</Link>

          <h3>Searches</h3>
          <Link to='/search-pet'>Buscar PET</Link>
          <Link to='/search-owner'>Buscar Dono</Link>

          <h3>Second</h3>
          <Link to='/add-vaccine'>Adicionar Vacina</Link>
          <Link to='/add-ill'>Adicionar Doença</Link>

          <h3>Managing</h3>
          <Link to='/finance'>Finanças</Link>
        </Menu>
      </Box>
    </Main>
  )
}

