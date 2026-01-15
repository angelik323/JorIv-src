<template>
  <q-form ref="informationFormRef">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericDateInputComponent
            :default_value="models.marked_day"
            label="Fecha"
            :option_calendar="($event) => isDateAllowed($event, holidays, true)"
            :onNavigation="({ year }) => handlerHolidays(year)"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'La fecha es requerida'),
            ]"
            @update:modelValue="models.marked_day = $event"
          />
        </div>

        <div class="col-12 col-md-6">
          <GenericInputComponent
            label="Motivo"
            :default_value="models.marking_reason"
            required
            :rules="[
                (val: string) => useRules().is_required(val, 'El motivo es requerido'),
                (val: string) => useRules().no_consecutive_spaces(val),
                (val: string) => useRules().max_length(val, 200),
                (val: string) => useRules().min_length(val, 3),
              ]"
            @update:model-value="models.marking_reason = $event"
          />
        </div>

        <div class="col-12">
          <q-separator class="q-mt-sm q-mb-lg" />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

// Interfaces
import { IConfigCalendarRequest } from '@/interfaces/customs/agenda/ConfigCalendar'
import { ActionType } from '@/interfaces/global'

// Composables
import { useRules } from '@/composables'

// Logic view
import useInformationForm from '@/components/Forms/ConfigCalendar/information/InformationForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IConfigCalendarRequest | null
    disabledDates?: string[]
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const { models, holidays, isDateAllowed, handlerHolidays, informationFormRef } =
  useInformationForm(props)

defineExpose({
  validateForm: () => informationFormRef.value?.validate(),
})
</script>
