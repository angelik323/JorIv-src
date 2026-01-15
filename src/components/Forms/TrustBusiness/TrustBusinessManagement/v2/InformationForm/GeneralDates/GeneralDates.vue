<template>
  <section>
    <q-form ref="general_dates_ref">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Fechas generales
        </p>
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4" v-if="!isSociety">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            :label="'Fecha radicación SFC'"
            :default_value="models.filing_date_sfc"
            :required="!isSociety"
            :disabled="is_edit"
            :rules="isSociety ? [] : [
              (val: string) =>
                is_required(val, 'La fecha de radicación SFC es requerida'),
              (val: string) => date_before_or_equal_to_the_current_date(val),
            ]"
            @update:modelValue="models.filing_date_sfc = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha radicación SFC</p>
            <p class="text-weight-medium no-margin">
              {{ models.filing_date_sfc ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            :label="'Fecha constitución'"
            :default_value="models.start_date"
            required
            :disabled="is_edit"
            :rules="[
              (val: string) =>
                is_required(val, 'La fecha de constitución es requerida'),
              (val: string) =>
                date_before_or_equal_to_the_specific_date(
                  val,
                  models.end_date ?? val,
                  'La fecha de constitución debe ser menor o igual a la fecha de vencimiento.'
                ),
            ]"
            :option_calendar="
              only_until(
                models.end_date &&
                  models.end_date < new Date().toISOString().split('T')[0]
                  ? models.end_date
                  : new Date().toISOString().split('T')[0]
              )
            "
            @update:modelValue="models.start_date = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha constitución</p>
            <p class="text-weight-medium no-margin">
              {{ models.start_date ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4" v-if="!isSociety">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            :label="'Fecha vencimiento'"
            :default_value="models.end_date"
            :required="!isSociety"
            :disabled="is_edit"
            :rules="isSociety ? [] : [
              (val: string) => is_required(val, 'La fecha vencimiento es requerida'),
              (val: string) =>
                date_after_or_equal_to_specific_date(
                  val,
                  currentDate ?? ''
                ),
            ]"
            :option_calendar="only_after(currentDate ?? '')"
            @update:modelValue="models.end_date = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha vencimiento</p>
            <p class="text-weight-medium no-margin">
              {{ models.end_date ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4" v-if="!isSociety">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            :label="'Fecha inicio comisión'"
            :default_value="models.start_date_commission"
            :required="!isSociety"
            :disabled="is_edit"
            :rules="isSociety ? [] : [
              (val: string) =>
                is_required(val, 'La fecha inicio comisión es requerida'),
              (val: string) =>
                date_after_or_equal_to_specific_date(
                  val,
                  models.start_date ?? ''
                ),
            ]"
            @update:modelValue="models.start_date_commission = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha inicio comisión</p>
            <p class="text-weight-medium no-margin">
              {{ models.start_date_commission ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4" v-if="!isSociety && !['create'].includes(action)">
          <GenericSelectorComponent
            v-if="['edit'].includes(action)"
            :label="'Prórroga'"
            :default_value="default_yes_no.find(opt => opt.value === models.has_extend) ?? null"
            :manual_option="default_yes_no"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            disabled
            :rules="[]"
            @update:modelValue="models.has_extend = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Prórroga</p>
            <p class="text-weight-medium no-margin">
              {{ models.has_extend ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4" v-if="!isSociety && models.has_extend">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            :label="'Fecha prórroga'"
            :default_value="models.extend_date"
            required
            :disabled="is_edit"
            :rules="[
              (val: string) =>
                is_required(val, 'La fecha prórroga es requerida'),
            ]"
            @update:modelValue="models.extend_date = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha prórroga</p>
            <p class="text-weight-medium no-margin">
              {{ models.extend_date ?? '-' }}
            </p>
          </div>
        </div>

      </div>
    </q-form>
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: ITrustBusinessGeneralDates | null
    isSociety: boolean
  }>(),
  {}
)

const emits =
  defineEmits<(e: 'update:models', value: ITrustBusinessGeneralDates) => void>()

// components
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

// constants
import { default_yes_no } from '@/constants/resources'

// logic
import useGeneralDates from './GeneralDates'

// interfaces
import { ActionType } from '@/interfaces/global'
import { ITrustBusinessGeneralDates } from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'

const {
  models,
  general_dates_ref,
  is_edit,
  currentDate,

  // rules
  is_required,
  date_before_or_equal_to_the_current_date,
  date_after_or_equal_to_specific_date,
  date_before_or_equal_to_the_specific_date,
  only_after,
  only_until,
} = useGeneralDates(props, emits)

defineExpose({
  validateForm: async () => await general_dates_ref.value?.validate(),
})
</script>
