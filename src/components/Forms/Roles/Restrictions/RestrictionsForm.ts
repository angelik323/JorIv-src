import { useMainLoader, useRules } from '@/composables'
import { useRolesModule } from '@/stores'
import { defaultIconsLucide, returnArrayRulesValidation } from '@/utils'
import { storeToRefs } from 'pinia'
import { defineComponent, onMounted, ref, watch } from 'vue'
import GenericTimeInput from '@/components/common/GenericTime/GenericTimeInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import Button from '@/components/common/Button/Button.vue'

export default defineComponent({
  name: 'RestrictionsForm',
  emits: ['onAction', 'onBack'],
  components: {
    GenericTimeInput,
    GenericSelectorComponent,
    Button,
  },
  props: {
    formType: {
      type: String,
      required: true,
    },
    btnLabel: {
      type: String,
      required: false,
      default: 'Continuar',
    },
    btnBackLabel: {
      type: String,
      required: false,
      default: 'Atrás',
    },
    btnBackIcon: {
      type: String,
      required: false,
      default: defaultIconsLucide.back,
    },
  },
  setup(props, { emit }) {
    const { openMainLoader } = useMainLoader()
    const { formDataRole, firtsTime } = storeToRefs(useRolesModule())

    const formData = ref()
    const dataForm = ref({
      is_schedule_restricted: false,
      schedule_start_hour: null,
      schedule_end_hour: null,
      has_expiration: false,
      expired_months: null,
      requires_mfa: false,
      mfa_duration_months: null,
      has_password_policy: false,
      password_expiration_days: null,
    }) as any
    const list = ref({
      months: [
        { value: 1, label: '1 Mes' },
        { value: 3, label: '3 Meses' },
        { value: 6, label: '6 Meses' },
        { value: 12, label: '12 Meses' },
        { value: 18, label: '18 Meses' },
      ],
      days: [
        { value: 30, label: '30 días' },
        { value: 60, label: '60 días' },
        { value: 180, label: '180 días' },
        { value: 360, label: '360 días' },
      ],
    })

    const returnLabel = (id: number | string, array: any) => {
      for (let i = 0; i < array.length; i++) {
        if (array[i].value === id) {
          return array[i].label
        }
      }
    }

    const searchObjectForKey = (id: any, list: any, key: string) => {
      if (id !== null && id !== undefined) {
        const verifyId = id[key] ? id[key] : id
        const found = list.find((item: any) => item[key] == verifyId)
        return found ?? null
      }
    }

    const setDataToLocalRestrictions = () => {
      dataForm.value.is_schedule_restricted =
        formDataRole.value?.is_schedule_restricted == null
          ? false
          : formDataRole.value?.is_schedule_restricted
      dataForm.value.schedule_start_hour =
        formDataRole.value?.schedule_start_hour ?? null
      dataForm.value.schedule_end_hour =
        formDataRole.value?.schedule_end_hour ?? null
      dataForm.value.has_expiration =
        formDataRole.value?.has_expiration == null
          ? false
          : formDataRole.value?.has_expiration
      dataForm.value.expired_months = searchObjectForKey(
        formDataRole.value?.expired_months,
        list.value.months,
        'value'
      )
      dataForm.value.requires_mfa =
        formDataRole.value?.requires_mfa == null
          ? false
          : formDataRole.value?.requires_mfa
      dataForm.value.mfa_duration_months = searchObjectForKey(
        formDataRole.value?.mfa_duration_months,
        list.value.months,
        'value'
      )
      dataForm.value.has_password_policy =
        formDataRole.value?.has_password_policy == null
          ? false
          : formDataRole.value?.has_password_policy
      dataForm.value.password_expiration_days = searchObjectForKey(
        formDataRole.value?.password_expiration_days,
        list.value.days,
        'value'
      )
    }

    const setDataToStoreRestrictions = () => {
      if (!formDataRole.value) return
      formDataRole.value.is_schedule_restricted =
        dataForm.value.is_schedule_restricted
      formDataRole.value.schedule_start_hour =
        dataForm.value.schedule_start_hour
      formDataRole.value.schedule_end_hour = dataForm.value.schedule_end_hour
      formDataRole.value.has_expiration = dataForm.value.has_expiration
      formDataRole.value.expired_months = dataForm.value.expired_months?.value
        ? dataForm.value.expired_months?.value
        : dataForm.value.expired_months
      formDataRole.value.requires_mfa = dataForm.value.requires_mfa
      formDataRole.value.mfa_duration_months = dataForm.value
        .mfa_duration_months?.value
        ? dataForm.value.mfa_duration_months?.value
        : dataForm.value.mfa_duration_months
      formDataRole.value.has_password_policy =
        dataForm.value.has_password_policy
      formDataRole.value.password_expiration_days = dataForm.value
        .password_expiration_days?.value
        ? dataForm.value.password_expiration_days?.value
        : dataForm.value.password_expiration_days
    }

    const handlerClickButton = () => {
      formData.value.validate().then((success: boolean) => {
        if (success) {
          setDataToStoreRestrictions()
          emit('onAction')
        }
      })
    }

    watch(
      () => dataForm.value,
      () => {
        setDataToStoreRestrictions()
      },
      { deep: true }
    )

    watch(
      () => [
        dataForm.value.has_expiration,
        dataForm.value.requires_mfa,
        dataForm.value.has_password_policy,
      ],
      () => {
        if (!dataForm.value.has_expiration) {
          dataForm.value.expired_months = ''
        }
        if (!dataForm.value.requires_mfa) {
          dataForm.value.mfa_duration_months = ''
        }
        if (!dataForm.value.has_password_policy) {
          dataForm.value.password_expiration_days = ''
        }
      }
    )

    onMounted(() => {
      if (
        props.formType === 'edit' ||
        props.formType === 'view' ||
        (props.formType === 'create' && firtsTime.value > 1)
      ) {
        openMainLoader(true)
        setTimeout(() => {
          setDataToLocalRestrictions()
          openMainLoader(false)
        }, 1000)
      }
    })

    return {
      formData,
      dataForm,
      props,
      list,
      //
      emit,
      returnArrayRulesValidation,
      returnLabel,
      handlerClickButton,
      useRules,
      minTime: (val: string) =>
        val > dataForm.value.schedule_start_hour ||
        'Ingresa una hora mayor a la inicial',
    }
  },
})
