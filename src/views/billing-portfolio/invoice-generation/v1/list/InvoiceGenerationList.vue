<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter(
          'BillingCollection',
          'GenerationCommissionInvoicesList',
          'create'
        )
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('GenerationCommissionInvoicesCreate')"
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
            <ShowStatus :type="row.status_id" status-type="billingPortfolio" />
          </template>

          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'BillingCollection',
                  'GenerationCommissionInvoicesList',
                  'show'
                ) && row.status_id !== 12
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
                  'GenerationCommissionInvoicesList',
                  'export'
                ) && row.status_id !== 12
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
import useInvoiceGenerationList from '@/views/billing-portfolio/invoice-generation/v1/list/InvoiceGenerationList'

const {
  headerProps,
  tableProps,
  filterConfig,
  viewerFileComponentRef,
  defaultIconsLucide,

  handleFilter,
  updatePage,
  updatePerPage,
  handleDownloadFile,
  viewFile,
  handleClear,
  validateRouter,
  goToURL,
} = useInvoiceGenerationList()
</script>
