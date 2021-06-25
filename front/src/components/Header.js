import React from 'react'
import styles, { css } from 'styled-components'
import { Link, withRouter } from 'react-router-dom'

import { IsLogged, Logout } from '../api/AccountController'
import { can } from '../api/authenticate'

import Logo from '../assets/logo-clean.png'

import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'

const Menu = styles.nav(css`
  z-index: 100;
  width: 100%;
  height: 80px;

  display: flex;
  align-items: center;

  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  color: var(--text);
  background: var(--white);
  box-shadow: 0 7px 21px 0 rgb(0 0 0 / 10%);

  @media (max-width: 650px) {
    height: 60px;
  }
`)

const StyledLink = styles(Link)(css`
  cursor: pointer;
  margin: 0 15px;
  padding: 20px 0;
  text-decoration: none;

  font-size: min(30px, 2vw);
  transition-duration: 0.1s;
  text-align: center;
    
  img {
    height: 50px;
  }
    
  &:hover {
    color: var(--darkred);
  }
    
  @media (max-width: 650px) {
    font-size: max(15px, 2vw);
  }
`)

const Tab = styles(Link)(css`
  margin-left: 25px;
  display: flex;
  text-decoration: none;

  &:hover {
    text-decoration: bold;
  }
`)

function Header(props) {
  const firstname = (localStorage.name || '').split(' ')[0]

  return (
    <Menu>
      <StyledLink to='/' style={{ padding: 0 }}><img src={Logo} /></StyledLink>
      <h1>Underdog Kennels</h1>

      <div style={{ display: 'flex' }} hidden={!IsLogged()}>
        <Divider style={{ marginLeft: '25px' }} orientation="vertical" flexItem />
        <Tab to='/search-pet' label="Pets" flexItem><h3>Pets</h3></Tab>
        <Divider style={{ marginLeft: '25px' }} orientation="vertical" flexItem />

        <Tab to='/search-owner'><h3>Donos</h3></Tab>
        <Divider style={{ marginLeft: '25px' }} orientation="vertical" flexItem />

        <Tab to='/edit-diseases'><h3>Doenças</h3></Tab>
        <Divider style={{ marginLeft: '25px' }} orientation="vertical" flexItem />

        <Tab to='/edit-vaccines'><h3>Vacinas</h3></Tab>
        <Divider style={{ marginLeft: '25px' }} orientation="vertical" flexItem />

        <Tab to='/finance'><h3>Finanças</h3></Tab>
        <Divider style={{ marginLeft: '25px' }} orientation="vertical" flexItem />

        <Tab to='/users-management' hidden={IsLogged() ? !can().readAny('user').granted : !IsLogged()}><h3>Usuários</h3></Tab>
        <Divider style={{ marginLeft: '25px' }} orientation="vertical" flexItem hidden={IsLogged() ? !can().readAny('user').granted : !IsLogged()} />
      </div>

      <span style={{ marginLeft: 'auto' }} />

      <span><Link to='/my-account' style={{ textDecoration: 'none' }}>{ firstname }</Link></span>
      <Button onClick={ () => Logout(props.history) } hidden={!IsLogged()}><span style={{ color: 'var(--text)' }}>Sair</span></Button>
    </Menu>
  )
}

export default withRouter(Header)
