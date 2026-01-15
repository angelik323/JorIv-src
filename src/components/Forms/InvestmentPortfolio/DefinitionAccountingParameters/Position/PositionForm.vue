<template>
  <q-form ref="formElementRef" class="q-pa-lg">
    <section>
      <div
        :class="[
          'row q-col-gutter-x-lg',
          ['view'].includes(action) ? 'q-col-gutter-y-lg' : 'q-col-gutter-y-md',
        ]"
      >
        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelector
            v-if="!isView"
            label="Código de operación"
            :default_value="models.operation_code"
            :manual_option="parsed_operation_type"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="is_required_fields_positions"
            :rules="
                is_required_fields_positions
                  ? [
                      (v: string) =>
                        useRules().is_required(v, 'El campo Código de operación es requerido'),
                    ]
                  : []
              "
            @update:model-value="
              handleOperationTypeCodeLocalCurrencyChange($event)
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código de operación</p>
            <p class="text-weight-medium no-margin">
              {{ models.operation_code ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelector
            v-if="!isView"
            label="Tipo de papel"
            :default_value="models.paper_type"
            :manual_option="paper_types_form_parameters"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="is_required_fields_positions"
            :rules="
                is_required_fields_positions
                  ? [
                      (v: string) =>
                        useRules().is_required(v, 'El campo Tipo de papel es requerido'),
                    ]
                  : []
              "
            @update:model-value="models.paper_type = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de papel</p>
            <p class="text-weight-medium no-margin">
              {{ models.paper_type ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelector
            v-if="!isView"
            label="Clase de inversión"
            :default_value="models.investment_class"
            :manual_option="class_investment"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="is_required_fields_positions"
            :rules="
                is_required_fields_positions
                  ? [
                      (v: string) =>
                        useRules().is_required(v, 'El campo Clase de inversión es requerido'),
                    ]
                  : []
              "
            @update:model-value="models.investment_class = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Clase de inversión</p>
            <p class="text-weight-medium no-margin">
              {{ models.investment_class ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <p
            class="text-weight-medium mb-0"
            :class="isView ? 'text-black-90 ' : 'text-grey-7'"
          >
            Posición
          </p>
          <RadioYesNo
            v-model="selectedPosition"
            :isRadioButton="true"
            :hasTitle="false"
            :title="'Posición'"
            :hasSubtitle="true"
            :options="position_options"
            :isDisabled="['view'].includes(action)"
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelector
            v-if="!isView"
            label="Mayor partida"
            :default_value="models.main_match"
            :manual_option="accounts_charts"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="is_required_fields_positions"
            :rules="
                is_required_fields_positions
                  ? [
                      (v: string) =>
                        useRules().is_required(v, 'El campo Mayor partida es requerido'),
                    ]
                  : []
              "
            @update:model-value="models.main_match = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Mayor partida</p>
            <p class="text-weight-medium no-margin">
              {{ models.main_match ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelector
            v-if="!isView"
            label="Auxiliar"
            :default_value="models.auxiliary"
            :manual_option="type_auxiliary"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="is_required_fields_positions"
            :rules="
                is_required_fields_positions
                  ? [
                      (v: string) =>
                        useRules().is_required(v, 'El campo Auxiliar es requerido'),
                    ]
                  : []
              "
            @update:model-value="models.auxiliary = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Auxiliar</p>
            <p class="text-weight-medium no-margin">
              {{ models.auxiliary ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelector
            v-if="!isView"
            label="Centro de costos"
            :default_value="models.cost_center_id"
            :manual_option="cost_center"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="false"
            :rules="[]"
            @update:model-value="models.cost_center_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Centro de costos</p>
            <p class="text-weight-medium no-margin">
              {{ models.cost_center ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelector
            v-if="!isView"
            label="Mayor contrapartida"
            :default_value="models.counterparty_account"
            :manual_option="accounts_charts"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="is_required_fields_positions"
            :rules="
                is_required_fields_positions
                  ? [
                      (v: string) =>
                        useRules().is_required(v, 'El campo Mayor cuenta por cobrar es requerido'),
                    ]
                  : []
              "
            @update:model-value="models.counterparty_account = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Mayor contrapartida</p>
            <p class="text-weight-medium no-margin">
              {{ models.counterparty_account ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <p
            class="text-weight-medium mb-0"
            :class="isView ? 'text-black-90 ' : 'text-grey-7'"
          >
            Naturaleza
          </p>
          <RadioYesNo
            v-model="selectedNature"
            :isRadioButton="true"
            :hasTitle="false"
            :title="'Naturaleza'"
            :hasSubtitle="true"
            :options="nature_options"
            :isDisabled="['view'].includes(action)"
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelector
            v-if="!isView"
            label="Centro de costos"
            :default_value="models.receivable_cost_center_id"
            :manual_option="cost_center"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="false"
            :rules="[]"
            @update:model-value="models.receivable_cost_center_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Centro de costos</p>
            <p class="text-weight-medium no-margin">
              {{ models.receivable_cost_center ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelector
            v-if="!isView"
            label="Auxiliar"
            :default_value="models.counterparty_auxiliary"
            :manual_option="type_auxiliary"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="is_required_fields_positions"
            :rules="
                is_required_fields_positions
                  ? [
                      (v: string) =>
                        useRules().is_required(v, 'El campo Auxiliar es requerido'),
                    ]
                  : []
              "
            @update:model-value="models.counterparty_auxiliary = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Auxiliar</p>
            <p class="text-weight-medium no-margin">
              {{ models.counterparty_auxiliary ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelector
            v-if="!isView"
            label="Comprobante"
            :default_value="models.voucher_type"
            :manual_option="receipt_types"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="is_required_fields_positions"
            :rules="
                is_required_fields_positions
                  ? [
                      (v: string) =>
                        useRules().is_required(v, 'El campo Comprobante es requerido'),
                    ]
                  : []
              "
            @update:model-value="handleReceiptTypeChange($event)"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Comprobante</p>
            <p class="text-weight-medium no-margin">
              {{ models.voucher_type ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelector
            v-if="!isView"
            label="Sub-comprobante"
            :default_value="models.sub_receipt_types"
            :manual_option="sub_receipt_types"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="is_required_fields_positions"
            :rules="
                is_required_fields_positions
                  ? [
                      (v: string) =>
                        useRules().is_required(v, 'El campo Sub-comprobante es requerido'),
                    ]
                  : []
              "
            @update:model-value="models.sub_receipt_types = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Sub-comprobante</p>
            <p class="text-weight-medium no-margin">
              {{ models.sub_receipt_types ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-12">
          <GenericInput
            v-if="!isView"
            label="Descripción código operación"
            :default_value="models.operation_description"
            placeholder="-"
            type="textarea"
            disabled
            :required="is_required_fields_positions"
            :rules="
                is_required_fields_positions
                  ? [
                      (v: string) =>
                        useRules().is_required(v, 'El campo Descripción código operación es requerido'),
                    ]
                  : []
              "
            @update:model-value="models.operation_description = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Descripción código operación
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.operation_description ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>

      <q-separator />
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelector from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import { useRules } from '@/composables'
import { nature_options, position_options } from '@/constants/resources'
import { ActionType } from '@/interfaces/global'
import { IDefinitionAccountingParametersPositions } from '@/interfaces/customs'
import usePositionForm from './PositionForm'

const props = defineProps<{
  action: ActionType
  data?: IDefinitionAccountingParametersPositions | null
  tabActive?: string
  isInitialized?: boolean
}>()

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})

const {
  models,
  formElementRef,
  selectedPosition,
  selectedNature,
  isView,
  parsed_operation_type,
  paper_types_form_parameters,
  class_investment,
  accounts_charts,
  type_auxiliary,
  cost_center,
  receipt_types,
  sub_receipt_types,
  is_required_fields_positions,
  handleReceiptTypeChange,
  handleOperationTypeCodeLocalCurrencyChange,
} = usePositionForm(props)
</script>
