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

import MarkerRedIcon from '../assets/marker-red-43px.png'
import MarkerGreenIcon from '../assets/marker-green-43px.png'

import { LoadingButton } from '@material-ui/lab'

import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api'

import Header from '../components/Header'
import { BoxNoMargin } from '../components/Box'
import StatusBox from '../components/StatusBox'
import LinkOnClick from '../components/LinkOnClick'

import dateFormat from '../dateFormat'

import { GetPet, UpdatePet, GetTimeline, AddEvent } from '../api/PetController'
import { SearchVaccine } from '../api/VaccineController'
import { SearchDisease } from '../api/DiseaseController'
import { SearchOwner } from '../api/OwnerController'
import GENDERS from '../assets/genders_pet.json'
import BREEDS from '../assets/breeds.json'
import { IsLogged } from '../api/AccountController'
import InputMask from 'react-input-mask'

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
  background: var(--white);
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
  background: var(--darkgray);
  & > * {
    width: 100%;
    margin: 10px 0 !important;
  }

  .confirm-button {
    background-color: #32CD32;
    &:hover {
      background-color: #228B22;
    }
  }
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

      // search vaccine
      vaccine_text: '',
      vaccine_index: '',
      vaccine_amount: 1,
      vaccines_results: [],

      // search disease
      disease_text: '',
      disease_index: '',
      diseases_results: [],

      // search new owner
      new_owner_cpf: '',
      owner_result: false,

      sell_price: '1',

      // component-related stuff
      loading: false,
      success: false,
      err: false,
    }
    this.state = { ...this.initial_state }
  }

  async search_vaccine() {
    this.setState({ loading: true, err: false, success: false, vaccine_index: '' })
    let vaccines_results = await SearchVaccine({ text: this.state.vaccine_text, limit: null })
    this.setState({ loading: false, vaccines_results, err: false, success: true })
  }

  async search_disease() {
    this.setState({ loading: true, err: false, success: false, disease_index: '' })
    let diseases_results = await SearchDisease({ text: this.state.disease_text, limit: null })
    this.setState({ loading: false, diseases_results, err: false, success: true })
  }

  async search_owner() {
    this.setState({ loading: true, err: false, success: false })
    let owner_result = await SearchOwner({ cpf: this.state.new_owner_cpf })
    owner_result = owner_result.length ? owner_result[0] : null
    let err = false

    if (owner_result?.cpf === this.props.owner.cpf) {
      owner_result = false
      err = 'Não pode ser o mesmo dono'
    } else if (owner_result && this.state.event === 'sell') {
      this.create_paypal_button()
    }

    this.setState({ loading: false, owner_result, err, success: !err })
  }

  clear_paypal_button() {
    document.getElementById('paypal-button-container').innerHTML = ''
  }

  create_paypal_button() {
    /*
    id: "_9Mkv8cJC7RayNq3WQyBQ"
    cpf: "000.000.000-00"
    name: "Underdog Kennels"
    email: "contato@pds.3wx.ru"
    birthdate: "2021-05-07T02:25:00.000Z"
    streetname: "Rod. João Leme dos Santos km 110 - SP-264"
    number: "S/N"
    postalcode: "18052-780"
    city: "Sorocaba"
    state: "SP"
    */

    paypal.Buttons({
      style: {
        color: 'silver',
        label: 'pay',
        tagline: false,
      },
      createOrder: (data, actions) => actions.order.create({
        payer: {
          name: {
            given_name: 'ARTHUR',
            surname: 'SIMAS',
          },
          birth_date: '2000-06-17',
          tax_info: { tax_id: '42636917845', tax_id_type: 'BR_CPF' },
          address: {
            admin_line_1: 'ABC',
            admin_line_2: 'DEF',
            admin_area_1: 'SP',
            admin_area_2: 'San Jose',
            postal_code: '95121',
            country_code: 'BR',
          },
          email_address: 'arthursimas1@gmail.com',
        },
        purchase_units: [{ amount: { currency_code: 'BRL', value: this.state.sell_price } }],
      }),
      onApprove: (data, actions) => actions.order.capture().then((details) => this.submit()),
      //onError: (err) => ('Transaction not authorized (onError)') && console.log( err),
      //onCancel: (err) => alert('Transaction not authorized (onCancel)') && console.log( err),
    }).render('#paypal-button-container')

    return true
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
        if (!this.state.owner_result)
          return this.setState({ loading: false, err: 'Selecione o novo dono', success: false })

        data.metadata = {
          type: data.event,
          previous_owner: this.props.owner.id,
          new_owner: this.state.owner_result.id,
          ...data.event === 'sell' && { price: Number(this.state.sell_price) },
        }
        data.event = 'ownership_transfer'
        break

      case 'vaccination':
        if (this.state.vaccine_index === '')
          return this.setState({ loading: false, err: 'Selecione a vacina', success: false })

        data.metadata = {
          vaccine: this.state.vaccines_results[Number(this.state.vaccine_index)].id,
          amount: this.state.vaccine_amount,
        }
        break

      case 'sick':
        if (this.state.disease_index === '')
          return this.setState({ loading: false, err: 'Selecione a doença', success: false })

        data.metadata = {
          disease: this.state.diseases_results[Number(this.state.disease_index)].id,
        }
        break

      case 'other':
        if (data.description.length === 0)
          return this.setState({ loading: false, err: 'Preencha a descrição', success: false })
    }

    let { err } = await AddEvent(data)

    if (!err && this.props.onNewEvent) {
      data.date = new Date().toISOString()
      data.id = data.date
      data.new = true

      switch (data.event) {
        case 'ownership_transfer':
          if (this.props.onOwnerChange) {
            data.metadata.previous_owner = this.props.owner
            data.metadata.new_owner = this.state.owner_result
            this.props.onOwnerChange(JSON.parse(JSON.stringify(this.state.owner_result)))
          }

          break

        case 'vaccination':
          data.metadata.vaccine = this.state.vaccines_results[Number(this.state.vaccine_index)]
          break

        case 'sick':
          data.metadata.disease = this.state.diseases_results[Number(this.state.disease_index)]
          break
      }

      this.props.onNewEvent(JSON.parse(JSON.stringify(data)))

      this.setState(this.initial_state)
    }

    this.setState({ loading: false, err, success: !err })
  }

  render() {
    return (
      <StyledEventDark>
        <StatusBox err={this.state.err} success={this.state.success} />

        <div style={{ color: 'white' }}><AddIcon color='secondary' style={{ marginBottom: '-4px' }} /> Adicionar evento</div>

        <TextField select label='Tipo' variant='outlined' value={this.state.event} onChange={(e) => {
          this.setState({ event: e.target.value }); this.clear_paypal_button()
        }} required>
          {EVENTS.map(([name, label]) => <MenuItem key={name} value={name} style={{ color: 'black', ...this.state.event === name ? { background: '#9e9e9e', fontWeight: 'bold' } : {} }}>{label}</MenuItem>)}
        </TextField>

        {
          (this.state.event === 'donation' || this.state.event === 'sell') &&
            <>
              <InputMask mask='999.999.999-99' value={this.state.new_owner_cpf} onChange={(e) => this.setState({ new_owner_cpf: e.target.value })}>
                { (inputProps) => <TextField {...inputProps} label='Buscar Novo Dono (CPF)' variant='outlined' type='text' inputProps={{ pattern: '\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}' }} InputProps={{ endAdornment: <InputAdornment position='end'><IconButton onClick={() => this.search_owner()} edge='end'><SearchIcon color={'primary'}/></IconButton></InputAdornment> }} required /> }
              </InputMask>
              {this.state.owner_result && <span style={{ color: 'white' }}>Novo dono: {this.state.owner_result.name} ({this.state.owner_result.cpf})</span>}
              <span hidden={this.state.owner_result !== null} style={{ color: 'white' }}>Não encontrado</span>

              <TextField hidden={this.state.event !== 'sell'} label='Valor' variant='outlined' type='number' inputProps={{ min: 1, step: '0.01' }} value={this.state.sell_price} onChange={(e) => this.setState({ sell_price: e.target.value })} required/>
            </>
        }

        {
          this.state.event === 'vaccination' &&
            <>
              <TextField
                label='Buscar Vacina'
                value={this.state.vaccine_text}
                onChange={(e) => this.setState({ vaccine_text: e.target.value })}
                InputProps={{ endAdornment: <InputAdornment position='end'><IconButton onClick={() => this.search_vaccine()} edge='end'><SearchIcon color='primary' /></IconButton></InputAdornment> }}
                variant='outlined'
              />
              <TextField select label='Vacina' variant='outlined' value={this.state.vaccine_index} onChange={(e) => this.setState({ vaccine_index: e.target.value })} required>
                {this.state.vaccines_results.map((v, i) => <MenuItem key={v.key} value={i} style={{ color: 'black', ...this.state.vaccine_index === i ? { background: '#9e9e9e', fontWeight: 'bold' } : {} }}>{v.name}</MenuItem>)}
              </TextField>

              <TextField label='Doses' variant='outlined' type='number' inputProps={{ min: 1 }} value={this.state.vaccine_amount} onChange={(e) => this.setState({ vaccine_amount: e.target.value })} required />
            </>
        }

        {
          this.state.event === 'sick' &&
            <>
              <TextField
                label='Buscar Doença'
                value={this.state.disease_text}
                onChange={(e) => this.setState({ disease_text: e.target.value })}
                InputProps={{ endAdornment: <InputAdornment position='end'><IconButton onClick={() => this.search_disease()} edge='end'><SearchIcon color='primary' /></IconButton></InputAdornment> }}
                variant='outlined'
              />
              <TextField select label='Doença' variant='outlined' value={this.state.disease_index} onChange={(e) => this.setState({ disease_index: e.target.value })} required>
                {this.state.diseases_results.map((v, i) => <MenuItem key={v.id} value={i} style={{ color: 'black', ...this.state.disease_index === i ? { background: '#9e9e9e', fontWeight: 'bold' } : {} }}>{v.name}</MenuItem>)}
              </TextField>
            </>
        }

        <TextField label='Detalhes' variant='outlined' multiline={true} hidden={this.state.event === ''} value={this.state.description} onChange={(e) => this.setState({ description: e.target.value })} />

        <div id='paypal-button-container' />

        <LoadingButton className='confirm-button' disabled={this.state.loading} hidden={this.state.event === '' || this.state.event === 'sell'} onClick={() => this.submit()} variant='contained' pending={this.state.loading} pendingPosition='center' startIcon={<AddIcon />}>Adicionar</LoadingButton>
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
      previous_owners: [],
      timeline: [],
      map_markers: [],
      map_marker_open: -1,
      map_center: { lat: 0, lng: 0 },

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

    this.setState({ loading: true })
    let pet_data = await GetPet(this.props.match.params.id)

    if (pet_data.err === 'not_found')
      return this.props.history.replace('/')

    let timeline = await GetTimeline(this.props.match.params.id)

    this.setState({
      ...pet_data,
      timeline,
      loading: false,
    })

    this.markers_builder(pet_data.owner, pet_data.previous_owners)
  }

  async edit_pet() {
    this.setState({ loading: true, err: false, success: false })
    const { timeline, owner, previous_owners, ...data } = this.state // eslint-disable-line no-unused-vars
    let { err } = await UpdatePet(data)
    this.setState({ loading: false, err, success: !err && 'PET atualizado' })
  }

  markers_builder(owner, previous_owners) {
    const owners_list = [ { ...owner } , ...previous_owners ]
    owners_list[0].name += ' (dono atual)'

    const map_markers = owners_list.map((po) => ({
      position: { lat: po.lat, lng: po.lng },
      icon: MarkerGreenIcon,
      opacity: .7,
      child: <><b>{po.name}</b><br />{ po.streetname }, { po.number}<br />{ po.city } - { po.state }<br />{ po.postalcode }</>,
    }))
    map_markers[0].icon = MarkerRedIcon
    delete map_markers[0].opacity

    this.setState({ map_markers, map_center: { lat: owner.lat, lng: owner.lng } })
  }

  onOwnerChange(new_owner) {
    const previous_owners = [ this.state.owner, ...this.state.previous_owners.filter((po) => po.id !== new_owner.id) ]
    this.setState({ owner: new_owner, previous_owners })
    this.markers_builder(new_owner, previous_owners)
  }

  render() {
    return (
      <Main>
        <Header/>

        <LoadScript googleMapsApiKey={process.env.REACT_APP_MAPS_TOKEN}>
          <GoogleMap
            mapContainerStyle={{ width: '60vw', height: '80vh' }}
            center={this.state.map_center}
            zoom={13}
            onClick={() => this.setState({ map_marker_open: -1 })}
            options={{ styles: [{ featureType: 'poi', stylers: [{ visibility: 'off' }] }] }}
          >
            <>{ this.state.map_markers.map(({ child, ...props }, i) => <Marker key={i} {...props} onClick={() => child && this.setState({ map_marker_open: this.state.map_marker_open === i ? -1 : i })} >{ this.state.map_marker_open === i && <InfoWindow onCloseClick={() => this.setState({ map_marker_open: -1 })}>{ child }</InfoWindow> }</Marker>) }</>
          </GoogleMap>
        </LoadScript>

        <Timeline style={{ marginLeft: 'auto' }}>
          <h3>Linha do Tempo do PET</h3>
          <div className='events'>
            {this.state.timeline.map((e) => <Event key={e.id} {...e} />)}
            <NewEvent pet={this.props.match.params.id} owner={this.state.owner} onNewEvent={(event) => {
              this.state.timeline.push(event)
              this.setState({ timeline: this.state.timeline })
            }} onOwnerChange={(new_owner) => this.onOwnerChange(new_owner)} />
          </div>
        </Timeline>

        <BoxNoMargin style={{ marginRight: 'auto' }}>
          <Menu>
            <span>&#8592; <LinkOnClick onClick={() => this.props.history.goBack()}>Voltar</LinkOnClick></span><br />

            <span>Dono: <Link to={`/owner/${this.state.owner.id}`} style={{ color: 'var(--white)' }}>{this.state.owner.name}</Link></span><br />

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

              <LoadingButton disabled={this.state.loading} onClick={() => this.edit_pet()} variant='contained' pending={this.state.loading} pendingPosition='center'>Atualizar</LoadingButton>
            </div>
          </Menu>
        </BoxNoMargin>
      </Main>
    )
  }
}
