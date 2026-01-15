<template>
  <q-form ref="formElementRef" class="q-pa-lg">
    <section>
      <p class="text-black-90 text-weight-bold text-h6">
        Información de nuevos proyectos
      </p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-xs-12 col-sm-12 col-md-6">
          <GenericInput
            v-if="[ActionTypeEnum.CREATE, ActionTypeEnum.EDIT].includes(action)"
            label="Nombre del proyecto"
            :default_value="models.name"
            :max_length="'60'"
            :required="true"
            :rules="[
              (val: string) => useRules().is_required(val, 'El nombre del proyecto es requerido'),
              (val: string) => useRules().max_length(val, 60)
            ]"
            @update:model-value="models.name = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nombre del proyecto</p>
            <p class="text-weight-medium no-margin">
              {{ models.name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div
          v-if="[ActionTypeEnum.EDIT, ActionTypeEnum.VIEW].includes(action)"
          class="col-xs-12 col-sm-12 col-md-6"
        >
          <GenericSelector
            v-if="[ActionTypeEnum.EDIT].includes(action)"
            label="Estado"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :default_value="models.status_id"
            :manual_option="default_statuses"
            :required="true"
            :rules="[
              (val: string) => useRules().is_required(val, 'El estado es requerido'),
            ]"
            @update:model-value="models.status_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Estado</p>
            <p class="text-weight-medium no-margin">
              {{
                default_statuses.find((item) => item.value === models.status_id)
                  ?.label ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-12">
          <GenericInput
            v-if="[ActionTypeEnum.CREATE, ActionTypeEnum.EDIT].includes(action)"
            label="Descripción del proyecto"
            :default_value="models.description"
            type="textarea"
            :max_length="'600'"
            :required="true"
            :rules="[
              (val: string) => useRules().is_required(val, 'La descripción del proyecto es requerida'),
              (val: string) => useRules().max_length(val, 600)
            ]"
            @update:model-value="models.description = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Descripción del proyecto</p>
            <p class="text-weight-medium no-margin">
              {{ models.description ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericDateInput
            v-if="[ActionTypeEnum.CREATE, ActionTypeEnum.EDIT].includes(action)"
            label="Fecha de inicio"
            :default_value="models.start_date"
            :option_calendar="useUtils().getDateValidationRange()"
            :mask="'YYYY-MM-DD'"
            :placeholder="'YYYY-MM-DD'"
            :required="true"
            :rules="[
              (val: string) => useRules().is_required(val, 'La fecha de inicio es requerida'),
              (val: string) => useRules().date_before_or_equal_to_the_current_date(val),
            ]"
            @update:model-value="models.start_date = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha de inicio</p>
            <p class="text-weight-medium no-margin">
              {{ models.start_date ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericDateInput
            v-if="[ActionTypeEnum.CREATE, ActionTypeEnum.EDIT].includes(action)"
            label="Fecha fin"
            :default_value="models.end_date"
            :option_calendar="useUtils().getDateValidationRange()"
            :mask="'YYYY-MM-DD'"
            :placeholder="'YYYY-MM-DD'"
            :required="true"
            :rules="[
              (val: string) => useRules().is_required(val, 'La fecha fin es requerida'),
              (val: string) => useRules().date_before_or_equal_to_the_current_date(val),
              (val: string) => useRules().date_after_or_equal_to_specific_date(val, models.start_date || '')
            ]"
            @update:model-value="models.end_date = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha fin</p>
            <p class="text-weight-medium no-margin">
              {{ models.end_date ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericInput
            v-if="[ActionTypeEnum.CREATE, ActionTypeEnum.EDIT].includes(action)"
            label="Ordenador del gasto"
            :default_value="models.expenditure_computer"
            :max_length="'60'"
            :required="false"
            :rules="[
              (val: string) => useRules().max_length(val, 60)
            ]"
            @update:model-value="models.expenditure_computer = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Ordenador del gasto</p>
            <p class="text-weight-medium no-margin">
              {{ models.expenditure_computer ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>

      <q-separator class="q-mt-md" />
    </section>
  </q-form>
</template>

<script lang="ts" setup>
// Components
import GenericSelector from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'

// Composables
import { useRules, useUtils } from '@/composables'

// Interfaces
import { ActionTypeEnum } from '@/interfaces/global'
import { IProjectManagementBasicDataForm } from '@/interfaces/customs/derivative-contracting/ProjectManagement'

// Logic form
import useBasicDataForm from '@/components/Forms/DerivativeContracting/ProjectManagement/BasicData/BasicDataForm'

const props = withDefaults(
  defineProps<{
    action: ActionTypeEnum
    basicDataForm?: IProjectManagementBasicDataForm | null
  }>(),
  {}
)

const emit = defineEmits<{
  (
    e: 'update:basicDataForm',
    value: IProjectManagementBasicDataForm | null
  ): void
}>()

const { models, formElementRef, default_statuses } = useBasicDataForm(
  props,
  emit
)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
