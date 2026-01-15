<template>
  <q-form ref="basicDataFormRef" class="q-pa-lg">
    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div
          class="col-12"
          :class="action === 'edit' ? 'col-md-3' : 'col-md-4'"
        >
          <GenericSelectorComponent
            label="Usuario autorizado"
            :manual_option="users_label_email"
            :map_options="true"
            :default_value="models.autorized_user_id"
            required
            @update:model-value="models.autorized_user_id = $event"
            :disabled="action === 'edit'"
            :rules="[
              (val: string) => useRules().is_required(val, 'El usuario autorizado es requerido'),
            ]"
          />
        </div>
        <div
          class="col-12"
          :class="action === 'edit' ? 'col-md-3' : 'col-md-4'"
        >
          <InputMoneyComponent
            :model-value="models.amount_from"
            label="Monto desde"
            :max_decimal_digits="2"
            required
            :rules="[
                (val: string) => useRules().is_required(val, 'El monto desde es requerido'),
            ]"
            @update:model-value="
              ({ rawValue }) => (models.amount_from = rawValue)
            "
          />
        </div>
        <div
          class="col-12"
          :class="action === 'edit' ? 'col-md-3' : 'col-md-4'"
        >
          <InputMoneyComponent
            :model-value="models.amount_to"
            label="Monto hasta"
            :max_decimal_digits="2"
            required
            :rules="[
                (val: string) => useRules().is_required(val, 'El monto hasta es requerido'),
            ]"
            @update:model-value="
              ({ rawValue }) => (models.amount_to = rawValue)
            "
          />
        </div>
        <div class="col-12 col-md-3" v-if="action === 'edit'">
          <GenericDateInputComponent
            label="Fecha de creación"
            disabled
            :default_value="models.created_at"
            :rules="[]"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>
<script setup lang="ts">
//Componets
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'

//Interfaces
import { IPaymentAuthorizersForm } from '@/interfaces/customs/accounts-payable/PaymentAuthorizers'
import { ActionType } from '@/interfaces/global/Action'

// Composables
import { useRules } from '@/composables'

//Logic
import useBasicDataForm from '@/components/Forms/AccountsPayable/PaymentAuthorizers/BasicDataForm'

const props = withDefaults(
  defineProps<{
    data?: IPaymentAuthorizersForm | null
    action: ActionType
  }>(),
  {}
)

const emits =
  defineEmits<
    (e: 'update:data', value: IPaymentAuthorizersForm | null) => void
  >()

const { basicDataFormRef, models, users_label_email } = useBasicDataForm(
  props,
  emits
)

defineExpose({
  validateForm: () => basicDataFormRef.value?.validate(),
})
</script>
