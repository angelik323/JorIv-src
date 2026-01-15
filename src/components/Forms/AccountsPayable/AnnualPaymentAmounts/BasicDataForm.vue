<template>
  <q-form ref="basicDataFormRef" class="q-pa-xl">
    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericInputComponent
            label="Vigencia"
            type="number"
            :default_value="models.year"
            :append_icon="defaultIconsLucide.calendar"
            required
            disabled
            :rules="[
              (val: string) => useRules().is_required(val, 'El año de vigencia es requerido'),
            ]"
            @update:model-value="models.year = $event"
          />
        </div>
        <div class="col-12 col-md-3">
          <InputMoneyComponent
            :model-value="models.minimum_salary"
            :max_decimal_digits="2"
            label="Salario mínimo"
            required
            :rules="[
                        (val: string) => useRules().is_required(val, 'El salario mínimo es requerido'),
                      ]"
            @update:model-value="
              ({ rawValue }) => (models.minimum_salary = rawValue)
            "
          />
        </div>
        <div class="col-12 col-md-3">
          <InputMoneyComponent
            :model-value="models.transport_subsidy"
            :max_decimal_digits="2"
            label="Subsidio de transporte"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El subsidio de transporte es requerido'),
            ]"
            @update:model-value="
              ({ rawValue }) => (models.transport_subsidy = rawValue)
            "
          />
        </div>
        <div class="col-12 col-md-3">
          <InputMoneyComponent
            :model-value="models.uvt"
            :max_decimal_digits="2"
            label="UVT"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El UVT es requerido'),
            ]"
            @update:model-value="({ rawValue }) => (models.uvt = rawValue)"
          />
        </div>
        <div class="col-12 col-md-3">
          <InputMoneyComponent
            :model-value="models.obligated_iva_uvt_pn"
            :max_decimal_digits="2"
            label="Monto obligado IVA UVT - PN"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El monto obligado IVA UVT - PN es requerido'),
            ]"
            @update:model-value="
              ({ rawValue }) => (models.obligated_iva_uvt_pn = rawValue)
            "
          />
        </div>
      </div>
    </section>
  </q-form>
</template>
<script setup lang="ts">
//Components
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'

//Interfaces
import { IAnnualPaymentAmountsForm } from '@/interfaces/customs/accounts-payable/AnnualPaymentAmounts'

//Composables
import { useRules } from '@/composables'

//Utils
import { defaultIconsLucide } from '@/utils'

// Logic
import useBasicDataForm from '@/components/Forms/AccountsPayable/AnnualPaymentAmounts/BasicDataForm'

const props = withDefaults(
  defineProps<{
    data?: IAnnualPaymentAmountsForm | null
  }>(),
  {}
)

const emits =
  defineEmits<
    (e: 'update:data', value: IAnnualPaymentAmountsForm | null) => void
  >()

const { basicDataFormRef, models } = useBasicDataForm(props, emits)

defineExpose({
  validateForm: () => basicDataFormRef.value?.validate(),
})
</script>
