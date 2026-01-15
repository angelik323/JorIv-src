<template>
  <section
    class="q-mt-sm justify-center q-gutter-md ml-2 mr-4 mt-0 editable-table"
  >
    <q-form ref="regulation_trust_business_form_ref">
      <TableList
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :custom-columns="['document_name', 'description', 'actions']"
        :rows="paginated"
        :pages="tableProps.pages"
        @updatePage="(val) => (tableProps.pages.currentPage = val)"
        @updateRowsPerPage="
          (val) => {
            pageSize = val
            tableProps.pages.currentPage = 1
          }
        "
      >
        <template #custom-header>
          <div>
            <p class="q-my-none text-weight text-h6">
              {{ tableProps.title }}
            </p>
          </div>
          <q-space />
          <div class="row q-col-gutter-sm" style="width: 100%">
            <div class="col-12">
              <div class="row justify-end">
                <Button
                  v-if="props.action !== 'view'"
                  label="Agregar"
                  size="md"
                  unelevated
                  outline
                  class="text-capitalize btn-filter custom"
                  @click="addRowTable"
                />
              </div>
            </div>
          </div>
        </template>

        <template #document_name="{ row }">
          <div class="flex items-center justify-center">
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :default_value="row.document_name"
              :placeholder="''"
              type="text"
              :class_name="'full-width'"
              @update:modelValue="row.document_name = $event"
              :required="true"
              :rules="[
                (v: string) => useRules().is_required(v, 'El nombre es requerido')
              ]"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ row.document_name ?? 'No registrado' }}
            </p>
          </div>
        </template>

        <template #description="{ row }">
          <div class="flex items-center justify-center">
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :default_value="row.description"
              :placeholder="''"
              type="text"
              :class_name="'full-width'"
              @update:modelValue="row.description = $event"
              :required="true"
              :rules="[
                (v: string) => useRules().is_required(v, 'La descripción es requerida'),
              ]"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ row.description ?? 'No registrado' }}
            </p>
          </div>
        </template>

        <template #actions="{ row }">
          <Button
            :left-icon="defaultIconsLucide.trash"
            color="orange"
            class-custom="custom"
            :outline="false"
            flat
            colorIcon="#f45100"
            tooltip="Eliminar"
            @click="openAlertModal(row)"
          />
        </template>
      </TableList>
    </q-form>
  </section>

  <AlertModalComponent
    ref="alertModalRef"
    styleModal="min-width: 480px"
    title="¿Desea eliminar el documento?"
    @confirm="changeStatusAction"
  >
  </AlertModalComponent>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IRegulationTrustBusiness[] | null
  }>(),
  {}
)
// components
import TableList from '@/components/table-list/TableList.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// logic view
import useRelugationTrustBusiness from './RegulationTrustBusiness'

// interfaces
import { ActionType } from '@/interfaces/global/Action'
import { IRegulationTrustBusiness } from '@/interfaces/customs/trust-business/TrustBusinesses'

// composables
import { useRules } from '@/composables'

// utils
import { defaultIconsLucide } from '@/utils'

const emits =
  defineEmits<(e: 'update:models', value: IRegulationTrustBusiness[]) => void>()

const {
  tableProps,
  paginated,
  pageSize,
  regulation_trust_business_form_ref,
  alertModalRef,
  openAlertModal,
  changeStatusAction,
  addRowTable,
} = useRelugationTrustBusiness(props, emits)

defineExpose({
  validateForm: async () => {
    return await regulation_trust_business_form_ref.value?.validate()
  },
})
</script>
