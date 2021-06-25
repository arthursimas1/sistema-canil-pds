import React, { Component } from 'react'
import styles from 'styled-components'

import Header from '../components/Header'
import Box from '../components/Box'

import dateFormat from '../dateFormat'

import { GetAllLog } from '../api/LogController'
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
  width: 1000px;
  margin: 0 auto;
  flex-direction: column;
  //background: pink;
  place-content: center;

  h3 {
    margin-bottom: 0;
  }

  div.fields {
    display: flex;
    flex-direction: column;
    align-items: center;

    > * {
      margin-top: 0;
      margin-bottom: 20px;
    }

    > *:not(:last-child) {
      width: 90%;
    }

    .MuiInputBase-inputMultiline {
      min-height: 66px;
    }
  }

  div.text {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: left;

    > *:not(:last-child) {
      margin-right: 20px;
    }
    > *:last-child {
      flex: 1;
    }
  }

  .confirm-button {
    background-color: #32CD32;
    &:hover {
      background-color: #228B22;
    }
  }

  table.log {
    margin-top: 20px;
    border-collapse: collapse;

    tr {
      background: rgba(0, 0, 0, 0.10);
      text-align: left;

      &:not(:first-child,:last-child) {
        //border-bottom: solid white 2px;
      }

      &.entrada {
        background: var(--success);
      }

      &.saida {
        background: #c00;
      }

      &:nth-child(even) {
        background: rgba(0, 0, 0, 0.03);
      }
    }

    th, td {
      padding: 8px;
      border: 1px solid rgba(0, 0, 0, 0.4);

      a {
        color: var(--white);
      }
    }
  }

`

export default class Log extends Component {
  constructor(props) {
    super(props)

    this.initial_state = {
      // Log fields
      events: [],

      // component-related stuff
      loading: false,
      success: false,
      err: false,
    }
    this.state = { ...this.initial_state }
  }

  async componentDidMount() {
    if (!IsLogged())
      return this.props.history.push('/login')

    if (!can().readAny('log').granted) return

    this.setState({ loading: true })
    let log_data = await GetAllLog()

    this.setState({ events: log_data, loading: false })
  }

  reset() {
    this.setState({ ...this.initial_state })
  }

  render() {
    return (
      <Main>
        <Header/>
        <Box hidden={!can().readAny('log').granted}>
          <Menu>
            <h3>Eventos</h3>
            <span hidden={this.state.events.length > 0}>Não foram encontrados eventos</span>
            <table className='log' hidden={this.state.events.length <= 0}>
              <tbody>
                <tr><th>Usuário</th><th>Data</th><th>Tabela</th><th>Operação</th><th>ID</th></tr>
                { this.state.events.map((e) => <tr key={e.id}><td>{e.user}</td><td>{dateFormat(e.date, 'HH:mm\xa0dd/MM/yy')}</td><td>{e.table}</td><td>{e.operation}</td><td>{e.key}</td></tr>) }
              </tbody>
            </table>
          </Menu>
        </Box>
      </Main>
    )
  }
}
