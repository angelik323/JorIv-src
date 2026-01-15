import {
  IGenericResource,
  IPaymentCodeOptionResource,
  IGenericResourceBoolean,
  ISelectorStringResource,
  IOption,
} from '@/interfaces/customs'
import { IResource } from '@/interfaces/global'
import { CalculationType } from '@/interfaces/customs/settlement-commissions/FiduciaryBusinessCommissionsV2'

export const SelectTableVersion = {
  v1: '',
  v2: '-v2',
} as const

export type SelectTableVersionKey = keyof typeof SelectTableVersion

export const listUserParamsData = {
  diaCaducidad: 180,
  intentosFallidos: 3,
  clavesHistoricos: 10,
  tiempoMxInactividad: 5,
  cerrarSesion: 15,
  sesionesActivas: 2,
}
export const options = [
  { id: 1, value: 'Aplicación', label: 'Aplicación' },
  { id: 2, value: 'Otro', label: 'Otro' },
]

export const correspondence: IResource[] = [
  { label: 'Email', value: 'Email' },
  { label: 'Correspondencia física', value: 'Correspondencia fisica' },
]

export const portfolio_class = [
  {
    label: 'Cartera abierta',
    value: 'Cartera abierta',
  },
  {
    label: 'Cartera cerrada',

    value: 'Cartera cerrada',
  },
]

export const tins: IResource[] = [
  {
    label: 'La supremacía del país no emite TIN',
    value: 'La supremacía del país no emite TIN',
  },
  {
    label: 'TIN en proceso de emisión.',
    value: 'TIN en proceso de emisión.',
  },
  { label: 'Posee TIN', value: 'Posee TIN' },
]

export const bankAccounts: IResource[] = [
  { label: 'Cuenta1', value: 'Cuenta1' },
]

export const regimen_trustor_person: IResource[] = [
  { label: 'Regimen1', value: 'Regimen1' },
]

export const document_types_client_natural: IResource[] = [
  { label: 'Cedula', value: 1 },
]

export const status: IResource[] = [
  { label: 'Todos', value: 0 },
  { label: 'Activo', value: 1 },
  { label: 'Inactivo', value: 2 },
]

export const default_statuses: IGenericResource[] = [
  { label: 'Activo', value: 1 },
  { label: 'Inactivo', value: 2 },
]

export const default_statuses_boolean: IGenericResourceBoolean[] = [
  { label: 'Activo', value: true },
  { label: 'Inactivo', value: false },
]

export const dividendTypeOptions = [
  { label: 'Ex-Dividendo', value: 'Ex-Dividendo' },
  { label: 'Exigible', value: 'Exigible' },
]

export const bank_types: IResource[] = [
  { label: 'Cuenta Corriente', value: 'Cuenta Corriente' },
  { label: 'Cuenta De Ahorros', value: 'Cuenta De Ahorros' },
  { label: 'Cuenta De Deposito', value: 'Cuenta De Deposito' },
  { label: 'Cuenta Remunerada', value: 'Cuenta Remunerada' },
  { label: 'Fuente Crédito', value: 'Fuente Crédito' },
  { label: 'Ventanilla - Caja', value: 'Ventanilla - Caja' },
]

export const fic_investment_plan_operation_account_types: IGenericResource[] = [
  { label: 'CH-Cuenta de ahorros', value: 'Cuenta de ahorros' },
  { label: 'CC-Cuenta corriente', value: 'CC-Cuenta corriente' },
] as const

export const fic_investment_plan_operation_document_types: IGenericResource[] =
  [
    { label: 'NIT', value: 'NIT' },
    { label: 'NIT Extranjero', value: 'NIT Extranjero' },
    { label: 'CC-Cédula ciudadanía', value: 'CE-Cédula extranjería' },
    { label: 'Pasaporte', value: 'Pasaporte' },
    { label: 'NIUP-Registro civil', value: 'NIUP-Registro civil' },
    { label: 'TI-Tarjeta identidad', value: 'TI-Tarjeta identidad' },
    { label: 'Otro', value: 'Otro' },
  ] as const

export const estate_origin: IResource[] = [
  {
    label: 'Aportes presupuesto nacional',
    value: 'Aportes presupuesto nacional',
  },
  { label: 'Crédito', value: 'Crédito' },
  { label: 'Impuestos', value: 'Impuestos' },
  { label: 'Salario', value: 'Salario' },
  { label: 'Servicios profesionales', value: 'Servicios profesionales' },
  { label: 'Otro', value: 'Otro' },
]

export const default_yes_no = [
  { label: 'Sí', value: true },
  { label: 'No', value: false },
]
export const fic_menu_movement = default_yes_no

export const options_boolean: IResource[] = [
  { label: 'SI', value: 'SI' },
  { label: 'NO', value: 'NO' },
]

export const phone_types: IResource[] = [
  {
    value: 'fixed',
    label: 'Fijo',
  },
  {
    value: 'mobile',
    label: 'Celular',
  },
]

export const person_types: IResource[] = [
  {
    value: 0,
    label: 'Todos',
  },
  {
    value: 'natural',
    label: 'Natural',
  },
  {
    value: 'legal',
    label: 'Juridica',
  },
]

export const GenerateScatterOptions = [
  { label: 'Por generar', value: 'Por generar' },
  { label: 'Generados', value: 'Generados' },
  { label: 'Todos', value: 'Todos' },
]

export const originType = [
  { label: 'Tesorería', value: 'Tesorería' },
  { label: 'Portafolio', value: 'Portafolio' },
]

export const natureOperation = [
  { label: 'Ingreso', value: 'Ingreso' },
  { label: 'Egreso', value: 'Egreso' },
]

export const types_reports: IGenericResource[] = [
  { label: 'Si', value: 1 },
  { label: 'No', value: 2 },
]
export const OPERATION_NATURE_INCOME = 'Ingreso'
export const OPERATION_NATURE_EXPENSES = 'Egreso'
export const ACCOUNTING_ORIGIN_TREASURY = 'Tesorería'
export const ACCOUNTING_ORIGIN_PORTFOLIO = 'Portafolio'

