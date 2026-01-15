<template>
  <q-form ref="formRef">
    <section aria-label="Datos básicos">
      <VCard v-if="props.action === 'edit'" class="q-mb-md">
        <template #content-card>
          <div class="q-pa-md">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <GenericInputComponent
                  label="Código novedad"
                  :default_value="formData.novelty_type_code || '-'"
                  readonly
                />
              </div>

              <div class="col-12 col-md-4">
                <GenericInputComponent
                  label="Estado"
                  :default_value="props.auditInfo?.status || '-'"
                  readonly
                />
              </div>

              <div class="col-12 col-md-4">
                <GenericInputComponent
                  label="Fecha de creación"
                  :default_value="props.auditInfo?.created_at || '-'"
                  readonly
                />
              </div>

              <div class="col-12 col-md-4">
                <GenericInputComponent
                  label="Creado por"
                  :default_value="props.auditInfo?.created_by || '-'"
                  readonly
                />
              </div>

              <div class="col-12 col-md-4">
                <GenericInputComponent
                  label="Fecha de actualización"
                  :default_value="props.auditInfo?.updated_at || '-'"
                  readonly
                />
              </div>

              <div class="col-12 col-md-4">
                <GenericInputComponent
                  label="Actualizado por"
                  :default_value="props.auditInfo?.updated_by || '-'"
                  readonly
                />
              </div>
            </div>
          </div>
        </template>
      </VCard>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            v-if="!isViewMode"
            :default_value="formData.creation_date"
            label="Fecha de creación"
            mask="YYYY-MM-DD HH:mm"
            :rules="[]"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha de creación</p>
            <p class="text-weight-medium no-margin">
              {{ formData.creation_date ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="!isViewMode"
            :default_value="formData.fixed_asset_id"
            label="Activo fijo o bien"
            placeholder="Seleccione"
            auto_complete
            map_options
            :manual_option="fixed_assets_configuration_subtypes"
            :rules="[
                  (val: string) =>
                    useRules().is_required(
                      val,
                      'El activo fijo o bien es requerido'
                    ),
                ]"
            :required="true"
            @update:model-value="formData.fixed_asset_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Activo fijo o bien</p>
            <p class="text-weight-medium no-margin">
              {{ fixedAssetLabel }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="!isViewMode"
            :default_value="formData.novelty_type_id"
            label="Tipo de novedad"
            placeholder="Seleccione"
            map_options
            :manual_option="novelty"
            :rules="[
                  (val: string) =>
                    useRules().is_required(
                      val,
                      'El tipo de novedad es requerido'
                    ),
                ]"
            :required="true"
            @update:model-value="formData.novelty_type_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de novedad</p>
            <p class="text-weight-medium no-margin">
              {{ formData.novelty_type_description ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="!isViewMode"
            :default_value="formData.generates_accounting"
            label="¿Genera contabilidad?"
            placeholder="Seleccione"
            :manual_option="default_yes_no"
            map_options
            :rules="[
  (val: boolean) =>
    useRules().is_required_boolean(val, 'Genera contabilidad es requerido'),
]"
            :required="true"
            @update:model-value="formData.generates_accounting = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">¿Genera contabilidad?</p>
            <p class="text-weight-medium no-margin">
              {{
                formData.generates_accounting === true
                  ? 'Sí'
                  : formData.generates_accounting === false
                  ? 'No'
                  : '-'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="!isViewMode"
            :default_value="formData.asset_affectation"
            label="Afectación al activo"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Afectación al activo</p>
            <p class="text-weight-medium no-margin">
              {{ formData.asset_affectation ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            v-if="!isViewMode"
            :default_value="formData.estimated_solution_date"
            label="Fecha estimada de solución"
            mask="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            :rules="[
                  (val: string) =>
                    useRules().is_required(
                      val,
                      'La fecha estimada de solución es requerida'
                    ),
                ]"
            @update:model-value="formData.estimated_solution_date = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha estimada de solución</p>
            <p class="text-weight-medium no-margin">
              {{ formData.estimated_solution_date ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-if="!isViewMode"
            v-model="formData.cost"
            label="Costo"
            placeholder="$"
            :rules="[
                  (val: string) =>
                    useRules().is_required(
                      val,
                      'El costo es requerido'
                    ),
                ]"
            currency="COP"
            :hideIcon="true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Costo</p>
            <p class="text-weight-medium no-margin">
              {{ formData.cost ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12">
          <GenericInputComponent
            v-if="!isViewMode"
            :default_value="formData.description"
            label="Descripción de la novedad"
            type="textarea"
            :rules="[
                  (val: string) =>
                    useRules().is_required(
                      val,
                      'La descripción de la novedad es requerida'
                    ),
                ]"
            @update:modelValue="formData.description = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Descripción de la novedad</p>
            <p class="text-weight-medium no-margin">
              {{ formData.description ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12">
          <GenericInputComponent
            v-if="!isViewMode"
            :default_value="formData.additional_observation"
            label="Observación adicional (Opcional)"
            type="textarea"
            @update:modelValue="formData.additional_observation = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Observación adicional</p>
            <p class="text-weight-medium no-margin">
              {{ formData.additional_observation ?? '-' }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import useFixedAssetNoveltyForm from '@/components/Forms/FixedAssets/RegisterAuthhorizationsChanges/InformationForm/InformationForm'

// Interfaces - constants
import { ActionType } from '@/interfaces/global'
import {
  IFixedAssetNoveltyFormData,
  INoveltyAuditInfo,
} from '@/interfaces/customs/fixed-assets/v1/Register-Authorization-Changes'

// Composables
import { useRules } from '@/composables/useRules'

const props = defineProps<{
  action: ActionType
  data?: IFixedAssetNoveltyFormData
  auditInfo?: INoveltyAuditInfo | null
}>()

const {
  formRef,
  formData,
  isViewMode,
  default_yes_no,
  fixed_assets_configuration_subtypes,
  novelty,
  fixedAssetLabel,
  resetForm,
} = useFixedAssetNoveltyForm(props)

defineExpose({
  resetForm,
  getValues: () => formData.value,
  validateForm: () => formRef.value?.validate(),
})
</script>
