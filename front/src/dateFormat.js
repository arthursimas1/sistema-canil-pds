//import { format as dateFormat } from 'date-fns'
import { format as dateFormat, utcToZonedTime } from 'date-fns-tz'
import { pt as ptLocale } from 'date-fns/locale'

export default (date, format) => dateFormat(
  utcToZonedTime(new Date(date), 'America/Sao_Paulo'),
  format,
  { locale: ptLocale, useAdditionalDayOfYearTokens: true },
)