export const phones_countries = [
  {
    code: '+93',
    country: 'Afghanistan',
    abbreviation: 'AF',
    flag: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_the_Taliban.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+35818',
    country: 'Åland Islands',
    abbreviation: 'AX',
    flag: 'https://flagcdn.com/ax.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+355',
    country: 'Albania',
    abbreviation: 'AL',
    flag: 'https://flagcdn.com/al.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+213',
    country: 'Algeria',
    abbreviation: 'DZ',
    flag: 'https://flagcdn.com/dz.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+1684',
    country: 'American Samoa',
    abbreviation: 'AS',
    flag: 'https://flagcdn.com/as.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+376',
    country: 'Andorra',
    abbreviation: 'AD',
    flag: 'https://flagcdn.com/ad.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+244',
    country: 'Angola',
    abbreviation: 'AO',
    flag: 'https://flagcdn.com/ao.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+1264',
    country: 'Anguilla',
    abbreviation: 'AI',
    flag: 'https://flagcdn.com/ai.svg',
    phoneMask: '### ### ####',
  },
  // {
  //   code: '',
  //   country: 'Antarctica',
  //   abbreviation: 'AQ',
  //   flag: 'https://flagcdn.com/aq.svg',
  //   phoneMask: '#### #### ####',
  // },
  {
    code: '+1268',
    country: 'Antigua and Barbuda',
    abbreviation: 'AG',
    flag: 'https://flagcdn.com/ag.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+54',
    country: 'Argentina',
    abbreviation: 'AR',
    flag: 'https://flagcdn.com/ar.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+374',
    country: 'Armenia',
    abbreviation: 'AM',
    flag: 'https://flagcdn.com/am.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+297',
    country: 'Aruba',
    abbreviation: 'AW',
    flag: 'https://flagcdn.com/aw.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+61',
    country: 'Australia',
    abbreviation: 'AU',
    flag: 'https://flagcdn.com/au.svg',
    phoneMask: '#### ### ###',
  },
  {
    code: '+43',
    country: 'Austria',
    abbreviation: 'AT',
    flag: 'https://flagcdn.com/at.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+994',
    country: 'Azerbaijan',
    abbreviation: 'AZ',
    flag: 'https://flagcdn.com/az.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+1242',
    country: 'Bahamas',
    abbreviation: 'BS',
    flag: 'https://flagcdn.com/bs.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+973',
    country: 'Bahrain',
    abbreviation: 'BH',
    flag: 'https://flagcdn.com/bh.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+880',
    country: 'Bangladesh',
    abbreviation: 'BD',
    flag: 'https://flagcdn.com/bd.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+1246',
    country: 'Barbados',
    abbreviation: 'BB',
    flag: 'https://flagcdn.com/bb.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+375',
    country: 'Belarus',
    abbreviation: 'BY',
    flag: 'https://flagcdn.com/by.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+32',
    country: 'Belgium',
    abbreviation: 'BE',
    flag: 'https://flagcdn.com/be.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+501',
    country: 'Belize',
    abbreviation: 'BZ',
    flag: 'https://flagcdn.com/bz.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+229',
    country: 'Benin',
    abbreviation: 'BJ',
    flag: 'https://flagcdn.com/bj.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+1441',
    country: 'Bermuda',
    abbreviation: 'BM',
    flag: 'https://flagcdn.com/bm.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+975',
    country: 'Bhutan',
    abbreviation: 'BT',
    flag: 'https://flagcdn.com/bt.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+591',
    country: 'Bolivia',
    abbreviation: 'BO',
    flag: 'https://flagcdn.com/bo.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+387',
    country: 'Bosnia and Herzegovina',
    abbreviation: 'BA',
    flag: 'https://flagcdn.com/ba.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+267',
    country: 'Botswana',
    abbreviation: 'BW',
    flag: 'https://flagcdn.com/bw.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+47',
    country: 'Bouvet Island',
    abbreviation: 'BV',
    flag: 'https://flagcdn.com/bv.svg',
    phoneMask: '### ## ###',
  },
  {
    code: '+55',
    country: 'Brazil',
    abbreviation: 'BR',
    flag: 'https://flagcdn.com/br.svg',
    phoneMask: '## #####-####',
  },
  {
    code: '+246',
    country: 'British Indian Ocean Territory',
    abbreviation: 'IO',
    flag: 'https://flagcdn.com/io.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+1284',
    country: 'British Virgin Islands',
    abbreviation: 'VG',
    flag: 'https://flagcdn.com/vg.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+673',
    country: 'Brunei',
    abbreviation: 'BN',
    flag: 'https://flagcdn.com/bn.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+359',
    country: 'Bulgaria',
    abbreviation: 'BG',
    flag: 'https://flagcdn.com/bg.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+226',
    country: 'Burkina Faso',
    abbreviation: 'BF',
    flag: 'https://flagcdn.com/bf.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+257',
    country: 'Burundi',
    abbreviation: 'BI',
    flag: 'https://flagcdn.com/bi.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+855',
    country: 'Cambodia',
    abbreviation: 'KH',
    flag: 'https://flagcdn.com/kh.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+237',
    country: 'Cameroon',
    abbreviation: 'CM',
    flag: 'https://flagcdn.com/cm.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+1',
    country: 'Canada',
    abbreviation: 'CA',
    flag: 'https://flagcdn.com/ca.svg',
    phoneMask: '(###) ###-####',
  },
  {
    code: '+238',
    country: 'Cape Verde',
    abbreviation: 'CV',
    flag: 'https://flagcdn.com/cv.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+599',
    country: 'Caribbean Netherlands',
    abbreviation: 'BES islands',
    flag: 'https://flagcdn.com/bq.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+1345',
    country: 'Cayman Islands',
    abbreviation: 'KY',
    flag: 'https://flagcdn.com/ky.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+236',
    country: 'Central African Republic',
    abbreviation: 'CF',
    flag: 'https://flagcdn.com/cf.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+235',
    country: 'Chad',
    abbreviation: 'TD',
    flag: 'https://flagcdn.com/td.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+56',
    country: 'Chile',
    abbreviation: 'CL',
    flag: 'https://flagcdn.com/cl.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+86',
    country: 'China',
    abbreviation: 'CN',
    flag: 'https://flagcdn.com/cn.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+61',
    country: 'Christmas Island',
    abbreviation: 'CX',
    flag: 'https://flagcdn.com/cx.svg',
    phoneMask: '#### ### ###',
  },
  {
    code: '+61',
    country: 'Cocos (Keeling) Islands',
    abbreviation: 'CC',
    flag: 'https://flagcdn.com/cc.svg',
    phoneMask: '#### ### ###',
  },
  {
    code: '+57',
    country: 'Colombia',
    abbreviation: 'CO',
    flag: 'https://flagcdn.com/co.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+269',
    country: 'Comoros',
    abbreviation: 'KM',
    flag: 'https://flagcdn.com/km.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+682',
    country: 'Cook Islands',
    abbreviation: 'CK',
    flag: 'https://flagcdn.com/ck.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+506',
    country: 'Costa Rica',
    abbreviation: 'CR',
    flag: 'https://flagcdn.com/cr.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+385',
    country: 'Croatia',
    abbreviation: 'HR',
    flag: 'https://flagcdn.com/hr.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+53',
    country: 'Cuba',
    abbreviation: 'CU',
    flag: 'https://flagcdn.com/cu.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+599',
    country: 'Curaçao',
    abbreviation: 'CW',
    flag: 'https://flagcdn.com/cw.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+357',
    country: 'Cyprus',
    abbreviation: 'CY',
    flag: 'https://flagcdn.com/cy.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+420',
    country: 'Czechia',
    abbreviation: 'CZ',
    flag: 'https://flagcdn.com/cz.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+45',
    country: 'Denmark',
    abbreviation: 'DK',
    flag: 'https://flagcdn.com/dk.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+253',
    country: 'Djibouti',
    abbreviation: 'DJ',
    flag: 'https://flagcdn.com/dj.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+1767',
    country: 'Dominica',
    abbreviation: 'DM',
    flag: 'https://flagcdn.com/dm.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+1809',
    country: 'Dominican Republic',
    abbreviation: 'DO',
    flag: 'https://flagcdn.com/do.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+243',
    country: 'DR Congo',
    abbreviation: 'CD',
    flag: 'https://flagcdn.com/cd.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+593',
    country: 'Ecuador',
    abbreviation: 'EC',
    flag: 'https://flagcdn.com/ec.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+20',
    country: 'Egypt',
    abbreviation: 'EG',
    flag: 'https://flagcdn.com/eg.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+503',
    country: 'El Salvador',
    abbreviation: 'SV',
    flag: 'https://flagcdn.com/sv.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+240',
    country: 'Equatorial Guinea',
    abbreviation: 'GQ',
    flag: 'https://flagcdn.com/gq.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+291',
    country: 'Eritrea',
    abbreviation: 'ER',
    flag: 'https://flagcdn.com/er.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+372',
    country: 'Estonia',
    abbreviation: 'EE',
    flag: 'https://flagcdn.com/ee.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+268',
    country: 'Eswatini',
    abbreviation: 'SZ',
    flag: 'https://flagcdn.com/sz.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+251',
    country: 'Ethiopia',
    abbreviation: 'ET',
    flag: 'https://flagcdn.com/et.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+500',
    country: 'Falkland Islands',
    abbreviation: 'FK',
    flag: 'https://flagcdn.com/fk.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+298',
    country: 'Faroe Islands',
    abbreviation: 'FO',
    flag: 'https://flagcdn.com/fo.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+679',
    country: 'Fiji',
    abbreviation: 'FJ',
    flag: 'https://flagcdn.com/fj.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+358',
    country: 'Finland',
    abbreviation: 'FI',
    flag: 'https://flagcdn.com/fi.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+33',
    country: 'France',
    abbreviation: 'FR',
    flag: 'https://flagcdn.com/fr.svg',
    phoneMask: '## ## ## ## ##',
  },
  {
    code: '+594',
    country: 'French Guiana',
    abbreviation: 'GF',
    flag: 'https://flagcdn.com/gf.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+689',
    country: 'French Polynesia',
    abbreviation: 'PF',
    flag: 'https://flagcdn.com/pf.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+262',
    country: 'French Southern and Antarctic Lands',
    abbreviation: 'TF',
    flag: 'https://flagcdn.com/tf.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+241',
    country: 'Gabon',
    abbreviation: 'GA',
    flag: 'https://flagcdn.com/ga.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+220',
    country: 'Gambia',
    abbreviation: 'GM',
    flag: 'https://flagcdn.com/gm.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+995',
    country: 'Georgia',
    abbreviation: 'GE',
    flag: 'https://flagcdn.com/ge.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+49',
    country: 'Germany',
    abbreviation: 'DE',
    flag: 'https://flagcdn.com/de.svg',
    phoneMask: '#### #######',
  },
  {
    code: '+233',
    country: 'Ghana',
    abbreviation: 'GH',
    flag: 'https://flagcdn.com/gh.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+350',
    country: 'Gibraltar',
    abbreviation: 'GI',
    flag: 'https://flagcdn.com/gi.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+30',
    country: 'Greece',
    abbreviation: 'GR',
    flag: 'https://flagcdn.com/gr.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+299',
    country: 'Greenland',
    abbreviation: 'GL',
    flag: 'https://flagcdn.com/gl.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+1473',
    country: 'Grenada',
    abbreviation: 'GD',
    flag: 'https://flagcdn.com/gd.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+590',
    country: 'Guadeloupe',
    abbreviation: 'GP',
    flag: 'https://flagcdn.com/gp.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+1671',
    country: 'Guam',
    abbreviation: 'GU',
    flag: 'https://flagcdn.com/gu.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+502',
    country: 'Guatemala',
    abbreviation: 'GT',
    flag: 'https://flagcdn.com/gt.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+44',
    country: 'Guernsey',
    abbreviation: 'GG',
    flag: 'https://flagcdn.com/gg.svg',
    phoneMask: '#### ### ###',
  },
  {
    code: '+224',
    country: 'Guinea',
    abbreviation: 'GN',
    flag: 'https://flagcdn.com/gn.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+245',
    country: 'Guinea-Bissau',
    abbreviation: 'GW',
    flag: 'https://flagcdn.com/gw.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+592',
    country: 'Guyana',
    abbreviation: 'GY',
    flag: 'https://flagcdn.com/gy.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+509',
    country: 'Haiti',
    abbreviation: 'HT',
    flag: 'https://flagcdn.com/ht.svg',
    phoneMask: '#### #### ####',
  },
  // {
  //   code: '',
  //   country: 'Heard Island and McDonald Islands',
  //   abbreviation: 'HM',
  //   flag: 'https://flagcdn.com/hm.svg',
  //   phoneMask: '#### #### ####',
  // },
  {
    code: '+504',
    country: 'Honduras',
    abbreviation: 'HN',
    flag: 'https://flagcdn.com/hn.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+852',
    country: 'Hong Kong',
    abbreviation: 'HK',
    flag: 'https://flagcdn.com/hk.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+36',
    country: 'Hungary',
    abbreviation: 'HU',
    flag: 'https://flagcdn.com/hu.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+354',
    country: 'Iceland',
    abbreviation: 'IS',
    flag: 'https://flagcdn.com/is.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+91',
    country: 'India',
    abbreviation: 'IN',
    flag: 'https://flagcdn.com/in.svg',
    phoneMask: '##### #####',
  },
  {
    code: '+62',
    country: 'Indonesia',
    abbreviation: 'ID',
    flag: 'https://flagcdn.com/id.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+98',
    country: 'Iran',
    abbreviation: 'IR',
    flag: 'https://flagcdn.com/ir.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+964',
    country: 'Iraq',
    abbreviation: 'IQ',
    flag: 'https://flagcdn.com/iq.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+353',
    country: 'Ireland',
    abbreviation: 'IE',
    flag: 'https://flagcdn.com/ie.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+44',
    country: 'Isle of Man',
    abbreviation: 'IM',
    flag: 'https://flagcdn.com/im.svg',
    phoneMask: '#### ### ###',
  },
  {
    code: '+972',
    country: 'Israel',
    abbreviation: 'IL',
    flag: 'https://flagcdn.com/il.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+39',
    country: 'Italy',
    abbreviation: 'IT',
    flag: 'https://flagcdn.com/it.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+225',
    country: 'Ivory Coast',
    abbreviation: 'CI',
    flag: 'https://flagcdn.com/ci.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+1876',
    country: 'Jamaica',
    abbreviation: 'JM',
    flag: 'https://flagcdn.com/jm.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+81',
    country: 'Japan',
    abbreviation: 'JP',
    flag: 'https://flagcdn.com/jp.svg',
    phoneMask: '##-####-####',
  },
  {
    code: '+44',
    country: 'Jersey',
    abbreviation: 'JE',
    flag: 'https://flagcdn.com/je.svg',
    phoneMask: '#### ### ###',
  },
  {
    code: '+962',
    country: 'Jordan',
    abbreviation: 'JO',
    flag: 'https://flagcdn.com/jo.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+76',
    country: 'Kazakhstan',
    abbreviation: 'KZ',
    flag: 'https://flagcdn.com/kz.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+254',
    country: 'Kenya',
    abbreviation: 'KE',
    flag: 'https://flagcdn.com/ke.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+686',
    country: 'Kiribati',
    abbreviation: 'KI',
    flag: 'https://flagcdn.com/ki.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+383',
    country: 'Kosovo',
    abbreviation: 'XK',
    flag: 'https://flagcdn.com/xk.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+965',
    country: 'Kuwait',
    abbreviation: 'KW',
    flag: 'https://flagcdn.com/kw.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+996',
    country: 'Kyrgyzstan',
    abbreviation: 'KG',
    flag: 'https://flagcdn.com/kg.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+856',
    country: 'Laos',
    abbreviation: 'LA',
    flag: 'https://flagcdn.com/la.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+371',
    country: 'Latvia',
    abbreviation: 'LV',
    flag: 'https://flagcdn.com/lv.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+961',
    country: 'Lebanon',
    abbreviation: 'LB',
    flag: 'https://flagcdn.com/lb.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+266',
    country: 'Lesotho',
    abbreviation: 'LS',
    flag: 'https://flagcdn.com/ls.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+231',
    country: 'Liberia',
    abbreviation: 'LR',
    flag: 'https://flagcdn.com/lr.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+218',
    country: 'Libya',
    abbreviation: 'LY',
    flag: 'https://flagcdn.com/ly.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+423',
    country: 'Liechtenstein',
    abbreviation: 'LI',
    flag: 'https://flagcdn.com/li.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+370',
    country: 'Lithuania',
    abbreviation: 'LT',
    flag: 'https://flagcdn.com/lt.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+352',
    country: 'Luxembourg',
    abbreviation: 'LU',
    flag: 'https://flagcdn.com/lu.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+853',
    country: 'Macau',
    abbreviation: 'MO',
    flag: 'https://flagcdn.com/mo.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+261',
    country: 'Madagascar',
    abbreviation: 'MG',
    flag: 'https://flagcdn.com/mg.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+265',
    country: 'Malawi',
    abbreviation: 'MW',
    flag: 'https://flagcdn.com/mw.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+60',
    country: 'Malaysia',
    abbreviation: 'MY',
    flag: 'https://flagcdn.com/my.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+960',
    country: 'Maldives',
    abbreviation: 'MV',
    flag: 'https://flagcdn.com/mv.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+223',
    country: 'Mali',
    abbreviation: 'ML',
    flag: 'https://flagcdn.com/ml.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+356',
    country: 'Malta',
    abbreviation: 'MT',
    flag: 'https://flagcdn.com/mt.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+692',
    country: 'Marshall Islands',
    abbreviation: 'MH',
    flag: 'https://flagcdn.com/mh.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+596',
    country: 'Martinique',
    abbreviation: 'MQ',
    flag: 'https://flagcdn.com/mq.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+222',
    country: 'Mauritania',
    abbreviation: 'MR',
    flag: 'https://flagcdn.com/mr.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+230',
    country: 'Mauritius',
    abbreviation: 'MU',
    flag: 'https://flagcdn.com/mu.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+262',
    country: 'Mayotte',
    abbreviation: 'YT',
    flag: 'https://flagcdn.com/yt.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+52',
    country: 'Mexico',
    abbreviation: 'MX',
    flag: 'https://flagcdn.com/mx.svg',
    phoneMask: '## #### ####',
  },
  {
    code: '+691',
    country: 'Micronesia',
    abbreviation: 'FM',
    flag: 'https://flagcdn.com/fm.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+373',
    country: 'Moldova',
    abbreviation: 'MD',
    flag: 'https://flagcdn.com/md.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+377',
    country: 'Monaco',
    abbreviation: 'MC',
    flag: 'https://flagcdn.com/mc.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+976',
    country: 'Mongolia',
    abbreviation: 'MN',
    flag: 'https://flagcdn.com/mn.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+382',
    country: 'Montenegro',
    abbreviation: 'ME',
    flag: 'https://flagcdn.com/me.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+1664',
    country: 'Montserrat',
    abbreviation: 'MS',
    flag: 'https://flagcdn.com/ms.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+212',
    country: 'Morocco',
    abbreviation: 'MA',
    flag: 'https://flagcdn.com/ma.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+258',
    country: 'Mozambique',
    abbreviation: 'MZ',
    flag: 'https://flagcdn.com/mz.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+95',
    country: 'Myanmar',
    abbreviation: 'MM',
    flag: 'https://flagcdn.com/mm.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+264',
    country: 'Namibia',
    abbreviation: 'NA',
    flag: 'https://flagcdn.com/na.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+674',
    country: 'Nauru',
    abbreviation: 'NR',
    flag: 'https://flagcdn.com/nr.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+977',
    country: 'Nepal',
    abbreviation: 'NP',
    flag: 'https://flagcdn.com/np.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+31',
    country: 'Netherlands',
    abbreviation: 'NL',
    flag: 'https://flagcdn.com/nl.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+687',
    country: 'New Caledonia',
    abbreviation: 'NC',
    flag: 'https://flagcdn.com/nc.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+64',
    country: 'New Zealand',
    abbreviation: 'NZ',
    flag: 'https://flagcdn.com/nz.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+505',
    country: 'Nicaragua',
    abbreviation: 'NI',
    flag: 'https://flagcdn.com/ni.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+227',
    country: 'Niger',
    abbreviation: 'NE',
    flag: 'https://flagcdn.com/ne.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+234',
    country: 'Nigeria',
    abbreviation: 'NG',
    flag: 'https://flagcdn.com/ng.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+683',
    country: 'Niue',
    abbreviation: 'NU',
    flag: 'https://flagcdn.com/nu.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+672',
    country: 'Norfolk Island',
    abbreviation: 'NF',
    flag: 'https://flagcdn.com/nf.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+850',
    country: 'North Korea',
    abbreviation: 'KP',
    flag: 'https://flagcdn.com/kp.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+389',
    country: 'North Macedonia',
    abbreviation: 'MK',
    flag: 'https://flagcdn.com/mk.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+1670',
    country: 'Northern Mariana Islands',
    abbreviation: 'MP',
    flag: 'https://flagcdn.com/mp.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+47',
    country: 'Norway',
    abbreviation: 'NO',
    flag: 'https://flagcdn.com/no.svg',
    phoneMask: '### ## ###',
  },
  {
    code: '+968',
    country: 'Oman',
    abbreviation: 'OM',
    flag: 'https://flagcdn.com/om.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+92',
    country: 'Pakistan',
    abbreviation: 'PK',
    flag: 'https://flagcdn.com/pk.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+680',
    country: 'Palau',
    abbreviation: 'PW',
    flag: 'https://flagcdn.com/pw.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+970',
    country: 'Palestine',
    abbreviation: 'PS',
    flag: 'https://flagcdn.com/ps.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+507',
    country: 'Panama',
    abbreviation: 'PA',
    flag: 'https://flagcdn.com/pa.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+675',
    country: 'Papua New Guinea',
    abbreviation: 'PG',
    flag: 'https://flagcdn.com/pg.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+595',
    country: 'Paraguay',
    abbreviation: 'PY',
    flag: 'https://flagcdn.com/py.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+51',
    country: 'Peru',
    abbreviation: 'PE',
    flag: 'https://flagcdn.com/pe.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+63',
    country: 'Philippines',
    abbreviation: 'PH',
    flag: 'https://flagcdn.com/ph.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+64',
    country: 'Pitcairn Islands',
    abbreviation: 'PN',
    flag: 'https://flagcdn.com/pn.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+48',
    country: 'Poland',
    abbreviation: 'PL',
    flag: 'https://flagcdn.com/pl.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+351',
    country: 'Portugal',
    abbreviation: 'PT',
    flag: 'https://flagcdn.com/pt.svg',
    phoneMask: '### ### ###',
  },
  {
    code: '+1787',
    country: 'Puerto Rico',
    abbreviation: 'PR',
    flag: 'https://flagcdn.com/pr.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+974',
    country: 'Qatar',
    abbreviation: 'QA',
    flag: 'https://flagcdn.com/qa.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+242',
    country: 'Republic of the Congo',
    abbreviation: 'CG',
    flag: 'https://flagcdn.com/cg.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+262',
    country: 'Réunion',
    abbreviation: 'RE',
    flag: 'https://flagcdn.com/re.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+40',
    country: 'Romania',
    abbreviation: 'RO',
    flag: 'https://flagcdn.com/ro.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+73',
    country: 'Russia',
    abbreviation: 'RU',
    flag: 'https://flagcdn.com/ru.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+250',
    country: 'Rwanda',
    abbreviation: 'RW',
    flag: 'https://flagcdn.com/rw.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+590',
    country: 'Saint Barthélemy',
    abbreviation: 'BL',
    flag: 'https://flagcdn.com/bl.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+290',
    country: 'Saint Helena, Ascension and Tristan da Cunha',
    abbreviation: 'Saint Helena',
    flag: 'https://flagcdn.com/sh.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+1869',
    country: 'Saint Kitts and Nevis',
    abbreviation: 'KN',
    flag: 'https://flagcdn.com/kn.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+1758',
    country: 'Saint Lucia',
    abbreviation: 'LC',
    flag: 'https://flagcdn.com/lc.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+590',
    country: 'Saint Martin',
    abbreviation: 'MF',
    flag: 'https://flagcdn.com/mf.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+508',
    country: 'Saint Pierre and Miquelon',
    abbreviation: 'PM',
    flag: 'https://flagcdn.com/pm.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+1784',
    country: 'Saint Vincent and the Grenadines',
    abbreviation: 'VC',
    flag: 'https://flagcdn.com/vc.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+685',
    country: 'Samoa',
    abbreviation: 'WS',
    flag: 'https://flagcdn.com/ws.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+378',
    country: 'San Marino',
    abbreviation: 'SM',
    flag: 'https://flagcdn.com/sm.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+239',
    country: 'São Tomé and Príncipe',
    abbreviation: 'ST',
    flag: 'https://flagcdn.com/st.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+966',
    country: 'Saudi Arabia',
    abbreviation: 'Saudi',
    flag: 'https://flagcdn.com/sa.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+221',
    country: 'Senegal',
    abbreviation: 'SN',
    flag: 'https://flagcdn.com/sn.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+381',
    country: 'Serbia',
    abbreviation: 'RS',
    flag: 'https://flagcdn.com/rs.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+248',
    country: 'Seychelles',
    abbreviation: 'SC',
    flag: 'https://flagcdn.com/sc.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+232',
    country: 'Sierra Leone',
    abbreviation: 'SL',
    flag: 'https://flagcdn.com/sl.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+65',
    country: 'Singapore',
    abbreviation: 'SG',
    flag: 'https://flagcdn.com/sg.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+1721',
    country: 'Sint Maarten',
    abbreviation: 'SX',
    flag: 'https://flagcdn.com/sx.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+421',
    country: 'Slovakia',
    abbreviation: 'SK',
    flag: 'https://flagcdn.com/sk.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+386',
    country: 'Slovenia',
    abbreviation: 'SI',
    flag: 'https://flagcdn.com/si.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+677',
    country: 'Solomon Islands',
    abbreviation: 'SB',
    flag: 'https://flagcdn.com/sb.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+252',
    country: 'Somalia',
    abbreviation: 'SO',
    flag: 'https://flagcdn.com/so.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+27',
    country: 'South Africa',
    abbreviation: 'ZA',
    flag: 'https://flagcdn.com/za.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+500',
    country: 'South Georgia',
    abbreviation: 'GS',
    flag: 'https://flagcdn.com/gs.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+82',
    country: 'South Korea',
    abbreviation: 'KR',
    flag: 'https://flagcdn.com/kr.svg',
    phoneMask: '##-####-####',
  },
  {
    code: '+211',
    country: 'South Sudan',
    abbreviation: 'SS',
    flag: 'https://flagcdn.com/ss.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+34',
    country: 'Spain',
    abbreviation: 'ES',
    flag: 'https://flagcdn.com/es.svg',
    phoneMask: '### ## ## ##',
  },
  {
    code: '+94',
    country: 'Sri Lanka',
    abbreviation: 'LK',
    flag: 'https://flagcdn.com/lk.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+249',
    country: 'Sudan',
    abbreviation: 'SD',
    flag: 'https://flagcdn.com/sd.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+597',
    country: 'Suriname',
    abbreviation: 'SR',
    flag: 'https://flagcdn.com/sr.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+4779',
    country: 'Svalbard and Jan Mayen',
    abbreviation: 'SJ',
    flag: 'https://flagcdn.com/sj.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+46',
    country: 'Sweden',
    abbreviation: 'SE',
    flag: 'https://flagcdn.com/se.svg',
    phoneMask: '###-###-###',
  },
  {
    code: '+41',
    country: 'Switzerland',
    abbreviation: 'CH',
    flag: 'https://flagcdn.com/ch.svg',
    phoneMask: '## ### ## ##',
  },
  {
    code: '+963',
    country: 'Syria',
    abbreviation: 'SY',
    flag: 'https://flagcdn.com/sy.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+886',
    country: 'Taiwan',
    abbreviation: 'TW',
    flag: 'https://flagcdn.com/tw.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+992',
    country: 'Tajikistan',
    abbreviation: 'TJ',
    flag: 'https://flagcdn.com/tj.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+255',
    country: 'Tanzania',
    abbreviation: 'TZ',
    flag: 'https://flagcdn.com/tz.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+66',
    country: 'Thailand',
    abbreviation: 'TH',
    flag: 'https://flagcdn.com/th.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+670',
    country: 'Timor-Leste',
    abbreviation: 'TL',
    flag: 'https://flagcdn.com/tl.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+228',
    country: 'Togo',
    abbreviation: 'TG',
    flag: 'https://flagcdn.com/tg.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+690',
    country: 'Tokelau',
    abbreviation: 'TK',
    flag: 'https://flagcdn.com/tk.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+676',
    country: 'Tonga',
    abbreviation: 'TO',
    flag: 'https://flagcdn.com/to.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+1868',
    country: 'Trinidad and Tobago',
    abbreviation: 'TT',
    flag: 'https://flagcdn.com/tt.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+216',
    country: 'Tunisia',
    abbreviation: 'TN',
    flag: 'https://flagcdn.com/tn.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+90',
    country: 'Turkey',
    abbreviation: 'TR',
    flag: 'https://flagcdn.com/tr.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+993',
    country: 'Turkmenistan',
    abbreviation: 'TM',
    flag: 'https://flagcdn.com/tm.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+1649',
    country: 'Turks and Caicos Islands',
    abbreviation: 'TC',
    flag: 'https://flagcdn.com/tc.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+688',
    country: 'Tuvalu',
    abbreviation: 'TV',
    flag: 'https://flagcdn.com/tv.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+256',
    country: 'Uganda',
    abbreviation: 'UG',
    flag: 'https://flagcdn.com/ug.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+380',
    country: 'Ukraine',
    abbreviation: 'UA',
    flag: 'https://flagcdn.com/ua.svg',
    phoneMask: '## ### ## ##',
  },
  {
    code: '+971',
    country: 'United Arab Emirates',
    abbreviation: 'AE',
    flag: 'https://flagcdn.com/ae.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+44',
    country: 'United Kingdom',
    abbreviation: 'GB',
    flag: 'https://flagcdn.com/gb.svg',
    phoneMask: '#### ### ###',
  },
  {
    code: '+1',
    country: 'United States',
    abbreviation: 'US',
    flag: 'https://flagcdn.com/us.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+268',
    country: 'United States Minor Outlying Islands',
    abbreviation: 'UM',
    flag: 'https://flagcdn.com/um.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+1340',
    country: 'United States Virgin Islands',
    abbreviation: 'VI',
    flag: 'https://flagcdn.com/vi.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+598',
    country: 'Uruguay',
    abbreviation: 'UY',
    flag: 'https://flagcdn.com/uy.svg',
    phoneMask: '### ### ###',
  },
  {
    code: '+998',
    country: 'Uzbekistan',
    abbreviation: 'UZ',
    flag: 'https://flagcdn.com/uz.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+678',
    country: 'Vanuatu',
    abbreviation: 'VU',
    flag: 'https://flagcdn.com/vu.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+3906698',
    country: 'Vatican City',
    abbreviation: 'VA',
    flag: 'https://flagcdn.com/va.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+58',
    country: 'Venezuela',
    abbreviation: 'VE',
    flag: 'https://flagcdn.com/ve.svg',
    phoneMask: '### ### ####',
  },
  {
    code: '+84',
    country: 'Vietnam',
    abbreviation: 'VN',
    flag: 'https://flagcdn.com/vn.svg',
    phoneMask: '### #### ###',
  },
  {
    code: '+681',
    country: 'Wallis and Futuna',
    abbreviation: 'WF',
    flag: 'https://flagcdn.com/wf.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+2125288',
    country: 'Western Sahara',
    abbreviation: 'EH',
    flag: 'https://flagcdn.com/eh.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+967',
    country: 'Yemen',
    abbreviation: 'YE',
    flag: 'https://flagcdn.com/ye.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+260',
    country: 'Zambia',
    abbreviation: 'ZM',
    flag: 'https://flagcdn.com/zm.svg',
    phoneMask: '#### #### ####',
  },
  {
    code: '+263',
    country: 'Zimbabwe',
    abbreviation: 'ZW',
    flag: 'https://flagcdn.com/zw.svg',
    phoneMask: '#### #### ####',
  },
]

