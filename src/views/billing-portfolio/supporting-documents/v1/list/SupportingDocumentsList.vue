<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      :btn-label="
        validateRouter('BillingCollection', 'SupportingDocumentsList', 'create')
          ? 'Crear'
          : undefined
      "
      @to="goToURL('SupportingDocumentsCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClear"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['actions', 'status']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #status="{ row }">
            <ShowStatus :type="row.status.id" status-type="billingPortfolio" />
          </template>
          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'BillingCollection',
                  'SupportingDocumentsList',
                  'show'
                )
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              @click="goToURL('SupportingDocumentsView', { id: row.id })"
            />
            <Button
              v-if="
                validateRouter(
                  'BillingCollection',
                  'SupportingDocumentsList',
                  'export'
                )
              "
              :left-icon="defaultIconsLucide.download"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Descargar"
              @click="handleDownloadSupportingDocument(row.id)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// Logic view
import useSupportingDocumentsList from '@/views/billing-portfolio/supporting-documents/v1/list/SupportingDocumentsList'

const {
  headerProps,
  tableProps,
  filterConfig,
  defaultIconsLucide,

  handleFilter,
  updatePage,
  updatePerPage,
  handleClear,
  goToURL,
  validateRouter,
  handleDownloadSupportingDocument,
} = useSupportingDocumentsList()
</script>
