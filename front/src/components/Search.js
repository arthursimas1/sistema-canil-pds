import React from 'react'
import styles from 'styled-components'
import { TextField } from '@material-ui/core'

const StyledBox = styles.div`
  place-self: center;
`

export default function Search() {
  return (
    <StyledBox>
      <TextField label='Buscar' variant='filled' />
    </StyledBox>
  )
}