export const cancellation_codes_options: IResource[] = [
  {
    label: 'Todos',
    value: '',
  },
  {
    label: 'Si',
    value: 1,
  },
  {
    label: 'No',
    value: 0,
  },
]
export const year_list = Array.from(
  { length: 6 },
  (_, index) => new Date().getFullYear() + index
)
export const month_list: IResource[] = [
  { label: 'Enero', value: 1 },
  { label: 'Febrero', value: 2 },
  { label: 'Marzo', value: 3 },
  { label: 'Abril', value: 4 },
  { label: 'Mayo', value: 5 },
  { label: 'Junio', value: 6 },
  { label: 'Julio', value: 7 },
  { label: 'Agosto', value: 8 },
  { label: 'Septiembre', value: 9 },
  { label: 'Octubre', value: 10 },
  { label: 'Noviembre', value: 11 },
  { label: 'Diciembre', value: 12 },
]

export const commission_rate_options = [
  { label: '% Comisión', value: '% Comisión' },
  { label: 'Valor Fijo', value: 'Valor Fijo' },
]

export const validates_collection_method_options = [
  { label: 'Entidad bancaria', value: true },
  { label: 'Forma de recaudo', value: false },
]

export const business_trust_register_type: IResource[] = [
  { value: 'Fideicomiso', label: 'Fideicomiso' },
  { value: 'Sociedad', label: 'Sociedad' },
]

