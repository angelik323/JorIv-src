import { ITabs } from '@/interfaces/customs/Tab'
import {
  ILegalClientInformation,
  ILegalRepresentationClient,
  ILegalClientCorporative,
  ILegalClientTributary,
  ILegalClientShareholder,
  ILegalClientManager,
  ILegalClientDocument,
} from '@/interfaces/customs'
import { onBeforeMount, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { defaultIconsLucide } from '@/utils'
import { useMainLoader, useAlert } from '@/composables'
import { useClientsStore, useResourceStore } from '@/stores'

const useLegalPersonEdit = () => {
  const router = useRouter()
  const route = useRoute()
  const legalClientId = +route.params.id

  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()
  const { getResources } = useResourceStore('v1')
  const { _getByIdLegalClient, _updateLegalClient, _clearDataLegal } =
    useClientsStore('v1')

  const {
    legal_client_request,
    data_legal_information_form,
    data_representative_legal_form,
    data_corporative_legal_form,
    data_tributary_legal_form,
    data_manager_legal_form,
    data_shareholder_legal_form,
    data_document_legal_form,
  } = storeToRefs(useClientsStore('v1'))

  const keys = [
    'third_party_request_types',
    'document_types_third_legal',
    'third_party_natures',
    'ciius',
    'banks',
    'countries',
    'departments',
    'cities',
    'document_types_third_party_natural',
    'legal_people_company_classification',
    'legal_people_fund_sources',
  ]

  const headerProps = {
    title: 'Editar persona jurídica',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Clientes',
      },
      {
        label: 'Vinculación de clientes',
        route: 'ClientsList',
      },
      {
        label: 'Editar persona jurídica',
        route: 'LegalEntity',
      },
      {
        label: `${legalClientId}`,
      },
    ],
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
      name: 'legal_representation',
      label: 'Representante legal',
      icon: defaultIconsLucide.representative,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
    {
      name: 'corporative',
      label: 'Corporativos',
      icon: defaultIconsLucide.corporative,
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
      name: 'shareholder',
      label: 'Accionistas',
      icon: defaultIconsLucide.bankNote,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'manager',
      label: 'Directivos',
      icon: defaultIconsLucide.accountMultiple,
      outlined: true,
      disable: true,
      show: true,
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

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  // Limpia el objeto de valores null, undefined o vacios
  const removeEmpty = (obj: object) =>
    Object.fromEntries(
      Object.entries(obj).filter(
        ([_, v]) => v !== null && v !== undefined && v !== '' && v !== 0
      )
    )

  /** INFORMACIÓN BASICA **/
  const makeBaseInfoRequest = (
    data: ILegalClientInformation,
    corpData: ILegalClientCorporative
  ) => {
    return removeEmpty({
      document_type_id: Number(data.document_type) || null,
      document: data.document_number,
      request_type: data.application_type,

      legal_person: removeEmpty({
        business_name: data.name,
        nature: data.nature,
        constitution_date: data.date_incorporation,
        country_id: Number(data.constitution_country) || null,
        sending_correspondence: data.sending_correspondence,
      }),

      address: data.address,
      country_id: Number(data.country) || null,
      department_id: Number(data.department) || null,
      city_id: Number(data.city) || null,
      email: data.email,
      phone: data.phone,

      ciiu_id: corpData.ciiu_code_corporative
        ? parseInt(corpData.ciiu_code_corporative)
        : null,
      classification_company: corpData.company_classification_corporative,
    })
  }

  /** REPRESENTANTE LEGAL **/
  const makeLegalRepresentationRequest = (rep: ILegalRepresentationClient) => {
    return removeEmpty({
      document_type_id: Number(rep.document_type_representation) || null,
      document: rep.document_number_representation,

      third_party_category: 'natural', //Representante legal es persona natural

      natural_person: removeEmpty({
        issue_date: rep.date_issue_representation,
        birth_country_id: Number(rep.country_birth_representation) || null,
        name: rep.first_name_representation,
        middle_name: rep.second_name_representation,
        last_name: rep.first_lastname_representation,
        second_last_name: rep.second_lastname_representation,
      }),

      tax_info: removeEmpty({
        has_different_nationality: rep.different_nactionality_representation
          ? 1
          : 0,
        foreign_responsibility: rep.different_tax_liability_representation
          ? 1
          : 0,
        country_id: Number(rep.country_representation) || null,
        nationality_id: Number(rep.nacionality_representation) || null,
        branch_address: rep.address_representation,
        tin: rep.nit_taxpayer_representation,
      }),

      pep_info: removeEmpty({
        is_pep: rep.is_pep ? 1 : 0,
        is_politician: rep.is_politician_representation ? 1 : 0,
        is_international_pep: rep.is_international_entity_representation
          ? 1
          : 0,
        is_pep_international: rep.is_international_pep_representation ? 1 : 0,
        position: rep.position_entity_representation,
        date_entry: rep.date_entry_position_representation,
        date_exit: rep.date_retirement_position_representation,
        has_pep_relatives: rep.family_member_second_degree_representation
          ? 1
          : 0,
      }),

      pep_info_relative: removeEmpty({
        full_name: rep.name_family_representation,
        relationship: rep.relationship_family_representation,
        position: rep.position_family_representation,
      }),
    })
  }

  /** CORPORATIVOS **/
  const makeFinancialInfoRequest = (data: ILegalClientCorporative) => {
    return removeEmpty({
      is_registered_in_national_emission_registery:
        data.is_registered_national_registry_corporative ? 1 : 0,
      total_operational_income:
        data.total_monthly_operating_income_corporative?.toString(),
      total_non_operational_income:
        data.total_monthly_not_operating_income_corporative?.toString(),

      total_expenses: data.total_monthly_expenses_corporative?.toString(),
      other_non_operational_income_concept:
        data.item_other_monthly_income_corporative?.toString(),
      assets: data.total_assets_corporative?.toString(),
      liabilities: data.total_liabilities_corporative?.toString(),
      cutoff_date: data.cutoff_date_financial_information_corporative,
      bank_holder_id: data.bank_entity_corporative
        ? data.bank_entity_corporative
        : null,
      account_type_holder: data.type_account_holder_corporative,
      bank_account_number_holder: data.holder_account_number_corporative,
      funding_source: data.origin_funds_corporative,
      describe_funding_source: data.other_origin_funds_corporative,
    })
  }

  /** TRIBUTACIÓN **/
  const makeTaxInfoRequest = (data: ILegalClientTributary) => {
    return removeEmpty({
      files_tax_return: data.declare_income_tributary ? 1 : 0,
      files_foreign_taxes: data.declare_taxes_another_country_tributary ? 1 : 0,
      country_id: Number(data.country_tributary) || null,
      giin_code: data.ciiu_code_tributary, // esta mal el name key front
      is_branches: data.branches_other_countries_tributary ? 1 : 0,
      description_economic_activity: data.economic_activity_branches_tributary,
      branch_address: data.address_tributary,
      branch_country_id: Number(data.country_address_tributary) || null,
    })
  }

  /** ACCIONISTAS **/
  const makeShareholderRequest = (data: ILegalClientShareholder) => {
    const { have_shareholder, shareholders } = data
    if (!have_shareholder) return []

    return shareholders.map((shareholder) => {
      const isNatural = shareholder.person_type?.toLowerCase() === 'natural'

      // Base del request
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const request: any = {
        document_type_id: shareholder.document_type_id,
        document: shareholder.document_number,
        third_party_category: isNatural ? 'natural' : 'juridica',

        shareholder_info: removeEmpty({
          shareholder_type_id: shareholder.shareholder_type,
          participating_percentage: shareholder.participation_percent,
          beneficiary_ownership: shareholder.beneficial_owner_by_ownership,
          beneficiary_benefits: shareholder.beneficial_owner_by_beneficiaries,
          control_over_legal_person: shareholder.has_control_over_legal_entity
            ? 'Si'
            : 'No',
          giin_code: 'N/A', // N/A
          nationality_id: shareholder.nationality,
          address: shareholder.address,
          country_id: shareholder.country,
          department_id: shareholder.department,
          city_id: shareholder.city,
          beneficiary_date: shareholder.beneficiary_date,
          different_nationality: shareholder.has_only_foreign_tax_responsibility
            ? 'Si'
            : 'No',
        }),

        contact_info: removeEmpty({
          email: shareholder.email_contact,
          phone: shareholder.legal_phone_number,
          postal_code: shareholder.postal_code,
        }),
      }

      // natural/legal person
      if (isNatural) {
        request.natural_person = removeEmpty({
          name: shareholder.first_name,
          middle_name: shareholder.second_name,
          last_name: shareholder.first_last_name,
          second_last_name: shareholder.second_last_name,
          birth_country_id: shareholder.birth_country,
          birth_date: shareholder.birth_date,
          issue_date: shareholder.expedition_date,
          document_issuance_country_id: shareholder.expedition_country,
        })

        request.tax_info = removeEmpty({
          foreign_responsibility:
            shareholder.has_international_tax_responsibility ? 1 : 0,
          has_tax_responsibility_outside_colombia:
            shareholder.has_only_foreign_tax_responsibility ? 1 : 0,
          country_id: shareholder.tax_country,
          nationality_id: shareholder.nationality,
          tin: shareholder.taxpayer_document_number,
          branch_address: shareholder.tax_address,
        })

        request.pep_info = removeEmpty({
          is_pep: shareholder.is_pep ? 1 : 0,
          is_politician: shareholder.political_decree_830_2021 ? 1 : 0,
          is_pep_international: shareholder.is_pep_international ? 1 : 0,
          has_pep_relatives: shareholder.has_pep_relative ? 1 : 0,
          is_international_pep: shareholder.is_representative_intl_org ? 1 : 0,
        })

        request.pep_info_relative = removeEmpty({
          full_name: shareholder.related_pep_full_name,
          relationship: shareholder.pep_relationship,
          position: shareholder.position_held,
        })
      } else {
        request.legal_person = removeEmpty({
          business_name: shareholder.social_reason,
          country_id: shareholder.incorporation_country,
        })

        // Tributario tab
        request.tax_info = removeEmpty({
          foreign_responsibility:
            shareholder.tributary_has_control_over_legal_entity,
          country_id: shareholder.tributary_country,
          giin_code: shareholder.giin_code ?? 'N/A', // N/A en lugar de null
        })
      }

      return removeEmpty(request)
    })
  }

  /** DIRECTIVOS **/
  const makeManagerRequest = (data: ILegalClientManager) => {
    const { board_directors, managers } = data
    if (!board_directors) return []

    return managers.map((manager) => {
      const isNatural = manager.person_type?.toLowerCase() === 'natural'

      // Base del request
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const request: any = {
        document_type_id: manager.document_type,
        document: manager.document_number?.toString(),
        third_party_category: isNatural ? 'natural' : 'juridica',

        pep_info: removeEmpty({
          is_pep: manager.is_pep ? 1 : 0,
          is_politician: manager.political_decree_830_2021 ? 1 : 0,
          is_pep_international: manager.is_pep_international ? 1 : 0,
          has_pep_relatives: manager.has_pep_relative ? 1 : 0,
          is_international_pep: manager.is_representative_intl_org ? 1 : 0,
        }),

        pep_info_relative: removeEmpty({
          full_name: manager.related_pep_full_name,
          relationship: manager.pep_relationship,
          position: manager.position_held,
        }),
      }

      // natural/legal person
      if (isNatural) {
        request.natural_person = removeEmpty({
          name: manager.first_name,
          middle_name: manager.second_name,
          last_name: manager.first_lastname,
          second_last_name: manager.second_lastname,
        })
      } else {
        request.legal_person = removeEmpty({
          business_name: manager.business_name,
        })
      }

      return removeEmpty(request)
    })
  }

  /** DOCUMENTOS **/
  const makeFilesRequest = (data: ILegalClientDocument) => {
    return data.files.map((element) => ({
      document_type: element.document_type,
      is_required: element.is_required,
      is_validated: element.is_validated,
      id: element.id,
    }))
  }

  const makeDataRequest = () => {
    if (
      !data_legal_information_form.value ||
      !data_corporative_legal_form.value
    )
      return

    const apiRequestBody = {
      ...makeBaseInfoRequest(
        data_legal_information_form.value,
        data_corporative_legal_form.value
      ),
      legal_representatives: data_representative_legal_form.value
        ? [makeLegalRepresentationRequest(data_representative_legal_form.value)]
        : null,
      financial_info: data_corporative_legal_form.value
        ? makeFinancialInfoRequest(data_corporative_legal_form.value)
        : null,
      tax_info: data_tributary_legal_form.value
        ? makeTaxInfoRequest(data_tributary_legal_form.value)
        : null,
      shareholders: data_shareholder_legal_form.value
        ? makeShareholderRequest(data_shareholder_legal_form.value)
        : [],
      board_members: data_manager_legal_form.value
        ? makeManagerRequest(data_manager_legal_form.value)
        : [],
      files: data_document_legal_form.value
        ? makeFilesRequest(data_document_legal_form.value)
        : null,
    }

    return apiRequestBody
  }

  const formInformation = ref()
  const formLegalRepresentation = ref()
  const formCorporative = ref()
  const formTributary = ref()
  const formShareholder = ref()
  const formManager = ref()
  const formInvestor = ref()
  const formDocument = ref()

  const validateForms = async () => {
    let valid: boolean = true
    const forms = [
      formInformation,
      formLegalRepresentation,
      formCorporative,
      formTributary,
      formShareholder,
      formManager,
      formInvestor,
      formDocument,
    ]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      if ([4].includes(tabActiveIdx.value)) {
        const { have_shareholder, shareholders } =
          data_shareholder_legal_form.value || {}

        if (have_shareholder && shareholders?.length === 0) {
          showAlert('Debes agregar al menos 1 accionista', 'error')
          return false
        }

        const validPercentShareholders =
          (await forms[tabActiveIdx.value]?.value?.itHasTotalPercent?.()) ??
          true

        if (
          !validPercentShareholders &&
          have_shareholder &&
          shareholders &&
          shareholders.length > 0
        ) {
          useAlert().showAlert(
            'El porcentaje de participación de los accionistas directos debe ser del 100%',
            'error',
            undefined,
            3000
          )
          return false
        }
      }

      if ([5].includes(tabActiveIdx.value)) {
        const { board_directors, managers } =
          data_manager_legal_form.value || {}

        if (board_directors && managers?.length === 0) {
          showAlert('Debes agregar al menos 1 directivo', 'error')
          return false
        }
      }

      const isFormDocument = forms[tabActiveIdx.value] === formDocument
      valid = (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false

      if (!valid && isFormDocument) {
        useAlert().showAlert(
          'Asegúrese de subir los documentos',
          'error',
          undefined,
          3000
        )
      }
    }
    return valid
  }

  const nextTab = async () => {
    if (await validateForms()) {
      tabActiveIdx.value = tabActiveIdx.value + 1
      tabActive.value = tabs.value[tabActiveIdx.value].name
    }
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const onSubmit = async () => {
    if (await validateForms()) {
      openMainLoader(true)
      const payload = makeDataRequest()
      if (await _updateLegalClient(payload, legalClientId)) {
        router.push({ name: 'ClientsList' })
      }

      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  onBeforeMount(async () => {
    _clearDataLegal()
    openMainLoader(true)
    await getResources(`keys[]=${keys.join('&keys[]=')}`)
    await _getByIdLegalClient(legalClientId)
    openMainLoader(false)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    legal_client_request,

    formInformation,
    formLegalRepresentation,
    formCorporative,
    formTributary,
    formShareholder,
    formManager,
    formInvestor,
    formDocument,

    handlerGoTo,
    onSubmit,
    nextTab,
    backTab,
  }
}

export default useLegalPersonEdit
