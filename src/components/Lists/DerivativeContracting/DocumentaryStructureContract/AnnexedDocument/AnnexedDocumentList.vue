<template>
  <section class="q-pa-lg">
    <div class="flex justify-between items-start q-mb-md">
      <p class="text-weight-bold text-h6 no-margin">
        {{ tableProps.title }}
      </p>

      <Button
        no-caps
        unelevated
        label="Nuevo documento"
        :left-icon="defaultIconsLucide.plusCircleOutline"
        color-icon="white"
        text-color="white"
        :outline="false"
        color="primary"
        @click="handleAddRow"
      />
    </div>

    <TableList
      :loading="tableProps.loading"
      :rows="tableProps.rows"
      :columns="tableProps.columns"
      :pages="tableProps.pages"
      :custom-columns="[
        'type_attached_document',
        'stage',
        'mandatory',
        'status_id',
      ]"
      @update-page="updatePage"
      @update-rows-per-page="updatePerPage"
    >
      <template #type_attached_document="{ row }">
        <GenericSelectorComponent
          :default_value="row.type_attached_document.value"
          placeholder="Seleccione"
          :manual_option="availableDocumentTypesCompositeIdentifier"
          auto_complete
          map_options
          required
          :rules="[
            (val) => !!val || 'El campo tipo de documento es obligatorio',
          ]"
          @update:modelValue="updateAttachedDocument(row, $event)"
        />
      </template>

      <template #stage="{ row }">
        <GenericSelectorComponent
          :default_value="row.stage"
          placeholder="Seleccione"
          :manual_option="contract_document_structure_stage"
          auto_complete
          map_options
          required
          :rules="[(val) => !!val || 'El campo etapa es obligatorio']"
          @update:modelValue="row.stage = $event"
        />
      </template>

      <template #mandatory="{ row }">
        <GenericSelectorComponent
          :default_value="row.mandatory"
          placeholder="Seleccione"
          :manual_option="definition_documentation_mandatory"
          auto_complete
          map_options
          required
          :rules="[(val) => !!val || 'El campo obligatoriedad es obligatorio']"
          @update:modelValue="row.mandatory = $event"
        />
      </template>

      <template #status_id="{ row }">
        <CustomToggle
          v-if="action === 'edit'"
          :value="row.status_id === StatusID.ACTIVE"
          :width="100"
          :height="30"
          checked-text="Activo"
          unchecked-text="Inactivo"
          readonly
          @click="hanldeChangeStatus(row)"
        />
      </template>

      <template #actions="{ row }">
        <Button
          flat
          :outline="false"
          :left-icon="defaultIconsLucide.trash"
          color-icon="#f45100"
          :class-custom="'custom'"
          tooltip="Eliminar"
          @click="handleDeleteRow(row.id)"
        />
      </template>
    </TableList>
  </section>
</template>

<script setup lang="ts">
// Components
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'

// Interfaces
import { StatusID, ActionType } from '@/interfaces/global'
import { IDocumentaryStructureContractAnnexedDocumentList } from '@/interfaces/customs/derivative-contracting/DocumentaryStructureContract'

// Logic form
import useAnnexedDocumentList from '@/components/Lists/DerivativeContracting/DocumentaryStructureContract/AnnexedDocument/AnnexedDocumentList'

const emit = defineEmits<{
  (
    e: 'update:annexed-document-list',
    value: IDocumentaryStructureContractAnnexedDocumentList
  ): void
}>()

const props = withDefaults(
  defineProps<{
    action: ActionType
    annexedDocumentList?: IDocumentaryStructureContractAnnexedDocumentList
    documentaryStructureContractId?: number
  }>(),
  {}
)

const {
  tableProps,
  defaultIconsLucide,
  contract_document_structure_stage,
  definition_documentation_mandatory,
  availableDocumentTypesCompositeIdentifier,

  updatePage,
  updatePerPage,
  handleAddRow,
  handleDeleteRow,
  hanldeChangeStatus,
  updateAttachedDocument,
} = useAnnexedDocumentList(props, emit)
</script>