export const business_trust_yes_no: IResource[] = [
  { value: 'si', label: 'Si' },
  { value: 'no', label: 'No' },
]

export const options_boolean_value = [
  { label: 'SI', value: true },
  { label: 'NO', value: false },
] as unknown as IResource[]

export const repeat_options: IResource[] = [
  { label: 'Diario', value: 'daily' },
  { label: 'Semanal', value: 'weekly' },
  { label: 'Mensual', value: 'monthly' },
  { label: 'Anual', value: 'yearly' },
]

export const clousings: IResource[] = [
  { value: 'daily', label: 'Diario' },
  { value: 'monthly', label: 'Mensual' },
]

export const normative_framework: IResource[] = [
  { label: 'CUIF', value: 'CUIF' },
  { label: 'Público', value: 'publico' },
  { label: 'Fiscal', value: 'fiscal' },
]

export const data_type: IResource[] = [
  { label: 'Numérico', value: 'Numérico' },
  { label: 'Alfanumérico', value: 'Alfanumérico' },
]

export const user_types: IResource[] = [
  { value: 'interno', label: 'Interno' },
  { value: 'externo', label: 'Externo' },
]

export const user_profile: IResource[] = [
  { value: 'Administrador', label: 'Administrador' },
  { value: 'Operador', label: 'Operador' },
  { value: 'Consulta', label: 'Consulta' },
]

