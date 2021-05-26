import React from 'react'
import styles from 'styled-components'

import CodeToMessage from '../api/CodeToMessage'

const StyledStatusBox = styles.div`
  margin: 1em 0;
  color: white;

  h3 {
    text-align: center;
    max-width: 250px;
    padding: 5px;
    margin: 0 auto;
  }

  h3.error {
    background: var(--error);
  }

  h3.success {
    background: var(--success);
  }
`

export default function StatusBox(props) {
  return (
    <StyledStatusBox>
      <h3 className='error' hidden={ typeof props.err !== 'string' }>{ CodeToMessage(props.err) }</h3>
      <h3 className='success' hidden={ typeof props.success !== 'string' }>{ props.success }</h3>
    </StyledStatusBox>
  )
}
