import React from 'react'
import styles from 'styled-components'

const StyledLink = styles.span`
  color: var(--text);
  text-decoration: underline;
  cursor: pointer;
`

export default function LinkOnClick({ onClick, children }) {
  return <StyledLink onClick={onClick}>{ children }</StyledLink>
}
