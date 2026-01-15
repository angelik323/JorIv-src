import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Card from '@/components/common/VCard/VCard.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'

//v2
import BasicDataForm from '@/components/Forms/ThirdParties/v2/BasicData/BasicDataForm.vue'
import EconActivityForm from '@/components/Forms/ThirdParties/v2/EconActivity/EconActivityForm.vue'
import AddressForm from '@/components/Forms/ThirdParties/v2/Address/AddressForm.vue'
import PhoneNumberForm from '@/components/Forms/ThirdParties/v2/PhoneNumber/PhoneNumberForm.vue'
import EmailForm from '@/components/Forms/ThirdParties/v2/Email/EmailForm.vue'
import BankAccountForm from '@/components/Forms/ThirdParties/v2/BankAccount/BankAccountForm.vue'

import { defineComponent, onMounted, reactive, ref, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useThirdPartiesStore } from '@/stores'
import { QTable } from 'quasar'
import { IRetentionsList } from '@/interfaces/global/ThirdParties'

import { defaultIconsLucide } from '@/utils'
import { IBankAccountTable } from '@/interfaces/customs'

export default defineComponent({
  name: 'ThirdPartiesView',
  components: {
    ContentComponent,
    TabsComponent,
    Card,
    TableList,
    ShowStatus,
    BasicDataForm,
    EconActivityForm,
    AddressForm,
    PhoneNumberForm,
    EmailForm,
    BankAccountForm,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const thirdPartyId = +route.params.id
    const { thirdpartie_request } = storeToRefs(useThirdPartiesStore())
    const { _getByIdAction, _setBankAccounTable, _clearRequestThirdparty } =
      useThirdPartiesStore()

    const manageWithholdings = ref(false)

    const tabs = reactive([
      // v2
      {
        name: 'BasicData',
        label: 'Información básica',
        icon: defaultIconsLucide.listBulleted,

        outlined: true,
        disable: false,
        show: true,
        required: true,
      },
      // v2
      {
        name: 'EconActivity',
        label: 'Actividad Económica',
        icon: defaultIconsLucide.factory,
        outlined: true,
        disable: false,
        show: true,
        required: true,
      },
      // v2
      {
        name: 'Address',
        label: 'Dirección',
        icon: defaultIconsLucide.location,
        outlined: true,
        disable: false,
        show: true,
        required: true,
      },
      // v2
      {
        name: 'PhoneNumber',
        label: 'Teléfono',
        icon: defaultIconsLucide.phoneOutline,
        outlined: true,
        disable: false,
        show: true,
        required: true,
      },
      // v2
      {
        name: 'Email',
        label: 'Correo Electrónico',
        icon: defaultIconsLucide.emailOutline,
        outlined: true,
        disable: false,
        show: true,
        required: true,
      },
      // v2
      {
        name: 'BankAccount',
        label: 'Cuenta Bancaria',
        icon: defaultIconsLucide.walletOutline,
        outlined: true,
        disable: false,
        show: true,
        required: false,
      },
    ])

    const activeTab = ref(tabs[0].name)
    const tabActiveIdx = ref(
      tabs.findIndex((tab) => tab.name === activeTab.value)
    )

    const headerProperties = {
      title: 'Tercero',
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
          label: 'Visualizar Tercero',
          route: 'ThirdPartiesView',
        },
        {
          label: thirdPartyId.toString(),
        },
      ],
    }

    const tableProperties = ref({
      title: 'Listado de retenciones',
      loading: false,
      columns: [
        {
          name: 'id',
          required: false,
          label: '#',
          align: 'left',
          field: 'id',
          sortable: true,
        },
        {
          name: 'name',
          required: false,
          label: 'Nombre',
          align: 'left',
          field: 'name',
          sortable: true,
          style: {
            'max-width': '200px',
            'min-width': '100px',
            'word-wrap': 'break-word',
            'white-space': 'break-spaces',
          },
        },
        {
          name: 'code',
          required: false,
          label: 'Código',
          align: 'left',
          field: 'code',
          sortable: true,
          style: {
            'max-width': '140px',
            'min-width': '100px',
            'word-wrap': 'break-word',
            'white-space': 'break-spaces',
          },
        },
        {
          name: 'account',
          required: false,
          label: 'Cuenta',
          align: 'left',
          field: (row) => `${row.account.name}`,
          sortable: true,
          style: {
            'max-width': '140px',
            'min-width': '100px',
            'word-wrap': 'break-word',
            'white-space': 'break-spaces',
          },
        },
        {
          name: 'third_party',
          required: false,
          label: 'Tercero',
          align: 'left',
          field: (row) => `${row?.third_party?.name ?? ''}`,
          sortable: true,
          style: {
            'max-width': '140px',
            'min-width': '100px',
            'word-wrap': 'break-word',
            'white-space': 'break-spaces',
          },
        },
        {
          name: 'type_label',
          required: false,
          label: 'Tipo',
          align: 'left',
          field: 'type_label',
          sortable: true,
          style: {
            'max-width': '140px',
            'min-width': '100px',
            'word-wrap': 'break-word',
            'white-space': 'break-spaces',
          },
        },
        {
          name: 'percentage_formatted',
          required: false,
          label: 'percentage_formatted',
          align: 'left',
          field: 'percentage_formatted',
          sortable: true,
          style: {
            'max-width': '140px',
            'min-width': '100px',
            'word-wrap': 'break-word',
            'white-space': 'break-spaces',
          },
        },
        {
          name: 'status',
          required: false,
          label: 'Estado',
          align: 'left',
          field: (row) => `${row.status.id}`,
          sortable: true,
        },
      ] as QTable['columns'],
      rows: [] as IRetentionsList[],
      pages: {
        currentPage: ref(1),
        lastPage: ref(1),
      },
    })

    const handlerGoTo = (goURL: string) => {
      router.push({ name: goURL })
    }

    const nextTab = async () => {
      tabActiveIdx.value = tabActiveIdx.value + 1
      activeTab.value = tabs[tabActiveIdx.value].name
    }

    const backTab = () => {
      tabActiveIdx.value = tabActiveIdx.value - 1
      activeTab.value = tabs[tabActiveIdx.value].name
    }

    onMounted(async () => {
      await _getByIdAction(thirdPartyId)

      const dataTableBanks = thirdpartie_request.value?.bank_accounts.map(
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
        data: dataTableBanks,
        current_page: 1,
        last_page: 1,
        total: dataTableBanks.length,
        per_page: 5,
      })
    })

    onUnmounted(() => {
      _clearRequestThirdparty()
      _setBankAccounTable(null)
    })

    return {
      handlerGoTo,
      nextTab,
      backTab,

      tabs,
      tabActiveIdx,
      activeTab,
      headerProperties,
      thirdpartie_request,
      manageWithholdings,
      tableProperties,
    }
  },
})
