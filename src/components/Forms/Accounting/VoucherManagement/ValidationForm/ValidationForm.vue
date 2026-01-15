<template>
  <q-form
    role="form"
    ref="basicDataFormRef"
    aria-label="Formulario de datos básicos"
  >
    <section aria-label="Sección de formulario de datos básicos">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            v-if="['create'].includes(action)"
            :default_value="models.period_date"
            label="Periodo"
            mask="YYYY-MM"
            placeholder="AAAA-MM"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'La fecha es requerida'),
              (val: string) => useRules().valid_format_date(val, 'YYYY-MM'),
            ]"
            @update:model-value="models.period_date = $event"
          />
          <div v-else class="text-black-90 mb-4">
            <p class="no-margin text-weight-bold">Periodo</p>
            <p class="text-weight-medium">
              {{ models.period_date || '-' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create'].includes(action)"
            :default_value="models.structure"
            label="Estructura contable"
            :manual_option="selectsOptions.account_structures"
            placeholder="Seleccione una estructura contable"
            map_options
            required
            :clearable="false"
            :auto_complete="true"
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'La estructura contable es requerida'),
            ]"
            @update:model-value="onChangeStructure"
          />
          <div v-else class="text-black-90 mb-4">
            <p class="no-margin text-weight-bold">Estructura contable</p>
            <p class="text-weight-medium">
              {{ models.structure || '-' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create'].includes(action)"
            :default_value="descriptionsFields.accounting_structure_purpose"
            label="Nombre de la estructura"
            placeholder="-"
            required
            disabled
          />
          <div v-else class="text-black-90 mb-4">
            <p class="no-margin text-weight-bold">Nombre de la estructura</p>
            <p class="text-weight-medium">
              {{ descriptionsFields.accounting_structure_purpose || '-' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create'].includes(action)"
            :default_value="models.from_business_trust_id"
            label="Desde negocio"
            :manual_option="selectsOptions.business_trusts"
            placeholder="Seleccione un negocio"
            map_options
            required
            :clearable="false"
            :auto_complete="true"
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'El desde negocio es requerido'),
            ]"
            @update:model-value="onChangeFromBusiness"
          />
          <div v-else class="text-black-90 mb-4">
            <p class="no-margin text-weight-bold">Desde negocio</p>
            <p class="text-weight-medium">
              {{ models.from_business_trust_id || '-' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create'].includes(action)"
            :default_value="descriptionsFields.from_business_description"
            label="Nombre del negocio"
            placeholder="-"
            required
            disabled
          />
          <div v-else class="text-black-90 mb-4">
            <p class="no-margin text-weight-bold">Nombre del negocio</p>
            <p class="text-weight-medium">
              {{ descriptionsFields.from_business_description || '-' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create'].includes(action)"
            :default_value="models.to_business_trust_id"
            label="Hasta negocio"
            :manual_option="selectsOptions.business_trusts"
            placeholder="Seleccione un negocio"
            map_options
            required
            :clearable="false"
            :auto_complete="true"
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'El hasta negocio es requerido'),
            ]"
            @update:model-value="onChangeToBusiness"
          />
          <div v-else class="text-black-90 mb-4">
            <p class="no-margin text-weight-bold">Hasta negocio</p>
            <p class="text-weight-medium">
              {{ models.to_business_trust_id || '-' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create'].includes(action)"
            :default_value="descriptionsFields.to_business_description"
            label="Nombre del negocio"
            placeholder="-"
            required
            disabled
          />
          <div v-else class="text-black-90 mb-4">
            <p class="no-margin text-weight-bold">Nombre del negocio</p>
            <p class="text-weight-medium">
              {{ descriptionsFields.to_business_description || '-' }}
            </p>
          </div>
        </div>
        <div class="col-12 q-mb-md">
          <q-separator />
        </div>
      </div>
    </section>
  </q-form>
</template>
<script lang="ts" setup>
// Interfaces
import { ActionType } from '@/interfaces/global'
import { IVoucherManagementValidationForm } from '@/interfaces/customs/accounting/VoucherManagement'

// Composables
import { useRules } from '@/composables'

// Components
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

// Logic form
import useValidationForm from '@/components/Forms/Accounting/VoucherManagement/ValidationForm/ValidationForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IVoucherManagementValidationForm | null
  }>(),
  {}
)

const {
  models,
  basicDataFormRef,
  selectsOptions,
  descriptionsFields,
  onChangeStructure,
  onChangeFromBusiness,
  onChangeToBusiness,
} = useValidationForm(props.action, props.data)

defineExpose({
  getValues: () => models.value,
  validateForm: () => basicDataFormRef.value?.validate(),
})
</script>
