export default (code) => ({
  // general
  conn_error: 'Não disponível no momento. Tente novamente mais tarde',
  internal: 'Erro interno',
}[code] || code)