export const user_status: IResource[] = [
  { value: 1, label: 'Activo' },
  { value: 2, label: 'Inactivo' },
  { value: 52, label: 'Retirado' },
  { value: 53, label: 'Vacaciones' },
  { value: 3, label: 'Nuevo' },
  { value: 51, label: 'Bloqueado' },
  { value: 54, label: 'Directorio activo' },
]

export const commission_options = {
  commission_type: [
    { label: 'Todos', value: '' },
    { label: 'Fija (FI)', value: 1 },
    { label: 'Variable (VA)', value: 2 },
  ],
  rate_type: [
    { label: 'Todos', value: '' },
    { label: 'Nominal (NO)', value: 'Nominal' },
    { label: 'Efectiva (EF)', value: 'Efectiva' },
  ],
}

export const generate_accounting = [
  { label: 'Todo', value: '' },
  { label: 'Si', value: true },
  { label: 'No', value: false },
]

export const operation_class: IGenericResource[] = [
  { label: 'P - Principal', value: 'P - Principal' },
  { label: 'A - Ajuste', value: 'A - Ajuste' },
  { label: 'R - Reverso', value: 'R - Reverso' },
]

export const puc_account_equivalences_by_type: IGenericResource[] = [
  { label: 'Equivalente', value: 'equivalente' },
  { label: 'Fiscal', value: 'fiscal' },
  {
    label: 'Equivalente - Fiscal',
    value: 'equivalente-fiscal',
  },
]

