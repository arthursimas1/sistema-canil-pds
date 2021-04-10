import React, { Component } from 'react'
import styles from 'styled-components'
import {
  TextField, FormControl, FormLabel, Radio, RadioGroup, FormControlLabel,
} from '@material-ui/core'

const StyledBox = styles.div`
  place-self: center;
`

const Helper = styles.div`
  height: 0;
  background: var(--background);
  color: black;
  padding: 5px;
  transition: 0.2s;
  transform: scale(1, 0);
  transform-origin: top;

  &.opened {
    height: auto;
    transform: scale(1, 1);
  }
`

export default class Search extends Component {
  constructor(props) {
    super(props)

    this.initial_state = {
      type: '',
      opened: false,
      loading: false,
      success: false,
      err: false,
    }
    this.state = { ...this.initial_state }
  }

  render() {
    return (
      <StyledBox>
        <TextField
          label={`Buscar ${this.state.type}`}
          variant='filled'
          inputProps={{
            //onBlur: () => this.setState({ opened: false }),
            onFocus: () => this.setState({ opened: true }),
          }} />
        <Helper className={this.state.opened ? 'opened' : ''}>
          <FormControl component='fieldset' required={true}>
            <FormLabel component='legend'>Pelo que está buscando?</FormLabel>
            <RadioGroup value={ String(this.state.type) } onChange={(e) => this.setState({ type: e.target.value })}>
              <FormControlLabel value='PET' control={<Radio />} label='PET' />
              <FormControlLabel value='dono' control={<Radio />} label='Dono' />
            </RadioGroup>
          </FormControl>
        </Helper>
      </StyledBox>
    )
  }
}
