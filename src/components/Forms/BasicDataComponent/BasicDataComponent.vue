<template>
  <section>
    <q-form ref="GroundsForBankRefundDataRef">
      <div class="mx-3 mt-0 mb-3">
        <div class="row q-col-gutter-lg mt-1">
          <div
            class="col-xs-12 col-sm-12"
            :class="['create'].includes(action) ? 'col-md-6' : 'col-md-12'"
          >
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              label="Nombre"
              :default_value="models.name"
              required
              placeholder="Inserte"
              :rules="[
              (v: string) => useRules().is_required(v, 'El nombre es requerido'),
            ]"
              @update:model-value="models.name = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Nombre</p>
              <p class="text-weight-medium no-margin">
                {{ models.name ?? 'No registrado' }}
              </p>
            </div>
          </div>
          <div
            v-show="['edit', 'view'].includes(action)"
            class="col-12 col-md-4"
          >
            <GenericInput
              v-if="['edit'].includes(action)"
              label="Código"
              :default_value="models.causal_code"
              required
              disabled
              placeholder="Inserte"
              :rules="[
              (v: string) => useRules().is_required(v, 'El código es requerido'),
            ]"
              @update:model-value="models.causal_code = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Código</p>
              <p class="text-weight-medium no-margin">
                {{ models.causal_code ?? 'No registrado' }}
              </p>
            </div>
          </div>
          <div
            class="col-xs-12 col-sm-12"
            :class="['create'].includes(action) ? 'col-md-6' : 'col-md-4'"
          >
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Aplica"
              :default_value="models.apply"
              required
              placeholder="Seleccione"
              :rules="[(v: string) => useRules().is_required(v)]"
              @update:model-value="models.apply = $event"
              :manual_option="reason_return_apply"
              :map_options="true"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Aplica</p>
              <p class="text-weight-medium no-margin">
                {{ models.apply ?? 'No registrado' }}
              </p>
            </div>
          </div>
          <div
            class="col-12 col-md-4"
            v-show="['edit', 'view'].includes(action)"
          >
            <GenericSelectorComponent
              v-if="['edit'].includes(action)"
              label="Estado"
              :default_value="models.status_id"
              required
              placeholder="Seleccione"
              :rules="[(v: string) => useRules().is_required(v)]"
              @update:model-value="models.status_id = $event"
              :manual_option="reason_return_status"
              :map_options="true"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Estado</p>
              <p class="text-weight-medium no-margin">
                {{ models.status_id ?? 'No registrado' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </q-form>
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit'
    data?: IGroundsBankRefund | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'

// Logic View
import useBasicDataComponent from './BasicDataComponent'

// utils
import { useRules } from '@/composables'
import { IGroundsBankRefund } from '@/interfaces/customs'

const {
  models,
  GroundsForBankRefundDataRef,
  reason_return_apply,
  reason_return_status,
} = useBasicDataComponent(props)

defineExpose({
  validateForm: () => GroundsForBankRefundDataRef.value?.validate(),
})
</script>