export const investment_type: IGenericResource[] = [
  { label: 'Renta fija', value: 'Renta fija' },
  { label: 'Renta variable', value: 'Renta variable' },
  { label: 'Participaciones', value: 'Participaciones' },
  { label: 'Derivados', value: 'Derivados' },
  { label: "ETF's", value: "ETF's" },
]
export const investment_class: IGenericResource[] = [
  {
    label: 'IN - Inversión negociable',
    value: 'IN - Inversión negociable',
  },
  {
    label: 'DV - Disponible para la venta',
    value: 'DV - Disponible para la venta',
  },
  {
    label: 'IV - Inversiones hasta el vencimiento',
    value: 'IV - Inversiones hasta el vencimiento',
  },
]
export const rate_type: IGenericResource[] = [
  { label: 'Fija', value: 'Fija' },
  { label: 'Variable', value: 'Variable' },
]
export const rate_class: IGenericResource[] = [
  { label: 'Nominal', value: 'Nominal' },
  { label: 'Efectivo', value: 'Efectivo' },
]
export const rate: IGenericResource[] = [
  { label: 'DTF', value: 'DTF' },
  { label: 'IBR', value: 'IBR' },
]
export const rate_mode: IGenericResource[] = [
  { label: 'Vencida', value: 'Vencida' },
  { label: 'Anticipada', value: 'Anticipada' },
]
export const flow_rate_base: IGenericResource[] = [
  { label: '365 días', value: '365 días' },
  { label: '360 días', value: '360 días' },
  { label: '366 días', value: '366 días' },
]
export const flow_type: IGenericResource[] = [
  { label: 'Regular', value: 'Regular' },
  { label: 'Irregular', value: 'Irregular' },
]
export const payment_flow: IGenericResource[] = [
  { label: 'Inicio', value: 'Inicio' },
  { label: 'Cobro', value: 'Cobro' },
]
export const amortization_type: IGenericResource[] = [
  { label: 'Tabla', value: 'Tabla' },
  { label: 'Manual', value: 'Manual' },
]

export const interest_rate_payment_code_options: IPaymentCodeOptionResource[] =
  [
    { label: 'ME', value: 'ME', description: 'Mensual', months: 1 },
    { label: 'BM', value: 'BM', description: 'Bimestral', months: 2 },
    { label: 'TR', value: 'TR', description: 'Trimestral', months: 3 },
    { label: 'CV', value: 'CV', description: 'Cuatrimestral', months: 4 },
    { label: 'SM', value: 'SM', description: 'Semestral', months: 6 },
    { label: 'PE', value: 'PE', description: 'Periodo', months: null },
    { label: 'N/A', value: 'N/A', description: 'No aplica', months: null },
  ]

export const interest_rate_payment_code_description_options: IPaymentCodeOptionResource[] =
  [
    { label: 'Mensual', value: 'Mensual', description: 'Mensual', months: 1 },
    {
      label: 'Bimestral',
      value: 'Bimestral',
      description: 'Bimestral',
      months: 2,
    },
    {
      label: 'Trimestral',
      value: 'Trimestral',
      description: 'Trimestral',
      months: 3,
    },
    {
      label: 'Cuatrimestral',
      value: 'Cuatrimestral',
      description: 'Cuatrimestral',
      months: 4,
    },
    {
      label: 'Semestral',
      value: 'Semestral',
      description: 'Semestral',
      months: 6,
    },
    {
      label: 'Periodo',
      value: 'Periodo',
      description: 'Periodo',
      months: null,
    },
    { label: 'N/A', value: 'N/A', description: 'No aplica', months: null },
  ]
export const interest_rate_mode_code_options: IGenericResource[] = [
  { label: 'A', value: 'A', description: 'Anticipado' },
  { label: 'V', value: 'V', description: 'Vencido' },
]

export const interest_rate_mode_code_description_options: IGenericResource[] = [
  { label: 'Anticipada', value: 'Anticipada', description: 'Anticipado' },
  { label: 'Vencida', value: 'Vencida', description: 'Vencido' },
]

export const dispersion_options = {
  gmf: [
    { label: 'Todos', value: 'todos' },
    { label: 'GMF', value: 'GMF' },
    { label: 'Sin GMF', value: 'Sin GMF' },
  ],
  group: [
    { label: 'Agrupa', value: true },
    { label: 'No agrupa', value: false },
  ],
  radio: [
    { value: 'todos', label: 'Todos' },
    { value: 'mismo banco', label: 'Mismo banco' },
    { value: 'diferente banco', label: 'Diferente banco' },
  ],
}

export const collective_investment_funds_options = {
  fund_type: [
    { label: 'Fondo abierto', value: 1 },
    { label: 'Fondo cerrado', value: 2 },
    { label: 'Fondo de pensiones', value: 3 },
  ],
  status_modal: [
    { label: 'Activo', value: 1 },
    { label: 'Inactivo', value: 2 },
  ],
}

export const movement_types: IGenericResource[] = [
  { value: 'income', label: 'Ingresos' },
  { value: 'expense', label: 'Egresos' },
  { value: 'transfer', label: 'Traslados' },
]

export const bank_accounts_mock: IGenericResource[] = [
  { label: 'Cuenta de prueba 1', value: 1 },
  { label: 'Cuenta de prueba 2', value: 2 },
]

export const note_type: IGenericResource[] = [
  { label: 'Nota Crédito', value: 'Nota Crédito' },
  { label: 'Nota Débito', value: 'Nota Débito' },
]

export const authorization_fiduciary_commissions_class: IGenericResource[] = [
  { label: 'Fija', value: 'Fija' },
  { label: 'Variable', value: 'Variable' },
  { label: 'Estructuración', value: 'Estructuración' },
]

export const authorization_fiduciary_commissions_periodicity: IGenericResource[] =
  [
    { label: 'Único pago', value: 'Único pago' },
    { label: 'Diario', value: 'Diario' },
    { label: 'Bimensual', value: 'Bimensual' },
    { label: 'Mensual', value: 'Mensual' },
    { label: 'Bimestral', value: 'Bimestral' },
    { label: 'Trimestral', value: 'Trimestral' },
    { label: 'Cuatrimestral', value: 'Cuatrimestral' },
    { label: 'Semestral', value: 'Semestral' },
    { label: 'Anual', value: 'Anual' },
  ]

export const authorization_fiduciary_commissions_status: IGenericResource[] = [
  { label: 'Liquidada', value: 7 },
  { label: 'Autorizada', value: 12 },
  { label: 'Anulada', value: 13 },
  { label: 'Facturado', value: 15 },
]

export const authorization_fiduciary_commissions_type: IGenericResource[] = [
  { label: 'Automática', value: 'Automática' },
  { label: 'Manual', value: 'Manual' },
]

export const authorization_fiduciary_commissions_collection: IGenericResource[] =
  [
    { label: 'Vencido', value: 'Vencido' },
    { label: 'Anticipado', value: 'Anticipado' },
  ]

export const risk_rating_agencies = {
  form: [
    { label: 'Interna', value: 'interna' },
    { label: 'Externa', value: 'externa' },
  ],
  options: [
    { label: 'Todos', value: '' },
    { label: 'Interna', value: 'interna' },
    { label: 'Externa', value: 'externa' },
  ],
}

export const process_type_options: ISelectorStringResource[] = [
  { label: 'Archivo', value: 'Archivo' },
  { label: 'Manual', value: 'Manual' },
]
export const update_date_options: IGenericResource[] = [
  { label: 'Día', value: 'Día' },
  { label: 'Mes', value: 'Mes' },
]

export const nature_options: IGenericResourceBoolean[] = [
  { label: 'Crédito', value: true },
  { label: 'Débito', value: false },
]

export const position_options: IGenericResourceBoolean[] = [
  { label: 'Activo', value: true },
  { label: 'Pasiva', value: false },
]

export const target_options: IGenericResourceBoolean[] = [
  { label: 'Cobertura', value: true },
  { label: 'Especulación', value: false },
]

export const bulk_upload_type = [
  { label: 'Ingresos', value: 'income' },
  { label: 'Egresos', value: 'expense' },
  { label: 'Traslados', value: 'transfer' },
]

