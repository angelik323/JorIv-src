<template>
  <q-form ref="formInformation">
    <section>
      <div class="mx-3 mt-0 mb-3">
        <div class="row q-col-gutter-lg mt-1">
          <div class="col-12 col-md-4">
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              disabled
              :default_value="models.name"
              type="text"
              required
              :label="'Nombre del negocio'"
              :rules="[]"
              @update:model-value="models.name = $event"
            />
            <template v-else>
              <p
                class="text-weight-medium mb-0"
                :class="['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'"
              >
                Nombre del negocio
              </p>
              <p class="text-grey-6 mb-0">
                {{ models.name ?? 'No registrado' }}
              </p>
            </template>
          </div>

          <div class="col-12 col-md-4">
            <GenericDateInputComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.start_date"
              required
              disabled
              :label="'Fecha inicio'"
              :rules="[]"
              @update:modelValue="models.start_date = $event"
            />
            <template v-else>
              <p
                class="text-weight-medium mb-0"
                :class="['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'"
              >
                Fecha inicio
              </p>
              <p class="text-grey-6 mb-0">
                {{ models.start_date ?? 'No registrado' }}
              </p>
            </template>
          </div>

          <div class="col-12 col-md-4">
            <GenericDateInputComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.end_date"
              required
              disabled
              :label="'Fecha final'"
              :rules="[]"
              @update:modelValue="models.end_date = $event"
            />
            <template v-else>
              <p
                class="text-weight-medium mb-0"
                :class="['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'"
              >
                Fecha final
              </p>
              <p class="text-grey-6 mb-0">
                {{ models.end_date ?? 'No registrado' }}
              </p>
            </template>
          </div>

          <div class="col-12 col-md-4">
            <GenericDateInputComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.extension_date"
              required
              :option_calendar="only_after(models.end_date || '')"
              :disabled="action === 'edit' && hasInitialExtensionDate"
              :label="'Fecha prórroga'"
              :rules="[
              (val: string) =>
               useRules().is_required(val, 'La fecha de prórroga es requerida'),
              (val: string) =>
                useRules().date_after_or_equal_to_specific_date(
                  val,
                  models.end_date || ''
                ),
            ]"
              @update:modelValue="models.extension_date = $event"
            />
            <template v-else>
              <p
                class="text-weight-medium mb-0"
                :class="['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'"
              >
                Fecha prórroga
              </p>
              <p class="text-grey-6 mb-0">
                {{ models.extension_date ?? 'No registrado' }}
              </p>
            </template>
          </div>

          <div class="col-12 col-md-4" v-if="action === 'edit' && hasInitialExtensionDate">
            <GenericDateInputComponent
              v-if="['edit'].includes(action)"
              :default_value="models.new_extension_date"
              required
              :label="'Nueva fecha de prórroga'"
              :option_calendar="only_after(minAllowedDate)"
              :rules="[
              (val: string) =>
               useRules().is_required(val, 'La nueva fecha de prórroga es requerida'),
              (val: string) =>
                useRules().date_after_specific_date(
                  val,
                  models.extension_date || ''
                ),
            ]"
              @update:modelValue="models.new_extension_date = $event"
            />
            <template v-else>
              <p
                class="text-weight-medium mb-0"
                :class="['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'"
              >
                Nueva fecha de prórroga
              </p>
              <p class="text-grey-6 mb-0">
                {{ models.new_extension_date ?? 'No registrado' }}
              </p>
            </template>
          </div>

          <div class="col-12">
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.observation"
              type="textarea"
              required
              :label="'Observación'"
              :rules="[
                (v: string) =>  useRules().is_required(v, 'Las observaciones son requeridas'),
                (v: string) =>  useRules().max_length(v,100),

              ]"
              @update:model-value="models.observation = $event"
            />
            <template v-else>
              <p
                class="text-weight-medium mb-0"
                :class="['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'"
              >
                Observación
              </p>
              <p class="text-grey-6 mb-0">
                {{ models.observation ?? 'No registrado' }}
              </p>
            </template>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// vue
import { computed } from 'vue'

// components
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'

// logic
import useInformationForm from './InformationForm'

// interfaces
import { IExtendTrustInterface } from '@/interfaces/customs'

// composables
import { useRules, useCalendarRules } from '@/composables'
import moment from 'moment'

const { only_after } = useCalendarRules()

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit' | 'view'
    data?: IExtendTrustInterface | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const { models, formInformation, hasInitialExtensionDate } = useInformationForm(props)

const minAllowedDate = computed(() => {
  const extensionDate = models.value.extension_date || ''
  const today = moment().format('YYYY-MM-DD')
  return moment(extensionDate).isAfter(today) ? extensionDate : today
})

defineExpose({
  validateForm: () => formInformation.value?.validate(),
})
</script>
