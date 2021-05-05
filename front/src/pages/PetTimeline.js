import React, { Component } from 'react'
import styles from 'styled-components'
import { Link } from 'react-router-dom'

import { pt as ptLocale } from 'date-fns/locale'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'

import { TextField, MenuItem, InputAdornment, IconButton } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import PetsIcon from '@material-ui/icons/Pets'
import SwapHorizIcon from '@material-ui/icons/SwapHoriz'
import InjectionIcon from '@material-ui/icons/Colorize'
import HealingIcon from '@material-ui/icons/Healing'
import InfoIcon from '@material-ui/icons/Info'
import SearchIcon from '@material-ui/icons/Search'

import { LoadingButton } from '@material-ui/lab'

import Header from '../components/Header'
import { BoxNoMargin } from '../components/Box'
import StatusBox from '../components/StatusBox'

import dateFormat from '../dateFormat'

import { GetPet, UpdatePet, GetTimeline, AddEvent } from '../api/PetController'
import { SearchVaccine } from '../api/VaccineController'
import { SearchDisease } from '../api/DiseaseController'
import { SearchOwner } from '../api/OwnerController'
import GENDERS from '../assets/genders_pet.json'
import BREEDS from '../assets/breeds.json'

const EVENTS = [
  ['vaccination', 'Vacinação'],
  ['sick', 'Doença'],
  ['donation', 'Doação'],
  ['sell', 'Venda'],
  ['other', 'Outro'],
]

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

const StyledEvent = styles.div`
  // background: var(--lightgray);
  // border-radius: 4px;
  width: 250px;
  border: solid var(--white) 3px;
  margin: 13px;
  padding: 5px;
  box-shadow: #d4d4d4 1px 2px 13px -2px;

  &.new {
    border-color: var(--background);
    box-shadow: var(--success) 1px 2px 13px -2px;
  }
`

const StyledEventDark = styles(StyledEvent)`
  background: var(--lightgray);
`

class Event extends Component {
  constructor(props) {
    super(props)

    this.initial_state = {
      // Event fields
      event: '',
      pet: this.props.pet,
      description: this.props.description,
      metadata: {},

      // component-related stuff
      editing: false,
      loading: false,
      success: false,
      err: false,
    }
    /*this.events = {
      ownership_transfer: {previous_owner: owner, new_owner: owner, type: <sell,donation>}
      vaccination: {vaccine: <vaccine id>, amount: <number>}
      sick: {disease: <disease id>}
    }*/
    this.state = { ...this.initial_state }

    switch (this.props.event) {
      case 'new_pet':
        this.event_icon = <PetsIcon/>
        this.headline = 'PET adicionado!'
        break

      case 'ownership_transfer':
        {
          this.event_icon = <SwapHorizIcon/>
          const previous = <Link to={`/owner/${this.props.metadata.previous_owner.id}`}>{this.props.metadata.previous_owner.name}</Link>
          const current = <Link to={`/owner/${this.props.metadata.new_owner.id}`}>{this.props.metadata.new_owner.name}</Link>
          this.headline = <>PET {this.props.metadata.type === 'donation' ? 'doado' : `vendido por R$${this.props.metadata.price}`} de {previous} para {current}.</>
        }
        break

      case 'vaccination':
        this.event_icon = <InjectionIcon/>
        this.headline = `Recebeu ${this.props.metadata.amount} ${this.props.metadata.amount === 1 ? 'dose' : 'doses'} da vacina ${this.props.metadata.vaccine.name}.`
        break

      case 'sick':
        this.event_icon = <HealingIcon/>
        this.headline = `O PET foi acometido por ${this.props.metadata.disease.name}.`
        break

      //case 'other':
      default:
        this.event_icon = <InfoIcon/>
        this.headline = this.props.description
        this.state.description = ''
    }
  }

  render() {
    return (
      <StyledEvent className={this.props.new ? 'new' : ''}>
        {this.event_icon} {dateFormat(this.props.date, 'HH:mm dd/MM/yy')}<br/>
        {this.headline}<br />
        {this.state.description.length > 0 ? <>Detalhes: <span style={{ whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{ __html: this.state.description }} /><br/></> : null}
      </StyledEvent>
    )
  }
}

class NewEvent extends Component {
  constructor(props) {
    super(props)

    this.initial_state = {
      // Event fields
      event: '',
      description: '',
      metadata: {},

      // search vaccine
      vaccine_text: '',
      vaccine: '',
      vaccine_amount: 1,
      vaccines_results: [],

      // search disease
      disease_text: '',
      disease: '',
      diseases_results: [],

      // search new owner
      new_owner_cpf: '',
      owner_result: false,

      sell_price: 0,

      // component-related stuff
      loading: false,
      success: false,
      err: false,
    }
    /*this.events = {
      ownership_transfer: {previous_owner: owner, new_owner: owner, type: <sell,donation>, price: int}
      vaccination: {vaccine: <vaccine id>, amount: <number>}
      sick: {disease: <disease id>}
    }*/
    this.state = { ...this.initial_state }
  }

