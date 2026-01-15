<template>
  <q-form ref="informationFormRef" aria-label="Formulario de información">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <section
          aria-label="Sección de datos generales"
          class="row col-12 q-col-gutter-x-md q-col-gutter-y-sm"
        >
          <div class="col-12" :class="isView ? 'col-md-3' : 'col-md-4'">
            <GenericInputComponent
              v-if="!isView"
              :default_value="formData.code"
              label="Código"
              placeholder="Inserte"
              type="text"
              required
              :rules="[
              (v: string) => useRules().is_required(v, 'El código es requerido'),
              (v: string) => useRules().max_length(v, 2),
              (v: string) => useRules().only_number(v),
            ]"
              @update:modelValue="formData.code = $event"
            />
            <div class="text-black-90" v-else>
              <p id="lbl-code" class="text-weight-bold no-margin">Código</p>
              <p
                class="text-weight-medium no-margin"
                aria-labelledby="lbl-code"
              >
                {{ formData.code || '-' }}
              </p>
            </div>
          </div>

          <div class="col-12" :class="isView ? 'col-md-3' : 'col-md-4'">
            <GenericInputComponent
              v-if="!isView"
              :default_value="formData.description"
              label="Descripción"
              placeholder="Inserte"
              type="text"
              required
              :rules="[
              (v: string) => useRules().is_required(v, 'La descripción es requerida'),
              (v: string) => useRules().max_length(v, 80),
            ]"
              @update:modelValue="formData.description = $event"
            />
            <div class="text-black-90" v-else>
              <p id="lbl-description" class="text-weight-bold no-margin">
                Descripción
              </p>
              <p
                class="text-weight-medium no-margin"
                aria-labelledby="lbl-description"
              >
                {{ formData.description || '-' }}
              </p>
            </div>
          </div>

          <div class="col-12" :class="isView ? 'col-md-3' : 'col-md-4'">
            <GenericSelectorComponent
              v-if="!isView"
              :default_value="formData.guy"
              label="Tipo"
              placeholder="Seleccione"
              :manual_option="risk_rating_agencies['form']"
              map_options
              required
              auto_complete
              :rules="[
              (v: string) => useRules().is_required(v, 'El tipo es requerido'),
            ]"
              @update:modelValue="formData.guy = $event"
            />
            <div v-else class="text-black-90">
              <p id="lbl-guy" class="text-weight-bold no-margin">Tipo</p>
              <p class="text-weight-medium no-margin" aria-labelledby="lbl-guy">
                {{ useUtils().capitalize(formData.guy) || '-' }}
              </p>
            </div>
          </div>
        </section>

        <div class="col-12">
          <q-separator :class="isView ? 'q-my-md' : 'q-mt-md q-mb-lg'" />
        </div>

        <section
          v-if="isView"
          aria-label="Sección de historial de cambios"
          class="row col-12 q-col-gutter-x-md q-col-gutter-y-sm"
        >
          <div class="col-12">
            <p class="text-weight-bold text-h6" aria-level="2">
              Historial de cambios
            </p>
          </div>

          <div class="col-12 col-md-3 text-black-90">
            <p id="lbl-created_at" class="text-weight-bold no-margin">
              Fecha de creación
            </p>
            <p
              class="text-weight-medium no-margin"
              aria-labelledby="lbl-created_at"
            >
              {{ formData.history_risk_rating_agencie?.created_at || '-' }}
            </p>
          </div>

          <div class="col-12 col-md-3 text-black-90">
            <p id="lbl-creator_data" class="text-weight-bold no-margin">
              Creado por
            </p>
            <p
              class="text-weight-medium no-margin"
              aria-labelledby="lbl-creator_data"
            >
              {{ formData.history_risk_rating_agencie?.creator_data || '-' }}
            </p>
          </div>

          <div class="col-12 col-md-3 text-black-90">
            <p id="lbl-updated_at" class="text-weight-bold no-margin">
              Modificación
            </p>
            <p
              class="text-weight-medium no-margin"
              aria-labelledby="lbl-updated_at"
            >
              {{ formData.history_risk_rating_agencie?.updated_at || '-' }}
            </p>
          </div>

          <div class="col-12 col-md-3 text-black-90">
            <p id="lbl-update_data" class="text-weight-bold no-margin">
              Modificado por
            </p>
            <p
              class="text-weight-medium no-margin"
              aria-labelledby="lbl-update_data"
            >
              {{ formData.history_risk_rating_agencie?.update_data || '-' }}
            </p>
          </div>

          <div class="col-12">
            <q-separator class="q-my-md" />
          </div>
        </section>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

import { useRules, useUtils } from '@/composables'

import { IRiskRatingAgencies } from '@/interfaces/customs'
import { risk_rating_agencies } from '@/constants'
import { ActionType } from '@/interfaces/global'

import useInformationForm from '@/components/Forms/InvestmentPortfolio/RiskRatingAgencie/InformationForm/InformationForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IRiskRatingAgencies
  }>(),
  {}
)

const { isView, formData, informationFormRef } = useInformationForm(props)

defineExpose({
  getValues: () => formData.value,
  validateForm: () => informationFormRef.value?.validate(),
})
</script>
