<template>
  <q-form ref="formDocument" class="q-pa-lg">
    <section>
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Adjuntar documentos
        </p>
        <p
          v-if="['create', 'edit'].includes(action)"
          class="text-grey-6 text-weight-medium q-mb-lg"
        >
          Proporcione los documentos necesarios para completar el
          diligenciamiento del cliente como personal natural.
        </p>
        <p class="color__text--red-wine text-weight-medium q-mb-none">
          Importante: Los documentos soporte que sean enviados del extranjero,
          deben ser apostillados
        </p>
      </div>
    </section>

    <template v-if="['create', 'edit'].includes(action)">
      <section class="q-pl-md q-mt-lg">
        <UploadDocument
          v-for="element in dataUpload"
          :key="element.position"
          @changeFile="(file: File) => handleFileChange(file, element.title, element.required)"
          :class="element.class"
          :title="element.title"
          :subtitle="element.subtitle"
          :required="element.required"
          :activeButton="element.file !== null"
          accept-files="image/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        />
      </section>
    </template>

    <section class="q-mt-xl">
      <TableList
        :loading="tableProperties.loading"
        :rows="tableProperties.rows"
        :columns="tableProperties.columns"
        :custom-columns="['actions']"
        :hide-header="tableProperties.rows.length === 0"
        hide-pagination
      >
        <template #custom-header>
          <p
            v-show="tableProperties.rows.length !== 0"
            class="text-black text-weight-bold text-body1"
          >
            {{ tableProperties.title }}
          </p>
        </template>

        <!-- Actions -->
        <template #actions="{ row }">
          <q-btn
            flat
            rounded
            size="14px"
            :icon="defaultIcons.download"
            color="indigo-10"
            class="action"
            @click="redirectToViewDocument(row)"
          >
            <q-tooltip
              transition-show="flip-right"
              transition-hide="flip-left"
              class="primary"
            >
              <p class="q-ma-none text-body2">Descargar</p>
            </q-tooltip>
          </q-btn>

          <!-- Editar -->
          <q-btn
            v-if="false"
            flat
            rounded
            size="14px"
            :icon="defaultIcons.edit"
            color="indigo-10"
            class="action"
            @click="triggerFileInput(row.document_type)"
          >
            <q-tooltip class="primary">
              <p class="q-ma-none text-body2">Editar</p>
            </q-tooltip>
          </q-btn>

          <input
            type="file"
            :ref="(el) => {
            const inputEl = el as HTMLInputElement | null;
              if (inputEl) {
                fileInput[row.document_type] = inputEl;
              }
            }"
            class="hidden"
            @change="updateDocumentTable($event, row.document_type)"
          />

          <q-btn
            :disable="!['create', 'edit'].includes(action)"
            flat
            rounded
            size="14px"
            :icon="defaultIcons.trash"
            color="indigo-10"
            @click="deleteDocument(row.document_type)"
          >
            <q-tooltip
              transition-show="flip-right"
              transition-hide="flip-left"
              class="primary"
            >
              <p class="q-ma-none text-body2">Eliminar</p>
            </q-tooltip>
          </q-btn>
        </template>

        <template #custom-no-data>
          <div
            class="column justify-center items-center q-col-gutter-y-lg q-mt-sm"
          >
            <img
              src="@/assets/images/icons/no_data_2.svg"
              alt="No hay datos para mostrar"
              width="180px"
            />
            <p class="text-weight-bold text-h5 text-center">
              No hay datos para mostrar
            </p>
          </div>
        </template>
      </TableList>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import TableList from '@/components/table-list/TableList.vue'
import UploadDocument from '@/components/common/UploadDocument/UploadDocument.vue'
import useDocumentForm from './DocumentForm'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit' | 'view'
    data?: any | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const {
  dataUpload,
  formDocument,
  tableProperties,
  defaultIcons,
  fileInput,
  data_document_form,
  handleFileChange,
  redirectToViewDocument,
  deleteDocument,
  updateDocumentTable,
  triggerFileInput,
} = useDocumentForm(props)
defineExpose({
  validateForm: () => {
    return dataUpload.every((element) => {
      if (!element.required) return true
      return data_document_form.value?.files.some(
        (file) => file.document_type === element.title
      )
    })
  },
})
</script>
