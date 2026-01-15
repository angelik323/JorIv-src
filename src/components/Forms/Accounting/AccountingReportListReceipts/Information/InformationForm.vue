<template>
  <q-form ref="formElementRef" :class="`q-pa-xl`">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Título de reporte"
            :default_value="models.report_template_id"
            required
            placeholder="Seleccione"
            :rules="[(val: string) => useRules().is_required(val, 'Título de reporte es requerida')]"
            @update:model-value="models.report_template_id = $event"
            :manual_option="template"
            :map_options="true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Título de reporte</p>
            <p class="text-weight-medium no-margin">
              {{ models.report_template_id ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Usuario"
            :default_value="models.user"
            required
            placeholder="Inserte"
            :rules="[
              (val: string) => useRules().is_required(val, 'Usuario es requerida'),
              (val: string) => useRules().max_length(val, 50),
            ]"
            @update:model-value="models.user = $event"
            :disabled="true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Usuario</p>
            <p class="text-weight-medium no-margin">
              {{ models.user ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Negocio"
            :default_value="models.business_trust_id"
            required
            placeholder="Seleccione"
            :rules="[(val: string) => useRules().is_required(val, 'Negocio es requerida')]"
            @update:model-value="models.business_trust_id = $event"
            :manual_option="business_trusts_with_description"
            :map_options="true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Negocio</p>
            <p class="text-weight-medium no-margin">
              {{ models.business_trust_id ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Estructura contable"
            :default_value="models.accounting_structure_id"
            required
            placeholder="Seleccione"
            :rules="[(val: string) => useRules().is_required(val, 'Estructura contable es requerida')]"
            @update:model-value="models.accounting_structure_id = $event"
            :manual_option="structure_by_business"
            :map_options="true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Estructura contable</p>
            <p class="text-weight-medium no-margin">
              {{ models.accounting_structure_id ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericDateInput
            v-if="['create', 'edit'].includes(action)"
            label="Desde periodo"
            :default_value="models.from_period"
            required
            placeholder="AAAA-MM"
            mask="YYYY-MM"
            :disabled="['edit'].includes(action)"
            :rules="[(val: string) => useRules().is_required(val, 'Desde periodo es requerida')]"
            @update:model-value="models.from_period = $event"
            :manual_option="structure_by_business"
            :map_options="true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Desde periodo</p>
            <p class="text-weight-medium no-margin">
              {{ models.from_period ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInput
            v-if="['create', 'edit'].includes(action)"
            label="Hasta periodo"
            :default_value="models.to_period"
            required
            placeholder="AAAA-MM"
            mask="YYYY-MM"
            :disabled="['edit'].includes(action)"
            :rules="[(val: string) => useRules().is_required(val, 'Hasta periodo es requerida')]"
            @update:model-value="models.to_period = $event"
            :manual_option="structure_by_business"
            :map_options="true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Hasta periodo</p>
            <p class="text-weight-medium no-margin">
              {{ models.to_period ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Desde comprobante"
            :default_value="models.from_receipt_types_id"
            required
            placeholder="Seleccione"
            :rules="[(val: string) => useRules().is_required(val, 'Desde comprobante es requerido')]"
            @update:model-value="models.from_receipt_types_id = $event"
            :manual_option="business_trust_receipt_types"
            :map_options="true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Desde comprobante</p>
            <p class="text-weight-medium no-margin">
              {{ models.from_receipt_types_id ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Hasta comprobante"
            :default_value="models.to_receipt_types_id"
            required
            placeholder="Seleccione"
            :rules="[(val: string) => useRules().is_required(val, 'Hasta comprobante es requerido')]"
            @update:model-value="models.to_receipt_types_id = $event"
            :manual_option="business_trust_receipt_types"
            :map_options="true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Hasta comprobante</p>
            <p class="text-weight-medium no-margin">
              {{ models.to_receipt_types_id ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Desde consecutivo"
            :default_value="models.from_consecutive"
            required
            placeholder="Seleccione"
            :rules="[(val: string) => useRules().is_required(val, 'Desde consecutivo es requerido')]"
            @update:model-value="models.from_consecutive = $event"
            :manual_option="voucher_consecutives_codes"
            :map_options="true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Desde consecutivo</p>
            <p class="text-weight-medium no-margin">
              {{ models.from_consecutive ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Hasta consecutivo"
            :default_value="models.to_consecutive"
            required
            placeholder="Seleccione"
            :rules="[(val: string) => useRules().is_required(val, 'Hasta consecutivo es requerido')]"
            @update:model-value="models.to_consecutive = $event"
            :manual_option="voucher_consecutives_codes"
            :map_options="true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Hasta consecutivo</p>
            <p class="text-weight-medium no-margin">
              {{ models.to_consecutive ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script lang="ts" setup>
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'

// Utils
import { useRules } from '@/composables'
import { ActionType } from '@/interfaces/global'
import { IAccountingReportListReceiptsForm } from '@/interfaces/customs'

// Logic view
import useInformationForm from '@/components/Forms/Accounting/AccountingReportListReceipts/Information/InformationForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IAccountingReportListReceiptsForm | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const {
  business_trusts_with_description,
  business_trust_receipt_types,
  voucher_consecutives_codes,
  structure_by_business,
  formElementRef,
  template,
  models,
} = useInformationForm(props)
defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
