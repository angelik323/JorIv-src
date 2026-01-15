<template>
  <q-form
    ref="formElementRef"
    aria-label="Formulario de datos básicos para clase de derivado"
  >
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div :class="['col-12', 'col-md-4']">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.code"
            label="Código derivado"
            required
            :rules="[ (val: string) => is_required(val, 'El código derivado es requerido'),
                (val: string) => max_length(val, 3),
                (val: string) => min_length(val, 3),
             ]"
            :disabled="action === 'edit'"
            @update:model-value="(val: number) => { if (models) models.code = String(val) }"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código derivado</p>
            <p class="text-weight-medium no-margin">
              {{ models.code }}
            </p>
          </div>
        </div>

        <div :class="['col-12', 'col-md-4']">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.derivative_type_id"
            label="Tipo derivado"
            auto_complete
            map_options
            :manual_option="derivative_type"
            required
            :rules="[
              (val: string) =>
                is_required(val, 'El tipo derivado es requerido'), ]"
            :disabled="action === 'edit'"
            @update:model-value="(val: number) => { if (models) models.derivative_type_id = Number(val) }"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo derivado:</p>
            <p class="text-weight-medium no-margin">
              {{ models.derivative_type_id }}
            </p>
          </div>
        </div>

        <div :class="['col-12', 'col-md-4']">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.description"
            label="Descripción"
            required
            :rules="[
              (val: string) => is_required(val, 'La descripción es requerida'),
              (val: string) => max_length(val, 90),
            ]"
            :disabled="action === 'edit'"
            @update:model-value="(val: number) => { if (models) models.description = String(val) }"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Descripción derivado:</p>
            <p class="text-weight-medium no-margin">
              {{ models.description }}
            </p>
          </div>
        </div>
      </div>

      <q-separator class="q-mt-md q-mb-md" color="grey-4" />

      <h6>Información del derivado</h6>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div :class="['col-12', 'col-md-3']">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.derivative_underlying_id"
            label="Tipo subyacente"
            auto_complete
            map_options
            :manual_option="derivative_underlying"
            required
            :rules="[
                (val: string) =>
                    is_required(val, 'El tipo subyacente es requerido'),
            ]"
            @update:model-value="(val: string) => { if (models) models.derivative_underlying_id = Number(val) }"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo subyacente</p>
            <p class="text-weight-medium no-margin">
              {{ models.derivative_underlying_id }}
            </p>
          </div>
        </div>

        <div :class="['col-12', 'col-md-3']">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.currency_id"
            label="Moneda"
            auto_complete
            map_options
            :manual_option="coins"
            required
            :rules="[
                (val: string) =>
                    is_required(val, 'La moneda es requerida'),
            ]"
            @update:model-value="(val: string) => { if (models) models.currency_id = Number(val) }"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Moneda</p>
            <p class="text-weight-medium no-margin">
              {{ models.currency_id }}
            </p>
          </div>
        </div>

        <div :class="['col-12', 'col-md-3']">
          <div v-if="['create', 'edit'].includes(action)">
            Tipo de operación*
          </div>
          <RadioYesNo
            v-if="['create', 'edit'].includes(action)"
            label="Tipo de operación*"
            :options="operation_type"
            required
            v-model="models!.operation_type"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de operación</p>
            <p class="text-weight-medium no-margin">
              {{ models.operation_type }}
            </p>
          </div>
        </div>

        <div :class="['col-12', 'col-md-3']">
          <div v-if="['create', 'edit'].includes(action)">
            Finaliza anticipadamente*
          </div>
          <RadioYesNo
            v-if="['create', 'edit'].includes(action)"
            label="Finaliza anticipadamente*"
            :options="end_early"
            required
            v-model="models!.end_early"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Finaliza anticipadamente</p>
            <p class="text-weight-medium no-margin">
              {{ models.end_early }}
            </p>
          </div>
        </div>

        <div :class="['col-12', 'col-md-3']">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models?.paper_type_id"
            label="Papel"
            auto_complete
            map_options
            :manual_option="paper_type"
            required
            :rules="[
                (val: string) =>
                    is_required(val, 'El papel es requerido'),
            ]"
            @update:model-value="(val: string | number) => { if (models) models.paper_type_id = Number(val) }"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Papel</p>
            <p class="text-weight-medium no-margin">
              {{ models.paper_type_id }}
            </p>
          </div>
        </div>

        <div :class="['col-12', 'col-md-3']">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.currency_payment_id"
            label="Moneda de pago"
            auto_complete
            map_options
            :manual_option="coins"
            required
            :rules="[
                (val: string) =>
                    is_required(val, 'La moneda de pago es requerida'),
            ]"
            @update:model-value="(val: string | number) => { if (models) models.currency_payment_id = Number(val) }"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Moneda de pago</p>
            <p class="text-weight-medium no-margin">
              {{ models.currency_payment_id }}
            </p>
          </div>
        </div>

        <div :class="['col-12', 'col-md-3']">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.badge_x_id"
            label="Divisa X"
            auto_complete
            map_options
            :manual_option="coins"
            required
            :rules="[
                (val: string) =>
                    is_required(val, 'La divisa X es requerida'),
            ]"
            @update:model-value="(val: string | number) => { if (models) models.badge_x_id = Number(val) }"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Divisa X</p>
            <p class="text-weight-medium no-margin">
              {{ models.badge_x_id }}
            </p>
          </div>
        </div>

        <div :class="['col-12', 'col-md-3']">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.badge_y_id"
            label="Divisa Y"
            auto_complete
            map_options
            :manual_option="coins"
            required
            :rules="[
                (val: string) =>
                    is_required(val, 'La divisa Y es requerida'),
            ]"
            @update:model-value="(val: string | number) => { if (models) models.badge_y_id = Number(val) }"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Divisa Y</p>
            <p class="text-weight-medium no-margin">
              {{ models.badge_y_id }}
            </p>
          </div>
        </div>

        <div :class="['col-12', 'col-md-3']">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.rate_point_id"
            label="Tasa / Indicador puntos"
            auto_complete
            map_options
            :manual_option="interest_rates"
            required
            :rules="[
                (val: string) =>
                    is_required(val, 'La tasa / indicador puntos es requerida'),
            ]"
            @update:model-value="models.rate_point_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tasa / Indicador puntos</p>
            <p class="text-weight-medium no-margin">
              {{ models.rate_point_id }}
            </p>
          </div>
        </div>

        <div :class="['col-12', 'col-md-3']">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.rate_x_id"
            label="Tasa indicador divisa X"
            auto_complete
            map_options
            :manual_option="interest_rates"
            required
            :rules="[
                (val: string) =>
                    is_required(val, 'La tasa / indicador divisa X es requerida'),
            ]"
            @update:model-value="(val: string | number) => { if (models) models.rate_x_id = String(val) }"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tasa indicador divisa X</p>
            <p class="text-weight-medium no-margin">
              {{ models.rate_x_id }}
            </p>
          </div>
        </div>

        <div :class="['col-12', 'col-md-3']">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.rate_y_id"
            label="Tasa indicador divisa Y"
            auto_complete
            map_options
            :manual_option="interest_rates"
            required
            :rules="[
                (val: string) =>
                    is_required(val, 'La tasa / indicador divisa Y es requerida'),
            ]"
            @update:model-value="(val: string | number) => { if (models) models.rate_y_id = String(val) }"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tasa indicador divisa Y</p>
            <p class="text-weight-medium no-margin">
              {{ models.rate_y_id }}
            </p>
          </div>
        </div>

        <div :class="['col-12', 'col-md-3']">
          <div v-if="['create', 'edit'].includes(action)">Estado*</div>
          <RadioYesNo
            v-if="['create', 'edit'].includes(action)"
            label="Estado*"
            :options="default_statuses"
            required
            v-model="models!.status_id"
          />
          <p class="no-margin text-black-80"><b>Estado:</b></p>
          <div class="no-margin">
            <ShowStatus :type="Number(models.status_id)" clickable />
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>
<script lang="ts" setup>
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'

import { useInformationForm } from '@/components/Forms/InvestmentPortfolio/DerivativeClasses/information/InformationForm'

import { IDerivativeClassesForm } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IDerivativeClassesForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IDerivativeClassesForm | null): void
}>()

const {
  formElementRef,
  models,
  coins,
  paper_type,
  interest_rates,
  derivative_type,
  derivative_underlying,
  operation_type,
  end_early,
  default_statuses,
  max_length,
  min_length,
  is_required,
} = useInformationForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
