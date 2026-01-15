<template>
  <q-form ref="informationFormRef">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-md">
        <div class="col-12 col-md-4">
          <GenericInputComponent
            v-if="!isView"
            :default_value="formData.mandate_code"
            disabled
            label="Número del encargo"
            placeholder="-"
            required
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Número del encargo</p>
            <p class="text-weight-medium no-margin">
              {{ formData.mandate_code || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            v-if="!isView"
            :default_value="formData.name"
            :disabled="isEdit"
            :rules="[
              (val: string) =>
                useRules().is_required(
                  val,
                  'El nombre de encargo es requerido'
                ),
              (val: string) => useRules().max_length(val, 40),
            ]"
            label="Nombre del encargo"
            placeholder="Inserte"
            required
            @update:modelValue="formData.name = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nombre del encargo</p>
            <p class="text-weight-medium no-margin">
              {{ formData.name || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="!isView"
            :default_value="formData.business_trust_id"
            :disabled="isEdit"
            :manual_option="business"
            :rules="[
              (val: string) =>
                useRules().is_required(
                  val,
                  'El nombre del negocio es requerido'
                ),
            ]"
            auto_complete
            label="Nombre del negocio"
            map_options
            placeholder="Seleccione"
            required
            @update:modelValue="formData.business_trust_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nombre del negocio</p>
            <p class="text-weight-medium no-margin">
              <p class="text-weight-medium no-margin">
                {{
                  formData.business_trust
                    ? `${formData.business_trust.business_code} - ${formData.business_trust.name}`
                    : '-'
                }}
              </p>
            </p>
          </div>
        </div>

        <div :class="isView ? 'col-md-4' : 'col-md-3'" class="col-12">
          <GenericSelectorComponent
            v-if="!isView"
            :default_value="formData.real_estate_project_id"
            :disabled="isEdit || !formData.business_trust_id"
            :manual_option="project"
            :rules="[
              (val: string) =>
                useRules().is_required(
                  val,
                  'El proyecto inmobiliario asociado es requerido'
                ),
            ]"
            auto_complete
            label="Proyecto inmobiliario asociado"
            map_options
            placeholder="Seleccione"
            required
            @update:modelValue="formData.real_estate_project_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Proyecto inmobiliario asociado
            </p>
            <p class="text-weight-medium no-margin">
              {{ formData.real_estate_project?.project_name || '-' }}
            </p>
          </div>
        </div>

        <div :class="isView ? 'col-md-4' : 'col-md-3'" class="col-12">
          <GenericSelectorComponent
            v-if="!isView"
            :default_value="formData.stage_id"
            :disabled="isEdit || !formData.real_estate_project_id"
            :manual_option="stage"
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'La etapa es requerida'),
            ]"
            auto_complete
            label="Etapa"
            map_options
            placeholder="Seleccione"
            required
            @update:modelValue="formData.stage_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Etapa</p>
            <p class="text-weight-medium no-margin">
              {{ formData.stage?.stage_number || '-' }}
            </p>
          </div>
        </div>

        <div :class="isView ? 'col-md-4' : 'col-md-3'" class="col-12">
          <GenericInputComponent
            v-if="!isView"
            :default_value="formData.currency"
            disabled
            label="Moneda"
            placeholder="-"
            required
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Moneda</p>
            <p class="text-weight-medium no-margin">
              {{ formData.currency || '-' }}
            </p>
          </div>
        </div>

        <div :class="isView ? 'col-md-4' : 'col-md-3'" class="col-12">
          <GenericSelectorComponent
            v-if="!isView"
            :default_value="formData.investment_fund_id"
            :disabled="!formData.business_trust_id"
            :manual_option="funds"
            :rules="[
              (val: string) =>
                useRules().is_required(
                  val,
                  'El fondo de inversión asociado es requerido'
                ),
            ]"
            auto_complete
            label="Fondo de inversión asociado"
            map_options
            placeholder="Seleccione"
            required
            @update:modelValue="formData.investment_fund_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Fondo de inversión asociado
            </p>
            <p class="text-weight-medium no-margin">
              {{ formData.investment_fund || '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="!isView"
            :default_value="formData.status_id"
            :manual_option="status"
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'El estado es requerido'),
            ]"
            auto_complete
            label="Estado"
            map_options
            placeholder="Seleccione"
            required
            @update:modelValue="formData.status_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Estado</p>
            <p class="text-weight-medium no-margin">
              {{ formData.status || '-' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="q-mt-md">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">Saldos</p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-md">
        <div
          v-for="(item, index) in fiduciary_trust_fields['balances']"
          :key="index"
          class="col-12 col-md-4"
        >
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">
              {{ item.label }}
            </p>
            <p class="text-weight-medium no-margin">{{ item.value }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="q-mt-md">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Deducción e impuestos
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-md">
        <div
          v-for="(item, index) in fiduciary_trust_fields['deductions']"
          :key="index"
          class="col-12 col-md-4"
        >
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">
              {{ item.label }}
            </p>
            <p class="text-weight-medium no-margin">{{ item.value }}</p>
          </div>
        </div>
      </div>
    </section>

    <div class="col-12">
      <q-separator class="q-mt-md q-mb-lg" />
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

import { IFiduciaryTrust } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'
import { useRules } from '@/composables'

import useBasicDataForm from '@/components/Forms/TrustBusiness/FiduciaryTrust/BasicData'
import { fiduciary_trust_fields } from '@/constants'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IFiduciaryTrust
  }>(),
  {}
)

const {
  stage,
  funds,
  status,
  isView,
  isEdit,
  project,
  business,
  formData,
  informationFormRef,
} = useBasicDataForm(props)

defineExpose({
  getValues: () => formData.value,
  validateForm: () => informationFormRef.value?.validate(),
})
</script>
