import React, { Component } from 'react'
import styles from 'styled-components'
import { Link } from 'react-router-dom'

import { pt as ptLocale } from 'date-fns/locale'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'

import { TextField, MenuItem } from '@material-ui/core'

import { LoadingButton } from '@material-ui/lab'

import Header from '../components/Header'
import { BoxNoMargin } from '../components/Box'
import StatusBox from '../components/StatusBox'

import { GetPet, UpdatePet, GetTimeline, AddEvent } from '../api/PetController'
import GENDERS from '../assets/genders_pet.json'
import BREEDS from '../assets/breeds.json'

const Main = styles.main`
  //background-color: red;
  min-height: 100%;
  display: flex;
  flex-direction: row;
  padding: 20px;
`

const Menu = styles.div`
  display: flex;
  width: 250px;
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

  table.pets {
    margin-top: 20px;
    border-collapse: collapse;

    tr {
      background: rgba(0, 0, 0, 0.10);
      text-align: left;

      &:nth-child(even) {
        background: rgba(0, 0, 0, 0.03);
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

const Timeline = styles.div`
  //background-color: red;
`

const Event = styles.div`
  // background: var(--lightgray);
  // border-radius: 4px;
  border: solid var(--white) 3px;
  margin: 13px;
  padding: 5px;
  box-shadow: #d4d4d4 1px 2px 13px -2px;
`

export default class PetTimeline extends Component {
  constructor(props) {
    super(props)

    this.initial_state = {
      // PET fields
      name: '',
      breed: '',
      birthdate: null,
      gender: '',
      owner: {},
      timeline: [],

      // component-related stuff
      loading: false,
      success: false,
      err: false,
    }
    this.state = { ...this.initial_state }
  }

  async componentDidMount() {
    this.setState({ loading: true })
    let pet_data = await GetPet(this.props.match.params.id)

    if (pet_data.err === 'not_found')
      return this.props.history.push('/')

    let timeline = await GetTimeline(this.props.match.params.id)

    this.setState({ ...pet_data, timeline, loading: false })
  }

  reset() {
    this.setState({ ...this.initial_state })
  }

  async edit_pet() {
    let l = Array.from(document.getElementsByTagName('input'))
    for (let i of l) {
      i.oninput = (e) => e.target.setCustomValidity('')

      // date check
      let aria_invalid = i.getAttribute('aria-invalid')
      if (aria_invalid === 'true') {
        i.setCustomValidity('Data inválida')

        return i.reportValidity()
      }

      if (!i.checkValidity())
        return i.reportValidity()
    }

    this.setState({ loading: true, err: false, success: false })
    let { err } = await UpdatePet({ ...this.state })
    this.setState({ loading: false, err, success: !err && 'Dono atualizado com sucesso' })
  }

  async create_event() {
    let l = Array.from(document.getElementsByTagName('input'))
    for (let i of l) {
      i.oninput = (e) => e.target.setCustomValidity('')

      if (!i.checkValidity())
        return i.reportValidity()
    }

    this.setState({ loading: true, err: false, success: false })

    const attr = {
      /*
      event: <new_pet, ownership_transfer, vaccination, sick, other>
      date: <ISOString>
      pet: <id>,
      description: string,
      metadata: {},
      // event ownership_transfer: {previous_owner: owner, new_owner: owner, type: <sell,donation>}
      // event vaccination: {vaccine: <vaccine id>, amount: <number>}
      // event sick: {disease: <disease id>}
       */
    }

    let { err } = await AddEvent({ id: this.props.match.params.id, ...attr })
    this.setState({ loading: false, err, success: !err && 'Dono atualizado com sucesso' })
  }

  render() {
    return (
      <Main>
        <Header/>

        <Timeline>
          <h3>Linha do Tempo do PET</h3>
          <div className='events'>
            { this.state.timeline.map((e) =>
              <Event key={e.id}>
                { e.event }<br/>
                { e.date }<br/>
                { e.description }<br/>
              </Event>) }
          </div>
        </Timeline>

        <BoxNoMargin>
          <Menu>
            <span>&#8592; <Link to='/search-pet'>Voltar</Link></span>

            <StatusBox err={this.state.err} success={this.state.success} />

            <div className='fields'>
              <TextField label='Nome' variant='outlined' value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} required />

              <TextField select label='Sexo' variant='outlined' value={this.state.gender} onChange={(e) => this.setState({ gender: e.target.value })} required >
                { GENDERS.map((label) => <MenuItem key={label} value={label} style={{ color: 'black', ...this.state.gender === label ? { background: '#9e9e9e', fontWeight: 'bold' } : {} }}>{ label }</MenuItem>) }
              </TextField>

              <TextField select label='Raça' variant='outlined' value={this.state.breed} onChange={(e) => this.setState({ breed: e.target.value })} required >
                { BREEDS.map((label) => <MenuItem key={label} value={label} style={{ color: 'black', ...this.state.breed === label ? { background: '#9e9e9e', fontWeight: 'bold' } : {} }}>{ label }</MenuItem>) }
              </TextField>

              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptLocale}>
                <KeyboardDatePicker
                  disableToolbar
                  variant='inline'
                  format='dd/MM/yyyy'
                  margin='normal'
                  label='Data de nascimento'
                  disableFuture={true}
                  openTo='year'
                  views={['year', 'month', 'date']}
                  value={this.state.birthdate}
                  onChange={(birthdate) => this.setState({ birthdate }) }
                  KeyboardButtonProps={{ 'aria-label': 'change date' }}
                  required
                />
              </MuiPickersUtilsProvider>

              <LoadingButton disabled={ this.state.loading } onClick={ () => this.submit() } variant='contained' pending={ this.state.loading } pendingPosition='center'>Atualizar</LoadingButton>
            </div>
          </Menu>
        </BoxNoMargin>
      </Main>
    )
  }
}
