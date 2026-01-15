import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
// Components:
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import PermissionsForm from '@/components/Forms/Roles/Permissions/PermissionsForm.vue'
import RestrictionsForm from '@/components/Forms/Roles/Restrictions/RestrictionsForm.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
// Composables & utils:
import { useMainLoader, useUtils } from '@/composables'
// Interfaces:
import { IFormDataRole } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/customs/Tab'
// Stores:
import { useRolesModule } from '@/stores'

export default defineComponent({
  name: 'CreateRoles',
  components: {
    ContentComponent,
    TabsComponent,
    PermissionsForm,
    RestrictionsForm,
    VCard,
    Button,
  },
  setup() {
    const router = useRouter()
    const { openMainLoader } = useMainLoader()
    const { _createRegister, _setStoreFormDataRole, _setStoreValidateForm } =
      useRolesModule()
    const { validateForm, formDataRole } = storeToRefs(useRolesModule())
    const { defaultIconsLucide } = useUtils()

    const headerProps = {
      title: 'Crear rol',
      breadcrumbs: [
        {
          label: 'Usuarios',
        },
        {
          label: 'Roles',
          route: 'ListRoles',
        },
        {
          label: 'Crear',
          route: 'CreateRoles',
        },
      ],
      showBackBtn: true,
    }

    // tabs:
    const tabs = ref<ITabs[]>([
      {
        name: 'permissions',
        label: 'Datos de rol y permisos',
        icon: defaultIconsLucide.bulletList,
        outlined: true,
        disable: true,
        show: true,
        required: false,
      },
      // {
      //   name: 'restrictions',
      //   label: 'Restricciones',
      //   icon: defaultIconsLucide.information,
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
            element.status_id == 1
          ) {
            arrayPermissionsTransform.push(element.name)
            if (element.children && element.children.length > 0) {
              element.children.forEach((child) => {
                if (child.isChecked) {
                  arrayPermissionsTransform.push(child.name)
                }
              })
            }
          }
        }
      }
      return arrayPermissionsTransform
    }

    const handlerCreate = async () => {
      openMainLoader(true)
      setTimeout(async () => {
        const permissions = await transformPermissions()
        const bodyRequest: IFormDataRole = {
          name: formDataRole.value?.name ?? null,
          description: formDataRole.value?.description ?? null,
          priority_level: formDataRole.value?.priority_level ?? null,
          authorization_level_id:
            formDataRole.value?.authorization_level_id ?? null,
          permissions: permissions ?? [],
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
        const response = await _createRegister(bodyRequest)
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
      }, 3000)
    }

    return {
      defaultIconsLucide,
      headerProps,
      tabs,
      tabActive,
      tabActiveIdx,
      validateForm,
      goToView,
      nextTab,
      backTab,
      handlerCreate,
    }
  },
})
