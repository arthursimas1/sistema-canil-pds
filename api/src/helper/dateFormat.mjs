//import { format as dateFormat } from 'date-fns'
import date_fns_tz from 'date-fns-tz'
const { format: dateFormat, utcToZonedTime } = date_fns_tz
import { pt as ptLocale } from 'date-fns/locale/index.js'

export default (date, format) => dateFormat(
  utcToZonedTime(new Date(date), 'America/Sao_Paulo'),
  format,
  { locale: ptLocale, useAdditionalDayOfYearTokens: true },
)
