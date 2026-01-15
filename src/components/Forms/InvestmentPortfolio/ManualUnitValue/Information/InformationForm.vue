<template>
  <q-form ref="formElementRef" :class="`q-pa-xl`">
    <section>
      <p class="text-weight-bold text-black-90 size-18">Emisores</p>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Identificación"
            :default_value="models.emitter_id"
            required
            :rules="[(val: string) => useRules().is_required(val, 'Identificación es requerido')]"
            @update:model-value="onUpdateEmitter"
            :manual_option="manual_unit_emitters"
            :return_object="true"
            :map_options="true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Identificación</p>
            <p class="text-weight-medium no-margin">
              {{ models.emitter_id ? models.emitter_id : 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Descripción"
            :default_value="models.description"
            required
            disabled
            placeholder="-"
            :rules="[
              (val: string) => useRules().is_required(val, 'Descripción es requerida'),
              (val: string) => useRules().max_length(val, 12)
            ]"
            @update:model-value="models.description = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Descripción</p>
            <p class="text-weight-medium no-margin">
              {{ models.description ? models.description : 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <q-separator class="my-20" />
    <section>
      <p class="text-weight-bold text-black-90 size-18">Unidades</p>

      <template v-if="['view'].includes(action)">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-xs-12 col-sm-12 col-md-3">
            <p class="text-weight-bold text-black-90 mb-0">
              ¿Tiene participaciones?
            </p>
            <p class="text-black-90 mb-3">
              {{ models.has_participations ? 'Si' : 'No' }}
            </p>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3">
            <p class="text-weight-bold text-black-90 mb-0">Participaciones</p>
            <p class="text-black-90 mb-3">
              {{
                models.participation_description
                  ? models.participation_description
                  : 'No registrado'
              }}
            </p>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3">
            <p class="text-weight-bold text-black-90 mb-0">¿Tiene acciones?</p>
            <p class="text-black-90 mb-3">
              {{ models.has_actions ? 'Si' : 'No' }}
            </p>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3">
            <p class="text-weight-bold text-black-90 mb-0">Acciones</p>
            <p class="text-black-90 mb-3">
              {{ models.action_type ? models.action_type : 'No registrado' }}
            </p>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="row justify-between align-center">
          <p
            class="text-weight-bold mb-0 text-black-90 letter-spacing-md flex items-center"
          >
            ¿Tiene participaciones o acciones?*
          </p>

          <div class="flex items-center">
            <RadioYesNo
              :modelValue="models.radio"
              @update:modelValue="(val: boolean) => models.radio = val"
              title-radio-false="Acciones"
              title-radio-true="Participaciones"
            />
          </div>
        </div>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div v-if="models.has_participations" class="col-12 col-md-6">
            <GenericInputComponent
              label="Participaciones"
              :default_value="models.participation_description"
              required
              :rules="[(val: string) => useRules().is_required(val, 'Participaciones es requerido')]"
              @update:model-value="models.participation_description = $event"
            />
          </div>
          <div v-if="models.has_actions" class="col-12 col-md-6">
            <GenericSelectorComponent
              label="Acciones"
              :default_value="models.action_type"
              required
              :rules="[(val: string) => useRules().is_required(val, 'Acciones es requerido')]"
              @update:model-value="models.action_type = $event"
              :manual_option="manual_unit_actions"
            />
          </div>
        </div>
      </template>

      <q-separator class="my-20" />
    </section>
    <section>
      <p class="text-weight-bold text-black-90 size-18">Periodo de fecha</p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericDateInput
            v-if="['create', 'edit'].includes(action)"
            label="Fecha inicial"
            :default_value="models.start_date"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'Fecha inicial es requerida'),
              (val) => useRules().is_after_or_equal_today(val, 'La fecha de inicio debe ser igual o posterior a hoy')
            ]"
            @update:model-value="models.start_date = $event"
            placeholder="AAAA-MM-DD"
            mask="YYYY-MM-DD"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha inicial</p>
            <p class="text-weight-medium no-margin">
              {{ models.start_date ? models.start_date : 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <GenericDateInput
            v-if="['create', 'edit'].includes(action)"
            label="Fecha final"
            :default_value="models.end_date"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'Fecha final es requerida'),
              (val) => useRules().is_after_or_equal_date(val, models.start_date, 'La fecha de finalización debe ser igual o posterior a la fecha de inicio')
            ]"
            @update:model-value="models.end_date = $event"
            placeholder="AAAA-MM-DD"
            mask="YYYY-MM-DD"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha final</p>
            <p class="text-weight-medium no-margin">
              {{ models.end_date ? models.end_date : 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <q-separator class="my-20" />
    <section>
      <p class="text-weight-bold text-black-90 size-18">Valor</p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-xs-12 col-sm-12 col-md-3">
          <template v-if="['view'].includes(action)">
            <p class="text-weight-bold text-black-90 mb-0">Valor</p>
            <p class="text-black-90 mb-3">
              {{ models.unit_value ? models.unit_value : 'No registrado' }}
            </p>
          </template>
          <template v-else>
            <CurrencyInput
              currencyLabel="Valor"
              v-model="(models.unit_value as number)"
              :currency="'COP'"
              hideIcon
              required
              placeholder="Inserte"
              :rules="[
              (val: string) => useRules().is_required(val, 'Valor es requerido'),
              (val: string) => useRules().length_between(val, 0, 99.9999),
              ]"
            />
          </template>
        </div>
      </div>
    </section>
    <section v-if="['view'].includes(action)">
      <q-separator class="my-20" />
      <p class="text-weight-bold text-black-90 size-18">Historial de cambios</p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-xs-12 col-sm-12 col-md-3">
          <p class="text-weight-bold text-black-90 mb-0">Fecha de creación</p>
          <p class="text-black-90 mb-3">
            {{ models.created_at ? models.created_at : 'No registrado' }}
          </p>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3">
          <p class="text-weight-bold text-black-90 mb-0">Creado por</p>
          <p class="text-black-90 mb-3">
            {{ models.creator_data ? models.creator_data : 'No registrado' }}
          </p>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3">
          <p class="text-weight-bold text-black-90 mb-0">Modificación</p>
          <p class="text-black-90 mb-3">
            {{ models.updated_at ? models.updated_at : 'No registrado' }}
          </p>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3">
          <p class="text-weight-bold text-black-90 mb-0">Modificado por</p>
          <p class="text-black-90 mb-3">
            {{
              models.updated_by_user ? models.updated_by_user : 'No registrado'
            }}
          </p>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script lang="ts" setup>
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

// composables
import { useRules } from '@/composables'

// Logic view
import useInformationForm from '@/components/Forms/InvestmentPortfolio/ManualUnitValue/Information/InformationForm'

// utils
import { ActionType } from '@/interfaces/global'
import { IManualUnitValueForm } from '@/interfaces/customs'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IManualUnitValueForm | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const {
  manual_unit_emitters,
  manual_unit_actions,
  formElementRef,
  models,
  onUpdateEmitter,
} = useInformationForm(props)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>

<style lang="scss" scoped>
.size-18 {
  font-size: 1.13rem;
}
.my-20 {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