export const treasury_cancellation_fields = [
  {
    showIfType: 'Movimiento de tesorería',
    fields: [
      { label: 'Concepto', key: 'concept' },
      { label: 'Valor', key: 'value.local' },
    ],
  },
  {
    showIfType: 'Traslados',
    fields: [{ label: 'Concepto', key: 'concept' }],
  },
  {
    showIfType: 'Cheque',
    fields: [
      { label: 'Banco', key: 'bank.description' },
      {
        label: 'Cuenta bancaria',
        key: 'bank_account.account_number - bank_account.account_name',
      },
      { label: 'Estado', key: 'status.id' },
    ],
  },
  {
    showIfType: 'Movimiento de tesorería',
    showSeparatorBefore: true,
    fields: [
      { label: 'Número de movimiento', key: 'treasury_movement.line_number' },
      { label: 'Período', key: 'treasury_movement.period' },
      { label: 'Fecha', key: 'date' },
      {
        label: 'Código de movimiento',
        key: 'treasury_movement_code.code - treasury_movement_code.description',
      },
      { label: 'Concepto', key: 'concept' },
      { label: 'Código de comprobante', key: 'voucher_number' },
      { label: 'Código de subcomprobante', key: 'sub_voucher' },
      { label: 'Número de comprobante', key: 'voucher' },
      { label: 'Orden de pago', key: 'id' },
      { label: 'Vigencia', key: 'fiscal_year' },
      { label: 'Banco', key: 'bank.code - bank.description' },
      {
        label: 'Cuenta bancaria',
        key: 'bank_account.account_number - bank_account.account_name',
      },
      { label: 'Número de cheque', key: 'cheque.consecutive' },
    ],
  },
  {
    showIfType: 'Traslados',
    showSeparatorBefore: true,
    fields: [
      { label: 'Número de traslado', key: 'id' },
      { label: 'Período', key: 'period' },
      { label: 'Fecha', key: 'date' },
      {
        label: 'Código de movimiento origen',
        key: 'origin.movement_code.code',
      },
      { label: 'Negocio origen', key: 'origin.business_trust.name' },
      { label: 'Banco origen', key: 'origin.bank.description' },

      {
        label: 'Cuenta origen',
        key: 'origin.bank_account',
        format: (val: unknown) => {
          const account = val as {
            account_name?: string
            account_number?: string
          } | null
          if (!account) return '-'
          return `${account.account_name ?? '-'} - ${
            account.account_number ?? '-'
          }`
        },
      },
      { label: 'Fondo origen', key: 'origin.found' },
      { label: 'Plan de inversión', key: 'origin.investment_plan' },
      {
        label: 'Código de movimiento destino',
        key: 'destination.movement_code.code',
      },
      { label: 'Negocio destino', key: 'destination.business_trust.name' },
      { label: 'Banco destino', key: 'destination.bank.description' },
      {
        label: 'Cuenta destino',
        key: 'destination.bank_account',
        format: (val: unknown) => {
          const account = val as {
            account_name?: string
            account_number?: string
          } | null
          if (!account) return '-'
          return `${account.account_name ?? '-'} - ${
            account.account_number ?? '-'
          }`
        },
      },
      { label: 'Fondo destino', key: 'destination.found' },
      {
        label: 'Plan de inversión destino',
        key: 'destination.investment_plan',
      },
    ],
  },
  {
    showIfType: 'Cheque',
    showSeparatorBefore: true,
    fields: [
      { label: 'Chequera', key: 'checkbook.code' },
      { label: 'Número de cheque', key: 'id' },
    ],
  },
]

export const periodicity_options: IGenericResource[] = [
  { label: 'Mensual', value: 'Mensual' },
  { label: 'Trimestral', value: 'Trimestral' },
]

export const collections_options: IGenericResource[] = [
  {
    label: 'Vencido',
    value: 'Vencido',
  },
  {
    label: 'Anticipado',
    value: 'Anticipado',
  },
]
// Son campos que dependen de backend por lo que se deja en este archivo temporal
export const fiduciary_trust_fields = {
  balances: [
    {
      label: 'Saldo total de plan de inversión',
      value: '-',
    },
    {
      label: 'Control de cancelación',
      value: '-',
    },
    {
      label: 'Saldo reservado',
      value: '-',
    },
    {
      label: 'Saldo canje',
      value: '-',
    },
    {
      label: 'Saldo congelado',
      value: '-',
    },
    {
      label: 'Disponible sin deducción',
      value: '-',
    },
    {
      label: 'Rendimientos',
      value: '-',
    },
  ],
  deductions: [
    {
      label: 'GMF',
      value: '-',
    },
    {
      label: 'Retención en la fuente',
      value: '-',
    },
    {
      label: 'Penalización',
      value: '-',
    },
    {
      label: 'Neto con impuesto',
      value: '-',
    },
    {
      label: 'Neto sin impuesto',
      value: '-',
    },
  ],
}

export const investment_portfolio_isines_rates_behaviors = {
  fixed: 'Fija',
  variable: 'Variable',
  not_applicable: 'No aplica',
} as const

export const investment_portfolio_isines_modality = {
  in_advance: 'Anticipada',
  expired: 'Vencida',
} as const

export const bulk_upload_status_id = [
  {
    label: 'Pendiente',
    value: '25',
  },
  {
    label: 'Autorizado',
    value: '69',
  },
  {
    label: 'Rechazado',
    value: '10',
  },
  {
    label: 'autorizado parcialmente',
    value: '72',
  },
]

export const equity_ops_options = {
  button: [
    {
      label: "Compra ETF's moneda local",
      routeName: 'ETFLocalBuyCreate',
    },
    {
      label: "Venta ETF's moneda local",
      routeName: 'ETFLocalSellCreate',
    },
    {
      label: "Compra ETF's moneda extranjera",
      routeName: 'ETFForeignBuyCreate',
    },
    {
      label: "Venta ETF's moneda extranjera",
      routeName: 'ETFForeignSellCreate',
    },
  ],
  radio: [
    { label: 'Valor operación', value: 'Valor Operación' },
    { label: 'No. Unidades', value: 'Número Unidades' },
    { label: 'Valor manual', value: 'Valor Manual' },
  ],
  radio_2: [
    { label: 'Valor operación', value: 'Valor Operación' },
    { label: 'Valor manual', value: 'Valor Manual' },
  ],
  operation: [
    { label: 'Spot', value: 'Spot' },
    { label: 'De contado', value: 'De Contado' },
  ],
}

export const operation_bulk_upload_template = [
  {
    label: 'Aportes',
    value: 'Aportes',
  },
  {
    label: 'Retiros',
    value: 'Retiros',
  },
  {
    label: 'Cancelaciones',
    value: 'Cancelaciones',
  },
]

export const COMPENSATION_SYSTEMS: IOption[] = [
  { label: 'LP (Libre de pago)', value: 'LP (libre de pago)' },
  { label: 'ECP (Entrega contra pago)', value: 'ECP (entrega contra pago)' },
  {
    label: 'ECE (Entrega contra entrega)',
    value: 'ECE (entrega contra entrega)',
  },
]

export const operation_type = [
  { label: 'Compra', value: 'Compra' },
  { label: 'Venta', value: 'Venta' },
]

export const end_early = default_yes_no

export const login_types = [
  { label: 'Aplicación', value: 'app' },
  { label: 'Directorio activo', value: 'directory_active' },
]

export const investment_portfolio_isines_title_classes = {
  shares: 'Acciones',
  holdings: 'Participaciones',
} as const

export const type_process_dispersion_group_list = [
  { label: 'Todo', value: 'Todo' },
  { label: 'Con respuesta', value: 'Con respuesta' },
  { label: 'Sin respuesta', value: 'Sin respuesta' },
]

export const currency_type_equity_operations = [
  { label: 'Moneda local', value: 'Moneda local' },
  { label: 'Moneda extranjera', value: 'Moneda extranjera' },
]

export const investment_plan_operation_type_options = [
  { value: 'aporte', label: 'Aportes' },
  { value: 'retiro', label: 'Retiros' },
]

export const investment_plan_operation_subtype_options = {
  aporte: [
    { value: 'transaccional', label: 'Transaccional' },
    { value: 'bienes', label: 'Bienes', disabled: true },
  ],
  retiro: [
    { value: 'parcial', label: 'Parcial' },
    { value: 'cancelacion', label: 'Cancelación' },
  ],
}

export const sources_debit: IGenericResource[] = [
  {
    label: 'Plan de inversión (Encargos generales)',
    value: 'investment_plan',
  },
  { label: 'Cuenta', value: 'account' },
]

export const commissionTypeMap: Record<string, string[]> = {
  '1-1': ['salario minimo legal vigente', 'valor del pago'],
  '1-2': ['salario minimo legal vigente', 'otros valores'],
  '2': ['% sobre el rendimiento', '% sobre el saldos'],
  '3': ['salario minimo legal vigente', 'otros valores'],
}

