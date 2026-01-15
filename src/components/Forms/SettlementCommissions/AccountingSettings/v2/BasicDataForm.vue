<template>
  <q-form ref="formElementRef">
    <section class="q-mt-md">
      <p class="text-black-90 text-weight-bold text-h6">
        Periodo de liquidación
      </p>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(props.action)"
            label="Nombre del negocio"
            :default_value="models.business_code_snapshot"
            :manual_option="business_trusts_billing_trusts"
            map_options
            auto_complete
            return_object
            required
            :rules="[(val: string) => is_required(val,  'El nombre del negocio es requerido')]"
            @update:modelValue="onBusinessChange"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Nombre del negocio</p>
            <p class="text-weight-medium no-margin">
              {{ models.business_name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(props.action)"
            label="Período de liquidación"
            :default_value="models.billing_trusts_id"
            :manual_option="billing_trusts_by_business_code"
            map_options
            auto_complete
            return_object
            required
            :rules="[(val: string) => is_required(val,  'El período de facturación es requerido')]"
            @update:modelValue="onBillingTrustsChange"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Período de liquidación</p>
            <p class="text-weight-medium no-margin">
              {{ models.billing_trusts_name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(props.action)"
            label="Periodicidad"
            :default_value="models.periodicity"
            :manual_option="periodicities"
            map_options
            auto_complete
            required
            disabled
            :rules="[]"
            @update:modelValue="models.periodicity = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Periodicidad</p>
            <p class="text-weight-medium no-margin">
              {{ models.periodicity ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(props.action)"
            label="Fecha inicial"
            disabled
            required
            :default_value="models.start_date"
            :rules="[]"
            @update:modelValue="models.start_date = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Fecha inicial</p>
            <p class="text-weight-medium no-margin">
              {{ models.start_date ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(props.action)"
            label="Fecha final"
            disabled
            required
            :default_value="models.end_date"
            :rules="[]"
            @update:modelValue="models.end_date = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Fecha final</p>
            <p class="text-weight-medium no-margin">
              {{ models.end_date ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <q-separator class="q-my-lg" />

    <section>
      <p class="text-black-90 text-weight-bold text-h6">Párametros contables</p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(props.action)"
            label="Código de movimiento de negocio"
            :default_value="models.business_movement_id_snapshot"
            :manual_option="movement_codes_parameters"
            map_options
            auto_complete
            return_object
            required
            :rules="[(val: string) => is_required(val,  'El código de movimiento de negocio es requerido')]"
            @update:modelValue="onBusinessMovementCodeChange"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">
              Código de movimiento de negocio
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.business_movement_name_snapshot ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(props.action)"
            label="Naturaleza"
            :default_value="models.business_movement_nature_snapshot"
            :manual_option="[]"
            map_options
            auto_complete
            :required="false"
            disabled
            :rules="[]"
            @update:modelValue="
              models.business_movement_nature_snapshot = $event
            "
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Naturaleza</p>
            <p class="text-weight-medium no-margin">
              {{ models.business_movement_nature_snapshot ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(props.action)"
            label="Genera contabilidad"
            :default_value="models.accounts"
            :manual_option="business_trust_yes_no"
            map_options
            auto_complete
            disabled
            :required="false"
            :rules="[]"
            @update:modelValue="models.accounts = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Genera contabilidad</p>
            <p class="text-weight-medium no-margin">
              {{ models.accounts ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(props.action)"
            label="Genera IVA"
            :default_value="models.generates_iva"
            :manual_option="business_trust_yes_no"
            map_options
            auto_complete
            disabled
            required
            :rules="[]"
            @update:modelValue="models.generates_iva = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Genera IVA</p>
            <p class="text-weight-medium no-margin">
              {{ models.generates_iva ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(props.action)"
            label="Porcentaje (%) de IVA"
            :default_value="models.iva"
            disabled
            @update:modelValue="models.iva = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Porcentaje (%) de IVA</p>
            <p class="text-weight-medium no-margin">
              {{ models.iva ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(props.action)"
            label="Retefuente"
            :default_value="models.has_retefuente"
            :manual_option="business_trust_yes_no"
            map_options
            auto_complete
            disabled
            :required="false"
            :rules="[]"
            @update:modelValue="models.has_retefuente = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Retefuente</p>
            <p class="text-weight-medium no-margin">
              {{ models.has_retefuente ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(props.action)"
            label="Porcentaje (%) de retefuente"
            :default_value="models.retefuente"
            disabled
            @update:modelValue="models.retefuente = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">
              Porcentaje (%) de retefuente
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.retefuente ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(props.action)"
            label="ReteICA"
            :default_value="models.has_reteica"
            :manual_option="business_trust_yes_no"
            map_options
            auto_complete
            disabled
            :required="false"
            :rules="[]"
            @update:modelValue="models.has_reteica = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">ReteICA</p>
            <p class="text-weight-medium no-margin">
              {{ models.has_reteica ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(props.action)"
            label="Porcentaje (%) de reteICA"
            :default_value="models.reteica"
            disabled
            @update:modelValue="models.reteica = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Porcentaje (%) de reteICA</p>
            <p class="text-weight-medium no-margin">
              {{ models.reteica ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Rete IVA"
            v-if="['create', 'edit'].includes(props.action)"
            :default_value="models.has_reteiva"
            :manual_option="business_trust_yes_no"
            map_options
            auto_complete
            disabled
            :required="false"
            :rules="[]"
            @update:modelValue="models.has_reteiva = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Rete IVA</p>
            <p class="text-weight-medium no-margin">
              {{ models.has_reteiva ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(props.action)"
            label="Porcentaje (%) de rete IVA"
            :default_value="models.reteiva"
            disabled
            @update:modelValue="models.reteiva = $event"
          />
          <div v-else class="text-black-90 q-my-md">
            <p class="text-weight-bold no-margin">Porcentaje (%) de rete IVA</p>
            <p class="text-weight-medium no-margin">
              {{ models.reteiva ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

// Interfaces
import { IAccountingSettingsInformationFormV2 } from '@/interfaces/customs/settlement-commissions/AccountingSettingsV2'
import { ActionType } from '@/interfaces/global/Action'

// Constants
import { business_trust_yes_no } from '@/constants'

// Logic view
import useBasicDataForm from '@/components/Forms/SettlementCommissions/AccountingSettings/v2/BasicDataForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IAccountingSettingsInformationFormV2 | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IAccountingSettingsInformationFormV2 | null): void
}>()

const {
  formElementRef,
  models,
  is_required,
  business_trusts_billing_trusts,
  movement_codes_parameters,
  periodicities,
  billing_trusts_by_business_code,

  onBusinessChange,
  onBillingTrustsChange,
  onBusinessMovementCodeChange,
} = useBasicDataForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
