<template>
  <q-form ref="formInformation">
    <section>
      <div class="mx-3 mt-0 mb-3">
        <div class="row q-col-gutter-lg mt-1">
          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Código de negocio{{ ['edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericInput
              v-if="['edit'].includes(action)"
              disabled
              :default_value="models.business_code"
              type="text"
              required
              :rules="[]"
              @update:model-value="models.business_code = $event"
            />
          </div>

          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Descripción negocio{{ ['edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericInput
              v-if="['edit'].includes(action)"
              disabled
              :default_value="models.name"
              type="text"
              required
              :rules="[]"
              @update:model-value="models.business_code = $event"
            />
          </div>

          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Estado actual{{ ['edit'].includes(action) ? '*' : '' }}
            </p>
            <ShowStatus :type="props.data?.status_id ?? 0" />
          </div>

          <div class="col-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Nuevo estado{{ ['edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericSelectorComponent
              v-if="['edit'].includes(action)"
              :manual_option="business_trust_change_status"
              :map_options="true"
              :required="true"
              :default_value="models.status_id"
              :auto_complete="true"
              @update:modelValue="models.status_id = $event"
              :rules="[(v: string) =>  useRules().is_required(v, 'El estado es requerido')]"
            />
          </div>

          <div class="col-12">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Observación{{ ['edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericInput
              v-if="['edit'].includes(action)"
              :default_value="models.observation"
              type="textarea"
              required
              :rules="[
                (v: string) =>  useRules().is_required(v, 'Las observaciones son requeridas'),
                (v: string) =>  useRules().min_length(v, 20),
                (v: string) =>  useRules().max_length(v, 500)
              ]"
              @update:model-value="models.observation = $event"
            />
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// logic
import useInformationForm from './InformationForm'

// interfaces
import { IChangeTrustStatusRequest } from '@/interfaces/customs'

// composables
import { useRules } from '@/composables'

const props = withDefaults(
  defineProps<{
    action: 'edit' | 'view'
    data?: IChangeTrustStatusRequest | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const { models, formInformation, business_trust_change_status } =
  useInformationForm(props)

defineExpose({
  validateForm: () => formInformation.value?.validate(),
})
</script>
