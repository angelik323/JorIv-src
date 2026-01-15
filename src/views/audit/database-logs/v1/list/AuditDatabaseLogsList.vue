<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerConfig.title"
      :breadcrumbs="headerConfig.breadcrumbs"
      :btn-label="headerConfig.btn.label"
      :btn-icon="headerConfig.btn.icon"
      :btn-disable="!isEnabledEditAction()"
      @to="handleGoToList"
    >
      <FiltersComponent
        ref="filtersRef"
        :fields="filtersConfig"
        @filter="handleFilterSearch"
        @clear-filters="handleClearFilters"
      />
      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="customCols"
          @update-page="handleUpdatePage"
          @update-rows-per-page="handleUpdateRowsPerPage"
        >
          <template #custom-header-action>
            <section class="row items-center q-gutter-md">
              <Button
                v-if="isEnabledDownloadAction()"
                label="Generar excel"
                tooltip="Generar excel"
                outline
                :leftImg="excelIcon"
                :disabled="!isEnabledDownloadBtn"
                @click=""
              />
              <Button
                v-if="isEnabledDownloadAction()"
                label="Generar PDF"
                tooltip="Generar PDF"
                outline
                :leftImg="pdfIcon"
                :disabled="!isEnabledDownloadBtn"
                @click=""
              />
            </section>
          </template>
          <template
            #new_data="{ row }: { row: IAuditDatabaseActivityLogsListItem }"
          >
            <Button
              v-if="row.new_data !== 'N/A'"
              class-custom="custom"
              color="orange"
              colorIcon="#f45100"
              flat
              tooltip="Ver"
              :left-icon="defaultIconsLucide.eye"
              :outline="false"
              @click="handleOpenModal(row, true)"
            />
            <div v-else>Sin información</div>
          </template>

          <template
            #old_data="{ row }: { row: IAuditDatabaseActivityLogsListItem }"
          >
            <Button
              v-if="row.old_data !== 'N/A'"
              class-custom="custom"
              color="orange"
              colorIcon="#f45100"
              flat
              tooltip="Ver"
              :left-icon="defaultIconsLucide.eye"
              :outline="false"
              @click="handleOpenModal(row, false)"
            />
            <div v-else>Sin información</div>
          </template>
        </TableList>
      </section>
    </ContentComponent>

    <AlertModalComponent
      ref="alertModalRef"
      :show-img-default="false"
      :show-btn-confirm="false"
      :show-btn-cancel="false"
      style-modal="min-width: 40%; max-height: 90%"
      margin-top-body="q-mt-none"
      @close="handleCloseModal"
    >
      <template #default-body>
        <div class="row justify-center mx-4">
          <GenericInputComponent
            readonly
            autogrow
            :label="modalLabel"
            :type="'textarea'"
            :default_value="modalContent"
          />
        </div>
      </template>
    </AlertModalComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'

// Interfaces
import { IAuditDatabaseActivityLogsListItem } from '@/interfaces/customs/audit/AuditDatabaseLogs'

// Assets
import excelIcon from '@/assets/images/excel.svg'
import pdfIcon from '@/assets/images/pdf.svg'

// Logic
import useAuditDatabaseLogsList from '@/views/audit/database-logs/v1/list/AuditDatabaseLogsList'

const {
  // composable refs and variables
  defaultIconsLucide,

  // composable functions

  // Refs and computed props
  headerConfig,
  filtersRef,
  filtersConfig,
  tableProps,
  customCols,
  isEnabledDownloadBtn,
  alertModalRef,
  modalContent,
  modalLabel,

  // Functions/Methods
  isEnabledDownloadAction,
  isEnabledEditAction,
  handleGoToList,
  handleClearFilters,
  handleFilterSearch,
  handleUpdatePage,
  handleUpdateRowsPerPage,
  handleOpenModal,
  handleCloseModal,
} = useAuditDatabaseLogsList()
</script>
