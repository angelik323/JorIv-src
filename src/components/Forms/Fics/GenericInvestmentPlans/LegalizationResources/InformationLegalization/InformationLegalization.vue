<template>
  <section class="q-pa-lg">
    <div class="row q-col-gutter-x-lg q-col-gutter-y-lg">
      <div class="col-12 col-md-4 text-black-90">
        <p class="text-weight-bold no-margin">Fondo de inversión</p>
        <p class="text-weight-medium no-margin">
          {{ formData.collective_investment_fund?.code || '-' }}
        </p>
      </div>

      <div class="col-12 col-md-4 text-black-90">
        <p class="text-weight-bold no-margin">Descripción fondo</p>
        <p class="text-weight-medium no-margin">
          {{ formData.collective_investment_fund?.name || '-' }}
        </p>
      </div>

      <div class="col-12 col-md-4 text-black-90">
        <p class="text-weight-bold no-margin">Fecha de registro</p>
        <p class="text-weight-medium no-margin">
          {{ formData.registration_date || '-' }}
        </p>
      </div>

      <div class="col-12 col-md-4 text-black-90">
        <p class="text-weight-bold no-margin">Fecha de cierre</p>
        <p class="text-weight-medium no-margin">
          {{ formData.collective_investment_fund?.end_date || '-' }}
        </p>
      </div>

      <div class="col-12 col-md-4 text-black-90">
        <p class="text-weight-bold no-margin">Plan de inversión genérico</p>
        <p class="text-weight-medium no-margin">
          {{ formData.fiduciary_investment_plan?.code || '-' }}
        </p>
      </div>

      <div class="col-12 col-md-4 text-black-90">
        <p class="text-weight-bold no-margin">Saldo plan de inversión</p>
        <p class="text-weight-medium no-margin">
          {{
            formatCurrencyString(formData.fiduciary_investment_plan?.balance) ||
            '-'
          }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Interfaces
import { IGenericInvestmentPlansLegalizeResponse } from '@/interfaces/customs/fics/GenericInvestmentPlans'
import { ActionType } from '@/interfaces/global'

// Logic view
import useInformationLegalization from '@/components/Forms/Fics/GenericInvestmentPlans/LegalizationResources/InformationLegalization/InformationLegalization'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IGenericInvestmentPlansLegalizeResponse | null
  }>(),
  {}
)

const { formData, formatCurrencyString } = useInformationLegalization(props)
</script>
