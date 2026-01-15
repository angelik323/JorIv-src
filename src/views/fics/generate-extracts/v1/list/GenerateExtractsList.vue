<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      btn-label="Crear"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('GenerateExtractsCreate')"
    >
      <FiltersComponent
        show_actions
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="handleClearFilters"
      />

      <NoDataState
        v-if="isGenerateExtractsEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <div v-else class="q-pt-md q-my-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :columns="tableProps.columns"
          :pages="tableProps.pages"
          :custom-columns="['file_name', 'status_id', 'details', 'actions']"
          @update-page="handleUpdatePage"
          @update-rows-per-page="handleUpdateRowsPerPage"
        >
          <template #file_name="{ row }">
            <div class="row items-center justify-start">
              <img
                class="image-excel q-mr-sm"
                src="@/assets/images/folder.svg"
                alt="Folder Icon"
              />
              {{ row.file_name || 'N/A' }}
            </div>
          </template>

          <template #status_id="{ row }">
            <ShowStatus
              :type="Number(row?.status_id ?? 1)"
              :clickable="false"
            />
          </template>

          <template #details="{ row }">
            <Button
              v-if="row.status_id === 84"
              flat
              :left-icon="defaultIconsLucide.info"
              colorIcon="#f45100"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              tooltip="Detalle"
              @click="handleOptions('detail', row.id)"
            />
          </template>

          <template #actions="{ row }">
            <Button
              v-if="row.status_id !== 84"
              flat
              :left-icon="defaultIconsLucide.folder"
              colorIcon="#f45100"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              tooltip="Ruta"
              @click="handleOptions('download', row.id)"
            />
            <Button
              v-if="row.status_id === 30"
              flat
              :left-icon="defaultIconsLucide.send"
              colorIcon="#f45100"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              tooltip="Reenviar"
              @click="handleOptions('resend', row.id)"
            />
          </template>
        </TableList>
      </div>

      <AlertModalComponent
        ref="detailModalRef"
        styleModal="min-width: 500px"
        titleHeader="No se envío el extracto"
        :showBtnConfirm="false"
        :showBtnCancel="false"
        :showImgDefault="false"
        :showCloseBtn="true"
      >
        <template #default-body>
          <div class="q-mx-lg q-px-lg text-black-90">
            <p class="text-weight-bold no-margin">Motivo</p>
            <p class="text-weight-medium no-margin">{{ errorMessage }}</p>
          </div>
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useGenerateExtractsList from '@/views/fics/generate-extracts/v1/list/GenerateExtractsList'

const {
  goToURL,
  showState,
  tableProps,
  headerProps,
  handleFilter,
  filterConfig,
  errorMessage,
  handleOptions,
  detailModalRef,
  handleUpdatePage,
  handleClearFilters,
  defaultIconsLucide,
  handleUpdateRowsPerPage,
  isGenerateExtractsEmpty,
} = useGenerateExtractsList()
</script>
