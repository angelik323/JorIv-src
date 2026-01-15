/* eslint-disable @typescript-eslint/no-explicit-any */

import { defaultIconsLucide } from '@/utils'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { ITabs } from '@/interfaces/global'
import { useMainLoader, useAlert } from '@/composables'
import {
  useClientsStore,
  useResourceStore,
  useThirdPartiesModuleStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { IClientsEmployment } from '@/interfaces/customs/Clients'

const useNaturalEntity = () => {
  const router = useRouter()

  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()

  const { exist_client } = storeToRefs(useThirdPartiesModuleStore())

  const {
    headerPropsDefault,
    data_information_form,
    data_tributary_form,
    data_finance_form,
    data_pep_form,
    data_estate_form,
    data_document_form,
  } = storeToRefs(useClientsStore('v1'))

  const { getResources } = useResourceStore('v1')
  const { _createNaturalClient, _clearDataNatural } = useClientsStore('v1')
  const { _clearData: _clearThirdPartiesData } = useThirdPartiesModuleStore()

  const keys = [
    'occupations',
    'ciius',
    'third_party_request_types',
    'applicant_type_nature_client',
    'document_types_third_party_natural',
    'correspondence',
    'third_party_occupations',
    'banks',
    'countries',
    'departments',
    'cities',
    'third_party_taxpayer_types',
    'third_party_tin_options',
    'estate_origins',
  ]

  const headerProps = {
    ...headerPropsDefault.value,
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Información básica',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
    {
      name: 'tributary',
      label: 'Tributario',
      icon: defaultIconsLucide.squarePercentage,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
    {
      name: 'finance',
      label: 'Finanzas',
      icon: defaultIconsLucide.dollarSign,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
    {
      name: 'pep',
      label: 'PEP',
      icon: defaultIconsLucide.user,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
    {
      name: 'estate',
      label: 'Bienes',
      icon: defaultIconsLucide.piggy,
      outlined: true,
      disable: true,
      show: false,
      required: false,
    },
    {
      name: 'investor',
      label: 'Inversionistas',
      icon: defaultIconsLucide.badgeDollarSign,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'document',
      label: 'Documentos',
      icon: defaultIconsLucide.file,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])

  watch(
    () => data_information_form.value?.application_type,
    (newType) => {
      tabs.value = tabs.value.map((tab) => ({
        ...tab,
        show: tab.name !== 'estate' || newType === 'Fideicomitente',
      }))
    },
    { immediate: true }
  )

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const makeDataRequest = () => {
    const filesMap = data_document_form.value?.files
      .filter((element) => element.file_url)
      .map((element) => ({
        document_type: element.document_type,
        is_required: element.is_required,
        is_validated: element.is_validated,
        id: element.id,
      }))

    const extractContact = (index: number) =>
      data_information_form.value?.contacts[index]?.contact_value || null

    const extractEmploymentInfo = (key: keyof IClientsEmployment) =>
      data_information_form.value?.employment_info[key] || null

    const extractTaxInfo = (key: string) =>
      (data_tributary_form.value?.tax_info as unknown as Record<string, any>)?.[
        key
      ] ?? null

    const extractFinancialInfo = (key: string) =>
      (
        data_finance_form.value?.financial_info as unknown as Record<
          string,
          any
        >
      )?.[key] ?? null

    const extractPepInfo = (key: string) =>
      (data_pep_form.value?.pep_info as unknown as Record<string, any>)?.[
        key
      ] ?? null

    const extractPepRelativeInfo = (key: string) =>
      (
        data_pep_form.value?.pep_info_relative as unknown as Record<string, any>
      )?.[key] ?? null

    const dataPayload: Record<string, any> = {
      third_party_category: 'Interno',
      request_type: data_information_form.value?.application_type,
      document_type_id: data_information_form.value?.document_type_id,
      document: data_information_form.value?.document,
      natural_person: {
        name: data_information_form.value?.natural_person?.name,
        middle_name: data_information_form.value?.natural_person?.middle_name,
        last_name: data_information_form.value?.natural_person?.last_name,
        second_last_name:
          data_information_form.value?.natural_person?.second_last_name,
        birth_date: data_information_form.value?.natural_person?.birth_date,
        sending_correspondence:
          data_information_form.value?.sending_correspondence,
      },
      contacts: [
        { contact_type: 'email', contact_value: extractContact(0), is_main: 0 },
        { contact_type: 'phone', contact_value: extractContact(1), is_main: 0 },
        {
          contact_type: 'mobile',
          contact_value: extractContact(2),
          is_main: 0,
        },
      ].filter((contact) => contact.contact_value),
      addresses: [
        {
          country_id: data_information_form.value?.addresses.country_id,
          department_id: data_information_form.value?.addresses.department_id,
          city_id: data_information_form.value?.addresses.city_id,
          address_type: 'residencial',
          address: data_information_form.value?.addresses?.address,
          postal_code: data_information_form.value?.addresses?.postal_code,
          is_main: 1,
        },
      ],
      employment_info: {
        occupation_id: extractEmploymentInfo('occupation_id'),
        ciiu_id: extractEmploymentInfo('ciiu_code'),
        company: extractEmploymentInfo('company'),
        phone: extractEmploymentInfo('phone'),
        profession_id: extractEmploymentInfo('profession_id'),
        address: extractEmploymentInfo('address'),
        country_id: extractEmploymentInfo('country_id'),
        department_id: extractEmploymentInfo('department_id'),
        city_id: extractEmploymentInfo('city_id'),
      },
      tax_info: {
        nationality_id: data_information_form.value?.nacionality,
        taxpayer_type: extractTaxInfo('taxpayer_type'),
        is_withholding_subject: Number(extractTaxInfo('withholding_tax')) || 0,
        has_different_nationality:
          Number(extractTaxInfo('has_different_nationality')) || 0,
        foreign_responsibility:
          Number(extractTaxInfo('foreign_responsibility')) || 0,
        tin_option: extractTaxInfo('tin_option_id') ?? null,
        tin: extractTaxInfo('tin_number') ?? null,
        country_id: extractTaxInfo('country_id'),
        foreign_phone: extractTaxInfo('foreign_phone'),
        postal_address: extractTaxInfo('address'),
        has_notarial_power:
          Number(extractTaxInfo('granted_power_attorney')) || 0,
        giin_code: 'n/a',
      },
      financial_info: {
        declares_income: Number(extractFinancialInfo('report_income')) || 0,
        total_operational_income: extractFinancialInfo(
          'total_operational_income'
        ),
        total_expenses: extractFinancialInfo('total_expenses'),
        total_non_operational_income: extractFinancialInfo(
          'total_non_operational_income'
        ),
        other_non_operational_income_concept: extractFinancialInfo(
          'other_non_operational_income_concept'
        ),
        assets: extractFinancialInfo('assets'),
        liabilities: extractFinancialInfo('liabilities'),
        cutoff_date: extractFinancialInfo('cutoff_date'),
        bank_holder_id: extractFinancialInfo('bank_holder_id'),
        bank_account_number_holder: extractFinancialInfo(
          'bank_account_number_holder'
        ),
        account_type_holder: extractFinancialInfo('account_type_holder_id'),
        beneficiary_document_number: extractFinancialInfo(
          'beneficiary_document_number'
        ),
        bank_beneficiary_id: extractFinancialInfo('bank_beneficiary_id'),
        bank_account_number_beneficiary: extractFinancialInfo(
          'bank_account_number_beneficiary'
        ),
        beneficiary_name: extractFinancialInfo('beneficiary_name'),
        account_type_beneficiary: extractFinancialInfo(
          'account_type_beneficiary_id'
        ),
      },
      pep_info: {
        is_pep: data_pep_form.value?.is_pep ? 1 : 0,
        position: extractPepInfo('position'),
        is_politician: Number(extractPepInfo('is_politician')) || 0,
        is_pep_international:
          Number(extractPepInfo('legal_representative')) || 0,
        is_international_pep:
          Number(extractPepInfo('is_pep_international')) || 0,
        date_entry: extractPepInfo('date_entry'),
        date_exit: extractPepInfo('date_exit'),
        has_pep_relatives:
          Number(extractPepRelativeInfo('familiar_politician')) || 0,
      },
      files: filesMap,
    }

    if (dataPayload.request_type === 'Fideicomitente') {
      dataPayload['estate'] = {
        resource_to_deliver: data_estate_form.value?.resource_type,
        estate_identification: data_estate_form.value?.asset_identification,
        total_value_to_delivered: data_estate_form.value?.asset_value,
        is_contributor_different_trustor:
          Number(data_estate_form.value?.different_contributor) || 0,
        source_of_goods: data_estate_form.value?.asset_source,
        other_source_of_goods: data_estate_form.value?.other_asset_source,
        contractual_relationship: data_estate_form.value?.purpose,
      }
    }

    if (dataPayload.pep_info.has_pep_relatives) {
      dataPayload['pep_info_relative'] = {
        full_name: extractPepRelativeInfo('full_name'),
        relationship: extractPepRelativeInfo('relationship'),
        position: extractPepRelativeInfo('position'),
      }
    }

    return dataPayload
  }

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const formInformation = ref()
  const formTributary = ref()
  const formFinance = ref()
  const formPep = ref()
  const formEstate = ref()
  const formInvestor = ref()
  const formDocument = ref()

  const nextTab = async () => {
    if (await validateForms()) {
      tabActiveIdx.value = tabActiveIdx.value + 1
      tabActive.value = filteredTabs.value[tabActiveIdx.value].name
    }
  }

  const validateForms = async () => {
    let valid = false
    const forms = [formInformation, formTributary, formFinance, formPep]

    if (data_information_form.value?.application_type === 'Fideicomitente') {
      forms.push(formEstate)
    }

    forms.push(formInvestor, formDocument)

    if (tabActiveIdx.value < 0 || tabActiveIdx.value >= forms.length) {
      return false
    }

    try {
      const isFormDocument = forms[tabActiveIdx.value] === formDocument
      valid = (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false

      if (!valid && isFormDocument) {
        showAlert(
          'Asegúrese de subir todos los documentos',
          'error',
          undefined,
          3000
        )
      }
      return valid
    } catch (error) {
      return valid
    }
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name
  }

  const onSubmit = async () => {
    if (await validateForms()) {
      openMainLoader(true)
      const payload = makeDataRequest()
      if (await _createNaturalClient(payload)) {
        router.push({ name: 'ClientsList' })
      }

      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  onBeforeMount(async () => {
    _clearDataNatural()
    _clearThirdPartiesData()
    openMainLoader(true)
    await getResources(`keys[]=${keys.join('&keys[]=')}`)
    openMainLoader(false)
  })

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,

    formInformation,
    formTributary,
    formFinance,
    formPep,
    formEstate,
    formInvestor,
    formDocument,
    exist_client,

    onSubmit,
    nextTab,
    backTab,
  }
}

export default useNaturalEntity
