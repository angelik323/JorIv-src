<template>
  <q-form ref="formElementRef" class="q-pa-lg">
    <section>
      <p class="text-black-90 text-weight-bold text-h6">Datos principales</p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <!-- Negocio consolidador -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Negocio consolidador</p>
            <p class="text-weight-medium no-margin">
              {{ models.consolidator_business ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Negocio -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Negocio</p>
            <p class="text-weight-medium no-margin">
              {{ models.business || 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Categoría -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Categoría</p>
            <p class="text-weight-medium no-margin">
              {{ models.category || 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Spacer vacío -->
        <div class="col-xs-12 col-sm-6 col-md-3"></div>

        <!-- Etapa -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Etapa</p>
            <p class="text-weight-medium no-margin">
              {{ models.stage?.name || 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Tipo de contrato -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de contrato</p>
            <p class="text-weight-medium no-margin">
              {{ models.contract_type || 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Estado -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Estado</p>
            <p class="text-weight-medium no-margin">
              {{ models.status?.name || 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Modalidad -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Modalidad</p>
            <p class="text-weight-medium no-margin">
              {{ models.modality || 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Moneda del contrato -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Moneda del contrato</p>
            <p class="text-weight-medium no-margin">
              {{ models.currency || 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Número de contrato principal -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Número de contrato principal</p>
            <p class="text-weight-medium no-margin">
              {{ models.main_contract_number || 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Número de contrato adición -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Número de contrato adición</p>
            <p class="text-weight-medium no-margin">
              {{ models.addition_contract_number ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Valor acumulado del contrato -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Valor acumulado del contrato</p>
            <p class="text-weight-medium no-margin">
              {{ models.accumulated_contract_value || 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Contratista -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Contratista</p>
            <p class="text-weight-medium no-margin">
              {{ models.contractor ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Fecha de registro -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha de registro</p>
            <p class="text-weight-medium no-margin">
              {{ models.created_at || 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Número interno -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Número interno</p>
            <p class="text-weight-medium no-margin">
              {{ models.internal_number ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Nombre del contrato -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Nombre del contrato</p>
            <p class="text-weight-medium no-margin">
              {{ models.contract_name || 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Objeto del contrato -->
        <div class="col-xs-12">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Objeto del contrato</p>
            <p class="text-weight-medium no-margin">
              {{ models.object || 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Fecha de suscripción -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha de suscripción</p>
            <p class="text-weight-medium no-margin">
              {{ models.subscription_date || 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Duración -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Duración</p>
            <p class="text-weight-medium no-margin">
              {{ models.duration || 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Fecha inicio de ejecución -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha inicio de ejecución</p>
            <p class="text-weight-medium no-margin">
              {{ models.execution_start_date || 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Fecha finalización de contrato -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha finalización de contrato</p>
            <p class="text-weight-medium no-margin">
              {{ models.execution_end_date || 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Monto extranjero -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Monto extranjero</p>
            <p class="text-weight-medium no-margin">
              {{ models.foreign_amount || 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- TRM -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">TRM</p>
            <p class="text-weight-medium no-margin">
              {{ models.trm || 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- ¿Aplica impuesto de timbre? -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">¿Aplica impuesto de timbre?</p>
            <p class="text-weight-medium no-margin">
              {{ models.has_stamp_tax ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <!-- ¿Requiere publicación? -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">¿Requiere publicación?</p>
            <p class="text-weight-medium no-margin">
              {{ models.requires_publication ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <!-- Código plan de obras -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Código plan de obras</p>
            <p class="text-weight-medium no-margin">
              {{ models.codigo_plan_obra ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Observaciones o notas internas -->
        <div class="col-xs-12">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Observaciones o notas internas</p>
            <p class="text-weight-medium no-margin">
              {{ models.internal_notes || 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Rol supervisor del contrato 1 -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Rol supervisor del contrato 1</p>
            <p class="text-weight-medium no-margin">
              {{ models.supervision_role || 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Supervisor del contrato 1 -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Supervisor del contrato 1</p>
            <p class="text-weight-medium no-margin">
              {{ models.supervision1 ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Rol supervisor del contrato 2 -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Rol supervisor del contrato 2</p>
            <p class="text-weight-medium no-margin">
              {{ models.other_supervision_role || 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Supervisor del contrato 2 -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Supervisor del contrato 2</p>
            <p class="text-weight-medium no-margin">
              {{ models.supervision2 ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- Lugar de ejecución -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Lugar de ejecución</p>
            <p class="text-weight-medium no-margin">
              {{ models.execution_city_id || 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script lang="ts" setup>

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IGeneralContractInquiryForm } from '@/interfaces/customs/derivative-contracting/GeneralContractInquiry'

// Logic form
import useBasicDataForm from '@/components/Forms/DerivativeContracting/GeneralContractInquiryForm/BasicData/BasicDataForm'

const emit = defineEmits<{
  (e: 'update:basic-data-form'): void
}>()

const props = withDefaults(
  defineProps<{
    action: ActionType
    basicDataForm?: IGeneralContractInquiryForm | null
  }>(),
  {}
)

const {
  models,
  formElementRef,
} = useBasicDataForm(props, emit)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>