  async search_vaccine() {
    this.setState({ loading: true, err: false, success: false })
    let vaccines_results = await SearchVaccine({ text: this.state.vaccine_text, limit: null })
    this.setState({ loading: false, vaccines_results, err: false, success: true })
  }

  async search_disease() {
    this.setState({ loading: true, err: false, success: false })
    let diseases_results = await SearchDisease({ text: this.state.disease_text, limit: null })
    this.setState({ loading: false, diseases_results, err: false, success: true })
  }

  async search_owner() {
    this.setState({ loading: true, err: false, success: false })
    let owner_result = await SearchOwner({ cpf: this.state.new_owner_cpf })
    this.setState({ loading: false, owner_result: owner_result.length ? owner_result[0] : null, err: false, success: true })
  }

  async submit() {
    this.setState({ loading: true, err: false, success: false })

    let data = {
      event: this.state.event,
      pet: this.props.pet,
      description: this.state.description,
    }
    switch (data.event) {
      case 'sell':
      case 'donation': // eslint-disable-line padding-line-between-statements
        data['metadata'] = {
          type: data.event,
          previous_owner: this.props.owner.id,
          new_owner: this.state.owner_result.id,
          ...data.event === 'sell' && { price: Number(this.state.sell_price) },
        }
        data['event'] = 'ownership_transfer'
        break

      case 'vaccination':
        data['metadata'] = {
          vaccine: this.state.vaccine,
          amount: this.state.vaccine_amount,
        }
        break

      case 'sick':
        data['metadata'] = {
          disease: this.state.disease,
        }
        break

      //case 'other':
      //default:
    }

    let { err } = await AddEvent(data)

    if (!err && this.props.onNewEvent) {
      data['date'] = new Date().toISOString()
      data['id'] = data['date']
      data['new'] = true

      if (data.event === 'ownership_transfer' && this.props.onOwnerChange) {
        data['metadata']['previous_owner'] = { ...this.props.owner }
        data['metadata']['new_owner'] = { ...this.state.owner_result }
        this.props.onOwnerChange(this.state.owner_result)
      }

      this.props.onNewEvent(data)

      this.setState(this.initial_state)
    }

    this.setState({ loading: false, err, success: !err })
  }

  render() {
    return (
      <StyledEventDark>
        <AddIcon color='secondary' />

        <TextField select label='Tipo' variant='outlined' value={this.state.event} onChange={(e) => this.setState({ event: e.target.value })} required>
          {EVENTS.map(([name, label]) => <MenuItem key={name} value={name} style={{ color: 'black', ...this.state.event === name ? { background: '#9e9e9e', fontWeight: 'bold' } : {} }}>{label}</MenuItem>)}
        </TextField>

        <div hidden={this.state.event !== 'donation' && this.state.event !== 'sell'}>
          <TextField
            label='Buscar Novo Dono (CPF)'
            value={this.state.new_owner_cpf}
            onChange={(e) => this.setState({ new_owner_cpf: e.target.value })}
            InputProps={{
              endAdornment:
                <InputAdornment position='end'>
                  <IconButton
                    onClick={() => this.search_owner()}
                    //onMouseDown={handleMouseDownPassword}
                    edge='end'
                  >
                    <SearchIcon color={'primary'} />
                  </IconButton>
                </InputAdornment>,
            }}
            variant='outlined'
          />
          { this.state.owner_result && <span>Novo dono: {this.state.owner_result.name} ({this.state.owner_result.cpf})</span> }
          <span hidden={this.state.owner_result !== null}>Não encontrado</span>

          <TextField hidden={this.state.event !== 'sell'} label='Valor' variant='outlined' type='number' inputProps={{ min: 1 }} value={this.state.sell_price} onChange={(e) => this.setState({ sell_price: e.target.value })} required />
        </div>

        <div hidden={this.state.event !== 'vaccination'}>
          <TextField
            label='Buscar Vacina'
            value={this.state.vaccine_text}
            onChange={(e) => this.setState({ vaccine_text: e.target.value })}
            InputProps={{
              endAdornment:
                <InputAdornment position='end'>
                  <IconButton
                    onClick={() => this.search_vaccine()}
                    //onMouseDown={handleMouseDownPassword}
                    edge='end'
                  >
                    <SearchIcon color='primary' />
                  </IconButton>
                </InputAdornment>,
            }}
            variant='outlined'
          />
          <TextField select label='Vacina' variant='outlined' value={this.state.vaccine} onChange={(e) => this.setState({ vaccine: e.target.value })} required>
            {this.state.vaccines_results.map((v) => <MenuItem key={v.id} value={v.id} style={{ color: 'black', ...this.state.vaccine === v.id ? { background: '#9e9e9e', fontWeight: 'bold' } : {} }}>{v.name}</MenuItem>)}
          </TextField>

          <TextField label='Quantidade' variant='outlined' type='number' inputProps={{ min: 1 }} value={this.state.vaccine_amount} onChange={(e) => this.setState({ vaccine_amount: e.target.value })} required />
        </div>

        <div hidden={this.state.event !== 'sick'}>
          <TextField
            label='Buscar Doença'
            value={this.state.disease_text}
            onChange={(e) => this.setState({ disease_text: e.target.value })}
            InputProps={{
              endAdornment:
                <InputAdornment position='end'>
                  <IconButton
                    onClick={() => this.search_disease()}
                    //onMouseDown={handleMouseDownPassword}
                    edge='end'
                  >
                    <SearchIcon color={'primary'} />
                  </IconButton>
                </InputAdornment>,
            }}
            variant='outlined'
          />
          <TextField select label='Doença' variant='outlined' value={this.state.disease} onChange={(e) => this.setState({ disease: e.target.value })} required>
            {this.state.diseases_results.map((v) => <MenuItem key={v.id} value={v.id} style={{ color: 'black', ...this.state.disease === v.id ? { background: '#9e9e9e', fontWeight: 'bold' } : {} }}>{v.name}</MenuItem>)}
          </TextField>
        </div>

        <TextField label='Detalhes' variant='outlined' multiline={true} hidden={this.state.event === ''} value={this.state.description} onChange={(e) => this.setState({ description: e.target.value })} required />

        <LoadingButton disabled={this.state.loading} hidden={this.state.event === ''} onClick={() => this.submit()} variant='contained' pending={this.state.loading} pendingPosition='center'>Adicionar</LoadingButton>
      </StyledEventDark>
    )
  }
}

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

