<template>
  <q-form
    ref="formElementRef"
    aria-label="Formulario de datos básicos para calificación"
  >
    <section>
      <div class="q-mb-lg">
        <p class="text-black text-weight-bold text-h6 q-mb-none">
          Datos generales
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.action_rating"
            label="Acción calificación"
            auto_complete
            map_options
            :manual_option="qualification_actions"
            required
            :rules="[(val: string) => is_required(val, 'La acción calificación es requerida')]"
            @update:model-value="models.action_rating = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Acción calificación</p>
            <p class="text-weight-medium no-margin">
              {{ models.action_rating ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.rating_code"
            label="Código calificación"
            required
            :rules="[
              (val: string) => is_required(val, 'El código calificación es requerido'),
              (val: string) => max_length(val, 5)]"
            @update:model-value="models.rating_code = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código calificación</p>
            <p class="text-weight-medium no-margin">
              {{ models.rating_code ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.group"
            label="Grupo"
            required
            :rules="[
              (val: string) => is_required(val, 'El grupo es requerido'),
              (val: string) => only_number(val),
              (val: string | number) => max_length(val, 2)]"
            @update:model-value="models.group = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Grupo</p>
            <p class="text-weight-medium no-margin">
              {{ models.group ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
      <q-separator :class="action === 'create' ? 'q-mt-sm' : 'q-mt-lg'" />
    </section>

    <section v-if="['view'].includes(action)" class="q-mt-lg">
      <div>
        <p class="text-weight-bold no-margin text-black-90 size-18">
          Historial de la calificación
        </p>

        <div class="row q-mt-md q-col-gutter-x-lg q-col-gutter-y-sm">
          <div
            :class="[
              'col-xs-12 col-sm-12',
              ['view'].includes(action) ? 'col-md-3' : '',
            ]"
          >
            <p class="text-weight-bold text-black-90 mb-0">
              Fecha de creación<span v-if="action !== 'view'">*</span>
            </p>
            <p class="text-black-90 mb-3">
              {{ models.history_qualification?.created_at ?? 'No registrado' }}
            </p>
          </div>
          <div
            :class="[
              'col-xs-12 col-sm-12',
              ['view'].includes(action) ? 'col-md-3' : '',
            ]"
          >
            <p class="text-weight-bold text-black-90 mb-0">
              Creado por<span v-if="action !== 'view'">*</span>
            </p>
            <p class="text-black-90 mb-3">
              {{
                models.history_qualification?.creator_data ?? 'No registrado'
              }}
            </p>
          </div>
          <div
            :class="[
              'col-xs-12 col-sm-12',
              ['view'].includes(action) ? 'col-md-3' : '',
            ]"
          >
            <p class="text-weight-bold text-black-90 mb-0">
              Modificación<span v-if="action !== 'view'">*</span>
            </p>
            <p class="text-black-90 mb-3">
              {{ models.history_qualification?.updated_at ?? 'No registrado' }}
            </p>
          </div>
          <div
            :class="[
              'col-xs-12 col-sm-12',
              ['view'].includes(action) ? 'col-md-3' : 'col-md-4',
            ]"
          >
            <p class="text-weight-bold text-black-90 mb-0">
              Modificado por<span v-if="action !== 'view'">*</span>
            </p>
            <p class="text-black-90 mb-3">
              {{ models.history_qualification?.update_data ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
      <q-separator :class="action === 'create' ? 'q-mt-sm' : 'q-mt-lg'" />
    </section>
  </q-form>
</template>

<script lang="ts" setup>
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

import useInformationForm from '@/components/Forms/InvestmentPortfolio/Qualifications/Information/InformationForm'

import { IQualificationsForm } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'
import { useRules } from '@/composables'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IQualificationsForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IQualificationsForm | null): void
}>()

const { is_required, max_length, only_number } = useRules()

const { models, formElementRef, qualification_actions } = useInformationForm(
  props,
  emits
)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
