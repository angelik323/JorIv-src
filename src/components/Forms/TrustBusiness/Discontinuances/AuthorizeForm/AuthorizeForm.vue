<template>
  <q-form ref="formAuthorize">
    <section>
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Autorizaciones
        </p>
      </div>

      <div class="row q-col-gutter-lg mt-1">
        <div class="col-12">
          <GenericInput
            :readonly="'view'.includes(action)"
            label="Observaciones"
            :default_value="models.observation"
            type="textarea"
            :required="!'view'.includes(action)"
            :rules="!'view'.includes(action) ? [              
                (val: string) => is_required(val, 'Las observaciones son requeridas'),
                (val: string) => min_length(val, 20),
                (val: string) => max_length(val, 500),
            ] : []"
            @update:modelValue="models.observation = $event"
          />
        </div>
      </div>
      <q-separator class="mt-2"></q-separator>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// components
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'

// logic
import useAuthorizeForm from './AuthorizeForm'

const props = withDefaults(
  defineProps<{
    action: 'view' | 'authorize'
    data?: string
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: string): void
}>()

const { models, formAuthorize, is_required, max_length, min_length } =
  useAuthorizeForm(props, emits)

defineExpose({
  validateForm: () => formAuthorize.value?.validate(),
})
</script>
