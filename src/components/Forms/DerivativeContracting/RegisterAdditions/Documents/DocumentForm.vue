<template>
  <q-form ref="formDocument">
    <section class="q-pa-lg">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Documentos anexos
        </p>
      </div>

      <template v-if="['create', 'edit'].includes(action)">
        <section class="q-pl-md q-mt-lg">
          <UploadDocument
            v-for="element in dataUpload"
            :key="element.position"
            :file="(element.file as IFile)"
            @update:file="element.file = $event"
            @changeFile="
              (file: File | null) => handleFileChange(file, element.title ?? '')
            "
            :class="element.class"
            :title="element.title"
            :subtitle="element.subtitle"
            :required="element.required"
            displayMode="file"
            :view-close-file="['create', 'edit'].includes(action)"
            :download-file="['create'].includes(action)"
          />
        </section>
      </template>

      <template v-else>
        <section class="q-pl-md q-mt-lg">
          <TableList
            :loading="tablePropsDocuments.loading"
            :columns="tablePropsDocuments.columns"
            :rows="tablePropsDocuments.rows"
            :hide-pagination="true"
            :rows-per-page-options="[0]"
            :custom-columns="['actions']"
          >
            <template #actions="{ row }" v-if="['view'].includes(props.action)">
              <Button
                :left-icon="defaultIconsLucide.eye"
                color="orange"
                class-custom="custom"
                :outline="false"
                flat
                colorIcon="#f45100"
                tooltip="Descargar documento"
                @click="downloadFile(row)"
              />
            </template>
          </TableList>
        </section>
      </template>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import {
  IBasicDataFormAdditions,
  IDocumentsFormAdditions,
  IFile,
} from '@/interfaces/customs/derivative-contracting/RegisterAdditions'
import { ActionType } from '@/interfaces/global'

import UploadDocument from '@/components/common/UploadDocument/UploadDocument.vue'
import useDocumentForm from '@/components/Forms/DerivativeContracting/RegisterAdditions/Documents/DocumentForm'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IDocumentsFormAdditions | null
    basic_data: IBasicDataFormAdditions | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IDocumentsFormAdditions | null): void
}>()

const {
  dataUpload,
  formDocument,
  tablePropsDocuments,
  defaultIconsLucide,
  handleFileChange,
  downloadFile,
} = useDocumentForm(props, emits)

defineExpose({
  validateForm: () => {
    return dataUpload.value.every((element) => {
      if (!element.required) return true
      if (element.file) return true
      return false
    })
  },
})
</script>
