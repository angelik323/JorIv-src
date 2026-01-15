<template>
  <div>
    <!-- Table for Annex Documents (Master) -->
    <section class="q-mt-md">
      <TableList
        :title="tableProps_annex_document.title"
        :loading="tableProps_annex_document.loading"
        :columns="tableProps_annex_document.columns"
        :rows="tableProps_annex_document.rows"
        :pages="tableProps_annex_document.pages"
        @update-page="updatePage"
        @update-rows-per-page="updatePerPage"
        @row-click="(_evt: unknown, row: IAnnexDocument) => handleRowClick(row)"
      >
        <template #effective_date="{ row }">
          {{ formatDate(row.effective_date, 'DD/MM/YYYY') }}
        </template>
        <template #expiration_date="{ row }">
          {{ formatDate(row.expiration_date, 'DD/MM/YYYY') }}
        </template>
      </TableList>
    </section>

    <!-- Separator Line -->
    <q-separator v-if="selectedAnnexRow && selectedAnnexRow.type?.type === 'poliza'" class="q-my-md" />

    <!-- Table for Annex Relation (Detail - Only shown for policies) -->
    <section v-if="selectedAnnexRow && selectedAnnexRow.type?.type === 'poliza'" class="q-mt-md">
      <TableList
        :title="tableProps_annex_relation.title"
        :loading="tableProps_annex_relation.loading"
        :columns="tableProps_annex_relation.columns"
        :rows="tableProps_annex_relation.rows"
        :pages="tableProps_annex_relation.pages"
        :hide-pagination="true"
      >
        <template #insured_value="{ row }">
          {{ formatCurrency(row.insured_value) }}
        </template>
        <template #start_validity_date="{ row }">
          {{ formatDate(row.start_validity_date, 'DD/MM/YYYY') }}
        </template>
        <template #end_validity_date="{ row }">
          {{ formatDate(row.end_validity_date, 'DD/MM/YYYY') }}
        </template>
      </TableList>
    </section>

    <!-- Separator Line -->
    <q-separator v-if="selectedAnnexRow && selectedAnnexRow.type?.type === 'poliza'" class="q-my-md" />

    <!-- Table for Policy Coverage (Detail - Only shown for policies) -->
    <section v-if="selectedAnnexRow && selectedAnnexRow.type?.type === 'poliza'" class="q-mt-md">
      <TableList
        :title="tableProps_policy_coverage.title"
        :loading="tableProps_policy_coverage.loading"
        :columns="tableProps_policy_coverage.columns"
        :rows="tableProps_policy_coverage.rows"
        :pages="tableProps_policy_coverage.pages"
        :hide-pagination="true"
      >
        <template #coverage_percentage="{ row }">
          {{ row.coverage_percentage }}%
        </template>
        <template #coverage_max_value="{ row }">
          {{ formatCurrency(row.coverage_max_value) }}
        </template>
      </TableList>

      
    </section>

    <q-separator v-if="selectedAnnexRow" class="q-my-md" />

    <section v-if="selectedAnnexRow" class="q-mt-md">
      <TableList
        :title="tableProps_attached_documents.title"
        :loading="tableProps_attached_documents.loading"
        :columns="tableProps_attached_documents.columns"
        :rows="tableProps_attached_documents.rows"
        :pages="tableProps_attached_documents.pages"
        :custom-columns="['actions']"
        :hide-pagination="true"
      >
        <template #date_loading="{ row }">
          {{ formatDate(row.date_loading, 'DD/MM/YYYY') }}
        </template>

         <template #actions>
             <Button
               :left-icon="defaultIconsLucide.eye"
               color="orange"
               :class-custom="'custom'"
               :outline="false"
               :flat="true"
               colorIcon="#f45100"
               :tooltip="'ver'"
               @click="selectedAnnexRow && openModalView(selectedAnnexRow.id, selectedAnnexRow.source)"
             />
         </template>
      </TableList>
    </section>
    <!-- Modal for Document Details -->
    <AlertModalComponent
      ref="alertModalViewRef"
      marginTopBody="mt-0 "
      marginTopActions="mt-0"
      classTitle="mt-0"
      styleModal="min-width: 80%"
      :showImgDefault="false"
      :title="alertModalViewConfig.title"
      :description_message="''"
      @confirm="alertModalViewRef.closeModal()"
    >
      <template #default-body>
        <div class="q-pa-md">
           <div v-if="document_file_view && document_file_view.presigned_url" class="row justify-center">
             <iframe
               :src="document_file_view.presigned_url"
               style="width: 100%; height: 600px;"
               frameborder="0"
             >
             </iframe>
           </div>
           <div v-else class="text-center q-pa-md">
             No se pudo cargar el archivo o no hay información disponible.
           </div>
        </div>
      </template>
    </AlertModalComponent>
  </div>
</template>

<script setup lang="ts">

// Components
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// logic
import useAnnexDocumentList from '@/components/Lists/DerivativeContracting/GeneralContractInquiry/AnnexDocument/AnnexDocumentList'
import { IAnnexDocument } from '@/interfaces/customs/derivative-contracting/GeneralContractInquiry'

const props = withDefaults(
  defineProps<{
    contractId?: number | null
  }>(),
  {
    contractId: null,
  }
)

const annexDocumentList = useAnnexDocumentList(props)

// Destructure the needed properties and methods
const {
  formatDate,
  formatCurrency,
  defaultIconsLucide,
  tableProps_annex_document,
  tableProps_annex_relation,
  tableProps_policy_coverage,
  tableProps_attached_documents,
  updatePage,
  updatePerPage,
  handleRowClick,
  selectedAnnexRow,
  openModalView,
  alertModalViewRef,
  alertModalViewConfig,
  document_file_view
} = annexDocumentList

</script>
