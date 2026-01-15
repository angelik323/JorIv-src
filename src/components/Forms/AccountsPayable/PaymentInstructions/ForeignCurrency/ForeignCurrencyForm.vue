<template>
  <q-form ref="headerFormRef" class="q-pa-md">
    <section>
      <div class="row row q-col-gutter-md">
        <div class="col-12 col-md-4">
          <InputMoneyComponent
            label="Valor neto"
            :model-value="String(models.net_value ?? '')"
            :required="true"
            :disabled="true"
            placeholder="0,00"
            :rules="[]"
            @update:model-value="
              ({ rawValue }) => (models.net_value = rawValue ?? '')
            "
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Moneda"
            :default_value="models.currency_id"
            :manual_option="coins"
            :auto_complete="true"
            :required="true"
            :disabled="['view'].includes(action)"
            :map_options="true"
            :rules="[]"
            @update:model-value="models.currency_id = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            label="TRM del día"
            type="text"
            :default_value="models.trm_day"
            :required="true"
            :disabled="true"
            :rules="[]"
            @update:model-value="models.trm_day = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            label="TRM final"
            type="text"
            :default_value="models.trm_final"
            :required="true"
            :disabled="['view'].includes(action)"
            :rules="[]"
            @update:model-value="models.trm_final = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <InputMoneyComponent
            label="Valor final en pesos $"
            :model-value="String(models.final_value_pesos ?? '')"
            :required="true"
            :disabled="true"
            placeholder="0,00"
            :rules="[]"
            @update:model-value="
              ({ rawValue }) => (models.final_value_pesos = rawValue ?? '')
            "
          />
        </div>

        <div class="col-12 col-md-4">
          <InputMoneyComponent
            label="Valor moneda extranjera $"
            :model-value="String(models.final_value_foreign ?? '')"
            :required="true"
            :disabled="true"
            placeholder="0,00"
            :rules="[]"
            @update:model-value="
              ({ rawValue }) => (models.final_value_foreign = rawValue ?? '')
            "
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'

// Interfaces
import { IPaymentInstructionsForeignCurrencyForm } from '@/interfaces/customs/accounts-payable/PaymentInstructions'
import { ActionType } from '@/interfaces/global'

// Logic
import useForeignCurrencyForm from '@/components/Forms/AccountsPayable/PaymentInstructions/ForeignCurrency/ForeignCurrencyForm'

const emit = defineEmits(['update:data'])

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IPaymentInstructionsForeignCurrencyForm | null
  }>(),
  {}
)

const {
  models,
  headerFormRef,

  // Selects
  coins,
} = useForeignCurrencyForm(props, emit)

defineExpose({
  validateForm: () => headerFormRef.value?.validate(),
})
</script>
