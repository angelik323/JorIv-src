<template>
  <q-form ref="informationFormRef">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12" :class="isView ? 'col-md-3' : 'col-md-4'">
          <GenericInputComponent
            v-if="!isView"
            :default_value="formData.title"
            label="Título"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El título es requerido.'),
              (val: string) => useRules().max_length(val, 60),
              (val: string) => useRules().min_length(val, 3),
            ]"
            @update:modelValue="formData.title = $event"
          />
          <div class="text-blak-90" v-else>
            <p class="text-weight-bold no-margin">Título</p>
            <p class="text-weight-medium no-margin">
              {{ viewData.title || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12" :class="isView ? 'col-md-3' : 'col-md-4'">
          <GenericInputComponent
            v-if="!isView"
            :default_value="formData.description"
            label="Detalle"
            placeholder="Inserte"
            type="text"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El detalle es requerido.'),
              (val: string) => useRules().max_length(val, 150),
              (val: string) => useRules().min_length(val, 3),
            ]"
            @update:modelValue="formData.description = $event"
          />
          <div class="text-blak-90" v-else>
            <p class="text-weight-bold no-margin">Detalle</p>
            <p class="text-weight-medium no-margin">
              {{ viewData.description || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12" :class="isView ? 'col-md-3' : 'col-md-4'">
          <GenericSelectorComponent
            v-if="!isView"
            :default_value="formData.repeat"
            :manual_option="repeat_options"
            label="Repetir"
            auto_complete
            map_options
            required
            @update:modelValue="formData.repeat = $event"
            :rules="[
              (val: string) => useRules().is_required(val, 'La frecuencia es requerido.') 
            ]"
          />
          <div class="text-blak-90" v-else>
            <p class="text-weight-bold no-margin">Repetir</p>
            <p class="text-weight-medium no-margin">
              {{ viewData.repeat || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInput
            v-if="!isView"
            :default_value="formData.start_date"
            label="Fecha inicial"
            mask="YYYY-MM-DD"
            placeholder="AAAA-MM-DD"
            :option_calendar="($event) => isDateAllowed($event, holidays, true)"
            :onNavigation="({ year }) => handlerHolidays(year)"
            required
            @update:modelValue="formData.start_date = $event"
            :rules="[
              (val: string) => useRules().is_required(val, 'La fecha inicial es requerida.'),
              (val: string) => useRules().valid_format_date(val, 'YYYY-MM-DD'),
            ]"
          />
          <div class="text-black-90" v-else>
            <p class="text-weight-bold no-margin">Fecha inicial</p>
            <p class="text-weight-medium no-margin">
              {{ viewData.start_date || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInput
            v-if="!isView"
            :default_value="formData.end_date"
            label="Fecha final"
            mask="YYYY-MM-DD"
            placeholder="AAAA-MM-DD"
            :option_calendar="($event) => isDateAllowed($event, holidays, true)"
            :onNavigation="({ year }) => handlerHolidays(year)"
            required
            @update:modelValue="formData.end_date = $event"
            :rules="[
              (val: string) => useRules().is_required(val, 'La fecha final es requerida.'),
              (val: string) => useRules().valid_format_date(val, 'YYYY-MM-DD'),
              (val: string) => useRules().date_after_or_equal_to_specific_date(val, formData.start_date, 'fecha inicial'),
            ]"
          />
          <div class="text-black-90" v-else>
            <p class="text-weight-bold no-margin">Fecha final</p>
            <p class="text-weight-medium no-margin">
              {{ viewData.end_date || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericTimeInput
            v-if="!isView"
            :default_value="formData.start_time"
            label="Hora inicial"
            placeholder="00:00"
            required
            now_btn
            @update:modelValue="formData.start_time = $event"
            :rules="[
              (val: string) => !val || useRules().is_required(val, 'La hora inical es requerida.'),
              (val: string) => useRules().validate_future_time(val, formData.start_date),
              (val: string) => useRules().valid_format_time(val)
            ]"
          />
          <div class="text-black-90" v-else>
            <p class="text-weight-bold no-margin">Hora inicial</p>
            <p class="text-weight-medium no-margin">
              {{ viewData.start_time || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericTimeInput
            v-if="!isView"
            ref="endTimeRef"
            :default_value="formData.end_time"
            label="Hora final"
            placeholder="00:00"
            required
            now_btn
            @update:modelValue="formData.end_time = $event"
            :rules="[
              (val: string) => !val || useRules().is_required(val, 'La hora final es requerida'),
              (val: string) => !val || validateEndTime(val),
              (val: string) => useRules().validate_future_time(val, formData.end_date),
              (val: string) => useRules().valid_format_time(val),
            ]"
          />
          <div class="text-black-90" v-else>
            <p class="text-weight-bold no-margin">Hora final</p>
            <p class="text-weight-medium no-margin">
              {{ viewData.end_time || '-' }}
            </p>
          </div>
        </div>

        <div v-if="!isView" class="col-12 row justify-start">
          <RadioYesNo
            :modelValue="formData.required_confirm"
            @update:modelValue="(val: boolean) => (formData.required_confirm = val)"
            label="Confirmación de lectura"
            :isRadioButton="false"
            :hasTitle="false"
            :hasSubtitle="false"
          />
        </div>

        <div v-else class="col-3 text-black-90">
          <p class="text-weight-bold no-margin">Confirmación de lectura</p>
          <p class="text-weight-medium no-margin">
            {{
              viewData.required_confirm === true
                ? 'Sí'
                : viewData.required_confirm === false
                ? 'No'
                : '-'
            }}
          </p>
        </div>
      </div>

      <q-separator :class="isView ? 'q-my-lg' : 'q-mt-sm'" />

      <div v-if="isView && hasNotificationData">
        <div class="row q-col-gutter-lg">
          <div :class="['col-12', viewData.required_confirm ? 'col-md-6' : '']">
            <p class="text-subtitle1 text-weight-bold text-grey-10 q-mb-md">
              Notificar a
            </p>
            <VCard>
              <template #content-card>
                <div class="column q-gutter-md q-pa-lg">
                  <template
                    v-for="(chips, index) in chipsDataViewer"
                    :key="chips.key"
                  >
                    <ChipRow
                      :label="chips.label"
                      :items="chips.visible.value"
                      :hiddenCount="chips.hiddenCount.value"
                      :emailMode="chips.emailMode"
                    />

                    <q-separator
                      v-if="index < chipsDataViewer.length - 1"
                      class="q-mb-xs q-mt-md"
                    />
                  </template>
                </div>
              </template>
            </VCard>
          </div>

          <div
            v-if="viewData.required_confirm && hasConfirmationData"
            class="col-12 col-md-6"
          >
            <p class="text-subtitle1 text-weight-bold text-grey-10 q-mb-md">
              Confirmar a
            </p>
            <VCard>
              <template #content-card>
                <div class="column q-gutter-md q-pa-lg">
                  <template
                    v-for="(chips, index) in chipsDataViewerConfirmations"
                    :key="chips.key"
                  >
                    <ChipRow
                      :label="chips.label"
                      :items="chips.visible.value"
                      :hiddenCount="chips.hiddenCount.value"
                      :emailMode="chips.emailMode"
                    />

                    <q-separator
                      v-if="index < chipsDataViewerConfirmations.length - 1"
                      class="q-mb-xs q-mt-md"
                    />
                  </template>
                </div>
              </template>
            </VCard>
          </div>
        </div>
      </div>

      <div v-if="isView" class="flex justify-end q-mt-lg">
        <Button
          :outline="false"
          label="Finalizar"
          color="orange"
          class="text-capitalize btn-filter custom"
          @click="handleGoToList"
        />
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericTimeInput from '@/components/common/GenericTime/GenericTimeInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import ChipRow from '@/components/common/ChipRow/ChipRow.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Interfaces
import { ICalendarEventView } from '@interfaces/customs/agenda/CalendarEvents'
import { ActionType } from '@/interfaces/global'

// Composables
import { useRules } from '@/composables'

// Logic view
import useInformationForm from '@/components/Forms/CalendarEvents/information/InformationForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: ICalendarEventView
  }>(),
  {}
)

const {
  isView,
  formData,
  viewData,
  holidays,
  endTimeRef,
  isDateAllowed,
  repeat_options,
  handleGoToList,
  chipsDataViewer,
  handlerHolidays,
  validateEndTime,
  informationFormRef,
  hasNotificationData,
  hasConfirmationData,
  chipsDataViewerConfirmations,
} = useInformationForm(props)

defineExpose({
  getValues: () => formData.value,
  validateForm: () => informationFormRef.value?.validate(),
})
</script>
