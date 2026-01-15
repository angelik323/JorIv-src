<template>
  <q-form ref="formElementRef" aria-label="Formulario de datos básicos">
    <section>
      <div class="row items-end q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="models.certificate_type_id"
            label="Tipos de certificados"
            auto_complete
            map_options
            :manual_option="certificate_types"
            required
            :rules="[
                (val: string) => useRules().is_required(val, 'El tipo de certificado es requerido'),
                ]"
            @update:model-value="models.certificate_type_id = $event"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericInputComponent
            :default_value="models.name"
            label="Nombre de certificado"
            placeholder="Inserte"
            @update:model-value="models.name = $event"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            :default_value="models.person_type_id"
            label="Tipo de persona"
            placeholder="Seleccione"
            auto_complete
            map_options
            :manual_option="person_types"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El tipo de persona es requerido'),
              ]"
            @update:model-value="models.person_type_id = $event"
          />
        </div>
        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            ref="periodRef"
            placeholder="-"
            mask="YYYY-MM-DD"
            label="Fecha de registro"
            required
            disabled
            :default_value="models.generation_date"
            :rules="[(val: string) => useRules().is_required(val, 'La fecha de generación es requerida')]"
            @update:model-value="models.generation_date = $event"
          />
        </div>
      </div>
      <q-separator :class="action === 'create' ? 'q-mt-sm' : 'q-mt-lg'" />

      <div class="form-section q-mt-md">
        <div class="row items-center justify-between">
          <div class="col-auto">
            <p class="text-h6 text-bold q-mb-none">Certificado</p>
          </div>

          <div class="col-auto row q-gutter-sm">
            <Button
              left-icon="PlusCircle"
              label="Agregar variables fijas"
              :class-custom="'custom'"
              color-icon="white"
              :outline="false"
              no-caps
              size="md"
              @click="openFixedVariablesModal"
            />
            <Button
              left-icon="PlusCircle"
              color-icon="white"
              label="Agregar imágenes"
              :class-custom="'custom'"
              size="md"
              :outline="false"
              no-caps
              @click="openUploadVariablesModal"
            />
          </div>
        </div>
      </div>
      <div class="q-mt-md">
        <WysiwygComponent
          :default_value="
            models.html_content ||
            'Encabezado <br> --- <br> Cuerpo del certificado <br> --- <br> Pie de página'
          "
          :required="false"
          placeholder="Ingrese una descripción detallada..."
          height="200px"
          class_name="col-12"
          hint="Puede usar formato enriquecido"
          @update:modelValue="handleEditorUpdate"
        />
      </div>
    </section>
    <AlertModalComponent
      ref="fixedVariablesModalRef"
      title-header="Variables"
      styleModal="max-width: 500px; width: 100%; padding-top: 20px;"
      marginTopBody="mt-0"
      marginTopActions="mt-0"
      :show-img-default="false"
      :show-btn-confirm="false"
      :show-btn-cancel="false"
      :show-close-btn="true"
    >
      <template #default-body>
        <FixedVariablesForm
          ref="fixedVariablesRef"
          :onAddVariable="handleAddFixedVariable"
        />
      </template>
    </AlertModalComponent>
    <AlertModalComponent
      ref="uploadVariablesModalRef"
      title-header="Variables"
      styleModal="max-width: 950px; width: 100%; padding-top: 20px;"
      marginTopBody="mt-0"
      marginTopActions="mt-0"
      :show-img-default="false"
      :show-btn-confirm="true"
      :show-btn-cancel="true"
      :show-close-btn="true"
      @close="cleanUploadVariablesModal"
      @confirm="handleConfirmUpload"
    >
      <template #default-body>
        <UploadVariablesForm ref="uploadVariablesRef" />
      </template>
    </AlertModalComponent>
  </q-form>
</template>

<script lang="ts" setup>
// components
import FixedVariablesForm from '@/components/Forms/Normative/FixedVariablesForm/FixedVariablesForm.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import WysiwygComponent from '@/components/common/Wysiwyg/WysiwygComponent.vue'
import UploadVariablesForm from '@/components/Forms/Normative/UploadVariablesForm/UploadVariablesForm.vue'
// interfaces
import { ICertifiedParametersInformationForm } from '@/interfaces/customs/normative/CertifiedParameters'
import { WriteActionType } from '@/interfaces/global'
// composables
import { useRules } from '@/composables/useRules'
// logic
import useInformationForm from '@/components/Forms/Normative/CertifiedParameters/Information/InformationForm'

const props = withDefaults(
  defineProps<{
    data: ICertifiedParametersInformationForm | null
    action: WriteActionType
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'update:data', value: ICertifiedParametersInformationForm): void
}>()

const {
  models,
  formElementRef,
  handleEditorUpdate,
  fixedVariablesRef,
  fixedVariablesModalRef,
  handleAddFixedVariable,
  openUploadVariablesModal,
  uploadVariablesModalRef,
  uploadVariablesRef,
  cleanUploadVariablesModal,
  handleConfirmUpload,
  certificate_types,
  person_types,
  getUploadFiles,
  openFixedVariablesModal,
} = useInformationForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
  getUploadFiles,
})
</script>
