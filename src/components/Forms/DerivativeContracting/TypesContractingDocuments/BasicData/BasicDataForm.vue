<template>
  <q-form ref="formElementRef" class="q-pa-lg">
    <section>
      <p class="text-black-10 text-weight-bold text-h6">Datos principales</p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Código del documento"
            :default_value="models.document_code"
            required
            :disabled="action === 'edit'"
            :rules="[
              (val: string) => useRules().is_required(val, 'El código del documento es requerido'),
              (val: string) => useRules().max_length(val, 3),
              (val: string) => useRules().only_alphanumeric(val, true)
            ]"
            @update:model-value="models.document_code = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código del documento</p>
            <p class="text-weight-medium no-margin">
              {{ models.document_code ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Nombre del documento contractual"
            :default_value="models.document_name"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El nombre del documento es requerido'),
              (val: string) => useRules().max_length(val, 60),
              (val: string) => useRules().only_alphanumeric(val, true)
            ]"
            @update:model-value="models.document_name = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Nombre del documento contractual
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.document_name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Categoría"
            :default_value="models.category"
            :manual_option="contract_type_category"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :disabled="action === 'edit'"
            :required="true"
            :rules="[(val: string) => useRules().is_required(val, 'La categoría es requerida')]"
            @update:modelValue="models.category = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Categoría</p>
            <p class="text-weight-medium no-margin">
              {{ models.category ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Tipo de numeración"
            :default_value="models.numbering_type"
            :manual_option="contract_type_numbering_type"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :disabled="action === 'edit'"
            :required="true"
            :rules="[(val: string) => useRules().is_required(val, 'El tipo de numeración es requerido')]"
            @update:modelValue="handleNumerationTypeChange"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de numeración</p>
            <p class="text-weight-medium no-margin">
              {{
                contract_type_numbering_type.find(
                  (item) => item.value === models.numbering_type
                )?.label ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Tipo de numeración por negocio"
            :default_value="models.business_numbering_type"
            :manual_option="contract_type_business_numbering_type"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :disabled="action === 'edit' || !showBusinessNumerationType"
            :required="showBusinessNumerationType"
            :rules="showBusinessNumerationType ? [(val: string) => useRules().is_required(val, 'El tipo de numeración por negocio es requerido')] : []"
            @update:modelValue="models.business_numbering_type = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Tipo de numeración por negocio
            </p>
            <p class="text-weight-medium no-margin">
              {{
                contract_type_business_numbering_type.find(
                  (item) => item.value === models.business_numbering_type
                )?.label ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Valor del contrato expresado en"
            :default_value="models.contract_value_in"
            :manual_option="contract_type_valuein"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :required="true"
            :rules="[(val: string) => useRules().is_required(val, 'El valor del contrato es requerido')]"
            @update:modelValue="models.contract_value_in = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Valor del contrato expresado en
            </p>
            <p class="text-weight-medium no-margin">
              {{
                contract_type_valuein.find(
                  (item) => item.value === models.contract_value_in
                )?.label ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Monto máximo permitido"
            :default_value="models.max_amount_allowed"
            :manual_option="contract_type_max_amount_allowed"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :required="true"
            :rules="[(val: string) => useRules().is_required(val, 'El monto máximo permitido es requerido')]"
            @update:modelValue="handleMaxAmountTypeChange"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Monto máximo permitido</p>
            <p class="text-weight-medium no-margin">
              {{
                contract_type_max_amount_allowed.find(
                  (item) => item.value === models.max_amount_allowed
                )?.label ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6">
          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            label="Valor máximo permitido"
            :hide-icon="!isLocalCurrency"
            v-model="models.max_allowed_value"
            :currency="'COP'"
            placeholder="-"
            :disabled="!showMaxAllowedValue"
            :required="showMaxAllowedValue"
            :rules="[
            (v: string) => useRules().is_required(v, 'El valor máximo permitido es requerido'),
            (v: string) => useRules().only_number_with_max_integers_and_decimals_ignore_symbols(v, 15, 2),
          ]"
            @update:model-value="models.max_allowed_value = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor máximo permitido</p>
            <p class="text-weight-medium no-margin">
              {{ models.max_allowed_value ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div
          v-if="['edit', 'view'].includes(action)"
          class="col-xs-12 col-sm-12 col-md-6"
        >
          <GenericSelectorComponent
            v-if="['edit'].includes(action)"
            label="Estado"
            :default_value="models.status_id"
            :manual_option="type_contract_status"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El valor máximo permitido es requerido'),
              (val: string) => useRules().max_length(val, 15)
            ]"
            @update:model-value="models.status_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Estado</p>
            <p class="text-weight-medium no-margin">
              {{
                type_contract_status.find(
                  (item) => item.value === models.status_id
                )?.label ?? 'No registrado'
              }}
            </p>
          </div>
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-xs-12 col-sm-12 col-md-4">
          <RadioYesNo
            v-model="models.has_work_plan"
            label="¿Maneja Plan de Obras?"
            :isRadioButton="false"
            :hasTitle="false"
            :hasSubtitle="false"
            :isDisabled="['view'].includes(action)"
            classCheck="text-black-90"
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4">
          <RadioYesNo
            v-model="models.has_supervisor"
            label="¿Maneja supervisor?"
            :isRadioButton="false"
            :hasTitle="false"
            :hasSubtitle="false"
            :isDisabled="['view'].includes(action)"
            classCheck="text-black-90"
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4">
          <RadioYesNo
            v-model="models.has_stamp_tax"
            label="¿Maneja impuesto de timbre?"
            :isRadioButton="false"
            :hasTitle="false"
            :hasSubtitle="false"
            :isDisabled="['view'].includes(action)"
            classCheck="text-black-90"
          />
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Tipo de contrato"
            :default_value="models.contract_type"
            :manual_option="contract_type"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :required="true"
            :rules="[(val: string) => useRules().is_required(val, 'El tipo de contrato es requerido')]"
            @update:modelValue="models.contract_type = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de contrato</p>
            <p class="text-weight-medium no-margin">
              {{
                contract_type.find(
                  (item) => item.value === models.contract_type
                )?.label ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Modalidad"
            :default_value="models.modality"
            :manual_option="contract_type_modality"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :required="true"
            :rules="[(val: string) => useRules().is_required(val, 'La modalidad es requerida')]"
            @update:modelValue="models.modality = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Modalidad</p>
            <p class="text-weight-medium no-margin">
              {{
                contract_type_modality.find(
                  (item) => item.value === models.modality
                )?.label ?? 'No registrado'
              }}
            </p>
          </div>
        </div>
      </div>

      <div class="q-mt-xl">
        <p class="text-black-10 text-weight-bold text-h6">
          Información presupuestal
        </p>

        <div class="col-xs-12">
          <p class="text-black-10 text-weight-bold text-subtitle1">
            Asignación presupuestal asignada
          </p>
        </div>

        <div class="row q-col-gutter-x-lg q-col-gutter-y-md q-mb-lg">
          <div class="col-xs-12 col-sm-12 col-md-4">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Documento a generar"
              :default_value="models.bud_document_id"
              :manual_option="budget_document_types"
              map_options
              first_filter_option="label"
              second_filter_option="label"
              auto_complete
              :required="false"
              :rules="[]"
              @update:modelValue="models.bud_document_id = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Documento a generar</p>
              <p class="text-weight-medium no-margin">
                {{
                  budget_document_types.find(
                    (item) => item.value === models.bud_document_id
                  )?.label ?? 'No registrado'
                }}
              </p>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Código de movimiento a generar"
              :default_value="models.bud_movement_id"
              :manual_option="code_movements_types_contracting"
              map_options
              first_filter_option="label"
              second_filter_option="label"
              auto_complete
              :required="false"
              :rules="[]"
              @update:modelValue="models.bud_movement_id = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">
                Código de movimiento a generar
              </p>
              <p class="text-weight-medium no-margin">
                {{
                  code_movements_types_contracting.find(
                    (item) => item.value === models.bud_movement_id
                  )?.label ?? 'No registrado'
                }}
              </p>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Vigencia presupuestal"
              :default_value="models.budget_validity"
              :manual_option="contract_type_status_budget_validy"
              map_options
              first_filter_option="label"
              second_filter_option="label"
              :disabled="action === 'edit'"
              :required="false"
              :rules="[]"
              @update:modelValue="handleBudgetValidityChange"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Vigencia presupuestal</p>
              <p class="text-weight-medium no-margin">
                {{
                  contract_type_status_budget_validy.find(
                    (item) => item.value === models.budget_validity
                  )?.label ?? 'No registrado'
                }}
              </p>
            </div>
          </div>
        </div>

        <div
          v-if="showAvailabilityCommitmentFields"
          class="row q-col-gutter-x-lg q-col-gutter-y-md q-mb-lg"
        >
          <div class="col-xs-12">
            <p class="text-black-10 text-weight-bold text-subtitle1">
              Generación del documento presupuestal - Nivel "Disponibilidad"
            </p>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Documento a generar - disponibilidad"
              :default_value="models.avail_document_id"
              :manual_option="budget_document_types"
              map_options
              first_filter_option="label"
              second_filter_option="label"
              auto_complete
              :required="false"
              :rules="[]"
              @update:modelValue="models.avail_document_id = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">
                Documento a generar - disponibilidad
              </p>
              <p class="text-weight-medium no-margin">
                {{
                  budget_document_types.find(
                    (item) => item.value === models.avail_document_id
                  )?.label ?? 'No registrado'
                }}
              </p>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Código de movimiento a generar - disponibilidad"
              :default_value="models.avail_movement_id"
              :manual_option="code_movements_types_contracting"
              map_options
              first_filter_option="label"
              second_filter_option="label"
              auto_complete
              :required="false"
              :rules="[]"
              @update:modelValue="models.avail_movement_id = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">
                Código de movimiento a generar - disponibilidad
              </p>
              <p class="text-weight-medium no-margin">
                {{
                  code_movements_types_contracting.find(
                    (item) => item.value === models.avail_movement_id
                  )?.label ?? 'No registrado'
                }}
              </p>
            </div>
          </div>
        </div>

        <div
          v-if="showAvailabilityCommitmentFields"
          class="row q-col-gutter-x-lg q-col-gutter-y-md q-mb-lg"
        >
          <div class="col-xs-12">
            <p class="text-black-10 text-weight-bold text-subtitle1">
              Generación del documento presupuestal - Nivel "Compromiso"
            </p>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Documento a generar - Compromiso"
              :default_value="models.comm_document_id"
              :manual_option="budget_document_types"
              map_options
              first_filter_option="label"
              second_filter_option="label"
              auto_complete
              :required="false"
              :rules="[]"
              @update:modelValue="models.comm_document_id = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">
                Documento a generar - Compromiso
              </p>
              <p class="text-weight-medium no-margin">
                {{
                  budget_document_types.find(
                    (item) => item.value === models.comm_document_id
                  )?.label ?? 'No registrado'
                }}
              </p>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Código de movimiento a generar - Compromiso"
              :default_value="models.comm_movement_id"
              :manual_option="code_movements_types_contracting"
              map_options
              first_filter_option="label"
              second_filter_option="label"
              auto_complete
              :required="false"
              :rules="[]"
              @update:modelValue="models.comm_movement_id = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">
                Código de movimiento a generar - Compromiso
              </p>
              <p class="text-weight-medium no-margin">
                {{
                  code_movements_types_contracting.find(
                    (item) => item.value === models.comm_movement_id
                  )?.label ?? 'No registrado'
                }}
              </p>
            </div>
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
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

// Logic form
import useBasicDataForm from '@/components/Forms/DerivativeContracting/TypesContractingDocuments/BasicData/BasicDataForm'

// Composables
import { useRules } from '@/composables'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { ITypesContractingDocumentsBasicDataForm } from '@/interfaces/customs'

const emit = defineEmits<{
  (e: 'update:basic-data-form'): void
}>()

const props = withDefaults(
  defineProps<{
    action: ActionType
    basicDataForm?: ITypesContractingDocumentsBasicDataForm | null
  }>(),
  {}
)

const {
  models,
  formElementRef,
  showBusinessNumerationType,
  showMaxAllowedValue,
  showAvailabilityCommitmentFields,
  isLocalCurrency,

  contract_type_category,
  contract_type_numbering_type,
  contract_type_business_numbering_type,
  contract_type_valuein,
  contract_type_max_amount_allowed,
  type_contract_status,
  contract_type,
  contract_type_modality,
  contract_type_status_budget_validy,
  budget_document_types,
  code_movements_types_contracting,

  handleNumerationTypeChange,
  handleMaxAmountTypeChange,
  handleBudgetValidityChange,
} = useBasicDataForm(props, emit)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
