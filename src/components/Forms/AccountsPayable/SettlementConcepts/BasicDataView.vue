<template>
  <q-form ref="basicDataFormRef" class="q-pa-xl">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-lg">
        <div class="col-12 col-md-6">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Estructura contable
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.structure_label ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Concepto</p>
            <p class="text-weight-medium no-margin">
              {{ models.concept_code ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Descripción</p>
            <p class="text-weight-medium no-margin">
              {{ models.description ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Tipo</p>
            <p class="text-weight-medium no-margin">
              {{ models.type ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">¿Aplica IVA?</p>
            <p class="text-weight-medium no-margin">
              {{ models.apply_iva ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Clase</p>
            <p class="text-weight-medium no-margin">
              {{ models.class_label ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Fila 4 -->
        <div class="col-12 col-md-6">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Porcentaje</p>
            <p class="text-weight-medium no-margin">
              {{ models.percentage ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              ¿Bases mínimas en UVT?
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.has_minimum_uvt ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <div v-if="models.has_minimum_uvt" class="col-12 col-md-6">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Base mínima retención en la fuente en UVT
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.min_withholding_uvt ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div v-if="models.has_minimum_uvt" class="col-12 col-md-6">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Base mínima retención de IVA en UVT
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.min_withholding_iva_uvt ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div v-if="!models.has_minimum_uvt" class="col-12 col-md-6">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Base mínima retención en la fuente en pesos
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.min_withholding_pesos ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div v-if="!models.has_minimum_uvt" class="col-12 col-md-6">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Base mínima retención de IVA en pesos
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.min_withholding_iva_pesos ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Cuenta contable concepto
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.plan_account_label ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Descripción cuenta contable concepto
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.plan_account_label ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div v-if="!isITETax" class="col-12 col-md-6">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Cuenta contable pasivo
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.liability_account_label ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div v-if="!isITETax" class="col-12 col-md-6">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Descripción cuenta contable pasivo
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.liability_account_label ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div v-if="!isITETax" class="col-12 col-md-6">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Cuenta contable gasto
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.expense_account_label ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div v-if="!isITETax" class="col-12 col-md-6">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Descripción cuenta contable gasto
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.expense_account_label ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Fila 10 -->
        <div class="col-12 col-md-6">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Cargo fiscal</p>
            <p class="text-weight-medium no-margin">
              {{ models.fiscal_charge_label ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div v-if="!isITETax" class="col-12 col-md-6">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Cuenta contable notas créditos periodos anteriores
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.credit_notes_account_label ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-6">
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
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// components
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// interfaces
import { ISettlementConceptsForm } from '@/interfaces/customs/accounts-payable/SettlementConcepts'
import { ActionType } from '@/interfaces/global'

// logic view
import useBasicDataView from '@/components/Forms/AccountsPayable/SettlementConcepts/BasicDataView'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: ISettlementConceptsForm | null
  }>(),
  {}
)

const { basicDataFormRef, models, isITETax } = useBasicDataView(props)

defineExpose({
  validateForm: () => basicDataFormRef.value?.validate(),
})
</script>