    if (pet_data.err === 'not_found') {
      return this.props.history.push('/')
    }

    let timeline = await GetTimeline(this.props.match.params.id)

    this.setState({
      ...pet_data,
      timeline,
      loading: false,
    })
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

      if (!i.checkValidity()) {
        return i.reportValidity()
      }
    }

    this.setState({
      loading: true,
      err: false,
      success: false,
    })
    let { err } = await UpdatePet({ ...this.state })
    this.setState({
      loading: false,
      err,
      success: !err && 'Dono atualizado com sucesso',
    })
  }

  async create_event() {
    let l = Array.from(document.getElementsByTagName('input'))
    for (let i of l) {
      i.oninput = (e) => e.target.setCustomValidity('')

      if (!i.checkValidity()) {
        return i.reportValidity()
      }
    }

    this.setState({
      loading: true,
      err: false,
      success: false,
    })

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
    this.setState({
      loading: false,
      err,
      success: !err && 'Dono atualizado com sucesso',
    })
  }

  render() {
    return (
      <Main>
        <Header/>

        <Timeline style={{ marginLeft: 'auto' }}>
          <h3>Linha do Tempo do PET</h3>
          <div className='events'>
            {this.state.timeline.map((e) => <Event key={e.id} {...e} />)}
            <NewEvent pet={this.props.match.params.id} owner={this.state.owner} onNewEvent={(event) => {
              this.state.timeline.push(event)
              this.setState({ timeline: this.state.timeline })
            }} onOwnerChange={(new_owner) => this.setState({ owner: new_owner })} />
          </div>
        </Timeline>

        <BoxNoMargin style={{ marginRight: 'auto' }}>
          <Menu>
            <span>&#8592; <Link onClick={() => this.props.history.goBack()}>Voltar</Link></span><br />

            <span>Dono: <Link to={`/owner/${this.state.owner.id}`}>{this.state.owner.name}</Link></span><br />

            <StatusBox err={this.state.err} success={this.state.success}/>

            <div className='fields'>
              <TextField label='Nome' variant='outlined' value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} required />

              <TextField select label='Sexo' variant='outlined' value={this.state.gender} onChange={(e) => this.setState({ gender: e.target.value })} required>
                {GENDERS.map((label) => <MenuItem key={label} value={label} style={{ color: 'black', ...this.state.gender === label ? { background: '#9e9e9e', fontWeight: 'bold' } : {} }}>{label}</MenuItem>)}
              </TextField>

              <TextField select label='Raça' variant='outlined' value={this.state.breed} onChange={(e) => this.setState({ breed: e.target.value })} required>
                {BREEDS.map((label) => <MenuItem key={label} value={label} style={{ color: 'black', ...this.state.breed === label ? { background: '#9e9e9e', fontWeight: 'bold' } : {} }}>{label}</MenuItem>)}
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
                  onChange={(birthdate) => this.setState({ birthdate })}
                  KeyboardButtonProps={{ 'aria-label': 'change date' }}
                  required
                />
              </MuiPickersUtilsProvider>

              <LoadingButton disabled={this.state.loading} onClick={() => this.submit()} variant='contained' pending={this.state.loading} pendingPosition='center'>Atualizar</LoadingButton>
            </div>
          </Menu>
        </BoxNoMargin>
      </Main>
    )
  }
}