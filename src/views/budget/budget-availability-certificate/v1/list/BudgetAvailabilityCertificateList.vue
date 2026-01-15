<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <VCard>
        <template #content-card>
          <div class="q-pa-lg">
            <InformationForm
              ref="informationFormRef"
              action="edit"
              :data="{ description_society: lastDescriptionSociety }"
            />

            <div class="row justify-end q-gutter-md q-mt-xs">
              <Button
                no-caps
                label="Generar certificado"
                color-icon="white"
                text-color="white"
                :outline="false"
                color="primary"
                class="text-capitalize"
                @click="generateCertificate"
              />
            </div>
          </div>
        </template>
      </VCard>

      <section>
        <p class="text-weight-bold text-h4 q-mb-lg">
          Historial de certificados generados
        </p>

        <FiltersComponent :fields="filterConfig" @filter="handleFilter" />

        <div class="q-pt-md q-my-xl">
          <TableList
            :title="tableProps.title"
            :loading="tableProps.loading"
            :columns="tableProps.columns"
            :rows="tableProps.rows"
            :pages="tableProps.pages"
            :custom-columns="['status', 'actions']"
            @update-page="handleUpdatePage"
            @update-rows-per-page="handleUpdatePerPage"
          >
            <template #custom-header-action>
              <div class="row q-gutter-md">
                <Button
                  outline
                  class-custom="custom"
                  label="Creación masiva de certificados PDF"
                  color="orange"
                  :disabled="!canCreateBulkPdfCertificates"
                  :style-text="{ color: 'black' }"
                  :left-img="pdfIcon"
                  @click="handleBulkCertificateCreation"
                />

                <Button
                  outline
                  class-custom="custom"
                  label="Descargar certificado"
                  color="orange"
                  :disabled="canCreateBulkPdfCertificates"
                  :style-text="{ color: 'black' }"
                  :left-img="excelIcon"
                  @click="handleCertificatesGenerationStatus"
                />
              </div>
            </template>

            <template
              #status="{ row }: { row: IBudgetAvailabilityCertificateList }"
            >
              <ShowStatus
                statusType="budget"
                :type="row.operation_log.status?.id ?? 1"
              />

            </template>

            <template
              #actions="{ row }: { row: IBudgetAvailabilityCertificateList }"
            >
              <Button
                v-if="canViewCertificateDetail()"
                flat
                class-custom="custom"
                color="orange"
                colorIcon="#f45100"
                left-icon="Eye"
                :outline="false"
                :tooltip="'Ver'"
                @click="handleGoToShowView(row)"
              />

              <Button
                v-if="canExportCertificate()"
                flat
                class-custom="custom"
                color="orange"
                colorIcon="#f45100"
                left-icon="Download"
                :outline="false"
                :tooltip="'Descargar'"
                @click="handleDownloadCertificateById(row.id)"
              />
            </template>
          </TableList>
        </div>
      </section>
    </ContentComponent>

    <AlertModalComponent
      ref="alertModalRef"
      :title="alertModalConfig.title"
      :description_message="alertModalConfig.descriptionMessage"
      :show-btn-cancel="alertModalConfig.showBtnCancel"
      @confirm="handleCloseAlertModal"
    />
  </div>
</template>

<script lang="ts" setup>
// Components
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import InformationForm from '@/components/Forms/Budget/BudgetAvailabilityCertificate/InformationForm/InformationForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Interfaces
import { IBudgetAvailabilityCertificateList } from '@/interfaces/customs/budget/BudgetAvailabilityCertificate'

// Assets
import excelIcon from '@/assets/images/excel.svg'
import pdfIcon from '@/assets/images/pdf.svg'

// Logic view
import useBudgetAvailabilityCertificateList from '@/views/budget/budget-availability-certificate/v1/list/BudgetAvailabilityCertificateList'

const {
  tableProps,
  headerProps,
  filterConfig,
  lastDescriptionSociety,
  canCreateBulkPdfCertificates,
  informationFormRef,
  alertModalRef,
  alertModalConfig,
  handleFilter,
  handleUpdatePage,
  handleUpdatePerPage,
  generateCertificate,
  handleDownloadCertificateById,
  handleBulkCertificateCreation,
  handleCertificatesGenerationStatus,
  handleCloseAlertModal,
  handleGoToShowView,
  canViewCertificateDetail,
  canExportCertificate,
} = useBudgetAvailabilityCertificateList()
</script>
