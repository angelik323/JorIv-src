<template>
  <q-form ref="basicDataFormRef" class="q-pa-xl">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-lg">
        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Código</p>
            <p class="text-weight-medium no-margin">
              {{ models.code ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Estado</p>
            <p class="text-weight-medium no-margin">
              <ShowStatus
                :type="models.status_id ?? 1"
                class-custom="q-px-sm q-py-xs"
              />
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Nombre</p>
            <p class="text-weight-medium no-margin">
              {{ models.name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Tipo de desembolso
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.disbursement_type_label ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Subtipo de comprobante contable causación
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.accounting_accrual_subtype_label ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              ¿Maneja presupuesto?
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.has_handle_budget ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Documento presupuestal a referenciar
            </p>
            <p class="text-weight-medium no-margin">
              {{
                models.budget_reference_document_type_label ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Documento presupuestal a generar
            </p>
            <p class="text-weight-medium no-margin">
              {{
                models.budget_generate_document_type_label ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Movimiento presupuestal a generar
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.budget_generate_movement_label ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              ¿Solicita factura?
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.has_requests_invoice ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              ¿Ejecución de contratos?
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.has_contract_execution ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              ¿Válida acta final?
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.has_validates_final_act ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              ¿Genera causación?
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.has_generates_accrual ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              ¿Cumplimiento sin tesorería?
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.has_generates_treasury ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Movimiento de tesorería pagos fondos
            </p>
            <p class="text-weight-medium no-margin">
              {{
                models.treasury_funds_payment_movement_label ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Movimiento de tesorería pagos cuentas bancarias
            </p>
            <p class="text-weight-medium no-margin">
              {{
                models.treasury_bank_payment_movement_label ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">¿Amortiza fondo?</p>
            <p class="text-weight-medium no-margin">
              {{ models.has_amortizes_fund ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Código de movimiento de fondo
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.fund_movement_code_label ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>

      <q-separator v-if="models.has_amortizes_fund" class="mt-1" />
    </section>
  </q-form>
</template>

<script setup lang="ts">
// components
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// interfaces
import { IMovementManagementForm } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

// logic view
import useBasicDataView from './BasicDataView'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IMovementManagementForm | null
  }>(),
  {}
)

const { basicDataFormRef, models } = useBasicDataView(props)

defineExpose({
  validateForm: () => basicDataFormRef.value?.validate(),
})
</script>
