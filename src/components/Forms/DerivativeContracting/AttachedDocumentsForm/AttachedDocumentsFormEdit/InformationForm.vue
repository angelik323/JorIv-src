<template>
  <q-form ref="formElementRef">
    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <GenericInput
            label="Código"
            placeholder="PRE023"
            :default_value="models.code"
            required
            :disabled="true"
            :rules="[
              (val: string) => is_required(val, 'El código es requerido'),
              (val: string) => max_length(val, 5),
            ]"
            @update:model-value="models.code = $event"
          />
        </div>
        <div class="col-12 col-md-6">
          <GenericInput
            label="Nombre documento anexo"
            placeholder="Inserte"
            :default_value="models.name"
            required
            :disabled="action === 'edit'"
            :rules="[
              (val: string) => is_required(val, 'El nombre del documento anexo es requerido'),
              ]"
            @update:model-value="models.name = $event"
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <p
            class="text-weight-medium mb-0"
            :class="
              ['view'].includes(action) ? 'text-black-90 ' : 'text-grey-7'
            "
          >
            Etapa
          </p>
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            placeholder="Seleccione"
            :manual_option="stage"
            :map_options="true"
            :required="true"
            :default_value="models.stage"
            :auto_complete="true"
            @update:modelValue="models.stage = $event"
            :rules="[(val: string) => !!val || is_required(val, 'La etapa es requerida' )]"
          />
          <p v-else class="text-grey-7 mb-0">
            {{ models.stage ?? 'No registrado' }}
          </p>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import { ActionType } from '@/interfaces/global'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import useInformationForm from '@/components/Forms/DerivativeContracting/AttachedDocumentsForm/InformationForm'
import { IAttachedDocumentForm } from '@/interfaces/customs/AttachedDocuments'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IAttachedDocumentForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IAttachedDocumentForm | null): void
}>()

const { formElementRef, models, is_required, stage, max_length } = useInformationForm(
  props,
  emits
)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
