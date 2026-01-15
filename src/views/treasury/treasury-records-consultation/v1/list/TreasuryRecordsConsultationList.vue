<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          ref="filtersRef"
          :fields="filterConfig"
          trigger_event_by_field
          @filter="handleFilter"
          @clear-filters="handleClear"
          @update:values="onFilterChange"
          @show-more="handleShowMoreFilters"
          :buttons="['more_filters']"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :columns="tableProps.columns"
          :pages="tableProps.pages"
          :custom-columns="['status', 'record_status_id', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #record_status_id="{ row }">
            <div class="q-pa-md">
              <ShowStatus :type="row.status?.id ?? 55" status-type="treasury" />
            </div>
          </template>

          <template #status="{ row }">
            <div class="q-pa-md">
              <ShowStatus
                :type="row.authorization?.status?.id ?? 55"
                status-type="treasury"
              />
            </div>
          </template>

          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'Treasury',
                  'TreasuryRecordsConsultationList',
                  'show'
                )
              "
              :right-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="handleOptions('view', row.id)"
            />
          </template>

          <template #custom-header-action>
            <Button
              :outline="true"
              label="Descargar excel"
              :leftImg="excelIcon"
              :disabled="tableProps.rows.length === 0"
              tooltip="Descargar excel"
              @click="downloadExcel()"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>

    <AlertModalComponent
      ref="alertModalRef"
      styleModal=" max-width: 700px; width: 100%;"
      :showImgDefault="false"
      :show-btn-cancel="false"
      :show-btn-confirm="false"
      margin-top-body=""
    >
      <template #default-body>
        <TreasuryRecordsConsultationData :data="findRowByRegisterId()" />
      </template>
    </AlertModalComponent>
  </div>
</template>

<script setup lang="ts">
//components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import TreasuryRecordsConsultationData from '@/components/Forms/Treasury/TreasuryRecordsConsultation/information/TreasuryRecordsConsultationData.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
// logic list
import useTreasuryRecordsConsultationList from './TreasuryRecordsConsultationList'
import excelIcon from '@/assets/images/excel.svg'
import { defaultIconsLucide } from '@/utils'

const {
  // Props
  headerProps,
  filterConfig,
  tableProps,
  alertModalRef,
  filtersRef,

  // Methods
  findRowByRegisterId,
  handleFilter,
  handleClear,
  onFilterChange,
  downloadExcel,
  updatePage,
  updatePerPage,
  handleShowMoreFilters,
  handleOptions,
  validateRouter,
} = useTreasuryRecordsConsultationList()
</script>
