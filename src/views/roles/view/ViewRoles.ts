import { defineComponent, onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
// Components:
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import PermissionsForm from '@/components/Forms/Roles/Permissions/PermissionsForm.vue'
import RestrictionsForm from '@/components/Forms/Roles/Restrictions/RestrictionsForm.vue'
import VCard from '@/components/common/VCard/VCard.vue'
// Composables & utils:
import { useUtils } from '@/composables'
// Interfaces:
import { ITabs } from '@/interfaces/customs/Tab'
// Stores:
import { useRolesModule } from '@/stores'

export default defineComponent({
  name: 'ViewRoles',
  components: {
    ContentComponent,
    TabsComponent,
    PermissionsForm,
    RestrictionsForm,
    VCard,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { _getRegister } = useRolesModule()
    const { validateForm } = storeToRefs(useRolesModule())

    const headerProps = {
      title: 'Ver rol',
      breadcrumbs: [
        {
          label: 'Usuarios',
        },
        {
          label: 'Roles',
          route: 'ListRoles',
        },
        {
          label: 'Ver',
        },
        {
          label: route?.params?.id as string,
        },
      ],
      showBackBtn: true,
    }

    // tabs:
    const tabs = ref<ITabs[]>([
      {
        name: 'permissions',
        label: 'Datos de rol y permisos',
        icon: useUtils().defaultIconsLucide.bulletList,
        outlined: true,
        disable: false,
        show: true,
        required: false,
      },
      // {
      //   name: 'restrictions',
      //   label: 'Restricciones',
      //   icon: defaultIcons.information,
      //   outlined: true,
      //   disable: false,
      //   show: true,
      //   required: false,
      // },
    ])

    const tabActive = ref(tabs.value[0].name)

    const tabActiveIdx = ref(
      tabs.value.findIndex((tab) => tab.name === tabActive.value)
    )

    const goToView = async (route: string, id?: number) => {
      await router.push({ name: route, params: { id } })
    }

    const nextTab = async () => {
      tabActiveIdx.value = tabActiveIdx.value + 1
      tabActive.value = tabs.value[tabActiveIdx.value].name
    }

    const backTab = () => {
      tabActiveIdx.value = tabActiveIdx.value - 1
      tabActive.value = tabs.value[tabActiveIdx.value].name
    }

    const handlerView = async () => {
      router.push({ name: 'ListRoles' })
    }

    onBeforeMount(async () => {
      await _getRegister(route?.params?.id)
    })

    return {
      headerProps,
      tabs,
      tabActive,
      tabActiveIdx,
      validateForm,
      goToView,
      nextTab,
      backTab,
      handlerView,
      //
    }
  },
})
