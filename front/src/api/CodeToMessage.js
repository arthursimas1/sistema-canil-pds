export default (code) => ({
  // user
  password_too_short: 'Sua senha deve ter pelo menos 5 caracteres',
  wrong_password_confirmation: 'Senhas diferentes',
  wrong_credentials: 'Usuário ou senha incorretos',
  duplicate_email: 'Já existe um usuário com esse email',

  // general
  not_allowed: 'Usuário sem permissões suficientes para realizar essa ação',
  conn_error: 'Não disponível no momento. Tente novamente mais tarde',
  internal: 'Erro interno',
}[code] || code)
