import React from 'react'
import styles from 'styled-components'
import { Link } from 'react-router-dom'

import Header from '../components/Header'
import { IsLogged } from '../api/AccountController'
import { can } from '../api/authenticate'

import { makeStyles } from '@material-ui/core/styles'
import ButtonBase from '@material-ui/core/ButtonBase'
import Typography from '@material-ui/core/Typography'
import SvgIcon from '@material-ui/core/SvgIcon'

import PetsIcon from '@material-ui/icons/Pets'
import FaceIcon from '@material-ui/icons/Face'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
import GroupIcon from '@material-ui/icons/Group'
import EventNoteIcon from '@material-ui/icons/EventNote'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    minWidth: 300,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    position: 'relative',
    height: 150,
    [theme.breakpoints.down('xs')]: {
      width: '100% !important', // Overrides inline-style
      height: 100,
    },
    '&:hover, &$focusVisible': {
      zIndex: 1,
      '& $imageBackdrop': {
        opacity: 0.15,
      },
      '& $imageMarked': {
        opacity: 0,
      },/*
      '& $imageTitle': {
        border: '4px solid currentColor',
      },*/
    },
  },
  focusVisible: {},
  imageButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
  },
  imageSrc: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
  },
  imageBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.3,
    transition: theme.transitions.create('opacity'),
  },
  imageTitle: {
    position: 'relative',
    top: '40px',
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${theme.spacing(1) + 6}px`,
  },
  imageMarked: {
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
  },
}))

const Main = styles.main`
  //background-color: red;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
`

export default function Home({ history }) {
  if (!IsLogged())
    return history.push('/login')

  const classes = useStyles()

  return (
    <Main>
      <Header />

      <div className={classes.root}>
        <ButtonBase
          focusRipple
          key={'Pets'}
          className={classes.image}
          focusVisibleClassName={classes.focusVisible}
          style={{
            width: 300,
            marginRight: '100px',
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
          }}
          component={Link} to='/search-pet'
        >
          <PetsIcon style={{ fontSize: 60 }}/>
          <span className={classes.imageBackdrop} />
          <span className={classes.imageButton}>
            <Typography
              component="span"
              variant="subtitle1"
              color="inherit"
              className={classes.imageTitle}
            >
              {'Pets'}
              <span className={classes.imageMarked} />
            </Typography>
          </span>
        </ButtonBase>

        <ButtonBase
          focusRipple
          key={'Donos'}
          className={classes.image}
          focusVisibleClassName={classes.focusVisible}
          style={{
            width: 300,
            marginRight: '100px',
            background: 'linear-gradient(45deg, #0288d1 30%, #81d4fa 90%)',
          }}
          component={Link} to='/search-owner'
        >
          <FaceIcon style={{ fontSize: 60 }}/>
          <span className={classes.imageBackdrop} />
          <span className={classes.imageButton}>
            <Typography
              component="span"
              variant="subtitle1"
              color="inherit"
              className={classes.imageTitle}
            >
              {'Donos'}
              <span className={classes.imageMarked} />
            </Typography>
          </span>
        </ButtonBase>
      </div>

      <div className={classes.root} style={{ marginTop: '50px' }}>
        <ButtonBase
          focusRipple
          key={'Doenças'}
          className={classes.image}
          focusVisibleClassName={classes.focusVisible}
          style={{
            width: 300,
            marginRight: '100px',
            background: 'linear-gradient(45deg, #388e3c 30%, #cddc39 90%)',
          }}
          component={Link} to='/edit-diseases'
        >
          <SvgIcon style={{ fontSize: 60 }}>
            <path d="M19.82 14C20.13 14.45 20.66 14.75 21.25 14.75C22.22 14.75 23 13.97 23 13S22.22 11.25 21.25 11.25C20.66 11.25 20.13 11.55 19.82 12H19C19 10.43 18.5 9 17.6 7.81L18.94 6.47C19.5 6.57 20.07 6.41 20.5 6C21.17 5.31 21.17 4.2 20.5 3.5C19.81 2.83 18.7 2.83 18 3.5C17.59 3.93 17.43 4.5 17.53 5.06L16.19 6.4C15.27 5.71 14.19 5.25 13 5.08V3.68C13.45 3.37 13.75 2.84 13.75 2.25C13.75 1.28 12.97 .5 12 .5S10.25 1.28 10.25 2.25C10.25 2.84 10.55 3.37 11 3.68V5.08C10.1 5.21 9.26 5.5 8.5 5.94L7.39 4.35C7.58 3.83 7.53 3.23 7.19 2.75C6.63 1.96 5.54 1.76 4.75 2.32C3.96 2.87 3.76 3.96 4.32 4.75C4.66 5.24 5.2 5.5 5.75 5.5L6.93 7.18C6.5 7.61 6.16 8.09 5.87 8.62C5.25 8.38 4.5 8.5 4 9C3.33 9.7 3.33 10.8 4 11.5C4.29 11.77 4.64 11.93 5 12L5 12C5 12.54 5.07 13.06 5.18 13.56L3.87 13.91C3.45 13.56 2.87 13.41 2.29 13.56C1.36 13.81 .808 14.77 1.06 15.71C1.31 16.64 2.28 17.19 3.21 16.94C3.78 16.78 4.21 16.36 4.39 15.84L5.9 15.43C6.35 16.22 6.95 16.92 7.65 17.5L6.55 19.5C6 19.58 5.5 19.89 5.21 20.42C4.75 21.27 5.07 22.33 5.92 22.79C6.77 23.25 7.83 22.93 8.29 22.08C8.57 21.56 8.56 20.96 8.31 20.47L9.38 18.5C10.19 18.82 11.07 19 12 19C12.06 19 12.12 19 12.18 19C12.05 19.26 12 19.56 12 19.88C12.08 20.85 12.92 21.57 13.88 21.5S15.57 20.58 15.5 19.62C15.46 19.12 15.21 18.68 14.85 18.39C15.32 18.18 15.77 17.91 16.19 17.6L18.53 19.94C18.43 20.5 18.59 21.07 19 21.5C19.7 22.17 20.8 22.17 21.5 21.5S22.17 19.7 21.5 19C21.07 18.59 20.5 18.43 19.94 18.53L17.6 16.19C18.09 15.54 18.47 14.8 18.71 14H19.82M10.5 12C9.67 12 9 11.33 9 10.5S9.67 9 10.5 9 12 9.67 12 10.5 11.33 12 10.5 12M14 15C13.45 15 13 14.55 13 14C13 13.45 13.45 13 14 13S15 13.45 15 14C15 14.55 14.55 15 14 15Z" />
          </SvgIcon>
          <span className={classes.imageBackdrop} />
          <span className={classes.imageButton}>
            <Typography
              component="span"
              variant="subtitle1"
              color="inherit"
              className={classes.imageTitle}
            >
              {'Doenças'}
              <span className={classes.imageMarked} />
            </Typography>
          </span>
        </ButtonBase>

        <ButtonBase
          focusRipple
          key={'Vacinas'}
          className={classes.image}
          focusVisibleClassName={classes.focusVisible}
          style={{
            width: 300,
            marginRight: '100px',
            background: 'linear-gradient(45deg, #ff6f00 30%, #fbc02d 90%)',
          }}
          component={Link} to='/edit-vaccines'
        >
          <SvgIcon style={{ fontSize: 60 }}>
            <path d="M11.15,15.18L9.73,13.77L11.15,12.35L12.56,13.77L13.97,12.35L12.56,10.94L13.97,9.53L15.39,10.94L16.8,9.53L13.97,6.7L6.9,13.77L9.73,16.6L11.15,15.18M3.08,19L6.2,15.89L4.08,13.77L13.97,3.87L16.1,6L17.5,4.58L16.1,3.16L17.5,1.75L21.75,6L20.34,7.4L18.92,6L17.5,7.4L19.63,9.53L9.73,19.42L7.61,17.3L3.08,21.84V19Z" />
          </SvgIcon>
          <span className={classes.imageBackdrop} />
          <span className={classes.imageButton}>
            <Typography
              component="span"
              variant="subtitle1"
              color="inherit"
              className={classes.imageTitle}
            >
              {'Vacinas'}
              <span className={classes.imageMarked} />
            </Typography>
          </span>
        </ButtonBase>
      </div>

      <div className={classes.root} style={{ marginTop: '50px' }}>
        <ButtonBase
          focusRipple
          key={'Finanças'}
          className={classes.image}
          focusVisibleClassName={classes.focusVisible}
          style={{
            width: 300,
            marginRight: '100px',
            background: 'linear-gradient(45deg, #00695c 30%, #80cbc4 90%)',
          }}
          component={Link} to='/finance'
        >
          <AttachMoneyIcon style={{ fontSize: 60 }}/>
          <span className={classes.imageBackdrop} />
          <span className={classes.imageButton}>
            <Typography
              component="span"
              variant="subtitle1"
              color="inherit"
              className={classes.imageTitle}
            >
              {'Finanças'}
              <span className={classes.imageMarked} />
            </Typography>
          </span>
        </ButtonBase>

        <ButtonBase
          focusRipple
          key={'Usuários'}
          className={classes.image}
          focusVisibleClassName={classes.focusVisible}
          style={{
            width: 300,
            marginRight: '100px',
            background: 'linear-gradient(45deg, #455a64 30%, #b0bec5 90%)',
          }}
          component={Link} to='/users-management'
          hidden={!can().readAny('user').granted}
        >
          <GroupIcon style={{ fontSize: 60 }}/>
          <span className={classes.imageBackdrop} />
          <span className={classes.imageButton}>
            <Typography
              component="span"
              variant="subtitle1"
              color="inherit"
              className={classes.imageTitle}
            >
              {'Usuários'}
              <span className={classes.imageMarked} />
            </Typography>
          </span>
        </ButtonBase>
      </div>

      <div className={classes.root} style={{ marginTop: '50px' }}>
        <ButtonBase
          focusRipple
          key={'Alterações'}
          className={classes.image}
          focusVisibleClassName={classes.focusVisible}
          style={{
            width: 300,
            marginRight: '100px',
            background: 'linear-gradient(45deg, #5d4037 30%, #8d6e63 90%)',
          }}
          component={Link} to='/log'
          hidden={!can().readAny('log').granted}
        >
          <EventNoteIcon style={{ fontSize: 60 }}/>
          <span className={classes.imageBackdrop} />
          <span className={classes.imageButton}>
            <Typography
              component="span"
              variant="subtitle1"
              color="inherit"
              className={classes.imageTitle}
            >
              {'Alterações'}
              <span className={classes.imageMarked} />
            </Typography>
          </span>
        </ButtonBase>
      </div>
    </Main>
  )
}
