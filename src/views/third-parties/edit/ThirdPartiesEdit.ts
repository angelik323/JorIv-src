import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'

// V2
import BasicDataForm from '@/components/Forms/ThirdParties/v2/BasicData/BasicDataForm.vue'
import EconActivityForm from '@/components/Forms/ThirdParties/v2/EconActivity/EconActivityForm.vue'
import AddressForm from '@/components/Forms/ThirdParties/v2/Address/AddressForm.vue'
import PhoneNumberForm from '@/components/Forms/ThirdParties/v2/PhoneNumber/PhoneNumberForm.vue'
import EmailForm from '@/components/Forms/ThirdParties/v2/Email/EmailForm.vue'
import BankAccountForm from '@/components/Forms/ThirdParties/v2/BankAccount/BankAccountForm.vue'

import {
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from 'vue'
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useAlert } from '@/composables'
import { useRouteValidator } from '@/composables/useRoutesValidator'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  useThirdPartiesStore,
  useResourceStore,
  useResourceManagerStore,
} from '@/stores'
import { defaultIconsLucide } from '@/utils'
import { IBankAccountTable, IThirdPartiesTable } from '@/interfaces/customs'

export default defineComponent({
  name: 'ThirdPartiesCreate',
  components: {
    ContentComponent,
    Card,
    TabsComponent,

    BasicDataForm,
    EconActivityForm,
    AddressForm,
    PhoneNumberForm,
    EmailForm,
    BankAccountForm,
  },
  setup() {
    const { openMainLoader } = useMainLoader()
    const { validateRouterAccess } = useRouteValidator()
    const { showAlert } = useAlert()

    const { _setTypePerson, getResources } = useResourceStore('v1')
    const { _getResources, _resetKeys } = useResourceManagerStore('v1')
    const { ciius } = storeToRefs(useResourceStore('v1'))

    const generalDataFormButton = ref(null)
    const router = useRouter()
    const route = useRoute()

    const thirdPartyId = +route.params.id

    const {
      thirdpartie_request,

      basicDataState,
      data_table_activities_ciius,
      addressLocationForm,
      phoneNumberState,
      data_table_bank_account,
      emailState,
    } = storeToRefs(useThirdPartiesStore())
    const {
      _getByIdAction,
      _setBasicDataState,
      _setActivitiesCIIUSTable,
      _setBankAccounTable,
      _updateAction,
      _clearRequestThirdparty,
    } = useThirdPartiesStore()

    const headerProperties = {
      title: 'Editar tercero',
      breadcrumbs: [
        {
          label: 'Administración',
        },
        {
          label: 'Terceros',
          route: '',
        },
        {
          label: 'Vinculación de terceros',
          route: 'ThirdPartiesList',
        },
        {
          label: 'Editar',
          route: 'ThirdPartiesEdit',
        },
        {
          label: thirdPartyId.toString(),
        },
      ],
    }

    const tabs = reactive([
      // v2
      {
        name: 'BasicData',
        label: 'Información básica',
        icon: defaultIconsLucide.listBulleted,
        outlined: true,
        disable: true,
        show: true,
        required: true,
      },
      // v2
      {
        name: 'EconActivity',
        label: 'Actividad Económica',
        icon: defaultIconsLucide.factory,
        outlined: true,
        disable: true,
        show: true,
        required: true,
      },
      // v2
      {
        name: 'Address',
        label: 'Dirección',
        icon: defaultIconsLucide.location,
        outlined: true,
        disable: true,
        show: true,
        required: true,
      },
      // v2
      {
        name: 'PhoneNumber',
        label: 'Teléfono',
        icon: defaultIconsLucide.phoneOutline,
        outlined: true,
        disable: true,
        show: true,
        required: true,
      },
      // v2
      {
        name: 'Email',
        label: 'Correo Electrónico',
        icon: defaultIconsLucide.emailOutline,
        outlined: true,
        disable: true,
        show: true,
        required: true,
      },
      // v2
      {
        name: 'BankAccount',
        label: 'Cuenta Bancaria',
        icon: defaultIconsLucide.walletOutline,
        outlined: true,
        disable: true,
        show: true,
        required: false,
      },
    ])

    const activeTab = ref(tabs[0].name)
    const tabActiveIdx = ref(
      tabs.findIndex((tab) => tab.name === activeTab.value)
    )
    const keys = [
      'banks',
      'fiscal_responsability',
      'occupations',
      'third_party_type',
      'document_types_third_party_natural',
      'document_types_third_legal',
      'bank_branches',
      'third_party_identity_types',
      'countries',
      'departments',
      'cities',
      'ciius',
    ]
    const keysManager = {
      third_party: ['document_types_third_party_fideicomiso'],
    }

    const handlerGoTo = (goURL: string) => {
      router.push({ name: goURL })
    }

    const basicDataFormRef = ref()

    const validationsByTab: Record<number, () => Promise<boolean> | boolean> = {
      0: async () => {
        return await basicDataFormRef.value?.validateForm()
      },
      1: () => {
        const valid = data_table_activities_ciius.value.length > 0
        if (!valid) {
          showAlert(
            'Por favor, agrega al menos una actividad económica',
            'error',
            undefined,
            3000
          )
        }
        return valid
      },
      2: () => {
        const valid = (addressLocationForm.value?.locations?.length ?? 0) > 0
        if (!valid) {
          showAlert(
            'Por favor, agrega al menos una dirección',
            'error',
            undefined,
            3000
          )
        }
        return valid
      },
      3: () => {
        const valid = (phoneNumberState.value?.phoneNumbers ?? []).length > 0
        if (!valid) {
          showAlert(
            'Por favor, agrega al menos un número de teléfono',
            'error',
            undefined,
            3000
          )
        }
        return valid
      },
      4: () => {
        const valid = (emailState.value?.emails ?? []).length > 0
        if (!valid) {
          showAlert(
            'Por favor, agrega al menos un correo electrónico',
            'error',
            undefined,
            3000
          )
        }
        return valid
      },
    }

    const nextTab = async () => {
      const index = tabActiveIdx.value
      const validator = validationsByTab[index]

      const valid = validator
        ? typeof validator === 'function'
          ? await validator()
          : Boolean(validator)
        : true

      if (valid) {
        tabActiveIdx.value++
        activeTab.value = tabs[tabActiveIdx.value]?.name
      }
    }

    const backTab = () => {
      tabActiveIdx.value = tabActiveIdx.value - 1
      activeTab.value = tabs[tabActiveIdx.value].name
    }

    const makeDataRequest = async () => {
      let person_type
      let name = `${basicDataState.value?.first_name} ${basicDataState.value?.first_last_name}`
      let dataThirdType: object = {}
      if (basicDataState.value?.person_type_id === 'legal') {
        person_type = 'legal'
        name = basicDataState.value.social_reason ?? ''
        dataThirdType = {
          business_name: name,
          acronym: basicDataState.value?.initials,
          constitution_code: 'SAS-789',
          country_id: 1,
          classification_company: 'Pyme',
          applicant_type: 'Empresa',
          nature: 'Publica',
        }
      } else if (basicDataState.value?.person_type_id === 'natural') {
        person_type = 'natural'
        dataThirdType = {
          name: basicDataState.value?.first_name,
          middle_name: basicDataState.value?.second_name,
          last_name: basicDataState.value?.first_last_name,
          second_last_name: basicDataState.value?.second_last_name,
          applicant_type: 1,
          occupation_id: basicDataState.value?.profession_id,
          birth_date: null,
          issue_date: '2010-01-20',
        }
      } else {
        person_type = 'fideicomiso'
      }

      const payload = {
        id: thirdPartyId,
        identity_type_id: basicDataState.value?.identity_type_id ?? null,
        document_type_id: basicDataState.value?.document_type_id ?? null,
        status_id: 1,
        document: basicDataState.value?.document_number ?? null,
        name: name,
        third_party_category: 'directo',
        validator_digit: basicDataState.value?.check_digit,
        is_customer: false,
        third_party_type: basicDataState.value?.third_type_id ?? null,
        fiscal_responsibility: basicDataState.value?.tax_manager_id ?? null,
        vat_responsibility: basicDataState.value?.iva_manager_id ?? null,
        person_type,
        ...(person_type === 'natural'
          ? { natural_person: dataThirdType }
          : person_type === 'legal'
          ? { legal_person: dataThirdType }
          : {}),
        economic_activities: data_table_activities_ciius.value?.map((ac) => ({
          ciiu_code: ac.ciiu_code,
          ciiu_id: ac.ciiu_id,
          city_id: ac.city_id,
          activity_description: ac.ciiu_name,
          is_main: ac.is_main,
        })),
        addresses: addressLocationForm.value?.locations.map((ad) => ({
          country_id: ad.country?.id,
          department_id: ad.department?.id,
          city_id: ad.city?.id,
          address: ad.address,
          is_main: ad.isMain,
        })),
        phones: phoneNumberState.value?.phoneNumbers.map((ph) => ({
          phone_type: ph?.type?.id,
          phone_number: ph.number,
          is_main: ph.isMain,
        })),
        bank_accounts: data_table_bank_account.value?.map((bk) => ({
          bank_id: bk.bank_id,
          bank_branch_id: bk.branch_id,
          account_type: bk.type,
          account_number: bk.account_number,
          is_main: bk.is_main,
          has_active_payments: bk.has_active_payments,
        })),
        emails: emailState.value?.emails.map((em) => ({
          email_address: em.email,
          is_main: em.isMain,
        })),
      }

      return payload
    }

    const onSubmit = async () => {
      openMainLoader(true)
      const PAYLOAD = await makeDataRequest()
      if (await _updateAction(PAYLOAD, thirdPartyId)) {
        router.push({ name: 'ThirdPartiesList' })
      }

      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }

    const capitalizeFirstLetter = (string: string) => {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
    const setFormEdit = () => {
      if (thirdpartie_request.value) {
        _setBasicDataState({
          id: thirdpartie_request.value?.id ?? null,
          check_digit: thirdpartie_request.value?.validator_digit ?? null,
          document_number: thirdpartie_request.value?.document ?? '',
          document_type_id:
            thirdpartie_request.value?.document_type.id ?? undefined,
          first_last_name:
            thirdpartie_request.value?.natural_person?.last_name ?? '',
          first_name: thirdpartie_request.value?.natural_person?.name ?? '',
          second_last_name:
            thirdpartie_request.value?.natural_person?.second_last_name ?? '',
          second_name:
            thirdpartie_request.value?.natural_person?.middle_name ?? '',
          social_reason:
            thirdpartie_request.value?.legal_person?.business_name ?? '',
          initials: thirdpartie_request.value?.legal_person?.acronym ?? '',
          person_type_id: thirdpartie_request.value?.person_type ?? null,
          third_type_id: thirdpartie_request.value?.third_party_type ?? '',
          tax_manager_id:
            thirdpartie_request.value?.fiscal_responsibility ?? '',
          iva_manager_id: thirdpartie_request.value?.vat_responsibility ?? '',
          profession_id:
            thirdpartie_request.value?.natural_person?.occupation_category
              ?.id ?? undefined,
          identity_type_id: thirdpartie_request.value.identity_type_id,
          creation_date: thirdpartie_request.value.created_at,
          created_by: `${thirdpartie_request.value.created_by.name} ${thirdpartie_request.value.created_by.last_name}`,
        })

        const dataTable = thirdpartie_request.value?.economic_activities.map(
          (ea) => {
            const ciiu = ciius.value.find((ciiu) => ea.ciiu_id === ciiu.value)

            return {
              id: ea.id ?? null,
              is_main: ea.is_main ?? false,
              ciiu_id: ea.ciiu_id ?? null,
              ciiu_code: ciiu?.code ?? null,
              ciiu_name: ciiu?.description ?? null,
              city_id: ea.city_id ?? null,
              city_code: ea.city?.code ?? null,
              city_name: ea.city?.name ?? null,
              saved: true,
            }
          }
        ) as IThirdPartiesTable[]

        _setActivitiesCIIUSTable({
          data: dataTable,
          current_page: 1,
          last_page: 1,
          total: dataTable.length,
          per_page: 5,
        })

        // -------------------------------------------------- //

        const dataTable2 = thirdpartie_request.value?.bank_accounts.map(
          (bk) => {
            return {
              id: bk.id ?? null,
              is_main: bk.is_main,
              bank_id: Number(bk.bank_id),
              bank_name: bk.bank.description ?? '',
              bank_code: bk.bank?.code ?? '',
              branch: bk?.bank_branch?.name ?? '',
              branch_id: bk.bank_branch_id ?? null,
              account_number: bk.account_number ?? '',
              city: bk.bank_branch?.city?.name ?? '',
              type: bk.account_type ?? '',
              has_active_payments: bk.has_active_payments ?? false,
              saved: false,
            }
          }
        ) as IBankAccountTable[]

        _setBankAccounTable({
          data: dataTable2,
          current_page: 1,
          last_page: 1,
          total: dataTable2.length,
          per_page: 5,
        })
      }
    }

    onMounted(async () => {
      openMainLoader(true)
      await getResources(`keys[]=${keys.join('&keys[]=')}`)
      await _getResources(keysManager)
      await _getByIdAction(thirdPartyId)
      openMainLoader(false)
    })

    watch(thirdpartie_request, (data) => {
      if (!data) return

      validateRouterAccess(
        () => !data?.is_fideicomiso,
        'No se pueden editar fideicomisos',
        'ThirdPartiesList'
      )

      _setTypePerson(
        capitalizeFirstLetter(thirdpartie_request.value?.person_type as string)
      )
      setFormEdit()
    })

    onUnmounted(() => {
      _clearRequestThirdparty()
      _setBankAccounTable(null)
      _setActivitiesCIIUSTable(null)
      _resetKeys(keysManager)
      basicDataState.value = null
      addressLocationForm.value = null
      phoneNumberState.value = null
      phoneNumberState.value = null
      emailState.value = null
    })

    return {
      headerProperties,
      tabs,
      activeTab,
      tabActiveIdx,
      thirdpartie_request,
      generalDataFormButton,
      basicDataFormRef,
      handlerGoTo,
      nextTab,
      backTab,
      onSubmit,
    }
  },
})
