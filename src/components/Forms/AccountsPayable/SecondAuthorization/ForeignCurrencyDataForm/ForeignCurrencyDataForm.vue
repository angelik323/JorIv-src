<template>
  <div class="q-pa-lg">
    <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
      <div class="col-12 col-md-6">
        <InputMoneyComponent
          :model-value="models.initial_value_pesos"
          label="Valor inicial en pesos"
          placeholder="-"
          disabled
        />
      </div>

      <div class="col-12 col-md-6">
        <InputMoneyComponent
          :model-value="models.initial_trm"
          label="TRM inicial"
          placeholder="-"
          disabled
        />
      </div>

      <div class="col-12 col-md-6">
        <InputMoneyComponent
          :model-value="models.final_value_pesos"
          label="Valor final en pesos"
          placeholder="-"
          disabled
        />
      </div>

      <div class="col-12 col-md-6">
        <InputMoneyComponent
          :model-value="models.final_trm"
          label="TRM final"
          placeholder="-"
          disabled
        />
      </div>

      <div class="col-12 col-md-6">
        <InputMoneyComponent
          :model-value="models.final_value_foreign_currency"
          label="Valor final en moneda extranjera"
          placeholder="-"
          disabled
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
//Components
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'

// Interfaces
import { ISecondAuthorizationForeignCurrency } from '@/interfaces/customs/accounts-payable/SecondAuthorization'

// Logic
import useForeignCurrencyDataForm from '@/components/Forms/AccountsPayable/SecondAuthorization/ForeignCurrencyDataForm/ForeignCurrencyDataForm'

const props = withDefaults(
  defineProps<{
    data?: ISecondAuthorizationForeignCurrency | null
  }>(),
  {}
)

const { models } = useForeignCurrencyDataForm(props)
</script>
