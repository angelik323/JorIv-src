import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import {
  ISelectorResources,
  IStructureChartAccount,
  IResourceThirdParty,
  IAccountStructureResource,
  IChangeTrustStatus,
  IThirdPartyResource,
  IAccountChartResource,
  IBusinessTrustResource,
  IReceiptTypeResource,
  IVoucherStatusResource,
  IBusinessSubTypeResource,
  IAccountStructuresByType,
  IInterestRateResource,
  IRevertVouchersResource,
  IStructure,
  IAccountingParameters,
  ICollectionAccountingBlocksResponse,
  ICatalogLimitGroups,
} from '@/interfaces/customs'
import { IBranchOptions, IErrors, IResource } from '@/interfaces/global'

import { defineStore } from 'pinia'

import {
  URL_PATH_TREASURIES,
  URL_PATH_ACCOUNTING,
  URL_PATH_RESOURCES,
  TRUST_BUSINESS_API_URL,
  URL_PATH_SCHEDULES,
  URL_PATH_FICS,
  URL_PATH_INVESTMENT_PORTFOLIO,
  URL_PATH_FINANCIAL_OBLIGATION,
  URL_PATH_USERS,
} from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useResourecesV1 = defineStore('resources-v1', {
  state: () => ({
    version: 'v1',
    users: [] as IResource[],
    users_with_document: [] as IResource[],
    document_types_user: [] as IResource[],
    document_types_third_party_natural: [] as IResource[],
    document_types_third_legal: [] as IResource[],
    cities: [] as IResource[],
    roles: [] as IResource[],
    banks: [] as IResource[],
    branches: [] as IBranchOptions[],
    bank_branches: [] as IBranchOptions[],
    ciius: [] as IResource[],
    departments: [] as IResource[],
    third_party: [] as IResource[],
    third_party_filter: [] as IResource[],
    occupations: [] as IResource[],
    vouchers_validation_status: [] as IResource[],
    third_party_occupations: [] as IResource[],
    provider_third_party: [] as IResource[],
    countries: [] as IResource[],
    nationalities: [] as IResource[],
    third_party_type: [] as IResource[],
    fiscal_responsability: [] as IResource[],
    third_party_identity_types: [] as IResource[],
    third_party_request_types: [] as IResource[],
    shareholder_types: [] as IResource[],
    beneficiary_ownerships: [] as IResource[],
    beneficiary_benefits: [] as IResource[],
    third_party_taxpayer_types: [] as IResource[],
    customer_status: [] as IResource[],
    legal_people_company_classification: [] as IResource[],
    third_party_tin_options: [] as IResource[],
    legal_people_fund_sources: [] as IResource[],
    account_structures_block: [] as IResource[],
    treasury_movement_codes: [] as IResource[],
    accounting_account_contrapart: [] as IResource[],
    third_type: [] as IResource[],
    accounting_account: [] as IResource[],
    treasury_type_receive: [] as IResource[],
    coin_type: [] as IResource[],
    cost_structures_by_chart_account: [] as IResource[],
    cost_center_codes_by_structure: [] as IResource[],
    accounting_third_parties_with_document: [] as IResource[],
    sub_receipt_type: [] as IResource[],
    third_party_nit: [] as IResourceThirdParty[],
    third_party_types: [] as IResource[],
    operational_account_charts: [] as IResource[],
    operational_cost_centers: [] as IResource[],
    receipt_type: [] as IResource[],
    movement_types_by_ids: [] as IResource[],
    movement_code_override: [] as IResource[],
    nature_movement_codes_list: [] as IResource[],
    operation_movement_codes_list: [] as ISelectorResources[],
    movements: [] as IResource[],
    funds: [] as IResource[],
    account_structures_active: [] as IResource[],
    account_structures_active_revert_vouchers: [] as IResource[],
    business_trusts_with_description: [] as IResource[],
    business_trust: [] as IBusinessTrustResource[],
    treasury_banks: [] as IResource[],
    account_structures_by_type: {} as IAccountStructuresByType,
    max_code_collection_blocks: 0,
    account_chart_options: [] as IResource[],
    cost_center_structure_options: [] as IResource[],
    collection_concepts: [] as IResource[],
    accounting_accounts: [] as IResource[],
    cost_centers: [] as IResource[],
    budget_categories: [] as IResource[],
    cash_flow: [] as IResource[],
    description_investment_portfolio: [] as IResource[],
    movement_fics_codes: [] as IResource[],
    receipt_types_by_structure: [] as IReceiptTypeResource[],
    sub_receipt_types_by_type: [] as IReceiptTypeResource[],
    business_trusts_with_description_by_account_structure: [] as IResource[],
    businesses_by_reexpression: [] as IResource[],
    structure_by_business: [] as IResource[],
    accounts_by_business: [] as IResource[],
    accounts_by_structure: [] as IResource[],
    structure_levels: [] as IResource[],
    offices: [] as ISelectorResources[],
    offices_dispersion: [] as ISelectorResources[],
    type_receive: [] as ISelectorResources[],
    bank_accounts_income: [] as ISelectorResources[],
    account_chart_id: [] as IAccountingParameters[],
    type_accounting_blocks_collections_request: [] as
      | ICollectionAccountingBlocksResponse
      | [],
    aux_type: [] as ISelectorResources[],
    cash_flow_structure: [] as IResource[],
    third_party_id: [] as IResource[],
    cost_center_structure_id: [] as IResource[],
    business_by_code: [] as ISelectorResources[],
    business_trusts_basic: [] as IResource[],
    amount_types: [] as IResource[],
    listUserParamsData: {
      diaCaducidad: 180,
      intentosFallidos: 3,
      clavesHistoricos: 10,
      tiempoMxInactividad: 5,
      cerrarSesion: 15,
      sesionesActivas: 2,
    },
    options: [
      { id: 1, value: 'Aplicación', label: 'Aplicación' },
      { id: 2, value: 'Otro', label: 'Otro' },
    ],
    third_party_natures: ['Privada', 'Publica', 'Mixta', 'Extranjera'],
    correspondence: [
      { label: 'Email', value: 'Email' },
      { label: 'Correspondencia física', value: 'Correspondencia fisica' },
    ] as IResource[],
    tins: [
      {
        label: 'La supremacía del país no emite TIN',
        value: 'La supremacía del país no emite TIN',
      },
      {
        label: 'TIN en proceso de emisión.',
        value: 'TIN en proceso de emisión.',
      },
      { label: 'Posee TIN', value: 'Posee TIN' },
    ] as IResource[],

    bankAccounts: [{ label: 'Cuenta1', value: 'Cuenta1' }] as IResource[],

    regimen_trustor_person: [
      { label: 'Regimen1', value: 'Regimen1' },
    ] as IResource[],

    document_types_client_natural: [
      { label: 'Cedula', value: 1 },
    ] as IResource[],

    // * Default values selects ERP:
    type_person: null as string | null,
    status: [
      { label: 'Todos', value: 0 },
      { label: 'Activo', value: 1 },
      { label: 'Inactivo', value: 2 },
    ] as IResource[],
    bank_types: [
      { label: 'Cuenta Corriente', value: 'Cuenta Corriente' },
      { label: 'Cuenta De Ahorros', value: 'Cuenta De Ahorros' },
      { label: 'Cuenta De Deposito', value: 'Cuenta De Deposito' },
      { label: 'Cuenta Remunerada', value: 'Cuenta Remunerada' },
      { label: 'Fuente Crédito', value: 'Fuente Crédito' },
      { label: 'Ventanilla - Caja', value: 'Ventanilla - Caja' },
    ] as IResource[],
    estate_origin: [
      {
        label: 'Aportes presupuesto nacional',
        value: 'Aportes presupuesto nacional',
      },
      { label: 'Crédito', value: 'Crédito' },
      { label: 'Impuestos', value: 'Impuestos' },
      { label: 'Salario', value: 'Salario' },
      { label: 'Servicios profesionales', value: 'Servicios profesionales' },
      { label: 'Otro', value: 'Otro' },
    ] as IResource[],
    options_boolean: [
      { label: 'SI', value: 'SI' },
      { label: 'NO', value: 'NO' },
    ] as IResource[],
    phone_types: [
      {
        value: 'phone',
        label: 'Fijo',
      },
      {
        value: 'mobile',
        label: 'Celular',
      },
    ] as IResource[],
    person_types: [
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
        label: 'Jurídica',
      },
    ] as IResource[],
    phones_countries: [
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
    ],
    cancellation_codes_options: [
      {
        label: 'Todos',
        value: '',
      },
      {
        label: 'Si',
        value: true,
      },
      {
        label: 'No',
        value: false,
      },
    ] as IResource[],
    year_list: Array.from(
      { length: 6 },
      (_, index) => new Date().getFullYear() + index
    ),
    month_list: [
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
    ],
    repeat_options: [
      { label: 'Diario', value: 'daily' },
      { label: 'Semanal', value: 'weekly' },
      { label: 'Mensual', value: 'monthly' },
      { label: 'Anual', value: 'yearly' },
    ],
    treasury_cancellation_code_type: [] as IResource[],
    treasury_means_of_payment: [],
    dispersion_types: [] as IResource[],
    transaction_types: [] as IResource[],
    type_funds_transfers: [] as IResource[],
    type_means_of_payments: [] as IResource[],
    type_registrations: [] as IResource[],
    reason_return_apply: [] as IResource[],
    reason_return_status: [] as IResource[],
    account_structures_available: [] as IResource[],
    account_chart_types: [] as IResource[],
    account_chart_structures: [] as IResource[],
    account_chart_structure_details: [] as IResource[],
    account_chart_purposes: [] as IResource[],
    // Accounting
    account_structure_types: [] as IResource[],
    account_structure_statuses: [] as IResource[],
    catalog_limit_types: [] as IResource[],
    catalog_limit_groups: {} as ICatalogLimitGroups,
    catalog_limit_natures: [] as IResource[],
    tree_status: [] as IResource[],
    account_structures_with_purpose: [] as IResource[],
    bussines_parent: [] as IResource[],
    bussines_child: [] as IResource[],
    available_account_charts: [] as IResource[],
    available_cost_center_structures: [] as IResource[],
    cost_center_types: [] as IResource[],
    cost_center_structures: [] as IResource[],
    opening_record_structures: [] as IResource[],
    account_closing_events: [] as IResource[],
    account_closing_natures: [] as IResource[],
    available_accounting_structures: [] as IAccountStructureResource[],
    accounting_closing_parameter_account_chart: [] as IResource[],
    accounting_closing_parameter_third_parties: [] as IResource[],
    accounting_closing_parameter_cost_centers: [] as IResource[],
    accounts_charts: [] as IAccountChartResource[],
    third_parties: [] as IThirdPartyResource[],
    cost_center: [] as IResource[],
    voucher_natures: [] as IResource[],
    voucher_status: [] as IVoucherStatusResource[],
    daily_closing_business_by_account_structure:
      [] as IRevertVouchersResource[],
    // Types accounting receipt
    sub_receipt_types: [] as IResource[],
    receipt_types: [] as IReceiptTypeResource[],

    // Financial obligations
    bank_account: [] as ISelectorResources[],
    obligation_status: [] as IResource[],
    credit_types: [] as IResource[],
    periodicity_types: [] as IResource[],

    //Treasurie - Saldos iniciales de cuentas bancarias
    banks_initial_balance: [] as ISelectorResources[],

    days: [] as IResource[],
    channel: [] as IResource[],
    available: [] as IResource[],
    bank_branches_contacts: [] as IResource[],
    account_structures: [] as IResource[],
    account_structure_structures: [] as IResource[],
    account_structure_purposes: [] as IResource[],
    cash_flow_structure_types: [] as IResource[],
    cash_flow_structure_natures: [] as IResource[],
    cash_flow_structure_activity_groups: [] as IResource[],
    business_trust_label: [] as ISelectorResources[],
    bank_accounts_balances: [] as ISelectorResources[],

    commission_rate_options: [
      { label: '% Comisión', value: '% Comisión' },
      { label: 'Valor Fijo', value: 'Valor Fijo' },
    ],

    validates_collection_method_options: [
      { label: 'Entidad bancaria', value: true },
      { label: 'Forma de recaudo', value: false },
    ],

    movement_types: [
      { value: 'Ingresos', label: 'Ingresos' },
      { value: 'Egresos', label: 'Egresos' },
      { value: 'Traslados', label: 'Traslados' },
    ] as ISelectorResources[],

    origin: [] as IResource[],
    formatType: [] as IResource[],
    validationType: [] as IResource[],
    fileExtension: [] as IResource[],
    fileType: [] as IResource[],
    numericMask: [] as IResource[],
    valueMask: [] as IResource[],
    dateMask: [] as IResource[],
    registerType: [] as IResource[],
    constant: [] as IResource[],
    mask: [] as IResource[],
    variables: [] as IResource[],
    justification: [] as IResource[],

    // Trust Business
    business_trust_statuses: [] as IResource[],
    business_trust_register_type: [
      { value: 'Fideicomiso', label: 'Fideicomiso' },
      { value: 'Sociedad', label: 'Sociedad' },
    ] as IResource[],
    business_trust_types: [] as IResource[],
    business_trust_fideico_types: [] as IResource[],
    business_trust_society_types: [] as IResource[],
    business_trust_subtypes: [] as IBusinessSubTypeResource[],
    business_trust_mode: [] as IResource[],
    business_trust_classification: [] as IResource[],
    business_trust_periodicity_accountability: [] as IResource[],
    business_trusts: [] as IResource[],
    business_trusts_with_code: [] as IResource[],
    business_trust_yes_no: [
      { value: 'si', label: 'Si' },
      { value: 'no', label: 'No' },
    ] as IResource[],
    cost_centers_structures: [] as IResource[],
    business_currency: [] as IResource[],
    options_boolean_value: [
      { label: 'SI', value: true },
      { label: 'NO', value: false },
    ] as unknown as IResource[],
    status_accounting_trust_business: [] as IResource[],
    business_trust_third_parties: [] as IResource[],
    cash_flow_structures: [] as IResource[],
    clousings: [
      { value: 'daily', label: 'Diario' },
      { value: 'monthly', label: 'Mensual' },
    ] as IResource[],
    movement_codes_natures: [] as IResource[],
    movement_codes_types: [] as IResource[],
    collection_shapes: [] as IResource[],
    funds_movements: [] as IResource[],
    movement_codes_cancellation_codes: [] as IResource[],
    params_good_class: [] as IResource[],
    params_good_type: [] as IResource[],
    params_nature: [] as IResource[],
    params_auxiliary_type: [] as IResource[],
    movement_codes_parameters: [] as IResource[],
    params_accounting_account: [] as IResource[],

    // fics
    status_business_line: [] as IResource[],
    movement_types_movement_codes: [] as ISelectorResources[],
    movement_classes_movement_codes: [] as ISelectorResources[],
    movement_nature_movement_codes: [] as ISelectorResources[],
    movement_group_movement_codes: [] as ISelectorResources[],
    generate_accounting: [
      { label: 'Todo', value: '' },
      { label: 'Si', value: true },
      { label: 'No', value: false },
    ] as ISelectorResources[],
    operation_class: [
      { label: 'P - Principal', value: 'P - Principal' },
      { label: 'A - Ajuste', value: 'A - Ajuste' },
      { label: 'R - Reverso', value: 'R - Reverso' },
    ] as ISelectorResources[],
    origin_module_movement_codes: [] as ISelectorResources[],

    // investment portfolio
    issuers_counterparty: [] as IResource[],
    risk_rating_agencie: [] as IResource[],
    qualification_lp: [] as IResource[],
    qualification_cp: [] as IResource[],
    type_of_coins: [] as IResource[],
    InterestRate: [] as IInterestRateResource[],
    interest_rate_mode: [] as IResource[],
    interest_rate_payment_frequency: [] as IResource[],
    close_treasurie: [] as IResource[],
    offices_fics: [] as IResource[],
    business_trusts_egreso: [] as ISelectorResources[],
    payments: [] as ISelectorResources[],
    cost_center_egreso: [] as IResource[],
    cash_flow_structure_egreso: [] as IResource[],
    active_third_parties: [] as IResource[],
    bank_account_third_party: [] as IResource[],
    document_type: [] as IResource[],
    movement: [] as ISelectorResources[],
    banks_third_party: [] as ISelectorResources[],
    bank_branches_third_party: [] as ISelectorResources[],
    business_trust_change_status: [] as IResource[],
    normative_framework: [
      { label: 'CUIF', value: 'CUIF' },
      { label: 'Público', value: 'publico' },
      { label: 'Fiscal', value: 'fiscal' },
    ],
    qualification_actions: [] as IResource[],
    nit_agents: [] as IResource[],
    bank_account_business: [] as IResource[],
    operation_types: [] as IResource[],
    account_types: [] as IResource[],
    account_types_equivalences: [] as IResource[],
    product_types: [] as IResource[],
    bank_account_accounting_account_gmf: [] as IResource[],
    bank_account_cost_centers: [] as IResource[],
    gmf_decimals: [] as IResource[],
    coins: [] as IResource[],
    local_currency_type: [] as IResource[],
    foreign_currency_type: [] as IResource[],
    movement_treasury: [] as IResource[],
    validate_balance: [] as IResource[],
    bank_account_accounting_account: [] as IResource[],
    type_thirParty: [] as IResource[],
    bank_account_cost_center: [] as IResource[],
    bank_account_movements: [] as IResource[],
    extend_business: [] as IResource[],
    bank_account_accounting_accounts: [] as IResource[],
    cost_center_treasuries: [] as IResource[],
    bank_account_status: [] as IResource[],
    accounting_chart_operative_by_structure: [] as IResource[],
    agents: [] as IResource[],
    users_by_name: [] as ISelectorResources[],
    business: [] as ISelectorResources[],
    role: [] as ISelectorResources[],
    data_type: [
      { label: 'Numérico', value: 'Numérico' },
      { label: 'Alfanumérico', value: 'Alfanumérico' },
    ],
    reasons_bank_return: [] as ISelectorResources[],
    treasury_type_receive_equivalence: [] as ISelectorResources[],
    dispersion_file_business: [] as ISelectorResources[],
    dispersion_file_banks: [] as ISelectorResources[],
    dispersion_file_bank_accounts: [] as ISelectorResources[],
    dispersion_file_group: [] as ISelectorResources[],
    puc_accounts_by_structure: [] as ISelectorResources[],
    puc_source_account_structures: [] as ISelectorResources[],
    puc_equivalences_account_structures: [] as ISelectorResources[],
    puc_equivalence_fiscal_account_structures: [] as ISelectorResources[],
    puc_account_equivalence_types: [] as ISelectorResources[],
    puc_account_equivalences_by_type: [
      { label: 'Equivalente', value: 'equivalente' },
      { label: 'Fiscal', value: 'fiscal' },
      {
        label: 'Equivalente - Fiscal',
        value: 'equivalente-fiscal',
      },
    ],
    third_parties_by_business: [] as ISelectorResources[],
    user_types: [
      {
        value: 'interno',
        label: 'Interno',
      },
      {
        value: 'externo',
        label: 'Externo',
      },
    ] as IResource[],
    user_profile: [
      {
        value: 'Administrador',
        label: 'Administrador',
      },
      {
        value: 'Operador',
        label: 'Operador',
      },
      {
        value: 'Consulta',
        label: 'Consulta',
      },
    ] as IResource[],
    user_status: [
      {
        value: 1,
        label: 'Activo',
      },
      {
        value: 2,
        label: 'Inactivo',
      },
      {
        value: 52,
        label: 'Retirado',
      },
      {
        value: 53,
        label: 'Vacaciones',
      },
      {
        value: 3,
        label: 'Nuevo',
      },
      {
        value: 51,
        label: 'Bloqueado',
      },
      {
        value: 54,
        label: 'Directorio activo',
      },
    ] as IResource[],
    user_roles: [] as IResource[],

    commission_options: {
      commission_type: [
        { label: 'Todos', value: '' },
        { label: 'Fija (FI)', value: 1 },
        { label: 'Variable (VA)', value: 2 },
      ],
      rate_type: [
        { label: 'Todos', value: '' },
        { label: 'Nominal (NO)', value: 'NO - Nominal' },
        { label: 'Efectiva (EF)', value: 'EF - Efectiva' },
      ],
    },

    dispersion_options: {
      gmf: [
        { label: 'Todos', value: '' },
        { label: 'GMF', value: 'GMF' },
        { label: 'Sin GMF', value: 'Sin GMF' },
      ],
      group: [
        { label: 'Agrupa', value: true },
        { label: 'No agrupa', value: false },
      ],
    },

    investment_type: [
      { label: 'Renta fija', value: 'Renta fija' },
      { label: 'Renta variable', value: 'Renta variable' },
      { label: 'Participaciones', value: 'Participaciones' },
      { label: 'Derivados', value: 'Derivados' },
      { label: "ETF's", value: 'ETF' },
    ] as IResource[],
    investment_class: [
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
    ] as IResource[],
    rate_type: [
      { label: 'Fija', value: 'Fija' },
      { label: 'Variable', value: 'Variable' },
    ] as IResource[],
    rate_class: [
      { label: 'Nominal', value: 'Nominal' },
      { label: 'Efectivo', value: 'Efectivo' },
    ] as IResource[],
    rate: [
      { label: 'DTF', value: 'DTF' },
      { label: 'IBR', value: 'IBR' },
    ] as IResource[],
    rate_mode: [
      { label: 'Vencida', value: 'Vencida' },
      { label: 'Anticipada', value: 'Anticipada' },
    ] as IResource[],
    flow_rate_base: [
      { label: '365 días', value: '365 días' },
      { label: '360 días', value: '360 días' },
      { label: '366 días', value: '366 días' },
    ] as IResource[],
    flow_type: [
      { label: 'Regular', value: 'Regular' },
      { label: 'Irregular', value: 'Irregular' },
    ] as IResource[],
    payment_flow: [
      { label: 'Inicio', value: 'Inicio' },
      { label: 'Cobro', value: 'Cobro' },
    ] as IResource[],
    amortization_type: [
      { label: 'Tabla', value: 'Tabla' },
      { label: 'Manual', value: 'Manual' },
    ] as IResource[],

    interest_rate_payment_code_options: [
      { label: 'ME', value: 'ME', description: 'Mensual', months: 1 },
      { label: 'BM', value: 'BM', description: 'Bimestral', months: 2 },
      { label: 'TR', value: 'TR', description: 'Trimestral', months: 3 },
      { label: 'CV', value: 'CV', description: 'Cuatrimestral', months: 4 },
      { label: 'SM', value: 'SM', description: 'Semestral', months: 6 },
      { label: 'PE', value: 'PE', description: 'Periodo', months: null },
      { label: 'N/A', value: 'N/A', description: 'No aplica', months: null },
    ] as IResource[],

    interest_rate_mode_code_options: [
      { label: 'A', value: 'A', description: 'Anticipado' },
      { label: 'V', value: 'V', description: 'Vencido' },
    ] as IResource[],

    periodicity_billing_trust: [
      { label: 'Único pago', value: 'Único pago' },
      { label: 'Diario', value: 'Diario' },
      { label: 'Bimensual', value: 'Bimensual' },
      { label: 'Mensual', value: 'Mensual' },
      { label: 'Bimestral', value: 'Bimestral' },
      { label: 'Trimestral', value: 'Trimestral' },
      { label: 'Semestral', value: 'Semestral' },
      { label: 'Anual', value: 'Anual' },
    ] as IResource[],

    who_pays_commission: [
      { label: 'Fideicomitente', value: 'Fideicomitente' },
      { label: 'Fideicomiso', value: 'Fideicomiso' },
    ] as IResource[],

    deferred_impairment_account_structures: [] as ISelectorResources[],
    deferred_impairment_business_trusts: [] as ISelectorResources[],
    deferred_impairment_range_types: [] as ISelectorResources[],
    deferred_impairment_natures: [] as ISelectorResources[],
    deferred_impairment_accounts: [] as ISelectorResources[],
    deferred_impairment_receipt_types: [] as ISelectorResources[],
    deferred_impairment_sub_receipt_types: [] as ISelectorResources[],
    grounds_blocking_investment_status: [] as ISelectorResources[],
    account_structures_by_businness: [] as IResource[],
    accounting_structure_from_to_business: [] as IResource[],
    consolidator_business_trust_with_account_structure:
      [] as ISelectorResources[],
  }),

  actions: {
    async getResources(keys: string) {
      await executeApi()
        .get(`${URL_PATH_RESOURCES}?${keys}`)
        .then((response) => {
          if (response.data.success) {
            // Usuarios
            if (response.data.data.users) {
              this.users = []
              this.users =
                response.data.data.users.map((user: ISelectorResources) => ({
                  ...user,
                  value: user.id,
                  label: user.name + ' ' + user.last_name,
                  status_id: user.status_id,
                })) || []

              this.users_with_document =
                response.data.data.users.map((user: ISelectorResources) => ({
                  ...user,
                  value: user.id,
                  label: `${user.document} - ${user.name} ${user.last_name}`,
                  status_id: user.status_id,
                })) || []
            }

            // Sedes
            if (response.data.data.branches) {
              this.branches =
                response.data.data.branches.map(
                  (branch: ISelectorResources) => ({
                    value: branch.id,
                    label: branch.name,
                    status_id: branch.status_id,
                    type: branch.type,
                    parent_branch_id: branch.parent_branch_id,
                    child_branches: branch.child_branches,
                  })
                ) || []
            }

            // Sucursales
            if (response.data.data.bank_branches) {
              this.bank_branches =
                response.data.data.bank_branches.map(
                  (branch: ISelectorResources) => ({
                    value: branch.id,
                    label: `${branch.code} - ${branch.name}`,
                    status_id: branch.status_id,
                    city: branch.city,
                    bank: branch.bank,
                    bank_id: branch.bank_id,
                  })
                ) || []
            }

            // CIIUs
            if (response.data.data.ciius) {
              this.ciius =
                response.data.data.ciius.map((ciiu: ISelectorResources) => ({
                  value: ciiu.id,
                  label: `${ciiu.code} - ${ciiu.description}`,
                  code: ciiu.code,
                  description: ciiu.description,
                })) || []
            }

            // Paises - Nacionalidades
            if (response.data.data.countries) {
              this.countries =
                response.data.data.countries.map(
                  (country: ISelectorResources) => ({
                    value: country.id,
                    label: country.name?.toUpperCase(),
                    code: country.code,
                  })
                ) || []

              this.nationalities =
                response.data.data.countries.map(
                  (country: ISelectorResources) => ({
                    value: country.id,
                    label: country.nationality?.toUpperCase(),
                  })
                ) || []
            }

            // Departamentos
            if (response.data.data.departments) {
              this.departments =
                response.data.data.departments.map(
                  (department: ISelectorResources) => ({
                    value: department.id,
                    label: department.name,
                  })
                ) || []
            }

            // Document_types Terceros
            // **** Natural

            if (response.data.data.document_types_third_party_natural) {
              this.document_types_third_party_natural =
                response.data.data.document_types_third_party_natural.map(
                  (document_types_third_party_natural: ISelectorResources) => ({
                    value: document_types_third_party_natural.id,
                    label: document_types_third_party_natural.name,
                  })
                ) ?? []
            }

            // **** Jurídico
            if (response.data.data.document_types_third_legal) {
              this.document_types_third_legal =
                response.data.data.document_types_third_legal.map(
                  (document_types_third_legal: ISelectorResources) => ({
                    value: document_types_third_legal.id,
                    label: document_types_third_legal.name,
                  })
                ) ?? []
            }

            // Bancos
            if (response.data.data.banks) {
              this.banks =
                response.data.data.banks.map((banks: ISelectorResources) => ({
                  value: banks.id,
                  label: banks.description,
                  code: banks.code,
                })) ?? []
            }

            // Cities:
            if (response.data.data.cities) {
              this.cities =
                response.data.data.cities.map((cities: ISelectorResources) => ({
                  value: cities.id,
                  label: `${cities.code} - ${cities.name}`,
                  code: cities.code,
                  name: cities.name,
                })) ?? []
            }

            // Terceros:
            if (response.data.data.third_party) {
              this.third_party =
                response.data.data.third_party.map(
                  (third_party: ISelectorResources) => ({
                    value: third_party.id,
                    label: third_party.name ?? third_party.description,
                    status_id: third_party.status_id,
                    classification: third_party.third_party_classification,
                    code: third_party.code,
                  })
                ) ?? []

              // Con opción 'Todos' para el filtro:
              this.third_party_filter = [
                { value: 'Todos', label: 'Todos' },
                ...this.third_party,
              ]
            }

            // Proveedores de terceros:
            if (response.data.data.provider_third_party) {
              this.provider_third_party =
                response.data.data.provider_third_party.map(
                  (provider_third_party: ISelectorResources) => ({
                    value: provider_third_party.id,
                    label: provider_third_party.name,
                    status_id: provider_third_party.status_id,
                    nit: provider_third_party?.nit,
                  })
                )
            }

            // Tipo de terceros:
            if (response.data.data.third_party_type) {
              this.third_party_type = response.data.data.third_party_type
            }

            // Tipo de solicitantes:
            if (response.data.data.third_party_request_types) {
              this.third_party_request_types =
                response.data.data.third_party_request_types
            }

            // Profesiones:
            if (response.data.data.occupations) {
              this.occupations =
                response.data.data.occupations.map(
                  (occ: ISelectorResources) => ({
                    value: occ.id,
                    label: `${occ.occupation}`,
                  })
                ) ?? []
            }

            // Responsabilidad fiscal:
            if (response.data.data.fiscal_responsability) {
              this.fiscal_responsability =
                response.data.data.fiscal_responsability ?? []
            }

            // Naturaleza:
            if (response.data.data.third_party_natures) {
              this.third_party_natures =
                response.data.data.third_party_natures ?? []
            }

            // Tipo identidad:
            if (response.data.data.third_party_identity_types) {
              this.third_party_identity_types =
                response.data.data.third_party_identity_types.map(
                  (it: ISelectorResources) => ({
                    value: it.id,
                    label: it.identity_type,
                  })
                ) ?? []
            }

            // Tipo de accionistas:
            if (response.data.data.shareholder_types) {
              this.shareholder_types =
                response.data.data.shareholder_types.map((it: IResource) => ({
                  value: it.value,
                  label: it.label,
                })) ?? []
            }

            // Beneficiario participacion
            if (response.data.data.beneficiary_ownerships) {
              this.beneficiary_ownerships =
                response.data.data.beneficiary_ownerships.map(
                  (it: IResource) => ({
                    value: it.value,
                    label: it.label,
                  })
                ) ?? []
            }

            // Beneficiario beneficios
            if (response.data.data.beneficiary_benefits) {
              this.beneficiary_benefits =
                response.data.data.beneficiary_benefits.map(
                  (it: IResource) => ({
                    value: it.value,
                    label: it.label,
                  })
                ) ?? []
            }

            // Profesiones
            if (response.data.data.third_party_occupations) {
              this.third_party_occupations =
                response.data.data.third_party_occupations.map(
                  (tp: ISelectorResources) => ({
                    value: tp.id,
                    label: `${tp.name}`,
                  })
                )
            }

            // Tipo de contribuyente
            if (response.data.data.third_party_taxpayer_types) {
              this.third_party_taxpayer_types =
                response.data.data.third_party_taxpayer_types.map(
                  (tptp: ISelectorResources) => ({
                    value: tptp.id,
                    label: `${tptp.name ?? '--'}`,
                  })
                )
            }

            // Estados de clientes
            if (response.data.data.customer_status) {
              this.customer_status = response.data.data.customer_status.map(
                (cs: ISelectorResources) => ({
                  value: cs.id,
                  label: `${cs.status ?? '--'}`,
                })
              )
            }

            // Clasificacion de la empresa
            if (response.data.data.legal_people_company_classification) {
              this.legal_people_company_classification =
                response.data.data.legal_people_company_classification
            }

            // Tin
            if (response.data.data.third_party_tin_options) {
              this.third_party_tin_options =
                response.data.data.third_party_tin_options
            }

            // Origen de fondos
            if (response.data.data.legal_people_fund_sources) {
              this.legal_people_fund_sources =
                response.data.data.legal_people_fund_sources
            }
          }
        })
        .catch((e) => {
          const error = e as IErrors
          showAlert(showCatchError(error), 'error')
        })
    },

    async _getAccountingResources(keys: string) {
      await executeApi()
        .get(`${URL_PATH_ACCOUNTING}/select-tables?${keys}`)
        .then((response) => {
          if (!response.status) return
          const accounting_resources = response.data.data
          this.account_structure_types =
            accounting_resources.account_structure_types ??
            this.account_structure_types
          if (Array.isArray(accounting_resources.account_structure_statuses)) {
            this.account_structure_statuses =
              accounting_resources.account_structure_statuses?.map(
                (element: ISelectorResources) => {
                  return {
                    ...element,
                    value: element.id,
                    label: element.status,
                  }
                }
              ) ?? this.account_structure_statuses
          }
          this.account_structures =
            accounting_resources.account_structures?.map(
              (item: ISelectorResources) => {
                return {
                  ...item,
                  value: item.structure,
                  label: item.structure,
                }
              }
            ) ?? this.account_structures

          // cost_center_structure_options
          if (accounting_resources.account_structures) {
            this.cost_center_structure_options =
              accounting_resources.account_structures.map(
                (item: IResource) => ({
                  ...item,
                  label: item.structure,
                  value: item.id,
                  purpose: item.purpose,
                  type: item.type,
                })
              ) ?? []
          }
          if (response.data.data.business_trust) {
            this.business_trust_label = response.data.data.business_trust
              .sort(
                (a: ISelectorResources, b: ISelectorResources) => a.id - b.id
              )
              .map((item: ISelectorResources) => ({
                value: item.id,
                label: `${item.business_code} - ${item.name}`,
                name: item.name,
                business_code: item.business_code,
              }))
          }

          if (response.data.data.business_trust) {
            this.business_trust_label = response.data.data.business_trust
              .sort(
                (a: ISelectorResources, b: ISelectorResources) => a.id - b.id
              )
              .map((item: ISelectorResources) => ({
                value: item.id,
                label: `${item.business_code} - ${item.name}`,
                name: item.name,
                business_code: item.business_code,
              }))
          }

          if (response.data.data.deferred_impairment_account_structures) {
            this.deferred_impairment_account_structures =
              response.data.data.deferred_impairment_account_structures.map(
                (item: ISelectorResources) => ({ ...item })
              )
          }

          if (response.data.data.deferred_impairment_business_trusts) {
            this.deferred_impairment_business_trusts =
              response.data.data.deferred_impairment_business_trusts.map(
                (item: ISelectorResources) => ({ ...item })
              )
          }

          if (response.data.data.deferred_impairment_range_types) {
            this.deferred_impairment_range_types =
              response.data.data.deferred_impairment_range_types.map(
                (item: ISelectorResources) => ({
                  value: item.value,
                  label: item.label,
                })
              )
          }

          if (response.data.data.deferred_impairment_natures) {
            this.deferred_impairment_natures =
              response.data.data.deferred_impairment_natures.map(
                (item: ISelectorResources) => ({
                  value: item.value,
                  label: item.label,
                })
              )
          }

          if (response.data.data.deferred_impairment_accounts) {
            this.deferred_impairment_accounts =
              response.data.data.deferred_impairment_accounts.map(
                (item: ISelectorResources) => ({
                  value: item.id,
                  label: `${item.code} - ${item.name}`,
                  name: item.name,
                })
              )
          }

          if (response.data.data.deferred_impairment_receipt_types) {
            this.deferred_impairment_receipt_types =
              response.data.data.deferred_impairment_receipt_types.map(
                (item: ISelectorResources) => ({
                  value: item.id,
                  label: `${item.code} - ${item.name}`,
                })
              )
          }

          if (response.data.data.deferred_impairment_sub_receipt_types) {
            this.deferred_impairment_sub_receipt_types =
              response.data.data.deferred_impairment_sub_receipt_types.map(
                (item: ISelectorResources) => ({
                  value: item.id,
                  label: `${item.code} - ${item.name}`,
                })
              )
          }

          if (accounting_resources.business_trusts_with_description) {
            this.business_trusts_with_description =
              accounting_resources.business_trusts_with_description.map(
                (item: IResource) => ({
                  ...item,
                  value: item.id,
                  label: item.business_description ?? '',
                })
              ) ?? []
          }

          this.vouchers_validation_status =
            accounting_resources.vouchers_validation_status?.map(
              (item: ISelectorResources) => {
                return {
                  ...item,
                  value: item.id,
                  label: item.status,
                }
              }
            ) ?? this.vouchers_validation_status

          this.account_structures_active =
            accounting_resources.account_structures_active?.map(
              (item: ISelectorResources) => {
                return {
                  ...item,
                  value: item.id,
                  label: item.code,
                }
              }
            ) ?? this.account_structures_active

          this.puc_accounts_by_structure =
            accounting_resources.accounts_by_structure?.map(
              (item: ISelectorResources) => ({
                ...item,
              })
            )

          this.puc_source_account_structures =
            accounting_resources.source_account_structures?.map(
              (item: ISelectorResources) => ({
                value: item.id,
                label: `${item.code} - ${item.purpose}`,
              })
            )

          this.puc_equivalences_account_structures =
            accounting_resources.equivalent_account_structures?.map(
              (item: ISelectorResources) => ({
                value: item.id,
                label: `${item.code} - ${item.purpose}`,
              })
            )

          this.puc_equivalence_fiscal_account_structures =
            accounting_resources.equivalence_fiscal_account_structures?.map(
              (item: ISelectorResources) => ({
                value: item.id,
                label: `${item.code} - ${item.purpose}`,
              })
            )

          this.puc_account_equivalence_types =
            accounting_resources.account_equivalence_types?.map(
              (item: ISelectorResources, index: number) => ({
                value: index + 1,
                label: item.label,
              })
            )
          this.account_structures_active_revert_vouchers =
            accounting_resources.account_structures_active?.map(
              (item: ISelectorResources) => {
                return {
                  ...item,
                  value: item.code,
                  label: `${item.code} - ${item.purpose}`,
                }
              }
            ) ?? this.account_structures_active

          this.catalog_limit_groups =
            accounting_resources.catalog_limit_groups ??
            this.catalog_limit_groups
          this.catalog_limit_natures =
            accounting_resources.catalog_limit_natures ??
            this.catalog_limit_natures
          this.catalog_limit_types =
            accounting_resources.catalog_limit_types ?? this.catalog_limit_types

          // account closing events
          this.account_closing_events =
            accounting_resources.account_closing_events ??
            this.account_closing_events
          // account closing natures
          this.account_closing_natures =
            accounting_resources.account_closing_natures ??
            this.account_closing_natures
          // available accounting structures
          this.available_accounting_structures =
            accounting_resources.available_accounting_structures?.map(
              (item: IAccountStructureResource) => ({
                ...item,
                value: item.id,
                label: `${item.structure}`,
              })
            ) ?? this.available_accounting_structures
          // accounting closing parameter account chart
          this.accounting_closing_parameter_account_chart =
            accounting_resources.accounting_closing_parameter_account_chart?.map(
              (item: IResource) => ({
                value: item.id,
                label: `${item.code}`,
              })
            ) ?? this.accounting_closing_parameter_account_chart
          // accounting closing parameter third parties
          this.accounting_closing_parameter_third_parties =
            accounting_resources.accounting_closing_parameter_third_parties?.map(
              (item: ISelectorResources) => ({
                value: item.id,
                label: `${item.name ?? item.business_name} ${
                  item.last_name ?? ''
                }`,
              })
            ) ?? this.accounting_closing_parameter_third_parties
          // accounting closing parameter cost centers
          this.accounting_closing_parameter_cost_centers =
            accounting_resources.accounting_closing_parameter_cost_centers?.map(
              (item: IResource) => ({
                value: item.id,
                label: `${item.name}`,
              })
            ) ?? this.accounting_closing_parameter_cost_centers

          if (response.data.data.account_structures_available) {
            // Structures account chart
            this.account_structures_available =
              response.data?.data?.account_structures_available?.map(
                (item: IStructureChartAccount) => ({
                  ...item,
                  value: item.id,
                  label: `${item.code}`,
                  nature: item.status?.status ?? '',
                  name: `${item.purpose}`,
                })
              ) || []
          }

          this.accounts_charts =
            accounting_resources?.accounts_charts?.map(
              (item: IAccountChartResource) => ({
                ...item,
                label: `${item.code} - ${item.name}`,
                value: item.id,
              })
            ) ?? []

          this.third_parties =
            accounting_resources?.third_parties?.map(
              (item: IThirdPartyResource) => ({
                ...item,
                label: `${item.document} - ${
                  item.commercial_registration ?? ''
                }`,
                value: item.id,
              })
            ) ?? []

          if (accounting_resources?.business_trust) {
            this.business_trust = accounting_resources.business_trust.map(
              (item: IBusinessTrustResource) => ({
                ...item,
                label: item.business_code,
                value: item.id,
              })
            )
          }

          this.voucher_natures = accounting_resources?.voucher_natures ?? []
          this.voucher_status =
            accounting_resources?.voucher_status?.map(
              (item: IVoucherStatusResource) => ({
                ...item,
                value: item.id,
                label: item.status,
              })
            ) ?? []
          this.cost_center =
            accounting_resources?.cost_center?.map((item: IResource) => ({
              ...item,
              label: `${item.code} - ${item.name}`,
              value: item.id,
            })) ?? []

          this.daily_closing_business_by_account_structure =
            accounting_resources?.daily_closing_business_by_account_structure?.map(
              (item: IRevertVouchersResource) => ({
                ...item,
                label: `${item.business_code} - ${item.name}`,
                value: item.id,
              })
            )

          // Types account chart
          if (response.data.data.account_chart_types) {
            this.account_chart_types =
              response.data?.data?.account_chart_types || []
          }

          // Structures account chart
          if (response.data.data.account_chart_structures) {
            this.account_chart_structures =
              response.data?.data?.account_chart_structures
          }

          if (response.data.data.account_chart_structure_details) {
            this.account_chart_structure_details =
              response.data?.data?.account_chart_structure_details.map(
                (item: ISelectorResources) => ({
                  ...item,
                  value: item.id,
                  label: `${item.code} - ${item.purpose}`,
                })
              )
          }

          // chart of accounts selector
          if (response.data.data.account_chart_structures) {
            this.account_chart_options =
              response.data.data.account_chart_structures.map(
                (item: ISelectorResources) => ({
                  value: item.id,
                  label: item.structure,
                })
              ) ?? []
          }

          if (response.data.data.cost_structures_by_chart_account) {
            this.cost_structures_by_chart_account =
              response.data.data.cost_structures_by_chart_account.map(
                (item: ISelectorResources) => ({
                  label: item.code,
                  value: item.id,
                })
              )
          }

          if (response.data.data.cost_center_codes_by_structure) {
            this.cost_center_codes_by_structure =
              response.data.data.cost_center_codes_by_structure.map(
                (item: ISelectorResources) => ({
                  label: item.code,
                  value: item.id,
                })
              )
          }

          if (response.data.data.accounting_third_parties_with_document) {
            this.accounting_third_parties_with_document =
              response.data.data.accounting_third_parties_with_document.map(
                (item: ISelectorResources) => ({
                  value: item.id,
                  label: item.full_name_code,
                })
              ) ?? []
          }

          if (response.data.data.account_chart_purposes) {
            this.account_chart_purposes =
              response.data?.data?.account_chart_purposes
          }

          if (response.data.data.accounts_by_structure) {
            this.accounts_by_structure =
              response.data.data.accounts_by_structure.map(
                (item: ISelectorResources) => ({
                  label: item.name,
                  value: item.id,
                })
              )
          }

          this.available_cost_center_structures =
            accounting_resources.available_cost_center_structures?.map(
              (element: ISelectorResources) => {
                return {
                  ...element,
                  value: element.id,
                  label: element.structure,
                }
              }
            ) ?? this.available_cost_center_structures
          this.available_account_charts =
            accounting_resources.available_account_charts?.map(
              (element: ISelectorResources) => {
                return {
                  ...element,
                  value: element.id,
                  label: element.structure,
                }
              }
            ) ?? this.available_account_charts
          this.cost_center_types =
            accounting_resources.cost_center_types ?? this.cost_center_types

          this.cost_center_structures =
            accounting_resources.cost_center_structures?.map(
              (element: ISelectorResources) => {
                return {
                  ...element,
                  value: element.structure,
                  label: element.structure,
                }
              }
            ) ?? this.cost_center_structures

          // accounting structure selector
          if (response.data.data.account_structures_with_purpose) {
            this.opening_record_structures =
              response.data.data.account_structures_with_purpose.map(
                (item: ISelectorResources) => ({
                  value: item.id,
                  label: item.code_purpose,
                })
              ) ?? []
          }
          // sub_receipt_types
          if (response.data.data.sub_receipt_types) {
            this.sub_receipt_types = response.data?.data?.sub_receipt_types
          }

          // receipt_types
          if (response.data.data.receipt_types) {
            this.receipt_types = response.data?.data?.receipt_types
          }

          if (response.data.data.receipt_types_by_structure) {
            this.receipt_types_by_structure =
              response.data.data.receipt_types_by_structure.map(
                (item: IResource) => ({
                  value: item.id,
                  label: item.code,
                  code: item.code,
                })
              ) ?? []
          }

          if (response.data.data.sub_receipt_types_by_type) {
            this.sub_receipt_types_by_type =
              response.data.data.sub_receipt_types_by_type.map(
                (item: IResource) => ({
                  value: item.id,
                  label: item.code,
                  code: item.code,
                })
              ) ?? []
          }

          // tree_status
          if (response.data.data.tree_status) {
            this.tree_status = response.data.data.tree_status.map(
              (status: ISelectorResources) => {
                return {
                  ...status,
                  value: status.id,
                  label: status.status,
                }
              }
            )
          }

          // bussines_parent
          if (response.data.data.bussines_parent) {
            this.bussines_parent = response.data.data.bussines_parent.map(
              (item: ISelectorResources) => {
                return {
                  ...item,
                  value: item.id,
                  label: item.business_code,
                }
              }
            )
          }

          // bussines_child
          if (response.data.data.bussines_child) {
            this.bussines_child = response.data.data.bussines_child.map(
              (item: ISelectorResources) => {
                return {
                  ...item,
                  value: item.id,
                  label: item.business_code,
                }
              }
            )
          }

          if (response.data.data.account_structures_with_purpose) {
            this.account_structures_with_purpose =
              response.data.data.account_structures_with_purpose.map(
                (item: { id: number; code_purpose: string }) => {
                  return {
                    ...item,
                    value: item.id,
                    label: item.code_purpose,
                  }
                }
              )
          }

          if (
            response.data.data
              .business_trusts_with_description_by_account_structure
          ) {
            this.business_trusts_with_description_by_account_structure =
              response.data.data.business_trusts_with_description_by_account_structure.map(
                (item: IBusinessTrustResource) => {
                  return {
                    ...item,
                    value: item.id,
                    label: item.business_description,
                  }
                }
              )
          }
          if (response.data.data.accounting_chart_operative_by_structure) {
            this.accounting_chart_operative_by_structure =
              response.data.data.accounting_chart_operative_by_structure.map(
                (item: IStructure) => {
                  return {
                    ...item,
                    value: item.code,
                    label: item.code_name,
                    code: item.business_code,
                  }
                }
              )
          }
          if (response.data.data.third_parties_by_business) {
            this.third_parties_by_business =
              response.data.data.third_parties_by_business.map(
                (item: IThirdPartyResource) => {
                  return {
                    ...item,
                    value: item.id,
                    label: item.document,
                    code: item.business_code,
                  }
                }
              )
          }
          if (response.data.data.businesses_by_reexpression) {
            this.businesses_by_reexpression =
              response.data.data.businesses_by_reexpression.map(
                (item: IResource) => ({
                  value: item.id,
                  label: item.business_description,
                })
              ) ?? []
          }
          if (response.data.data.structure_by_business) {
            this.structure_by_business =
              response.data.data.structure_by_business.map(
                (item: IResource) => ({
                  value: item.id,
                  label: item.code_purpose,
                })
              ) ?? []
          }
          if (response.data.data.accounts_by_business) {
            this.accounts_by_business =
              response.data.data.accounts_by_business.map(
                (item: IResource) => ({
                  value: item.id,
                  label: item.code_name,
                })
              ) ?? []
          }

          if (response.data.data.business_by_code) {
            this.business_by_code =
              response.data.data.business_by_code.map(
                (item: ISelectorResources) => {
                  return {
                    value: item.business_code,
                    label: item.business_code,
                    name: item.name,
                    accounting_structure_code:
                      item.account.accounting_structure?.code ?? '',
                    accounting_structure_purpose:
                      item.account.accounting_structure?.purpose,
                  }
                }
              ) ?? []
          }
          if (accounting_resources.account_structures_active) {
            this.account_structures_by_businness =
              accounting_resources.account_structures_active?.map(
                (item: ISelectorResources) => {
                  return {
                    ...item,
                    value: item.code,
                    label: `${item.code} - ${item.structure}`,
                  }
                }
              ) ?? this.account_structures_by_businness
          }

          if (
            accounting_resources.business_trusts_with_description_by_account_structure
          ) {
            this.accounting_structure_from_to_business =
              accounting_resources.business_trusts_with_description_by_account_structure.map(
                (item: IBusinessTrustResource) => {
                  return {
                    value: item.id,
                    label: (item.business_description ?? '').replace(
                      '+',
                      ' - '
                    ),
                  }
                }
              )
          }

          if (
            accounting_resources.consolidator_business_trust_with_account_structure
          ) {
            this.consolidator_business_trust_with_account_structure =
              accounting_resources.consolidator_business_trust_with_account_structure.map(
                (item: ISelectorResources) => ({
                  value: item.id,
                  label: `${item.business_code} - ${item.name}`,
                  accounting_structure_code: `${item.account?.accounting_structure?.code} - ${item.account?.accounting_structure?.purpose}`,
                })
              )
          }
        })
        .catch((e) => {
          const error = e as IErrors
          showAlert(showCatchError(error), 'error')
        })
    },

    _setTypePerson(state: string | null) {
      this.type_person = null
      if (state) {
        this.type_person = state
      }
    },

    async _getResourcesTreasuries(keys: string) {
      await executeApi()
        .get(`${URL_PATH_TREASURIES}/select-tables?${keys}`)
        .then((response) => {
          if (response.data.success) {
            // Tipos de recaudos
            if (response.data.data.treasury_type_receive) {
              this.treasury_type_receive =
                response.data.data.treasury_type_receive ?? []

              this.treasury_type_receive_equivalence =
                response.data.data.treasury_type_receive.map(
                  (item: ISelectorResources) => ({
                    label: item.label,
                    value: item.id,
                  })
                )
            }

            if (response.data.data.coin_type) {
              this.coin_type = response.data.data.coin_type.map(
                (item: ISelectorResources) => ({
                  label: item.label,
                  value: item.value,
                })
              )
            }

            // Terceros activos
            if (response.data.data.third_party_nit) {
              this.third_party_nit =
                response.data.data.third_party_nit.map(
                  (item: ISelectorResources) => ({
                    label: `${item.third_party?.document_type?.name} ${item.third_party?.document} ${item.business_name}`,
                    value: item.third_party_id ?? null,
                  })
                ) ?? []
            }

            // Bancos de chequeras
            if (response.data.data.banks) {
              this.treasury_banks =
                response.data.data.banks.map((item: ISelectorResources) => ({
                  label: `${item.bank_code} ${item.description}`,
                  value: item.id ?? null,
                })) ?? []
            }

            // Bancos
            if (response.data.data.banks) {
              this.banks_initial_balance =
                response.data.data.banks.map((item: ISelectorResources) => ({
                  label: `${item.bank_code} - ${item.description}`,
                  value: item.id ?? null,
                })) ?? []

              this.banks = response.data.data.banks.map(
                (item: ISelectorResources) => ({
                  label: item.description,
                  value: item.id,
                })
              )
            }

            // Cancellation codes
            if (response.data.data.treasury_cancellation_code_type) {
              this.treasury_cancellation_code_type =
                response.data.data.treasury_cancellation_code_type
            }
            //Accounting voucher
            if (response.data.data.treasury_type_receive) {
              this.treasury_type_receive =
                response.data.data.treasury_type_receive ?? []
            }

            //Sub accounting voucher
            if (response.data.data.sub_receipt_type) {
              this.sub_receipt_type = response.data.data.sub_receipt_type.map(
                (item: ISelectorResources) => ({
                  label: item.code + ' - ' + item.name,
                  value: item.id,
                })
              )
            }

            if (response.data.data.receipt_type) {
              this.receipt_type = response.data?.data?.receipt_type.map(
                (item: ISelectorResources) => ({
                  label: item.code + ' - ' + item.name,
                  value: item.id ?? item.value,
                })
              )
            }

            // Movement code override
            if (response.data.data.MoveOverride) {
              this.movement_code_override =
                response.data.data.MoveOverride.map(
                  (item: ISelectorResources) => ({
                    label: item.code + ' - ' + item.description,
                    value: item.id,
                  })
                ) ?? []
            }
            // Movement codes nature
            if (response.data.data.nature) {
              this.nature_movement_codes_list = response.data.data.nature.map(
                (item: ISelectorResources) => ({
                  label: item.label ?? item.name ?? String(item.id),
                  value: item.value,
                })
              )
            }
            //third_party_comissions
            if (response.data.data.third_parties) {
              this.third_party_id =
                response.data?.data?.third_parties.map(
                  (item: ISelectorResources) => ({
                    label: item.document + ' - ' + item.name,
                    value: item.id ?? 1,
                  })
                ) ?? []
            }
            //aux_type_for_count
            if (response.data.data.counter_auxiliary_type) {
              this.aux_type =
                response.data?.data?.counter_auxiliary_type.map(
                  (item: ISelectorResources) => ({
                    label: item.label ?? item.name,
                    value: item.value ?? item.id,
                  })
                ) ?? []
            }

            //account_char_id
            if (response.data.data.accounting_block_collections_charts) {
              this.account_chart_id =
                response.data?.data?.accounting_block_collections_charts[0]?.accounting_structure.accounts_chart.map(
                  (item: ISelectorResources) => ({
                    label: item.name,
                    value: item.id,
                  })
                ) ?? []
            }

            if (response.data.data.accounting_block_collections_charts) {
              this.cost_center_structure_id =
                response.data?.data?.accounting_block_collections_charts[0].cost_center_structure.cost_centers.map(
                  (item: ISelectorResources) => ({
                    label: item.name,
                    value: item.id,
                  })
                ) ?? []
            }
            // Movement codes operation
            if (response.data.data.operation) {
              this.operation_movement_codes_list =
                response.data.data.operation.map(
                  (item: ISelectorResources) => ({
                    label: item.label ?? item.name ?? String(item.id),
                    value: item.value,
                    disable: false,
                  })
                )
            }
            //third_party_comissions
            if (response.data.data.third_parties) {
              this.third_party_id =
                response.data?.data?.third_parties.map(
                  (item: ISelectorResources) => ({
                    label: item.document + ' - ' + item.name,
                    value: item.id ?? 1,
                  })
                ) ?? []
            }
            //aux_type_for_count
            if (response.data.data.counter_auxiliary_type) {
              this.aux_type =
                response.data?.data?.counter_auxiliary_type.map(
                  (item: ISelectorResources) => ({
                    label: item.label ?? item.name,
                    value: item.value ?? item.id,
                  })
                ) ?? []
            }

            //account_char_id
            if (response.data.data.accounting_block_collections_charts) {
              this.account_chart_id =
                response.data?.data?.accounting_block_collections_charts[0]?.accounting_structure.accounts_chart.map(
                  (item: ISelectorResources) => ({
                    label: item.name,
                    value: item.id,
                  })
                ) ?? []
            }

            if (response.data.data.accounting_block_collections_charts) {
              this.cost_center_structure_id =
                response.data?.data?.accounting_block_collections_charts[0].cost_center_structure.cost_centers.map(
                  (item: ISelectorResources) => ({
                    label: item.name,
                    value: item.id,
                  })
                ) ?? []
            }
            // Payment methods
            if (response.data.data.treasury_means_of_payment) {
              this.dispersion_types =
                response.data.data.treasury_means_of_payment
                  ?.dispersion_types ?? []
              this.transaction_types =
                response.data.data.treasury_means_of_payment
                  ?.transaction_types ?? []
              this.type_funds_transfers =
                response.data.data.treasury_means_of_payment
                  ?.type_funds_transfers ?? []
              this.type_means_of_payments =
                response.data.data.treasury_means_of_payment
                  ?.type_means_of_payments ?? []
              this.type_registrations =
                response.data.data.treasury_means_of_payment
                  ?.type_registrations ?? []
            }

            // GroundsForBankRefund
            if (response.data.data.reason_return_apply) {
              this.reason_return_apply =
                response.data.data.reason_return_apply ?? []
            }

            if (response.data.data.reason_return_status) {
              this.reason_return_status =
                response.data.data.reason_return_status.map(
                  (item: ISelectorResources) => ({
                    value: item.id,
                    label: item.status,
                  })
                ) ?? []
            }

            if (response.data.data.account_structures_available) {
              this.account_structures_available =
                response.data.data.account_structures_available ?? []
            }

            if (response.data.data.account_structures) {
              this.account_structures =
                response.data.data.account_structures.map(
                  (item: ISelectorResources) => ({
                    label: item.code,
                    value: item.id,
                    purpose: item.purpose,
                    structure: item.structure,
                  })
                ) ?? []
            }

            if (response.data.data.business_trust) {
              this.business_trust =
                response.data.data.business_trust.map(
                  (item: ISelectorResources) => ({
                    label: `${item.business_code} ${item.name}`,
                    value: item.id ?? null,
                    name: item.name,
                    business_code: item.business_code,
                  })
                ) ?? []
            }

            if (response.data.data.account_structure_structures) {
              this.account_structure_structures =
                response.data.data.account_structure_structures ?? []
            }
            if (response.data.data.account_structure_purposes) {
              this.account_structure_purposes =
                response.data.data.account_structure_purposes ?? []
            }
            if (response.data.data.cash_flow_structure_types) {
              this.cash_flow_structure_types =
                response.data.data.cash_flow_structure_types ?? []
            }
            if (response.data.data.cash_flow_structure_natures) {
              this.cash_flow_structure_natures =
                response.data.data.cash_flow_structure_natures ?? []
            }
            if (response.data.data.cash_flow_structure_activity_groups) {
              this.cash_flow_structure_activity_groups =
                response.data.data.cash_flow_structure_activity_groups ?? []
            }

            // Dias
            if (response.data.data.days) {
              this.days = response.data.data.days ?? []
            }
            //sucursales bancarias
            if (response.data.data.bank_branches) {
              this.bank_branches_contacts =
                response.data.data.bank_branches.map((branch: IResource) => ({
                  value: branch.id,
                  label: `${branch.code}  ${branch.name} `,
                })) ?? []
            }
            // Canales
            if (response.data.data.channel) {
              this.channel = response.data.data.channel ?? []
            }

            // Estructura de cuentas de tipo catalogo cuentas contables
            if (response.data.data.account_structures_block) {
              this.account_structures_block =
                response.data.data.account_structures_block.map(
                  (item: ISelectorResources) => ({
                    value: item.id,
                    label: `${item.code} - ${item.purpose}`,
                    structure: item.structure,
                    purpose: item.purpose,
                  })
                ) ?? []
            }

            // Códigos movimiento tesorería
            if (response.data.data.treasury_movement_codes) {
              this.treasury_movement_codes =
                response.data.data.treasury_movement_codes.map(
                  (item: ISelectorResources) => ({
                    value: item.id,
                    label: `${item.code} - ${item.description}`,
                    description: item.description,
                    nature: item.nature,
                    handles_accounting_offset: item.handles_accounting_offset,
                  })
                ) ?? []
            }

            // Cuenta contable contrapartida asociada a la estructura contable seleccionada
            if (response.data.data.accounting_account_contrapart) {
              this.accounting_account_contrapart =
                response.data.data.accounting_account_contrapart.map(
                  (item: ISelectorResources) => ({
                    value: item.id,
                    label: `${item.code} - ${item.name}`,
                    name: item.name,
                    account_structure: item.account_structure,
                  })
                ) ?? []
            }

            // Tipo tercero: Cuenta Bancaria, Beneficiarios, Específico.
            if (response.data.data.third_type) {
              this.third_type =
                response.data.data.third_type.map((item: IResource) => ({
                  label: item.label,
                  value: item.value,
                })) ?? []
            }

            // Cuentas contables
            if (response.data.data.accounting_account) {
              this.accounting_account =
                response.data.data.accounting_account.map(
                  (item: ISelectorResources) => ({
                    value: item.id,
                    label: `${item.code} ${item.name}`,
                    name: item.name,
                    code: item.code,
                    account_structure: item.account_structure,
                  })
                ) ?? []
            }

            // Estructuras contables
            if (response.data.data.account_structures_by_type) {
              this.account_structures_by_type =
                response.data.data.account_structures_by_type ?? {}

              this.collection_concepts =
                this.account_structures_by_type['Catálogo de conceptos recaudo']
                  ?.map(
                    (item: {
                      id: number
                      code?: number
                      structure: string
                      purpose?: string
                    }) => ({
                      value: item.id,
                      label: `${item.code} - ${item.purpose}`,
                      code: item.code ?? 0,
                    })
                  )
                  .sort((a, b) => a.code - b.code)
                  .map(({ value, label }) => ({ value, label })) ?? []
              this.accounting_accounts =
                this.account_structures_by_type['Catálogo de cuentas contables']
                  ?.map(
                    (item: {
                      id: number
                      code?: number
                      structure: string
                      purpose?: string
                    }) => ({
                      value: item.id,
                      label: `${item.code} - ${item.purpose}`,
                      code: item.code ?? 0,
                    })
                  )
                  .sort((a, b) => a.code - b.code)
                  .map(({ value, label }) => ({ value, label })) ?? []
              this.cost_centers =
                this.account_structures_by_type['Catálogo de centros de costo']
                  ?.map(
                    (item: {
                      id: number
                      code?: number
                      structure: string
                      purpose?: string
                    }) => ({
                      value: item.id,
                      label: `${item.code} - ${item.purpose}`,
                      code: item.code ?? 0,
                    })
                  )
                  .sort((a, b) => a.code - b.code)
                  .map(({ value, label }) => ({ value, label })) ?? []
              this.budget_categories =
                this.account_structures_by_type[
                  'Catálogo de rubros presupuestal'
                ]
                  ?.map(
                    (item: {
                      id: number
                      code?: number
                      structure: string
                      purpose?: string
                    }) => ({
                      value: item.id,
                      label: `${item.code} - ${item.purpose}`,
                      code: item.code ?? 0,
                    })
                  )
                  .sort((a, b) => a.code - b.code)
                  .map(({ value, label }) => ({ value, label })) ?? []
              this.cash_flow =
                this.account_structures_by_type[
                  'Catálogo de cuentas flujo de caja'
                ]
                  ?.map(
                    (item: {
                      id: number
                      code?: number
                      structure: string
                      purpose?: string
                    }) => ({
                      value: item.id,
                      label: `${item.code} - ${item.purpose}`,
                      code: item.code ?? 0,
                    })
                  )
                  .sort((a, b) => a.code - b.code)
                  .map(({ value, label }) => ({ value, label })) ?? []
            }

            // accounting_blocks_collection_code
            if (response.data.data.accounting_blocks_collection_code) {
              this.max_code_collection_blocks =
                response.data.data.accounting_blocks_collection_code.max_code ??
                0
            }

            // Flujos de caja
            if (response.data.data.cash_flow_structures) {
              this.cash_flow_structures =
                response.data.data.cash_flow_structures.map(
                  (item: IResource) => {
                    return {
                      value: item.id,
                      label: `${item.code} - ${item.name}`,
                    }
                  }
                )
            }

            // tipos de terceros: Cuenta Bancaria, Fideicomitentes, Beneficiarios, Específico, Tercero, Negocio y NIT Negocio.
            if (response.data.data.third_party_types) {
              this.third_party_types = response.data.data.third_party_types.map(
                (item: IResource) => ({
                  value: item.value,
                  label: item.label,
                })
              )
            }

            // Cuentas contables partidas
            if (response.data.data.operational_account_charts) {
              this.operational_account_charts =
                response.data.data.operational_account_charts.map(
                  (item: IResource) => ({
                    ...item,
                    value: item.id,
                    label: `${item.code ?? ''} - ${item.name ?? ''}`,
                    code: item.code,
                  })
                ) ?? []
            }

            if (response.data.data.business_trusts_egreso) {
              this.business_trusts_egreso =
                response.data.data.business_trusts_egreso.map(
                  (item: ISelectorResources) => ({
                    ...item,
                    label: `${item.business_code} ${item.name}`,
                    value: item.id ?? null,
                    name: item.name ?? null,
                    account: item.account ?? null,
                    treasurie: item.treasurie ?? null,
                  })
                ) ?? []
            }

            if (response.data.data.payments) {
              this.payments =
                response.data.data.payments.map((item: ISelectorResources) => ({
                  label: item.type_mean_of_payments ?? null,
                  value: item.id ?? null,
                  type_mean_of_payments: item.type_mean_of_payments ?? null,
                  authorized_payment: item.authorized_payment ?? null,
                  payment_instructions: item.payment_instructions ?? null,
                  request_bank_withdrawal: item.request_bank_withdrawal ?? null,
                })) ?? []
            }

            if (response.data.data.cost_center_egreso) {
              this.cost_center_egreso =
                response.data.data.cost_center_egreso.map(
                  (item: ISelectorResources) => ({
                    label: `${item.code ?? ''} - ${item.id ?? ''}`,
                    value: item.id ?? null,
                    account_structure: item.account_structure ?? null,
                  })
                ) ?? []
            }

            if (response.data.data.bank_account) {
              this.bank_account =
                response.data.data.bank_account.map(
                  (item: ISelectorResources) => ({
                    label: item.account_number ?? null,
                    value: item.id ?? null,
                    coin_type: item.coin_type ?? null,
                  })
                ) ?? []

              this.bank_accounts_balances =
                response.data.data.bank_account.map(
                  (item: ISelectorResources) => ({
                    ...item,
                    label: `${item.account_number} - ${item.account_name}`,
                    value: item.id,
                  })
                ) ?? []
            }

            if (response.data.data.account_types) {
              this.account_types_equivalences =
                response.data.data.account_types.map(
                  (item: ISelectorResources, index: number) => ({
                    label: item.label,
                    value: index + 1,
                  })
                )
            }

            if (response.data.data.cash_flow_structure_egreso) {
              this.cash_flow_structure_egreso =
                response.data.data.cash_flow_structure_egreso.map(
                  (item: ISelectorResources) => ({
                    label: `${item.code} - ${item.name}`,
                    value: item.id ?? null,
                    account_structure: item.account_structure ?? null,
                  })
                )
            }

            if (response.data.data.third_parties) {
              this.active_third_parties =
                response.data.data.third_parties.map(
                  (item: ISelectorResources) => ({
                    label: `${item.document} - ${item.name}`,
                    value: item.id ?? null,
                  })
                ) ?? []
            }

            // Centros costos
            if (response.data.data.operational_cost_centers) {
              this.operational_cost_centers =
                response.data.data.operational_cost_centers.map(
                  (item: IResource) => ({
                    ...item,
                    value: item.id,
                    label: `${item.code ?? ''} - ${item.name ?? ''}`,
                    name: item.name,
                  })
                ) ?? []
            }

            if (response.data.data.bank_account_third_party) {
              this.bank_account_third_party =
                response.data.data.bank_account_third_party.map(
                  (item: ISelectorResources) => ({
                    label: `${item.account_number} - ${item.bank?.description}`,
                    value: item.id ?? null,
                    bank: item.bank ?? null,
                  })
                ) ?? []
            }

            if (response.data.data.document_type) {
              this.document_type = response.data.data.document_type.map(
                (item: ISelectorResources) => ({
                  label: item.name,
                  value: item.id,
                })
              )
            }

            if (response.data.data.movement) {
              this.movement =
                response.data.data.movement.map((item: ISelectorResources) => ({
                  id: item.id,
                  label: item.code,
                  value: item.id ?? null,
                  receipt_types: item.receipt_types ?? [],
                  sub_receipt_types: item.sub_receipt_types ?? [],
                })) ?? []
            }

            if (response.data.data.banks_third_party) {
              this.banks_third_party =
                response.data.data.banks_third_party.map(
                  (item: ISelectorResources) => ({
                    label: `${item.bank_code} - ${item.description}`,
                    value: item.id ?? null,
                  })
                ) ?? []
            }

            if (response.data.data.bank_branches_third_party) {
              this.bank_branches_third_party =
                response.data.data.bank_branches_third_party.map(
                  (item: ISelectorResources) => ({
                    label: `${item.code} - ${item.name}`,
                    value: item.id ?? null,
                  })
                ) ?? []
            }

            // Campo Origen
            if (response.data.data.origin) {
              this.origin =
                response.data.data.origin.map((item: ISelectorResources) => ({
                  label: item.name ?? null,
                  value: item.id ?? null,
                })) ?? []
            }

            // Campo tipo formato
            if (response.data.data.formatType) {
              this.formatType =
                response.data.data.formatType.map(
                  (item: ISelectorResources) => ({
                    label: item.name ?? null,
                    value: item.id ?? null,
                  })
                ) ?? []
            }

            // Campo tipo validación
            if (response.data.data.validationType) {
              this.validationType =
                response.data.data.validationType.map(
                  (item: ISelectorResources) => ({
                    label: item.name ?? null,
                    value: item.id ?? null,
                  })
                ) ?? []
            }

            // Campo extensión de archivo
            if (response.data.data.fileExtension) {
              this.fileExtension =
                response.data.data.fileExtension.map(
                  (item: ISelectorResources) => ({
                    label: item.name ?? null,
                    value: item.id ?? null,
                  })
                ) ?? []
            }

            // Campo tipo de archivo
            if (response.data.data.fileType) {
              this.fileType =
                response.data.data.fileType.map((item: ISelectorResources) => ({
                  label: item.name ?? null,
                  value: item.id ?? null,
                })) ?? []
            }

            // Campo mascara valor | Estructuras bancarias
            if (response.data.data.valueMask) {
              this.valueMask =
                response.data.data.valueMask.map(
                  (item: ISelectorResources) => ({
                    label: item.name ?? null,
                    value: item.id ?? null,
                  })
                ) ?? []
            }

            // Campo mascara numerica | Estructuras bancarias
            if (response.data.data.numericMask) {
              this.numericMask =
                response.data.data.numericMask.map(
                  (item: ISelectorResources) => ({
                    label: item.name ?? null,
                    value: item.id ?? null,
                  })
                ) ?? []
            }

            // Campo mascara fecha | Estructuras bancarias
            if (response.data.data.dateMask) {
              this.dateMask =
                response.data.data.dateMask.map((item: ISelectorResources) => ({
                  label: item.name ?? null,
                  value: item.id ?? null,
                })) ?? []
            }

            // Campo tipo registro | Estructuras bancarias
            if (response.data.data.registerType) {
              this.registerType =
                response.data.data.registerType.map(
                  (item: ISelectorResources) => ({
                    label: item.name ?? null,
                    value: item.id ?? null,
                  })
                ) ?? []
            }

            // Campo variable | Estructuras bancarias
            if (response.data.data.variables) {
              this.variables =
                response.data.data.variables.map(
                  (item: ISelectorResources) => ({
                    label: item.name ?? null,
                    value: item.id ?? null,
                  })
                ) ?? []
            }

            // Campo constante | Estructuras bancarias
            if (response.data.data.constant) {
              this.constant = response.data.data.constant ?? []
            }

            // Campo mascara | Estructuras bancarias
            if (response.data.data.mask) {
              this.mask =
                response.data.data.mask.map((item: ISelectorResources) => ({
                  label: item.name ?? null,
                  value: item.id ?? null,
                })) ?? []
            }

            // Campo justificación | Estructuras bancarias
            if (response.data.data.justification) {
              this.justification =
                response.data.data.justification.map(
                  (item: ISelectorResources) => ({
                    label: item.name ?? null,
                    value: item.id ?? null,
                  })
                ) ?? []
            }

            if (response.data.data.cities) {
              this.cities = response.data.data.cities.map(
                (item: ISelectorResources) => ({
                  label: item.name,
                  value: item.id,
                })
              )
            }

            if (response.data.data.reasonsForBankReturn) {
              this.reasons_bank_return =
                response.data.data.reasonsForBankReturn.map(
                  (item: ISelectorResources) => ({
                    label: item.name,
                    value: item.id,
                  })
                )
            }

            if (response.data.data.available) {
              this.available = response.data.data.available ?? []
            }

            if (response.data.data.bank_account_business) {
              this.bank_account_business =
                response.data.data.bank_account_business.map(
                  (item: ISelectorResources) => ({
                    label: `${item.business_code} - ${item.name}`,
                    value: item.id ?? null,
                    has_cost_center: item.account?.has_cost_center ?? false,
                    business_type_id: item.business_type_id ?? null,
                  })
                ) ?? []
            }

            if (response.data.data.banks) {
              this.treasury_banks =
                response.data.data.banks.map((item: ISelectorResources) => ({
                  label: `${item.bank_code} - ${item.description}`,
                  value: item.id ?? null,
                })) ?? []
            }

            if (response.data.data.third_parties) {
              this.third_parties =
                response.data.data.third_parties.map(
                  (item: ISelectorResources) => ({
                    label: `${item.document ?? ''} - ${item.name ?? ''}`,
                    value: item.id ?? null,
                  })
                ) ?? []
            }

            if (response.data.data.operation_types) {
              this.operation_types = response.data.data.operation_types ?? []
            }

            if (response.data.data.account_types) {
              this.account_types = response.data.data.account_types ?? []
            }

            if (response.data.data.product_types) {
              this.product_types = response.data.data.product_types ?? []
            }

            if (response.data.data.bank_account_accounting_account_gmf) {
              this.bank_account_accounting_account_gmf =
                response.data.data.bank_account_accounting_account_gmf.map(
                  (item: ISelectorResources) => ({
                    label: `${item.code} - ${item.name}`,
                    value: item.id ?? null,
                  })
                ) ?? []
            }

            if (response.data.data.bank_account_accounting_accounts) {
              this.bank_account_accounting_accounts =
                response.data.data.bank_account_accounting_accounts.map(
                  (item: ISelectorResources) => ({
                    label: `${item.code} - ${item.name}`,
                    value: item.id ?? null,
                    has_cost_center: item.has_cost_center ?? false,
                  })
                ) ?? []
            }

            if (response.data.data.banks) {
              this.banks =
                response.data.data.banks.map((item: ISelectorResources) => ({
                  label: `${item.bank_code ?? ''} - ${item.description ?? ''}`,
                  value: item.id ?? null,
                })) ?? []
            }

            if (response.data.data.typeReceive) {
              this.type_receive =
                response.data.data.typeReceive.map(
                  (item: ISelectorResources) => {
                    return {
                      ...item,
                      value: item.id,
                      label: item.description,
                      type_receive: item.type_receive ?? '',
                    }
                  }
                ) ?? []
            }

            if (response.data.data.bank_accounts_income) {
              this.bank_accounts_income =
                response.data.data.bank_accounts_income.map(
                  (item: ISelectorResources) => {
                    return {
                      ...item,
                      value: item.id ?? null,
                      label: `${item.account_number} - ${item.account_name}`,
                    }
                  }
                ) ?? []
            }
            if (response.data.data.bank_account_cost_centers) {
              this.bank_account_cost_centers =
                response.data.data.bank_account_cost_centers.map(
                  (item: ISelectorResources) => ({
                    label: `${item.code} - ${item.name}`,
                    value: item.id ?? null,
                  })
                ) ?? []
            }

            if (response.data.data.gmf_decimals) {
              this.gmf_decimals = response.data.data.gmf_decimals ?? []
            }

            if (response.data.data.movement_treasury) {
              this.movement_treasury =
                response.data.data.movement_treasury.map(
                  (item: ISelectorResources) => ({
                    label: `${item.code} - ${item.description}`,
                    value: item.id ?? null,
                  })
                ) ?? []
            }

            if (response.data.data.validate_balance) {
              this.validate_balance = response.data.data.validate_balance ?? []
            }

            if (response.data.data.bank_account_accounting_account) {
              this.bank_account_accounting_account =
                response.data.data.bank_account_accounting_account.map(
                  (item: ISelectorResources) => ({
                    label: `${item.code} - ${item.name}`,
                    value: item.id ?? null,
                  })
                ) ?? []
            }

            if (response.data.data.type_thirParty) {
              this.type_thirParty = response.data.data.type_thirParty ?? []
            }

            if (response.data.data.bank_account_cost_center) {
              this.bank_account_cost_center =
                response.data.data.bank_account_cost_center.map(
                  (item: ISelectorResources) => ({
                    label: `${item.code} - ${item.name}`,
                    value: item.id ?? null,
                  })
                ) ?? []
            }

            if (response.data.data.bank_account_status) {
              this.bank_account_status =
                response.data.data.bank_account_status.map(
                  (item: ISelectorResources) => ({
                    label: item.status,
                    value: item.id ?? null,
                  })
                ) ?? []
            }

            if (response.data.data.bank_account_accounting_account) {
              this.bank_account_accounting_account =
                response.data.data.bank_account_accounting_account.map(
                  (item: ISelectorResources) => ({
                    label: `${item.code} - ${item.name}`,
                    value: item.id ?? null,
                  })
                ) ?? []
            }

            if (response.data.data.cost_center) {
              this.cost_center_treasuries =
                response.data.data.cost_center.map(
                  (item: ISelectorResources) => ({
                    label: `${item.code} - ${item.name}`,
                    value: item.code ?? null,
                  })
                ) ?? []
            }

            if (response.data.data.typeReceive) {
              this.type_receive = response.data.data.typeReceive.map(
                (item: ISelectorResources) => ({
                  label: item.description,
                  value: item.id,
                })
              )
            }
          }
        })
        .catch((e) => {
          const error = e as IErrors
          showAlert(showCatchError(error), 'error')
        })
    },

    async _getResourcesFics(keys: string) {
      await executeApi()
        .get(`${URL_PATH_FICS}/select-tables?${keys}`)
        .then((response) => {
          if (response.data.success) {
            // Códigos Movimiento Fondos
            if (response.data.data.movements) {
              this.movements =
                response.data.data.movements.map(
                  (item: ISelectorResources) => ({
                    ...item,
                    value: item.id,
                    label: `${item.code ?? ''} - ${item.description ?? ''}`,
                    description: item?.description ?? null,
                  })
                ) ?? []
            }

            if (response.data.data.funds) {
              this.funds =
                response.data.data.funds.map((item: ISelectorResources) => ({
                  value: item.id,
                  label: `${item.code} - ${item.name}`,
                })) ?? []
            }

            if (response.data.data.offices) {
              this.offices_fics =
                response.data.data.offices.map((item: ISelectorResources) => ({
                  label: `${item.office_code} ${item.office_description}`,
                  value: item.id ?? null,
                  nameOffice: item.office_description,
                })) ?? []
            }
            if (response.data.data.movement_types_by_ids) {
              this.movement_types_by_ids =
                response.data.data.movement_types_by_ids.map(
                  (item: ISelectorResources) => ({
                    label: item.name,
                    value: item.id,
                  })
                )
            }

            if (response.data.data.offices) {
              this.offices = response.data.data.offices.map(
                (item: ISelectorResources) => {
                  return {
                    ...item,
                    value: item.id,
                    label: `${item.office_code ?? ''} - ${
                      item.office_description ?? ''
                    }`,
                  }
                }
              )

              this.offices_dispersion = response.data.data.offices.map(
                (item: ISelectorResources) => {
                  return {
                    value: item.id,
                    label: item.office_code,
                    name: item.office_description,
                  }
                }
              )
            }

            if (response.data.data.bank_account_movements) {
              this.bank_account_movements =
                response.data.data.bank_account_movements.map(
                  (item: ISelectorResources) => ({
                    label: `${item.code} ${item.description}`,
                    value: item.id ?? null,
                  })
                ) ?? []
            }

            if (response.data.data['status_business_line']) {
              this.status_business_line = response.data.data[
                'status_business_line'
              ].map((item: ISelectorResources) => ({
                label: item.status,
                value: item.id,
              }))
            }

            if (response.data.data.movement_types_movement_codes) {
              this.movement_types_movement_codes =
                response.data.data.movement_types_movement_codes.map(
                  (item: ISelectorResources) => ({
                    label: `${item.code} ${item.description}`,
                    value: item.id ?? null,
                  })
                ) ?? []
            }

            if (response.data.data.movement_classes_movement_codes) {
              this.movement_classes_movement_codes =
                response.data.data.movement_classes_movement_codes.map(
                  (item: ISelectorResources) => ({
                    label: `${item.code} ${item.description}`,
                    value: item.id ?? null,
                  })
                ) ?? []
            }

            if (response.data.data.movement_nature_movement_codes) {
              this.movement_nature_movement_codes =
                response.data.data.movement_nature_movement_codes.map(
                  (item: ISelectorResources) => ({
                    label: `${item.code} ${item.description}`,
                    value: item.id ?? null,
                  })
                ) ?? []
            }

            if (response.data.data.movement_group_movement_codes) {
              this.movement_group_movement_codes =
                response.data.data.movement_group_movement_codes.map(
                  (item: ISelectorResources) => ({
                    label: `${item.code} ${item.description}`,
                    value: item.id ?? null,
                  })
                ) ?? []
            }

            if (response.data.data.origin_module_movement_codes) {
              this.origin_module_movement_codes =
                response.data.data.origin_module_movement_codes.map(
                  (item: ISelectorResources) => ({
                    label: `${item.code} ${item.description}`,
                    value: item.id ?? null,
                  })
                ) ?? []
            }

            if (response.data.data.movements) {
              this.movement_fics_codes = response.data.data.movements.map(
                (item: ISelectorResources) => ({
                  label: item.code + ' - ' + item.description,
                  value: item.id,
                })
              )
            }
          }
        })
        .catch((e) => {
          const error = e as IErrors
          showAlert(showCatchError(error), 'error')
        })
    },

    async _getResourcesFinancialObligations(keys: string) {
      await executeApi()
        .get(`${URL_PATH_FINANCIAL_OBLIGATION}/select-tables?${keys}`)
        .then((response) => {
          if (response.data.success) {
            // Estado de obligaciones
            if (response.data.data.obligation_statuses) {
              this.obligation_status =
                response.data.data.obligation_statuses.map(
                  (item: ISelectorResources) => ({
                    label: item.name,
                    value: item.id,
                  })
                )
            }

            // Credit types
            if (response.data.data.credit_types) {
              this.credit_types = response.data.data.credit_types.map(
                (item: ISelectorResources) => ({
                  label: item.name,
                  value: item.id,
                })
              )
            }

            // Periodicity types
            if (response.data.data.periodicity_types) {
              this.periodicity_types = response.data.data.periodicity_types
            }
          }
        })
        .catch((e) => {
          const error = e as IErrors
          showAlert(showCatchError(error), 'error')
        })
    },

    async _getTrustBusinessResources(keys: string) {
      await executeApi()
        .get(`${TRUST_BUSINESS_API_URL}/utils/select-tables?${keys}`)
        .then((response) => {
          if (response.data.success) {
            this.movement_codes_natures =
              response.data?.data?.movement_codes_natures?.map(
                (item: ISelectorResources) => ({
                  ...item,
                  value: item.description,
                  label: `${item.code} - ${item.description}`,
                })
              ) ?? []

            this.movement_codes_types =
              response.data?.data?.movement_codes_types?.map(
                (item: ISelectorResources) => ({
                  ...item,
                  value: item.description,
                  label: `${item.code} - ${item.description}`,
                })
              ) ?? []

            this.funds_movements =
              response.data?.data?.funds_movements?.map(
                (item: ISelectorResources) => ({
                  ...item,
                  value: item.id,
                  label: `${item.code} - ${item.description}`,
                })
              ) ?? []

            this.params_good_class =
              response.data?.data?.params_good_class ?? []
            this.params_good_type = response.data?.data?.params_good_type ?? []
            this.params_nature = response.data?.data?.params_nature ?? []
            this.params_accounting_account =
              response.data?.data?.params_accounting_account?.map(
                (item: ISelectorResources) => ({
                  ...item,
                  value: item.id,
                  label: `${item.code} - ${item.name}`,
                })
              ) ?? []

            this.receipt_types =
              response.data?.data?.receipt_types?.map(
                (item: ISelectorResources) => ({
                  ...item,
                  value: item.id,
                  label: `${item.code} - ${item.name}`,
                })
              ) ?? []

            this.sub_receipt_types =
              response.data?.data?.sub_receipt_types?.map(
                (item: ISelectorResources) => ({
                  ...item,
                  value: item.id,
                  label: `${item.code} - ${item.name}`,
                })
              ) ?? []

            this.movement_codes_parameters =
              response.data?.data?.movement_codes?.map(
                (item: ISelectorResources) => ({
                  ...item,
                  value: item.id,
                  label: `${item.description}`,
                })
              ) ?? []

            this.params_auxiliary_type =
              response.data?.data?.params_auxiliary_type?.map(
                (item: ISelectorResources) => ({
                  ...item,
                  value: item.code,
                  label: `${item.code} - ${item.description}`,
                })
              ) ?? []

            this.movement_codes_cancellation_codes =
              response.data?.data?.movement_codes?.map(
                (item: ISelectorResources) => ({
                  ...item,
                  value: item.id,
                  label: `${item.code} - ${item.description}`,
                })
              ) ?? []

            this.collection_shapes = response.data.data?.collection_shapes ?? []

            // Negocios con prorroga
            if (response.data.data.business_trusts) {
              this.extend_business = response.data.data.business_trusts.map(
                (item: ISelectorResources) => ({
                  ...item,
                  label: `${item.business_code} - ${item.name}`,
                  value: item.id,
                })
              )
            }

            // Estados
            if (response.data.data.business_trust_change_status) {
              this.business_trust_change_status =
                response.data.data.business_trust_change_status.map(
                  (item: IChangeTrustStatus) => {
                    return {
                      value: item.id,
                      label: item.status,
                    }
                  }
                ) ?? []
            }

            // Cierres
            if (response.data.data.close_treasurie) {
              this.close_treasurie = response.data.data.close_treasurie ?? []
            }

            // Flujos de caja
            if (response.data.data.cash_flow_structure) {
              this.cash_flow_structures =
                response.data?.data?.cash_flow_structure.map(
                  (item: ISelectorResources) => {
                    return {
                      ...item,
                      value: item.id,
                      label: `${item.code} - ${item.purpose}`,
                    }
                  }
                )
            }

            // Terceros
            if (response.data.data.third_parties) {
              this.business_trust_third_parties =
                response.data.data.third_parties.map(
                  (item: ISelectorResources) => {
                    const docType = (
                      item.document_type?.abbreviation ?? ''
                    ).padEnd(3, ' ')
                    const doc = (item.document ?? '').padEnd(15, ' ')
                    const name = (item.name ?? '').toUpperCase()

                    return {
                      ...item,
                      value: item.id,
                      label: `${docType} ${doc} ${name}`,
                    }
                  }
                ) ?? []

              this.nit_agents =
                response.data.data.third_parties.map(
                  (item: ISelectorResources) => {
                    const docType = (
                      item.document_type?.abbreviation ?? ''
                    ).padEnd(3, ' ')
                    const doc = (item.document ?? '').padEnd(15, ' ')
                    const name = (item.name ?? '').toUpperCase()

                    return {
                      ...item,
                      value: item.document,
                      label: `${docType} ${doc} ${name}`,
                    }
                  }
                ) ?? []
            }

            // Estados de negocio
            if (response.data.data.business_trust_statuses) {
              this.business_trust_statuses =
                response.data.data.business_trust_statuses.map(
                  (item: ISelectorResources) => ({
                    label: item.status ?? null,
                    value: item.id ?? null,
                  })
                ) ?? []
            }

            // Tipo de negocio
            if (response.data.data.business_trust_types) {
              this.business_trust_types =
                response.data.data.business_trust_types.map(
                  (item: ISelectorResources) => ({
                    label: `${item.indice} - ${item.name}`,
                    value: item.id,
                  })
                ) ?? []
            }

            // Tipo de negocio - Fideicomiso
            if (response.data.data.business_trust_fideico_types) {
              this.business_trust_fideico_types =
                response.data.data.business_trust_fideico_types.map(
                  (item: ISelectorResources) => ({
                    label: `${item.indice} - ${item.name}`,
                    value: item.id,
                  })
                ) ?? []
            }

            // Tipo de negocio - Sociedad
            if (response.data.data.business_trust_society_types) {
              this.business_trust_society_types =
                response.data.data.business_trust_society_types.map(
                  (item: ISelectorResources) => ({
                    label: `${item.indice} - ${item.name}`,
                    value: item.id,
                  })
                ) ?? []
            }

            // Subtipo de negocio
            if (response.data.data.business_trust_subtypes) {
              this.business_trust_subtypes =
                response.data.data.business_trust_subtypes.map(
                  (item: ISelectorResources): IBusinessSubTypeResource => ({
                    label: `${item.indice} - ${item.name}`,
                    value: item.id ?? null,
                    business_type_id: item.business_type_id ?? null,
                  })
                ) ?? []
            }

            // Modalidad de negocio
            if (response.data.data.business_trust_mode) {
              this.business_trust_mode =
                response.data.data.business_trust_mode ?? []
            }

            // Periocidad de negocio
            if (response.data.data.business_trust_periodicity_accountability) {
              this.business_trust_periodicity_accountability =
                response.data.data.business_trust_periodicity_accountability ??
                []
            }

            // Estructura contable
            if (response.data.data.account_structures) {
              this.account_structures =
                response.data.data.account_structures.map(
                  (item: ISelectorResources) => ({
                    label: `${item.code} - ${item.purpose}`,
                    value: item.id ?? null,
                  })
                ) ?? []
            }

            // Estructura centro de costos
            if (response.data.data.cost_centers_structures) {
              this.cost_centers_structures =
                response.data.data.cost_centers_structures.map(
                  (item: ISelectorResources) => ({
                    label: `${item.code} - ${item.purpose}`,
                    value: item.id,
                  })
                ) ?? []
            }

            // Moneda funcional del negocio
            if (response.data.data.business_currency) {
              this.business_currency =
                response.data.data.business_currency ?? []
            }

            if (response.data.data.status_accounting) {
              this.status_accounting_trust_business =
                response.data.data.status_accounting.map(
                  (item: ISelectorResources) => ({
                    label: item.status,
                    value: item.id,
                  })
                ) ?? []
            }
            // Clasificacion de negocio
            if (response.data.data.business_trust_classification) {
              this.business_trust_classification =
                response.data.data.business_trust_classification ?? []
            }

            // Periocidad de negocio
            if (response.data.data.business_trust_periodicity_accountability) {
              this.business_trust_periodicity_accountability =
                response.data.data.business_trust_periodicity_accountability ??
                []
            }

            // Negocios con obligaciones
            if (response.data.data.business_trusts) {
              this.business_trusts = response.data.data.business_trusts.map(
                (item: ISelectorResources) => ({
                  label: item.name,
                  value: item.id,
                  code: item.business_code,
                })
              )

              this.business_trusts_with_code =
                response.data.data.business_trusts.map(
                  (item: ISelectorResources) => ({
                    label: `${item.business_code} - ${item.name}`,
                    value: item.id,
                  })
                )
            }
          }
        })
        .catch((e) => {
          const error = e as IErrors
          showAlert(showCatchError(error), 'error')
        })
    },

    async _getInvestmentPortfolioResources(keys: string) {
      await executeApi()
        .get(`${URL_PATH_INVESTMENT_PORTFOLIO}/select-tables?${keys}`)
        .then((response) => {
          if (!response.data.success) return

          const resources = response?.data?.data

          if (resources.type_of_coins) {
            this.type_of_coins = resources.type_of_coins
          }

          if (resources.interest_rate_mode) {
            this.interest_rate_mode = resources.interest_rate_mode
          }

          if (resources.interest_rate_payment_frequency) {
            this.interest_rate_payment_frequency =
              resources.interest_rate_payment_frequency
          }

          if (resources.InterestRate) {
            this.InterestRate = (
              resources.InterestRate as IInterestRateResource[]
            ).map((item) => ({
              ...item,
              value: item.interest_rate_description,
              label: item.interest_rate_description,
              description: item.interest_rate_description,
              modality: item.mode,
              frequency: item.payment_frequency,
            }))
          }

          if (resources.description) {
            this.description_investment_portfolio = resources.description.map(
              (item: ISelectorResources) => ({
                label: item.description,
                value: item.description,
                id: item.id,
              })
            )
          }

          this.qualification_actions =
            resources.qualification?.map((q: ISelectorResources) => ({
              ...q,
              value: q.value,
              label: q.label,
            })) || []

          this.coins =
            resources.coins?.map((item: ISelectorResources) => ({
              label: `${item.code} - ${item.description}`,
              value: item.id ?? null,
            })) ?? []

          this.issuers_counterparty =
            resources.issuers_counterparty?.map((item: ISelectorResources) => ({
              label: item.label,
              value: item.value
                .toString()
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, ''),
            })) ?? []

          this.risk_rating_agencie = resources.risk_rating_agencie ?? []
          this.qualification_cp =
            resources.qualification_cp?.map((item: ISelectorResources) => ({
              ...item,
              value: item.rating_code,
              label: item.rating_code,
            })) ?? []
          this.qualification_lp =
            resources.qualification_lp?.map((item: ISelectorResources) => ({
              ...item,
              value: item.rating_code,
              label: item.rating_code,
            })) ?? []

          this.local_currency_type =
            resources.local_currency_type?.map((item: ISelectorResources) => ({
              label: `${item.code} - ${item.description}`,
              value: item.id ?? null,
            })) ?? []

          this.foreign_currency_type =
            resources.foreign_currency_type?.map(
              (item: ISelectorResources) => ({
                label: `${item.code} - ${item.description}`,
                value: item.id ?? null,
              })
            ) ?? []
        })
        .catch((e) => {
          const error = e as IErrors
          showAlert(showCatchError(error), 'error')
        })
    },

    async _getResourcesSchedules(params: string) {
      await executeApi()
        .get(`${URL_PATH_SCHEDULES}/select-tables?${params}`)
        .then((response) => {
          if (response.data.success) {
            if (response.data.data.users_by_name) {
              this.users_by_name = response.data.data.users_by_name.map(
                (item: ISelectorResources) => ({
                  id: item.id,
                  name: item.name,
                })
              )
            }

            if (response.data.data.business) {
              this.business = response.data.data.business.map(
                (item: ISelectorResources) => ({
                  id: item.id,
                  name: `${item.business_code} - ${item.name}`,
                })
              )
            }

            if (response.data.data.roles) {
              this.role = response.data.data.roles.map(
                (item: ISelectorResources) => ({
                  id: item.id,
                  name: item.name,
                })
              )
            }
          }
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error')
        })
    },

    async _getResourcesUsers(params: string) {
      await executeApi()
        .get(`${URL_PATH_USERS}/select-tables?${params}`)
        .then((response) => {
          if (response.data.success) {
            // Document_types:
            if (response.data.data.document_types_user) {
              this.document_types_user =
                response.data.data.document_types_user.map(
                  (document_types_user: ISelectorResources) => ({
                    value: document_types_user.id,
                    label:
                      document_types_user.abbreviation +
                      ': ' +
                      document_types_user.name,
                  })
                ) ?? []
            }

            // Roles usuarios:
            this.user_roles =
              response.data?.data?.roles?.map((roles: ISelectorResources) => ({
                value: roles.id,
                label: roles.name,
                status_id: roles.status_id,
              })) ?? []
          }
        })
        .catch((e) => {
          const error = e as IErrors
          showAlert(showCatchError(error), 'error')
        })
    },
    async getResourcesDispersionGroup(params: string) {
      await executeApi()
        .get(`${URL_PATH_TREASURIES}/select-tables-v2?${params}`)
        .then((response) => {
          if (response.data.success) {
            if (Array.isArray(response.data.data.dispersion_file_business)) {
              this.dispersion_file_business =
                response.data.data.dispersion_file_business.map(
                  (q: ISelectorResources) => ({
                    value: String(q.id),
                    label: q.business,
                  })
                ) || []
            }
            if (Array.isArray(response.data.data.dispersion_file_banks)) {
              this.dispersion_file_banks =
                response.data.data.dispersion_file_banks.map(
                  (q: ISelectorResources) => ({
                    value: String(q.id),
                    label: `${q.bank_code} - ${q.description}`,
                  })
                ) || []
            }
            if (
              Array.isArray(response.data.data.dispersion_file_bank_accounts)
            ) {
              this.dispersion_file_bank_accounts =
                response.data.data.dispersion_file_bank_accounts.map(
                  (q: ISelectorResources) => ({
                    value: String(q.id),
                    label: `${q.account_number} - ${q.account_name}`,
                  })
                ) || []
            } else {
              this.dispersion_file_bank_accounts = []
            }
            if (Array.isArray(response.data.data.dispersion_file_group)) {
              this.dispersion_file_group =
                response.data.data.dispersion_file_group.map(
                  (q: ISelectorResources) => ({
                    value: q.id,
                    label: String(q.id),
                  })
                ) || []
            } else {
              this.dispersion_file_group = []
            }
          }
        })
        .catch((e) => {
          const error = e as IErrors
          showAlert(showCatchError(error), 'error')
        })
    },
    async _getResourcesGroundsBlockingInvestment(params: string) {
      await executeApi()
        .get(`${URL_PATH_FICS}/select-tables?${params}`)
        .then((response) => {
          if (response.data.success) {
            this.grounds_blocking_investment_status =
              response.data.data.status_blocking_reason_investment.map(
                (q: ISelectorResources) => ({
                  value: String(q.id),
                  label: q.status,
                })
              ) || []
          }
        })
        .catch((e) => {
          const error = e as IErrors
          showAlert(showCatchError(error), 'error')
        })
    },
  },

  persist: true,
})
