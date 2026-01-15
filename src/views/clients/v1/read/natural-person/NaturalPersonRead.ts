import { computed, defineComponent, onBeforeMount, ref, watch } from 'vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'

import InformationForm from '@/components/Forms/Clients/NaturalEntity/information/InformationForm.vue'
import TributaryForm from '@/components/Forms/Clients/NaturalEntity/tributary/TributaryForm.vue'
import FinanceForm from '@/components/Forms/Clients/NaturalEntity/finance/FinanceForm.vue'
import PepForm from '@/components/Forms/Clients/NaturalEntity/pep/PepForm.vue'
import EstateForm from '@/components/Forms/Clients/NaturalEntity/estate/EstateForm.vue'
import InvestorForm from '@/components/Forms/Clients/NaturalEntity/investor/InvestorForm.vue'
import DocumentForm from '@/components/Forms/Clients/NaturalEntity/document/DocumentForm.vue'

import { defaultIcons } from '@/utils'
import { ITabs } from '@/interfaces/global'
import { useRoute, useRouter } from 'vue-router'
import { useClientsStore } from '@/stores'
import { useMainLoader } from '@/composables'
import { storeToRefs } from 'pinia'

export default defineComponent({
  name: 'NaturalPersonView',
  components: {
    ContentComponent,
    TabsComponent,
    VCard,
    InformationForm,
    TributaryForm,
    FinanceForm,
    PepForm,
    EstateForm,
    InvestorForm,
    DocumentForm,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const naturalClientId = +route.params.id

    const { natural_client_request, data_information_form } = storeToRefs(
      useClientsStore('v1')
    )

    const { _getByIdNaturalClient, _clearDataNatural } = useClientsStore('v1')

    const { openMainLoader } = useMainLoader()

    const tabs = ref<ITabs[]>([
      {
        name: 'information',
        label: 'Información básica',
        icon: defaultIcons.bulletList,
        outlined: true,
        disable: false,
        show: true,
        required: false,
      },
      {
        name: 'tributary',
        label: 'Tributario',
        icon: defaultIcons.bulletList,
        outlined: true,
        disable: false,
        show: true,
        required: false,
      },
      {
        name: 'finance',
        label: 'Finanzas',
        icon: defaultIcons.bulletList,
        outlined: true,
        disable: false,
        show: true,
        required: false,
      },
      {
        name: 'pep',
        label: 'PEP',
        icon: defaultIcons.bulletList,
        outlined: true,
        disable: false,
        show: true,
        required: false,
      },
      {
        name: 'estate',
        label: 'Bienes',
        icon: defaultIcons.bulletList,
        outlined: true,
        disable: false,
        show: false,
        required: false,
      },
      {
        name: 'investor',
        label: 'Inversionistas',
        icon: defaultIcons.bulletList,
        outlined: true,
        disable: false,
        show: true,
        required: false,
      },
      {
        name: 'document',
        label: 'Documentos',
        icon: defaultIcons.bulletList,
        outlined: true,
        disable: false,
        show: true,
        required: false,
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

    const headerProps = {
      title: 'Ver persona natural',
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
          label: 'Ver persona natural',
        },
        {
          label: `${naturalClientId}`,
        },
      ],
      showBackBtn: true,
    }

    const tabActive = ref(filteredTabs.value[0].name)

    const tabActiveIdx = ref(
      filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
    )

    const handlerGoTo = (goURL: string) => {
      router.push({ name: goURL })
    }

    const nextTab = async () => {
      tabActiveIdx.value = tabActiveIdx.value + 1
      tabActive.value = filteredTabs.value[tabActiveIdx.value].name
    }

    const backTab = () => {
      tabActiveIdx.value = tabActiveIdx.value - 1
      tabActive.value = filteredTabs.value[tabActiveIdx.value].name
    }

    onBeforeMount(async () => {
      _clearDataNatural()
      openMainLoader(true)
      await _getByIdNaturalClient(naturalClientId)
      openMainLoader(false)
    })

    return {
      handlerGoTo,
      nextTab,
      backTab,

      filteredTabs,
      tabActiveIdx,
      tabActive,
      natural_client_request,
      headerProps,
    }
  },
})
