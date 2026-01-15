<template>
  <section>
    <div class="q-mb-lg mt-2">
      <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
        Documentos contractuales
      </p>
    </div>
    <q-list>
      <q-expansion-item
        v-for="register in contractual_documents"
        :key="register.name"
        class="q-mb-md"
        expand-icon-class="text-black expansion-icon"
      >
        <template #header>
          <q-item-section>
            <div class="row q-col-gutter-sm">
              <div class="col-sm-12 col-md-9 center-content">
                <p class="text-weight-light text-h6 mb-0">
                  {{ `${register.name} ${register.is_required ? '*' : ''}` }}
                </p>
              </div>
              <div class="col-sm-12 col-md-3 self-center">
                <div class="row justify-end" v-if="register.show_button">
                  <Button
                    v-if="register.show_button"
                    :label="'Agregar'"
                    :size="'md'"
                    :unelevated="true"
                    :outline="true"
                    :color="'orange'"
                    :style-text="'color:black;'"
                    :class="'text-capitalize btn-filter custom'"
                    @click="
                      handleUploadFile(
                        register.name,
                        register.business_document_type,
                        register.business_document_section
                      )
                    "
                  />
                </div>
              </div>
            </div>
          </q-item-section>
        </template>

        <TableDocuments
          :hide_header="
            select_rows_by_type(register.business_document_type).length === 0
          "
          :data="select_rows_by_type(register.business_document_type) ?? []"
          :hide_actions="is_view"
          @update:delete="openAlertModal"
          @update:download="download_action"
        />
      </q-expansion-item>
    </q-list>
    <div class="q-mb-lg mt-2">
      <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
        Documentos de estructura de negocio
      </p>
    </div>
    <q-list>
      <q-expansion-item
        v-for="register in business_structure_documents"
        :key="register.name"
        class="q-mb-md"
        expand-icon-class="text-black expansion-icon"
      >
        <template #header>
          <q-item-section>
            <div class="row q-col-gutter-sm">
              <div class="col-sm-12 col-md-9 center-content">
                <p class="text-weight-light text-h6 mb-0">
                  {{ `${register.name} ${register.is_required ? '*' : ''}` }}
                </p>
              </div>
              <div class="col-sm-12 col-md-3 self-center">
                <div class="row justify-end" v-if="register.show_button">
                  <Button
                    v-if="register.show_button"
                    :label="'Agregar'"
                    :size="'md'"
                    :unelevated="true"
                    :outline="true"
                    :color="'orange'"
                    :style-text="'color:black;'"
                    :class="'text-capitalize btn-filter custom'"
                    @click="
                      handleUploadFile(
                        register.name,
                        register.business_document_type,
                        register.business_document_section
                      )
                    "
                  />
                </div>
              </div>
            </div>
          </q-item-section>
        </template>

        <TableDocuments
          :hide_header="
            select_rows_by_type(register.business_document_type).length === 0
          "
          :data="select_rows_by_type(register.business_document_type) ?? []"
          :hide_actions="is_view"
          @update:delete="openAlertModal"
          @update:download="download_action"
        />
      </q-expansion-item>
    </q-list>

    <AlertModalComponent
      ref="alertModalRef"
      styleModal="min-width: 480px"
      :title="alertModalConfig.description"
      @confirm="delete_action()"
    >
    </AlertModalComponent>
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IDocumentsTrustBusiness[] | null
    entityId?: number | string
  }>(),
  {}
)

const emits =
  defineEmits<(e: 'update:models', value: IDocumentsTrustBusiness[]) => void>()

// components
import Button from '@/components/common/Button/Button.vue'
import TableDocuments from './TableDocuments/TableDocuments.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// interfaces
import { ActionType } from '@/interfaces/global/Action'
import { IDocumentsTrustBusiness } from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'

// logic-view
import useDocumentsForm from './DocumentsForm'

const {
  contractual_documents,
  business_structure_documents,
  is_view,
  alertModalRef,
  alertModalConfig,

  openAlertModal,
  handleUploadFile,
  select_rows_by_type,
  delete_action,
  download_action,
  validateForm,
} = useDocumentsForm(props, emits)

defineExpose({
  validateForm,
})
</script>
