<template>
  <q-form ref="formInformation">
    <section>
      <div class="mx-3 mt-2 mb-3">
        <div class="q-mb-lg">
          <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
            Información general
          </p>
        </div>

        <div class="row q-col-gutter-lg mt-1">
          <div class="col-12 col-xs-4 col-md-4">
            <GenericSelector
              v-if="['create', 'edit'].includes(props.action)"
              :label="`ID Fideicomiso`"
              auto_complete
              first_filter_option="label"
              second_filter_option="value"
              :manual_option="business_trusts"
              :map_options="true"
              :required="true"
              :disabled="['edit'].includes(action)"
              :default_value="models.business_id"
              @update:modelValue="models.business_id = $event"
              :rules="[(v) => useRules().is_required(v)]"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Fideicomiso</p>
              <p class="text-weight-medium no-margin">
                {{ models.business_name }}
              </p>
            </div>
          </div>

          <div class="col-12 col-xs-4 col-md-4">
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              label="Nombre del fideicomiso"
              :default_value="models.name"
              type="text"
              :required="false"
              :rules="[]"
              disabled
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Nombre del fideicomiso</p>
              <p class="text-weight-medium no-margin">
                {{ models.name }}
              </p>
            </div>
          </div>

          <div class="col-12 col-xs-4 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Estado General
            </p>
            <ShowStatus :type="Number(models.state_id ?? 0)" />
          </div>

          <div class="col-12 col-xs-4 col-md-4">
            <GenericSelector
              v-if="['create', 'edit'].includes(props.action)"
              :label="`Tipo de cesión`"
              auto_complete
              first_filter_option="label"
              second_filter_option="value"
              :manual_option="participant_types"
              :map_options="true"
              :required="true"
              :disabled="['edit'].includes(action)"
              :default_value="models.participant_type_id"
              @update:modelValue="models.participant_type_id = $event"
              :rules="[(v) => useRules().is_required(v)]"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Tipo de cesión</p>
              <p class="text-weight-medium no-margin">
                {{ models.transfer_type }}
              </p>
            </div>
          </div>

          <div class="col-12 col-xs-4 col-md-4">
            <GenericDateInputComponent
              v-if="['create', 'edit'].includes(props.action)"
              label="Fecha de registro"
              :default_value="models.date"
              :required="false"
              disabled
              :rules="[]"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Fecha de registro</p>
              <p class="text-weight-medium no-margin">
                {{ models.date }}
              </p>
            </div>
          </div>

          <div
            class="col-12 col-xs-4 col-md-4"
            v-if="!['create'].includes(props.action)"
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Estado registro cesión
            </p>
            <ShowStatus :type="Number(models.state_register ?? 0)" />
          </div>
        </div>
        <q-separator class="mt-2"></q-separator>
      </div>
    </section>
  </q-form>

  <div v-if="isValidData">
    <TablesInformation
      ref="formTables"
      :action="props.action"
      :status="Number(props.data?.status?.id)"
    />
  </div>
</template>

<script setup lang="ts">
// components
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelector from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import TablesInformation from './TablesInformation/TablesInformation.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// logic
import useInformationForm from './InformationForm'

// interfaces
import { IResponseRecordTransfers } from '@/interfaces/customs'

// composables
import { useRules } from '@/composables'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit' | 'view' | 'authorize'
    data?: IResponseRecordTransfers | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const {
  models,
  formInformation,
  business_trusts,
  participant_types,
  isValidData,
  formTables,
} = useInformationForm(props)

defineExpose({
  validateForm: async () =>
    (await formInformation.value?.validate()) &&
    (await formTables.value?.validateForm()),
})
</script>
