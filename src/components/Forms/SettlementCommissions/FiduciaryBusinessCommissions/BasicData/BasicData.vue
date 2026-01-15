<template>
  <q-form ref="formElementRef">
    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Código de negocio fiduciario"
            :default_value="models.business_code"
            :manual_option="business_trusts_value_is_code"
            map_options
            auto_complete
            required
            :disabled="['edit'].includes(action)"
            :rules="[(val: string) => is_required(val,  'El código de negocio fiduciario es requerido')]"
            @update:modelValue="handleBusinessCodeChange"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código de negocio fiduciario</p>
            <p class="text-weight-medium no-margin">{{ models.business_code ?? 'No registrado' }}</p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Nombre del negocio fiduciario"
            :default_value="models.name"
            disabled
            required
            :rules="[
              (val: string) => is_required(val, 'El nombre del negocio fiduciario es requerido'),
              (val: string) => max_length(val, 150),
              (val: string) => only_alphanumeric(val),
            ]"
            @update:model-value="handleBusinessNameChange"
          />
          <p v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nombre del negocio fiduciario</p>
            <p class="text-weight-medium no-margin">{{ models.name ?? 'No registrado' }}</p>
          </p>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Clase de comisión"
            :default_value="models.commission_class_catalog_id"
            :manual_option="commission_types"
            map_options
            auto_complete
            required
            :rules="[(val: string) => is_required(val,  'La clase de comisión es requerida')]"
            @update:modelValue="handleCommissionTypeChange"
          />
          <p v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Clase de comisión</p>
            <p class="text-weight-medium no-margin">
              {{ models.commission_class_catalog_name && models.commission_type_description 
                ? `${models.commission_class_catalog_name} - ${models.commission_type_description}`
                : 'No registrado' }}
            </p>
          </p>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Tipo de comisión"
            :default_value="models.commission_type_catalog_id"
            :manual_option="commissions_type_catalog"
            map_options
            auto_complete
            required
            disabled
            :rules="[]"
            @update:modelValue="models.commission_type_catalog_id = $event"
          />
          <p v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de comisión</p>
            <p class="text-weight-medium no-margin">{{ models.commission_type_catalog_name ?? 'No registrado' }}</p>
          </p>
        </div>

        <div class="col-12 col-md-4" v-if="['create'].includes(action)">
          <GenericInput
            v-if="['create'].includes(action)"
            label="Descripción"
            :default_value="models.observation"
            required
            disabled
            :rules="[
              (val: string) => is_required(val, 'La descripción es requerida'),
              (val: string) => max_length(val, 300),
              (val: string) => only_alphanumeric(val),
            ]"
            @update:model-value="models.observation = $event"
          />
          <p v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Descripción</p>
            <p class="text-weight-medium no-margin">{{ models.observation ?? 'No registrado' }}</p>
          </p>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Tercero a facturar"
            :default_value="models.third_party_billings_id"
            :manual_option="third_party_billings"
            map_options
            auto_complete
            required
            :rules="[(val: string) => is_required(val, 'El tercero a facturar es requerido')]"
            :disabled="['edit'].includes(action) && models.comission_settlement_statuses_id === 67"
            @update:modelValue="models.third_party_billings_id = $event"
          />
          <p v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tercero a facturar</p>
            <p class="text-weight-medium no-margin">
              {{
              models.third_party_billings
                ? models.third_party_billings.third_party_document_type + ' - ' +
                  models.third_party_billings.third_party_document + ' - ' +
                  models.third_party_billings.third_party_name
                : 'No registrado'
              }}
            </p>
          </p>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Periodicidad"
            :default_value="models.periodicity"
            :manual_option="periodicities"
            map_options
            auto_complete
            required
            :rules="[(val: string) => is_required(val,  'La periodicidad es requerida')]"
            @update:modelValue="models.periodicity = $event"
          />
          <p v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Periodicidad</p>
            <p class="text-weight-medium no-margin">{{ models.periodicity ?? 'No registrado' }}</p>
          </p>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Cobro"
            :default_value="models.colllection"
            :manual_option="collections_options"
            map_options
            auto_complete
            required
            :rules="[(val: string) => is_required(val,  'El cobro es requerido')]"
            @update:modelValue="models.colllection = $event"
          />
          <p v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Cobro</p>
            <p class="text-weight-medium no-margin">{{ models.colllection ?? 'No registrado' }}</p>
          </p>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="IVA"
            :default_value="models.iva"
            :manual_option="business_trust_yes_no"
            map_options
            auto_complete
            required
            :rules="[(v: string) =>  is_required(v,  'El IVA es requerido')]"
            @update:modelValue="models.iva = $event"
          />
           <p v-else class="text-black-90">
            <p class="text-weight-bold no-margin">IVA</p>
            <p class="text-weight-medium no-margin">{{ models.iva ? 'Sí' : 'No' }}</p>
          </p>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'

import { business_trust_yes_no, collections_options } from '@/constants'

import { IFiduciaryBusinessCommissionsForm } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

import useBasicDataForm from '@/components/Forms/SettlementCommissions/FiduciaryBusinessCommissions/BasicData/BasicData'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IFiduciaryBusinessCommissionsForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IFiduciaryBusinessCommissionsForm | null): void
}>()

const { 
  formElementRef,
  models,
  is_required,
  max_length,
  only_alphanumeric,
  business_trusts_value_is_code,
  third_party_billings,
  commission_types,
  commissions_type_catalog,
  periodicities,

  handleBusinessCodeChange,
  handleBusinessNameChange,
  handleCommissionTypeChange,
} = useBasicDataForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
