import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import GeneralDataForm from '@/components/Forms/ThirdParties/GeneralData/GeneralDataForm.vue'
import BankForm from '@/components/Forms/ThirdParties/Bank/BankForm.vue'
import RetentionsForm from '@/components/Forms/ThirdParties/Retentions/RetentionsForm.vue'
import Icon from '@/components/common/Icon/Icon.vue'

//v2
import BasicDataForm from '@/components/Forms/ThirdParties/v2/BasicData/BasicDataForm.vue'
import EconActivityForm from '@/components/Forms/ThirdParties/v2/EconActivity/EconActivityForm.vue'
import AddressForm from '@/components/Forms/ThirdParties/v2/Address/AddressForm.vue'
import PhoneNumberForm from '@/components/Forms/ThirdParties/v2/PhoneNumber/PhoneNumberForm.vue'
import EmailForm from '@/components/Forms/ThirdParties/v2/Email/EmailForm.vue'
import BankAccountForm from '@/components/Forms/ThirdParties/v2/BankAccount/BankAccountForm.vue'

import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
} from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  useResourceStore,
  useThirdPartiesModuleStore,
  useThirdPartiesStore,
} from '@/stores'
import { useMainLoader, useAlert, useUtils } from '@/composables'
import { defaultIconsLucide } from '@/utils'
import { PersonType } from '@/interfaces/global/Clients'

export default defineComponent({
  name: 'ThirdPartiesCreate',
  components: {
    ContentComponent,
    Card,
    TabsComponent,
    Icon,

    GeneralDataForm,
    BankForm,
    RetentionsForm,

    // v2
    BasicDataForm,
    EconActivityForm,
    AddressForm,
    PhoneNumberForm,
    EmailForm,
    BankAccountForm,
  },
  setup() {
    const generalDataFormButton = ref(null)
    const { openMainLoader } = useMainLoader()
    const router = useRouter()
    const {
      // Data forms
      basicDataState,
      data_table_activities_ciius,
      addressLocationForm,
      phoneNumberState,
      data_table_bank_account,
      emailState,
      isValidPerson,
    } = storeToRefs(useThirdPartiesStore())

    const {
      _createAction,
      _clearRequestThirdparty,
      _setBankAccounTable,
      _setActivitiesCIIUSTable,
    } = useThirdPartiesStore()

    const { getResources } = useResourceStore('v1')

    const { third_request } = storeToRefs(useThirdPartiesModuleStore())

    const { showAlert } = useAlert()
    const { normalizeText } = useUtils()

    const headerProperties = {
      title: 'Crear tercero',
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
          label: 'Creación de tercero',
          route: 'ThirdPartiesCreate',
        },
      ],
    }

    const tabs = reactive([
      {
        name: 'BasicData',
        label: 'Información básica',
        icon: defaultIconsLucide.listBulleted,
        outlined: true,
        disable: true,
        show: true,
        required: true,
      },
      {
        name: 'EconActivity',
        label: 'Actividad Económica',
        icon: defaultIconsLucide.factory,
        outlined: true,
        disable: true,
        show: true,
        required: true,
      },
      {
        name: 'Address',
        label: 'Dirección',
        icon: defaultIconsLucide.location,
        outlined: true,
        disable: true,
        show: true,
        required: true,
      },
      {
        name: 'PhoneNumber',
        label: 'Teléfono',
        icon: defaultIconsLucide.phoneOutline,
        outlined: true,
        disable: true,
        show: true,
        required: true,
      },
      {
        name: 'Email',
        label: 'Correo Electrónico',
        icon: defaultIconsLucide.emailOutline,
        outlined: true,
        disable: true,
        show: true,
        required: true,
      },
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

    const handlerGoTo = (goURL: string) => {
      router.push({ name: goURL })
    }

    const basicDataFormRef = ref()

    // Computada para validaciones personalizadas
    const isValid = computed(() => {
      return isValidPerson.value
    })

    const nextTab = async () => {
      let valid = false

      if (tabActiveIdx.value == 0) {
        valid = await basicDataFormRef.value?.validateForm()
      }

      if (tabActiveIdx.value == 1) {
        valid = data_table_activities_ciius.value.length > 0

        if (!valid) {
          showAlert(
            'Por favor, agrega al menos una actividad económica',
            'error',
            undefined,
            3000
          )
        }
      }

      if (tabActiveIdx.value == 2) {
        valid = addressLocationForm.value
          ? addressLocationForm.value?.locations.length > 0
          : false

        if (!valid) {
          showAlert(
            'Por favor, agrega al menos una dirección',
            'error',
            undefined,
            3000
          )
        }
      }

      if (tabActiveIdx.value == 3) {
        valid = phoneNumberState.value
          ? phoneNumberState.value?.phoneNumbers.length > 0
          : false

        if (!valid) {
          showAlert(
            'Por favor, agrega al menos un número de teléfono',
            'error',
            undefined,
            3000
          )
        }
      }

      if (tabActiveIdx.value == 4) {
        valid = emailState.value ? emailState.value?.emails.length > 0 : false

        if (!valid) {
          showAlert(
            'Por favor, agrega al menos un correo electrónico',
            'error',
            undefined,
            3000
          )
        }
      }

      if (valid) {
        tabActiveIdx.value = tabActiveIdx.value + 1
        activeTab.value = tabs[tabActiveIdx.value].name
      }
    }

    const backTab = () => {
      tabActiveIdx.value = tabActiveIdx.value - 1
      activeTab.value = tabs[tabActiveIdx.value].name
    }

    const makeDataRequest = async () => {
      let person_type = 'natural'
      let name = `${basicDataState.value?.first_name} ${basicDataState.value?.first_last_name}`
      let dataThirdType: object = {}
      if (
        basicDataState.value?.person_type_id === normalizeText(PersonType.LEGAL)
      ) {
        person_type = 'legal'
        name = basicDataState.value.social_reason ?? ''
        dataThirdType = {
          business_name: name,
          acronym: basicDataState.value?.initials,
          nature_id: 1,
          constitution_code: 'SAS-789',
          country_id: 1,
          classification_company: 'Pyme',
          applicant_type: 'Empresa',
        }
      } else {
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
      }

      const payload = {
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
        person_type: person_type,
        ...(person_type === 'natural'
          ? { natural_person: dataThirdType }
          : { legal_person: dataThirdType }),
        economic_activities: data_table_activities_ciius.value?.map((ac) => ({
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
      if (await _createAction(PAYLOAD)) {
        router.push({ name: 'ThirdPartiesList' })
      }

      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }

    onMounted(async () => {
      await getResources(`keys[]=${keys.join('&keys[]=')}`)
    })

    onUnmounted(() => {
      _clearRequestThirdparty()
      _setBankAccounTable(null)
      _setActivitiesCIIUSTable(null)
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
      generalDataFormButton,
      basicDataFormRef,
      isValid,
      third_request,

      handlerGoTo,
      nextTab,
      backTab,
      onSubmit,
    }
  },
})
