import React, { Component } from 'react'
import styles from 'styled-components'
import { Link } from 'react-router-dom'

import { TextField } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import BlockIcon from '@material-ui/icons/Block'
import DoneIcon from '@material-ui/icons/Done'
import DeleteIcon from '@material-ui/icons/Delete'
import { LoadingButton } from '@material-ui/lab'
import Header from '../components/Header'
import Box from '../components/Box'

import { SearchVaccine, UpdateVaccine, DeleteVaccine } from '../api/VaccineController'
import StatusBox from '../components/StatusBox'
import { IsLogged } from '../api/AccountController'

const Main = styles.main`
  //background-color: red;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
`

const Menu = styles.div`
  display: flex;
  width: auto;
  margin: 0 auto;
  flex-direction: column;
  //background: pink;
  place-content: center;

  h3 {
    margin-bottom: 0;
  }

  div.fields {
    display: flex;
    flex-direction: row;
    align-items: center;

    > * {
      margin: 0 20px;
      width: 90%;

      &:first-child {
        margin-left: 0;
      }

      &:last-child {
        margin-right: 0;
      }
    }

    .MuiInputBase-inputMultiline {
      min-height: 66px;
    }
  }

  .search-button {
    text-align: right;
    margin-top: 20px;
    margin-right: 20px;
  }

  table.results {
    margin-top: 20px;
    border-collapse: collapse;

    tr {
      background: rgba(0, 0, 0, 0.10);
      text-align: left;

      &:nth-child(even) {
        background: rgba(0, 0, 0, 0.03);
      }

      .MuiSvgIcon-root {
        cursor: pointer;
        fill: var(--background);

        &.edit {
          //display: none;
          opacity: 0;
        }

        &:hover {
          fill: var(--white);
        }
      }

      &:hover .MuiSvgIcon-root.edit {
        //display: block;
        opacity: 1;
      }
    }

    th, td {
      padding: 8px;

      a {
        color: var(--white);
      }
    }
  }
`

class EditableVaccine extends Component {
  constructor(props) {
    super(props)
    this.initial_state = {
      // Vaccines fields
      name: this.props.name,
      manufacturer: this.props.manufacturer,
      description: this.props.description,

      // component-related stuff
      deleted: false,
      editing: false,
      loading: false,
      success: false,
      err: false,
    }
    this.state = { ...this.initial_state }
  }

  async delete() {
    this.setState({ deleted: true })
    await DeleteVaccine(this.props.id)
  }

  async submit() {
    let l = Array.from(document.getElementsByTagName('input'))
    for (let i of l) {
      i.oninput = (e) => e.target.setCustomValidity('')

      if (!i.checkValidity())
        return i.reportValidity()
    }

    this.setState({ loading: true, err: false, success: false })
    let { err } = await UpdateVaccine({ id: this.props.id, ...this.state })
    if (!err) {
      this.initial_state.name = this.state.name
      this.initial_state.manufacturer = this.state.manufacturer
      this.initial_state.description = this.state.description

      this.setState({ loading: false, err: false, editing: false })
    }

    //this.setState({ loading: false, err, success: !err && 'Doença cadastrada com sucesso' })
  }

  setEdit() {
    // save state when cancel editing
    this.initial_state.name = this.state.name
    this.initial_state.manufacturer = this.state.manufacturer
    this.initial_state.description = this.state.description

    this.setState({ editing: true })
  }

  unsetEdit() {
    // restore state when cancel editing
    this.setState({
      name: this.initial_state.name,
      manufacturer: this.initial_state.manufacturer,
      description: this.initial_state.description,
      editing: false,
    })
  }

  renderDisplay() {
    return (
      <tr><td>{this.state.name}</td><td>{this.state.manufacturer}</td><td style={{ width: '350px', whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{ __html: this.state.description }} /><td><EditIcon className='edit' onClick={() => this.setEdit()} /></td></tr>
    )
  }

  renderEditing() {
    return (
      <tr>
        <td>
          <TextField value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} required />
        </td>
        <td>
          <TextField value={this.state.manufacturer} onChange={(e) => this.setState({ manufacturer: e.target.value })} required />
        </td>
        <td>
          <TextField multiline={true} value={this.state.description} onChange={(e) => this.setState({ description: e.target.value })} required />
        </td>
        <td>
          <DeleteIcon onClick={() => this.delete()} />
          <BlockIcon onClick={() => this.unsetEdit()} />
          <DoneIcon onClick={() => this.submit()} />
        </td>
      </tr>
    )
  }

  render() {
    if (this.state.deleted)
      return null

    return this.state.editing ? this.renderEditing() : this.renderDisplay()
  }
}

export default class EditVaccinesForm extends Component {
  constructor(props) {
    super(props)

    this.initial_state = {
      // Vaccine search fields
      text: '',

      // component-related stuff
      results: [],
      loading: false,
      success: false,
      err: false,
    }
    this.state = { ...this.initial_state }
  }

  async componentDidMount() {
    if (!IsLogged())
      return this.props.history.push('/login')

    await this.search()
  }

  reset() {
    this.setState({ ...this.initial_state })
  }

  async search() {
    this.setState({ loading: true, err: false, success: false })
    let results = await SearchVaccine({ text: this.state.text, limit: null })
    const err = results.length ? false : 'Nenhum resultado encontrado'
    this.setState({ loading: false, results, err, success: !err })
  }

  render() {
    return (
      <Main>
        <Header/>

        <Box>
          <Menu>
            <span>&#8592; <Link to='/'>Voltar</Link></span>
            <h3>Buscar Vacinas</h3>
            <Link to='/add-vaccine'>Adicionar Vacina</Link>
            <br />

            <div className='fields'>
              <TextField label='Nome, fabricante ou descrição' variant='outlined' value={this.state.text} onChange={(e) => this.setState({ text: e.target.value })} />
            </div>

            <div className='search-button'>
              <LoadingButton disabled={ this.state.loading } onClick={ () => this.search() } variant='contained' pending={ this.state.loading } pendingPosition='center'>Buscar</LoadingButton>
            </div>

            <StatusBox err={this.state.err} />
          </Menu>
        </Box>

        <Box hidden={this.state.results.length <= 0}>
          <Menu>
            <table className='results'>
              <tbody>
                <tr><th>Nome</th><th>Fabricante</th><th>Descrição</th><th /></tr>
                { this.state.results.map((e) => <EditableVaccine key={e.id} {...e} />) }
              </tbody>
            </table>
          </Menu>
        </Box>
      </Main>
    )
  }
}
