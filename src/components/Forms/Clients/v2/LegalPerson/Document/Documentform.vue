<template>
  <q-form ref="formDocument" class="q-pa-lg">
    <section v-if="['create', 'edit'].includes(action)">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Adjuntar documentos
        </p>
        <p class="text-grey-6 text-weight-medium q-mb-lg">
          Proporcione los documentos necesarios para completar el
          diligenciamiento del cliente como personal jurídica.
        </p>
        <p class="color__text--red-wine text-weight-medium q-mb-none">
          Importante: Los documentos soporte que sean enviados del extranjero,
          deben ser apostillados
        </p>
      </div>
    </section>

    <template v-if="['create', 'edit'].includes(action)">
      <section class="q-pl-md q-mt-lg q-mb-xl">
        <UploadDocument
          v-for="element in dataUpload"
          :key="element.position"
          @changeFile="(file: File) => handleFileChange(file, element.title, element.required)"
          :class="element.class"
          :title="element.title"
          :subtitle="element.subtitle"
          :required="element.required"
          :activeButton="element.file !== null"
        />
      </section>
    </template>

    <section>
      <TableList
        :title="tableProperties.title"
        :loading="tableProperties.loading"
        :rows="tableProperties.rows"
        :columns="tableProperties.columns"
        :custom-columns="['actions']"
        :hide-header="tableProperties.rows.length === 0"
        hide-pagination
        :rows-per-page-options="[0]"
      >
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

          <q-btn
            v-if="['create', 'edit'].includes(action)"
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
import { IDocumentIndirectForm, IClientLegalPersonIndirectTributaryForm } from '@/interfaces/customs/clients/ClientIndirectLegalPerson'
import { ActionType } from '@/interfaces/global'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IDocumentIndirectForm | null
    tributaryDataForm: IClientLegalPersonIndirectTributaryForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IDocumentIndirectForm | null): void
}>()

const {
  dataUpload,
  tableProperties,
  defaultIcons,
  handleFileChange,
  redirectToViewDocument,
  deleteDocument,
} = useDocumentForm(props, emits)

defineExpose({
  validateForm: () => {
    return dataUpload.every((element) => {
      if (!element.required) return true
      return props.data?.documents.some(
        (file) => file.document_type === element.title
      )
    })
  },
})
</script>
