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
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import SearchIcon from '@material-ui/icons/Search'

import { SearchDisease, UpdateDisease, DeleteDisease } from '../api/DiseaseController'
import StatusBox from '../components/StatusBox'
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

  div.buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 20px;

    > *:not(:last-child) {
      margin-right: 20px;
    }
  }

  .confirm-button {
    background-color: #32CD32;
    &:hover {
      background-color: #228B22;
    }
  }

  .confirm-icon {
    fill: #32CD32;
    &:hover {
      fill: #228B22;
    }
  }

  .decline-icon {
    fill: var(--white);
    &:hover {
      fill: var(--lightgray);
    }
  }

  .remove-icon {
    fill: #D00000;
    &:hover {
      fill: #900000;
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

      /*
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
      }*/
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

class EditableDisease extends Component {
  constructor(props) {
    super(props)
    this.initial_state = {
      // Disease fields
      name: this.props.name,
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
    await DeleteDisease(this.props.id)
  }

  async submit() {
    let l = Array.from(document.getElementsByTagName('input'))
    for (let i of l) {
      i.oninput = (e) => e.target.setCustomValidity('')

      if (!i.checkValidity())
        return i.reportValidity()
    }

    this.setState({ loading: true, err: false, success: false })
    let { err } = await UpdateDisease({ id: this.props.id, ...this.state })
    if (!err) {
      this.initial_state.name = this.state.name
      this.initial_state.description = this.state.description

      this.setState({ loading: false, err: false, editing: false })
    }

    //this.setState({ loading: false, err, success: !err && 'Doença cadastrada com sucesso' })
  }

  setEdit() {
    // save state when cancel editing
    this.initial_state.name = this.state.name
    this.initial_state.description = this.state.description

    this.setState({ editing: true })
  }

  unsetEdit() {
    // restore state when cancel editing
    this.setState({
      name: this.initial_state.name,
      description: this.initial_state.description,
      editing: false,
    })
  }

  renderData() {
    return (
      <tr><td style={{ width: '200px' }}>{this.state.name}</td><td style={{ width: '700', whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{ __html: this.state.description }} /><td hidden={!can().updateAny('disease').granted}><EditIcon className='decline-icon' onClick={() => this.setEdit()} /></td></tr>
    )
  }

  renderEditing() {
    return (
      <tr>
        <td>
          <TextField style={{ width: '200px' }} value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} required />
        </td>
        <td>
          <TextField style={{ width: '700px' }} multiline={true} value={this.state.description} onChange={(e) => this.setState({ description: e.target.value })} required />
        </td>
        <td>
          <DeleteIcon className='remove-icon' onClick={() => this.delete()} />
          <BlockIcon className='decline-icon' onClick={() => this.unsetEdit()} />
          <DoneIcon className='confirm-icon' onClick={() => this.submit()} />
        </td>
      </tr>
    )
  }

  /*
          <Button className='decline-button' style={{width: '100%'}} onClick={() => this.delete()} variant='contained' startIcon={<DeleteIcon style={{fill: "rgba(0, 0, 0, 0.87)"}} />}>Excluir</Button>
          <Button style={{width: '100%'}} onClick={() => this.unsetEdit()} variant='contained' startIcon={<BlockIcon style={{fill: "rgba(0, 0, 0, 0.87)"}} />}>Cancelar</Button>
          <Button className='confirm-button' style={{width: '100%'}} onClick={() => this.submit()} variant='contained' startIcon={<DoneIcon style={{fill: "rgba(0, 0, 0, 0.87)"}} />}>Confirmar</Button>
  */

  render() {
    if (this.state.deleted)
      return null

    return this.state.editing ? this.renderEditing() : this.renderData()
  }
}

export default class EditDiseasesForm extends Component {
  constructor(props) {
    super(props)

    this.initial_state = {
      // Disease search fields
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
    let results = await SearchDisease({ text: this.state.text, limit: null })
    const err = results.length ? false : 'Nenhum resultado encontrado'
    this.setState({ loading: false, results, err, success: !err })
  }

  render() {
    return (
      <Main>
        <Header/>

        <Box>
          <Menu>
            <span>&#8592; <Link to='/' style={{ color: 'var(--white)' }}>Voltar</Link></span>
            <h3>Buscar Doenças</h3>

            <div className='fields'>
              <TextField style={{ flex: 1 }} label='Nome ou descrição' variant='outlined' value={this.state.text} onChange={(e) => this.setState({ text: e.target.value })} />
            </div>

            <div className='buttons'>
              <Button className='confirm-button' component={Link} to='/add-disease' variant='contained' startIcon={<AddIcon/>} hidden={!can().createAny('disease').granted}>Adicionar</Button>

              <LoadingButton disabled={ this.state.loading } onClick={ () => this.search() } variant='contained' pending={ this.state.loading } pendingPosition='center' startIcon={<SearchIcon/>}>Buscar</LoadingButton>
            </div>

            <StatusBox err={this.state.err} />
          </Menu>
        </Box>

        <Box hidden={this.state.results.length <= 0}>
          <Menu>
            <table className='results'>
              <tbody>
                <tr><th>Nome</th><th>Descrição</th><th hidden={!can().updateAny('disease').granted}/></tr>
                { this.state.results.map((e) => <EditableDisease key={e.id} {...e} />) }
              </tbody>
            </table>
          </Menu>
        </Box>
      </Main>
    )
  }
}
