import styles from 'styled-components'

const Box = styles.div`
  width: fit-content;
  color: var(--white);
  margin: 0 auto;
  padding: 20px;
  background: var(--lightgray);
  border: 3px solid white;

  @media (max-width: 650px) {
    width: 85vw;
  }

  h1 {
    text-align: center;
  }

  div.fields {
    display: flex;
    flex-direction: column;
    align-items: center;

    > * {
      margin-bottom: 20px;
    }

    > *:not(:last-child) {
      width: 90%;
    }

    .MuiInputBase-inputMultiline {
      min-height: 66px;
    }
  }
`

export default Box
