<template>
  <q-form ref="formInformation">
    <section>
      <div class="mx-3 mt-0 mb-3">
        <div class="row q-col-gutter-lg mt-1">
          <div class="col-12 col-md-4" v-if="!['create'].includes(action)">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Código
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.code"
              type="text"
              disabled
              placeholder=""
              :required="false"
            />
            <p v-else class="text-grey-6 mb-3">
              {{ models.code ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Descripción de movimiento{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.description"
              type="text"
              required
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'La descripción es requerida'),
                (v: string) => useRules().max_length(v, 50),
              ]"
              @update:model-value="models.description = $event"
            />
            <p v-else class="text-grey-6 mb-3">
              {{ models.description ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Naturaleza{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :manual_option="movement_codes_natures"
              :map_options="true"
              :required="true"
              :default_value="models.nature"
              :auto_complete="true"
              @update:modelValue="models.nature = $event"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'La naturaleza es requerida'),
              ]"
            />
            <p v-else class="text-grey-6 mb-3">
              {{ models.nature ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Clase de movimiento{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :manual_option="movement_codes_types"
              :map_options="true"
              :required="true"
              :default_value="models.movement"
              :auto_complete="true"
              @update:modelValue="models.movement = $event"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'La clase es requerida'),
              ]"
            />
            <p v-else class="text-grey-6 mb-3">
              {{ models.movement ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Genera contabilidad{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :manual_option="default_yes_no"
              :map_options="true"
              :required="true"
              :default_value="models.has_ganerate_accounting"
              :auto_complete="true"
              @update:modelValue="models.has_ganerate_accounting = $event"
              :rules="[
                (v: boolean) =>
                  useRules().is_required_boolean(
                    v,
                    'La contabilidad es requerida'
                  ),
              ]"
            />
            <p v-else class="text-grey-6 mb-3">
              {{ models.has_ganerate_accounting ? 'Sí' : 'No' }}
            </p>
          </div>

          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Código de movimiento de cancelación{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :manual_option="movement_codes_cancellation_codes"
              :map_options="true"
              :required="!!models.has_ganerate_accounting"
              :default_value="models.has_cancellation_movement_code"
              :auto_complete="true"
              @update:modelValue="
                models.has_cancellation_movement_code = $event
              "
              :readonly="!models.has_ganerate_accounting"
              :rules="models.has_ganerate_accounting ? [
                (v: string) => useRules().is_required(v)
              ]: []"
            />
            <p v-else class="text-grey-6 mb-3">
              {{
                models.has_cancellation_movement_code_name
                  ? models.has_cancellation_movement_code_name
                  : '-'
              }}
            </p>
          </div>

          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Aplica para bienes{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :manual_option="default_yes_no"
              :map_options="true"
              :required="true"
              :default_value="models.applies_to_goods"
              :auto_complete="true"
              @update:modelValue="models.applies_to_goods = $event"
              :rules="[
                (v: boolean) =>
                  useRules().is_required_boolean(v, 'El campo es requerido'),
              ]"
            />
            <p v-else class="text-grey-6 mb-3">
              {{ models.applies_to_goods ? 'Sí' : 'No' }}
            </p>
          </div>

          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Código tipo de bienes{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :manual_option="movement_codes_cancellation_codes"
              :map_options="true"
              :required="models.applies_to_goods ?? false"
              :default_value="models.good_type_code"
              :auto_complete="true"
              :readonly="!models.applies_to_goods"
              @update:modelValue="models.good_type_code = $event"
              :rules="
                models.applies_to_goods
                  ? [
                      (v: string) =>
                        useRules().is_required(v, 'El código es requerido'),
                    ]
                  : []
              "
              ref="good_type_ref"
            />
            <p v-else class="text-grey-6 mb-3">
              {{
                models.good_type_code_name ? models.good_type_code_name : '-'
              }}
            </p>
          </div>

          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Genera IVA{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :manual_option="default_yes_no"
              :map_options="true"
              :required="true"
              :default_value="models.has_iva"
              :auto_complete="true"
              @update:modelValue="models.has_iva = $event"
              :rules="[
                (v: boolean) =>
                  useRules().is_required_boolean(v, 'El campo es requerido'),
              ]"
            />
            <p v-else class="text-grey-6 mb-3">
              {{ models.has_iva ? 'Sí' : 'No' }}
            </p>
          </div>

          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Porcentaje % IVA
              {{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.percentage_iva"
              type="number"
              :required="models.has_iva ?? false"
              :readonly="!models.has_iva"
              :rules="
                models.has_iva
                  ? [
                      (v: string) =>
                        useRules().is_required(v, 'El porcentaje es requerido'),
                      (v: string) => useRules().min_value(v, 1),
                      (v: string) => useRules().max_value(v, 100),
                    ]
                  : []
              "
              @update:model-value="models.percentage_iva = $event"
            />
            <p v-else class="text-grey-6 mb-3">
              {{ models.percentage_iva ? models.percentage_iva : '-' }}
            </p>
          </div>

          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Código movimiento negocio IVA{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :manual_option="movement_codes_cancellation_codes"
              :map_options="true"
              :required="true"
              :default_value="models.iva_movement_code"
              :auto_complete="true"
              :readonly="!models.has_iva"
              @update:modelValue="models.iva_movement_code = $event"
              :rules="
                models.has_iva
                  ? [
                      (v: string) =>
                        useRules().is_required(v, 'El porcentaje es requerido'),
                    ]
                  : []
              "
            />
            <p v-else class="text-grey-6 mb-3">
              {{
                models.iva_movement_code_name
                  ? models.iva_movement_code_name
                  : '-'
              }}
            </p>
          </div>

          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Genera efecto en fondos{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :manual_option="default_yes_no"
              :map_options="true"
              :required="true"
              :default_value="models.has_affects_funds"
              :auto_complete="true"
              @update:modelValue="models.has_affects_funds = $event"
              :rules="[
                (v: boolean) =>
                  useRules().is_required_boolean(v, 'El campo es requerido'),
              ]"
            />
            <p v-else class="text-grey-6 mb-3">
              {{ models.has_affects_funds ? 'Sí' : 'No' }}
            </p>
          </div>

          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Código movimiento fondos{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :manual_option="movements_codes_nfi"
              :map_options="true"
              :required="models.has_affects_funds ?? false"
              :default_value="models.funds_movement_code"
              :auto_complete="true"
              :readonly="!models.has_affects_funds"
              @update:modelValue="models.funds_movement_code = $event"
              :rules="
                models.has_affects_funds
                  ? [
                      (v: string) =>
                        useRules().is_required(v, 'El código es requerido'),
                    ]
                  : []
              "
            />
            <p v-else class="text-grey-6 mb-3">
              {{
                models.funds_movement_code_name
                  ? models.funds_movement_code_name
                  : '-'
              }}
            </p>
          </div>

          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Forma recaudo{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :manual_option="collection_shapes"
              :map_options="true"
              :required="models.has_affects_funds ?? false"
              :default_value="models.collection_shape"
              :readonly="!models.has_affects_funds"
              :auto_complete="true"
              @update:modelValue="models.collection_shape = $event"
              :rules="
                models.has_affects_funds
                  ? [
                      (v: string) =>
                        useRules().is_required(
                          v,
                          'La forma de recaudo es requerida'
                        ),
                    ]
                  : []
              "
            />
            <p v-else class="text-grey-6 mb-3">
              {{ models.collection_shape ?? '-' }}
            </p>
          </div>

          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Genera factura{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :manual_option="default_yes_no"
              :map_options="true"
              :required="true"
              :default_value="models.has_generate_invoice"
              :auto_complete="true"
              @update:modelValue="models.has_generate_invoice = $event"
              :rules="[
                (v: boolean) =>
                  useRules().is_required_boolean(v, 'El campo es requerido'),
              ]"
            />
            <p v-else class="text-grey-6 mb-3">
              {{ models.has_generate_invoice ? 'Sí' : 'No' }}
            </p>
          </div>

          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Concepto de facturación{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>

            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.billing_concept"
              type="text"
              :required="models.has_generate_invoice ?? false"
              :readonly="!models.has_generate_invoice"
              :rules="
                models.has_generate_invoice
                  ? [
                      (v: string) =>
                        useRules().is_required(v, 'El concepto es requerido'),
                    ]
                  : []
              "
              @update:model-value="models.billing_concept = $event"
            />

            <p v-else class="text-grey-6 mb-3">
              {{ models.billing_concept ? models.billing_concept : '-' }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'

// logic
import useInformationForm from './InformationForm'

// interfaces
import { ITrustBusinessMovementCodes } from '@/interfaces/customs'

// composables
import { useRules } from '@/composables'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit' | 'view'
    data?: ITrustBusinessMovementCodes | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const {
  models,
  formInformation,
  movement_codes_natures,
  movement_codes_types,
  default_yes_no,
  collection_shapes,
  movements_codes_nfi,
  movement_codes_cancellation_codes,
} = useInformationForm(props)

defineExpose({
  validateForm: () => formInformation.value?.validate(),
})
</script>
