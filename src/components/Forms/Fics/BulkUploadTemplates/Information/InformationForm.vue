<template>
  <q-form
    ref="informationFormRef"
    class="q-pa-lg"
    aria-label="Formulario de datos básicos del fondo"
  >
    <section v-if="['create'].includes(action)">
      <div class="row col-12 items-center justify-between q-px-md">
        <p class="q-mb-none mt-1 text-weight-medium">Operación</p>
        <RadioYesNo
          v-model="models.operation"
          class="q-mt-none"
          @update:modelValue="models.operation = $event"
          :options="operation_bulk_upload_template"
        />
      </div>
      <q-separator class="my-20" />

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Descripción de plantilla"
            :default_value="models.description"
            required
            placeholder="Inserte"
            :rules="[
              (val: string) => useRules().is_required(val, 'Descripción de plantilla es requerida'),
              (val: string) => useRules().max_length(val, 200),

            ]"
            @update:model-value="models.description = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Descripción de plantilla</p>
            <p class="text-weight-medium no-margin">
              {{ 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Forma de pago / Recaudo"
            :default_value="models.transaction_method_id"
            required
            :disabled="['edit'].includes(action)"
            placeholder="Seleccione"
            :rules="[
               (val: string) => useRules().is_required(val, 'Forma de pago / Recaudo es requerido'),

            ]"
            @update:model-value="models.transaction_method_id = $event"
            :manual_option="models.transaction_method_options"
            map_options
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Forma de pago / Recaudo</p>
            <p class="text-weight-medium no-margin">
              {{ 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
      <q-separator class="my-20" />
    </section>
    <section v-else>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-xs-12 col-sm-12 col-md-4">
          <p class="text-weight-bold text-black-90 mb-0">Operación</p>
          <p class="text-black-90 mb-3">
            {{ models.operation ? models.operation : 'No registrado' }}
          </p>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4">
          <p class="text-weight-bold text-black-90 mb-0">
            Descripción de plantilla
          </p>
          <p class="text-black-90 mb-3">
            {{ models.description ? models.description : 'No registrado' }}
          </p>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4">
          <p class="text-weight-bold text-black-90 mb-0">
            Forma de pago / Recaudo
          </p>
          <p class="text-black-90 mb-3">
            {{
              models.transaction_method_id
                ? models.transaction_method_id
                : 'No registrado'
            }}
          </p>
        </div>
      </div>
      <q-separator class="my-20" />
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

// Interfaces
import { IBulkUploadTemplatesList } from '@/interfaces/customs/fics/BulkUploadTemplates'
import { ActionType } from '@/interfaces/global'

// Composables
import { useRules } from '@/composables'

// Logic view
import useInformationForm from '@/components/Forms/Fics/BulkUploadTemplates/Information/InformationForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IBulkUploadTemplatesList
  }>(),
  {}
)

const { models, informationFormRef, operation_bulk_upload_template } =
  useInformationForm(props)

defineExpose({
  validateForm: () => informationFormRef.value?.validate(),
  models,
})
</script>
<style lang="scss" src="./InformationForm.scss" />
