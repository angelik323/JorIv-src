<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      :btn-label="
        validateRouter(
          'BillingCollection',
          'GenerateInvoicesOtherConceptsList',
          'create'
        )
          ? 'Crear'
          : undefined
      "
      @to="goToURL('InvoiceGenerationOtherItemsCreate')"
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
            <ShowStatus
              :type="Number(row?.status.id ?? 1)"
              status-type="billingPortfolio"
            />
          </template>

          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'BillingCollection',
                  'GenerateInvoicesOtherConceptsList',
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
              @click="
                goToURL('InvoiceGenerationOtherItemsView', { id: row.id })
              "
            />

            <Button
              v-if="
                validateRouter(
                  'BillingCollection',
                  'GenerateInvoicesOtherConceptsList',
                  'show'
                )
              "
              :left-icon="defaultIconsLucide.eyeFile"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver factura"
              @click="viewFile(row.pdf_signed_url)"
            />

            <Button
              v-if="
                validateRouter(
                  'BillingCollection',
                  'GenerateInvoicesOtherConceptsList',
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
              @click="handleDownloadFile(row.pdf_signed_url)"
            />
          </template>
        </TableList>

        <ViewerFileComponent ref="viewerFileComponentRef" />
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
import ViewerFileComponent from '@/components/common/ViewerFile/ViewerFileComponent.vue'

// Logic view
import useInvoiceGenerationOtherItemsList from '@/views/billing-portfolio/invoice-generation-other-items/v1/list/InvoiceGenerationOtherItemsList'

const {
  headerProps,
  tableProps,
  filterConfig,
  defaultIconsLucide,
  viewerFileComponentRef,

  handleFilter,
  updatePage,
  updatePerPage,
  handleClear,
  handleDownloadFile,
  validateRouter,
  goToURL,
  viewFile,
} = useInvoiceGenerationOtherItemsList()
</script>
