<template>
  <q-form
    role="form"
    ref="authorizeFormRef"
    aria-label="Formulario de autorización"
  >
    <section aria-label="Sección de formulario de autorización">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12">
          <div class="q-my-lg">
            <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
              Autorización
            </p>
          </div>
        </div>
        <div class="col-12">
          <GenericInputComponent
            :default_value="models.observation"
            label="Observaciones"
            placeholder="Inserte"
            type="textarea"
            required
            :rules="[
              (val: string) =>
                useRules().is_required(val, 'Las observaciones son requeridas'),
                (val: string) => useRules().max_length(val, 100),
            ]"
            @update:model-value="models.observation = $event"
            v-if="['create'].includes(action)"
          />
          <div v-else class="text-black-90 mb-4">
            <p class="mb-0 text-weight-bold">Observaciones</p>
            <p class="text-weight-medium">
              {{ balance_point_response?.observation }}
            </p>
          </div>
        </div>
        <div class="col-12">
          <q-separator class="mb-4" />
        </div>
      </div>
    </section>
  </q-form>
</template>
<script lang="ts" setup>
withDefaults(
  defineProps<{
    action: ActionType
  }>(),
  {}
)
import { ActionType } from '@/interfaces/global'
import useAuthorizeBalancePointForm from './AuthorizeBalancePoint'
import { useRules } from '@/composables'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

const { models, authorizeFormRef, balance_point_response } =
  useAuthorizeBalancePointForm()

defineExpose({
  validateForm: () => authorizeFormRef.value?.validate(),
})
</script>
