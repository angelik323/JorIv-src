import { defineComponent, onMounted, ref } from 'vue'
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
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
// Interfaces:
import { IFormDataRole } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/customs/Tab'
// Stores:
import { useRolesModule } from '@/stores'

export default defineComponent({
  name: 'EditRoles',
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
    const {
      _updateRegister,
      _setStoreFormDataRole,
      _setStoreValidateForm,
      _getRegister,
    } = useRolesModule()
    const { openMainLoader } = useMainLoader()
    const { validateForm, formDataRole } = storeToRefs(useRolesModule())

    const headerProps = {
      title: 'Editar rol',
      breadcrumbs: [
        {
          label: 'Usuarios',
        },
        {
          label: 'Roles',
          route: 'ListRoles',
        },
        {
          label: 'Editar',
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
        disable: true,
        show: true,
        required: false,
      },
      // {
      //   name: 'restrictions',
      //   label: 'Restricciones',
      //   icon: defaultIcons.information,
      //   outlined: true,
      //   disable: true,
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

    const transformPermissions = async () => {
      const arrayPermissionsTransform: string[] = []
      if (formDataRole.value && Array.isArray(formDataRole.value.permissions)) {
        for (
          let index = 0;
          index < formDataRole.value.permissions.length;
          index++
        ) {
          const element = formDataRole.value.permissions[index]
          if (
            typeof element === 'object' &&
            element !== null &&
            'status_id' in element &&
            element.children &&
            (element.status_id == 1 || element.isChecked)
          ) {
            arrayPermissionsTransform.push(element.name)
            element.children.map((e) => {
              if (e.isChecked) {
                arrayPermissionsTransform.push(e.name)
              }
            })
          }
        }
        formDataRole.value.permissions = arrayPermissionsTransform
      }
    }

    const handlerUpdate = async () => {
      openMainLoader(true)
      transformPermissions()
      const bodyRequest: IFormDataRole = {
        name: formDataRole.value?.name ?? null,
        description: formDataRole.value?.description ?? null,
        priority_level: formDataRole.value?.priority_level ?? null,
        authorization_level_id:
          formDataRole.value?.authorization_level_id ?? null,
        permissions: formDataRole.value?.permissions ?? [],
        is_schedule_restricted:
          formDataRole.value?.is_schedule_restricted ?? false,
        schedule_start_hour: formDataRole.value?.schedule_start_hour ?? null,
        schedule_end_hour: formDataRole.value?.schedule_end_hour ?? null,
        has_expiration: formDataRole.value?.has_expiration ?? null,
        expired_months: formDataRole.value?.expired_months ?? null,
        requires_mfa: formDataRole.value?.requires_mfa ?? false,
        mfa_duration_months: formDataRole.value?.mfa_duration_months ?? null,
        has_password_policy: formDataRole.value?.has_password_policy ?? false,
        password_expiration_days:
          formDataRole.value?.password_expiration_days ?? null,
      }
      const response = await _updateRegister(route.params.id, bodyRequest)
      if (response) {
        _setStoreFormDataRole({
          name: null,
          description: null,
          priority_level: null,
          authorization_level_id: null,
          permissions: [],
          is_schedule_restricted: false,
          schedule_start_hour: null,
          schedule_end_hour: null,
          has_expiration: null,
          expired_months: null,
          requires_mfa: false,
          mfa_duration_months: null,
          has_password_policy: false,
          password_expiration_days: null,
        })
        _setStoreValidateForm(true)
        router.push({ name: 'ListRoles' })
      }
      openMainLoader(false)
    }

    onMounted(async () => {
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
      handlerUpdate,
      //
    }
  },
})