export const settlement_fiduciary_commissions_class: IGenericResource[] = [
  { label: 'Todos', value: '' },
  { label: 'Fija', value: 1 },
  { label: 'Variable', value: 2 },
  { label: 'Estructuración', value: 3 },
]

export const settlement_fiduciary_commissions_periodicity: IGenericResource[] =
  [
    { label: 'Mensual', value: 'monthly' },
    { label: 'Trimestral', value: 'quarterly' },
    { label: 'Otro', value: 'other' },
  ]

export const settlement_fiduciary_commissions_type: IGenericResource[] = [
  { label: 'Automática', value: 'automatic' },
  { label: 'Manual', value: 'manual' },
]

export const settlement_fiduciary_commissions_collection: IGenericResource[] = [
  { label: 'Vencido', value: 'expired' },
  { label: 'Anticipado', value: 'anticipated' },
]

export const freezeOptions: IGenericResource[] = [
  {
    label: 'Total',
    value: 'Total',
  },
  {
    label: 'Parcial',
    value: 'Parcial',
  },
]

export const typeFreezeOptions: IGenericResource[] = [
  { label: 'Congelamiento', value: 'Congelamiento' },
  { label: 'Descongelamiento', value: 'Descongelamiento' },
  { label: 'Todos', value: 'Todos' },
]

export const typeFormFreezeOptions: IGenericResource[] = [
  { label: 'Parcial', value: 'Parcial' },
  { label: 'Total', value: 'Total' },
  { label: 'Todos', value: 'Todos' },
]

export const days_base_options: IGenericResource[] = [
  { label: '360', value: 360 },
  { label: '365', value: 365 },
  { label: '366', value: 366 },
]

export type Periodicity =
  | 'MENSUAL'
  | 'BIMESTRAL'
  | 'TRIMESTRAL'
  | 'SEMESTRAL'
  | 'ANUAL'

export const typePaymentMethodOptions: IGenericResource[] = [
  { label: 'Activo', value: '1' },
  { label: 'Inactivo', value: '2' },
  { label: 'Todos', value: '' },
]

export const disbursementTypeOptions: IGenericResource[] = [
  { label: 'Todos', value: 'Todos' },
  { label: 'Pago', value: 'Pago' },
  { label: 'Giro', value: 'Giro' },
]

export const ficsBulkUploadOperationOptions: IGenericResource[] = [
  {
    label: 'Aportes',
    value: 'Aportes',
  },
  {
    label: 'Retiros',
    value: 'Retiros',
  },
  {
    label: 'Cancelación',
    value: 'Cancelaciones',
  },
]

export const typeStatus: IGenericResource[] = [
  { label: 'Fraccionado', value: 'Fraccionado' },
  { label: 'Anulado', value: 'Anulado' },
]

export const CATEGORY_NUMERIC = 11
export const CATEGORY_VALUE = 12
export const CATEGORY_DATE = 13

export const bank_response_status_options: IGenericResource[] = [
  { label: 'Aplicado', value: 102 },
  { label: 'Debitado', value: 103 },
  { label: 'Rechazado', value: 10 },
]

export const generateExtractsOptions = [
  { label: 'Individual', value: 'individual' },
  { label: 'Masivo', value: 'masivo' },
]

export const fics_fiduciary_investment_plans_report_options: IGenericResource[] =
  [
    { label: 'Consulta planes cancelados', value: 'canceled_plans' },
    { label: 'Consulta apertura de planes de inversión', value: 'open_plans' },
  ] as const

export const pay_methods: IGenericResource[] = [
  { label: 'Crédito', value: 'Crédito' },
  { label: 'De contado', value: 'De contado' },
]

export const type_emitter_options: IGenericResource[] = [
  { value: 'Privado', label: 'Privado' },
  { value: 'Público', label: 'Público' },
]

export const stage: IGenericResource[] = [
  { label: 'Precontractual', value: 'Precontractual' },
  { label: 'En ejecución', value: 'En ejecución' },
  { label: 'Cierre', value: 'Cierre' },
]

export const status_automatic_debit: IGenericResource[] = [
  { label: 'Activo', value: '1' },
  { label: 'Inactivo', value: '0' },
  { label: 'Todos', value: '' },
]

export const investment_plan_operation_options = [
  { value: 'aporte', label: 'Aportes' },
  { value: 'retiro', label: 'Retiros' },
  { value: 'cancelacion', label: 'Cancelacion' },
]

export const process_source: IGenericResource[] = [
  { label: 'Facturas Aprobadas', value: 'factura_aprobada' },
  { label: 'Solicitudes de pago', value: 'solicitud_pago' },
]

export const payment_type: IGenericResource[] = [
  { label: 'Total', value: 'total' },
  { label: 'Parcial', value: 'parcial' },
]

export const payment_source: IGenericResource[] = [
  { label: 'Cuenta bancaria', value: 'cuenta_bancaria' },
  { label: 'Plan de inversión', value: 'plan_de_inversion' },
]

export const advance_amortization_type: IGenericResource[] = [
  { label: 'Manual', value: 'manual' },
  { label: 'Porcentaje', value: 'porcentaje' },
]

export const consolidation_type_options: IGenericResource[] = [
  { label: 'Diario', value: 'Diario' },
  { label: 'Mensual', value: 'Mensual' },
  { label: 'Todos', value: '' },
]

export const contract_periodicity_options: IGenericResource[] = [
  { label: 'Días', value: 'Días' },
  { label: 'Meses', value: 'Meses' },
  { label: 'Años', value: 'Años' },
]

export const constract_roles: IGenericResource[] = [
  { label: 'Supervisor del Contrato', value: 'Supervisor del Contrato' },
  { label: 'Interventor del Contrato', value: 'Interventor del Contrato' },
  { label: 'Apoyo a la Supervisión', value: 'Apoyo a la Supervisión' },
  { label: 'Coordinador de Supervisión', value: 'Coordinador de Supervisión' },
  { label: 'Responsable Financiero', value: 'Responsable Financiero' },
  { label: 'Responsable Técnico', value: 'Responsable Técnico' },
  { label: 'Responsable Jurídico', value: 'Responsable Jurídico' },
  {
    label: 'Responsable de Seguimiento Contractual',
    value: 'Responsable de Seguimiento Contractual',
  },
  {
    label: 'Responsable de Interventoría Ambiental o Social',
    value: 'Responsable de Interventoría Ambiental o Social',
  },
  {
    label: 'Representante del Contratante',
    value: 'Representante del Contratante',
  },
  { label: 'Comité de Supervisión', value: 'Comité de Supervisión' },
  { label: 'Auditor del Contrato', value: 'Auditor del Contrato' },
]

export const seizure_areas = [
  {
    label: 'FOMAG',
    value: 'fomag',
  },
  {
    label: 'VAF',
    value: 'vaf',
  },
  {
    label: 'JURÍDICA',
    value: 'juridica',
  },
]

export const process_type_seizure = [
  { value: 1, label: 'Cuotas alimentarias' },
  { value: 2, label: 'Cooperativas' },
  { value: 3, label: 'Créditos laborales' },
  { value: 4, label: 'Aportes parafiscales y seguridad social' },
  { value: 5, label: 'Créditos fiscales' },
  { value: 6, label: 'Embargos por créditos con garantía real' },
  { value: 7, label: 'Embargos judiciales civiles' },
  { value: 8, label: 'Embargos comerciales' },
]
export const calculation_types = <
  Array<{ label: CalculationType; value: CalculationType }>
>[
  {
    label: CalculationType.SMLMV,
    value: CalculationType.SMLMV,
  },
  {
    label: CalculationType.FIXED_VALUE,
    value: CalculationType.FIXED_VALUE,
  },
  {
    label: CalculationType.BENEFICIARY_PAYMENT,
    value: CalculationType.BENEFICIARY_PAYMENT,
  },
  {
    label: CalculationType.PERFORMANCE_PERCENTAGE,
    value: CalculationType.PERFORMANCE_PERCENTAGE,
  },
  {
    label: CalculationType.BALANCE_PERCENTAGE,
    value: CalculationType.BALANCE_PERCENTAGE,
  },
  {
    label: CalculationType.MANUAL,
    value: CalculationType.MANUAL,
  },
  {
    label: CalculationType.TRANSACTION_VALUE,
    value: CalculationType.TRANSACTION_VALUE,
  },
  {
    label: CalculationType.TRANSACTION_PERCENTAGE,
    value: CalculationType.TRANSACTION_PERCENTAGE,
  },
]

export const fixed_asset_source_options: IResource[] = [
  {
    label: 'Activos fijos',
    value: 'Activo Fijo',
  },
  {
    label: 'Bienes',
    value: 'Bien',
  },
]
