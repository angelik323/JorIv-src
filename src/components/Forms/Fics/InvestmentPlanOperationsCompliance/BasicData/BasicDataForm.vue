<template>
  <div>
    <q-form ref="basicDataForm">
      <section>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-lg items-end">
          <div class="col-12 col-md-3 text-black-90">
            <p class="text-weight-bold mb-3">Operación</p>
            <p class="text-weight-medium no-margin">
              {{ basicData.type }}
            </p>
          </div>

          <div class="col-12 col-md-3 text-black-90">
            <p class="text-weight-bold mb-3">
              {{ basicData.type === 'aporte' ? 'Aportes' : 'Retiros' }}
            </p>
            <p class="text-weight-medium no-margin">
              {{
                basicData.subtype === 'cancelacion'
                  ? 'cancelación'
                  : basicData.subtype
              }}
            </p>
          </div>

          <div class="col-12 col-md-3 text-black-90">
            <p class="text-weight-bold mb-3">Fecha registro</p>
            <p class="text-weight-medium no-margin">
              {{ basicData.request_date ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-3 text-black-90">
            <p class="text-weight-bold mb-3">Solicitud de operación</p>
            <p class="text-weight-medium no-margin">
              {{ basicData.operation_request ?? 'No registrado' }}
            </p>
          </div>
          <div class="col-12 col-md-3 text-black-90">
            <p class="text-weight-bold mb-3">Código fondo de inversión</p>
            <p class="text-weight-medium no-margin">
              {{ basicData.fund_code ?? 'No registrado' }}
            </p>
          </div>
          <div class="col-12 col-md-3 text-black-90">
            <p class="text-weight-bold mb-3">Descripción fondo de inversión</p>
            <p class="text-weight-medium no-margin">
              {{ basicData.fund_name ?? 'No registrado' }}
            </p>
          </div>
          <div class="col-12 col-md-3 text-black-90">
            <p class="text-weight-bold mb-3">Fecha de operación</p>
            <p class="text-weight-medium no-margin">
              {{ basicData.operation_date ?? 'No registrado' }}
            </p>
          </div>
          <div class="col-12 col-md-3 text-black-90">
            <p class="text-weight-bold mb-3">Negocio</p>
            <p class="text-weight-medium no-margin">
              {{ basicData.business_trust_code ?? 'No registrado' }}
            </p>
          </div>
          <div class="col-12 col-md-3 text-black-90">
            <p class="text-weight-bold mb-3">Descripción negocio</p>
            <p class="text-weight-medium no-margin">
              {{ basicData.business_trust_name ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-12 col-md-3 text-black-90"
            v-if="basicData.type === 'cancelacion'"
          >
            <p class="text-weight-bold mb-3">Oficina</p>
            <p class="text-weight-medium no-margin">
              {{ basicData.office_code ?? 'No registrado' }}
            </p>
          </div>
          <div
            class="col-12 col-md-3 text-black-90"
            v-if="basicData.type === 'cancelacion'"
          >
            <p class="text-weight-bold mb-3">Descripción oficina</p>
            <p class="text-weight-medium no-margin">
              {{ basicData.office ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-3 text-black-90">
            <p class="text-weight-bold mb-3">Plan de inversión</p>
            <p class="text-weight-medium no-margin">
              {{ basicData.investment_plan ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-3 text-black-90">
            <p class="text-weight-bold mb-3">Código de negocio / fondo</p>
            <p class="text-weight-medium no-margin">
              {{
                basicData.plan_business_trust_code
                  ? basicData.plan_business_trust_code
                  : 'No registrado'
              }}
            </p>
          </div>

          <div
            class="col-12 col-md-3 text-black-90"
            v-if="basicData.type === 'aporte'"
          >
            <p class="text-weight-bold mb-3">Saldo</p>
            <p class="text-weight-medium no-margin">
              {{
                formatCurrencyString(basicData.plan_balance) ?? 'No registrado'
              }}
            </p>
          </div>
          <div class="col-12 col-md-3 text-black-90">
            <p class="text-weight-bold mb-3">Identificación titular</p>
            <p class="text-weight-medium no-margin">
              {{
                basicData.holder_identification
                  ? basicData.holder_identification
                  : 'No registrado'
              }}
            </p>
          </div>
          <div class="col-12 col-md-3 text-black-90">
            <p class="text-weight-bold mb-3">Nombre titular</p>
            <p class="text-weight-medium no-margin">
              {{
                basicData.holder_name ? basicData.holder_name : 'No registrado'
              }}
            </p>
          </div>
          <div class="col-12 col-md-3 text-black-90">
            <p class="text-weight-bold mb-3">Valor de la operación</p>
            <p class="text-weight-medium no-margin">
              {{
                formatCurrencyString(basicData.operation_value) ??
                'No registrado'
              }}
            </p>
          </div>
          <div class="col-12 col-md-3 text-black-90">
            <p class="text-weight-bold mb-3">Saldo máximo de inversión</p>
            <p class="text-weight-medium no-margin">
              {{
                formatCurrencyString(basicData.maximum_value) ?? 'No registrado'
              }}
            </p>
          </div>
        </div>
      </section>
    </q-form>
  </div>
</template>
<script setup lang="ts">
// Interfaces
import { IInvestmentPlanOperationResponse } from '@/interfaces/customs/fics/InvestmentPlanOperations'

// Logic view
import useBasicDataForm from '@/components/Forms/Fics/InvestmentPlanOperationsCompliance/BasicData/BasicDataForm'

defineExpose({
  validateForm: () => validateInvestmentPlanOperation(),
})
const props = withDefaults(
  defineProps<{
    data?: IInvestmentPlanOperationResponse
  }>(),
  {}
)

const {
  basicData,
  basicDataForm,
  validateInvestmentPlanOperation,
  formatCurrencyString,
} = useBasicDataForm(props)
</script>
