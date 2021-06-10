import hbs from 'nodemailer-express-handlebars'
import path from 'path'
import { fileURLToPath } from 'url'
import config from 'config'

// eslint-disable-next-line more-naming-conventions/snake-case-variables
const __dirname = path.dirname(fileURLToPath(import.meta.url))

let nodemailer, transporter = null

export async function Init(mock = false) {
  nodemailer = mock ? mock : (await import('nodemailer')).default

  transporter = nodemailer.createTransport({
    host: config.get('smtp_provider.host'),
    port: 465,
    secure: true,
    auth: {
      user: config.get('smtp_provider.login'),
      pass: config.get('smtp_provider.password'),
    },
  })

  transporter.use('compile', hbs({
    viewEngine: {
      defaultLayout: false,
      partialsDir: path.resolve(__dirname, './mailerTemplates/'),
      extName: '.html',
    },
    viewPath: path.resolve(__dirname, './mailerTemplates/'),
    extName: '.html',
  }))
}

export default async function SendMail({ template, to, replyTo, context }) {
  if (transporter === null) await Init()

  if (typeof template === 'undefined' || typeof to === 'undefined')
    return { err: 'wrong_usage' }

  let subject = {
    pet_transfering: 'Informações do seu novo PET!',
  }[template]

  if (typeof subject === 'undefined')
    return { err: 'unregistered_template' }

  return transporter.sendMail({
    from: `"${config.get('noreply_from.name')}" <${config.get('noreply_from.address')}>`,
    replyTo,
    to,
    subject,
    template,
    context: { site_url: config.get('site_url'), ...context },
  })
}

