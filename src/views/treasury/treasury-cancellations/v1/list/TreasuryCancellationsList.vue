<template>
  <div class="q-mx-xl" main>
    <ContentComponent
      v-if="isLoaded"
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
      <FiltersComponent
        show_actions
        ref="filtersRef"
        :fields="filterConfig"
        @filter="handleFilter"
        trigger_event_by_field
        @update:values="onChangeFilter"
        @clear-filters="handleClearFilters"
      />

      <NoDataState v-if="!selectedDocumentType" type="empty" />

      <div v-else class="q-py-md">
        <p class="text-weight-bold text-h6">
          {{ titleSection }}
        </p>

        <FiltersComponent
          ref="filterComponentRef"
          show_actions
          :key="filterKey"
          :fields="filterConfigType"
          @filter="handleFilterType"
          trigger_event_by_field
          @update:values="onChangeFilterType"
          @clear-filters="handleClearFiltersType"
        />

        <NoDataState
          v-if="isTableEmpty"
          :type="showState === 0 ? 'empty' : 'no-results'"
        />

        <div class="q-pt-md q-mb-lg" v-else>
          <TableList
            hidePagination
            :title="tableProperties.title"
            :loading="tableProperties.loading"
            :columns="tableProperties.columns"
            :rows="tableProperties.rows"
            :selection="selectedDocumentType === 'Cheque' ? 'multiple' : 'none'"
            :custom-columns="['status', 'actions']"
            @update:selected="selectedRows = $event"
          >
            <template
              #custom-header-action
              v-if="selectedDocumentType === 'Cheque'"
            >
              <Button
                :label="'Anular'"
                :leftIcon="defaultIconsLucide.plusCircleOutline"
                :color-icon="'white'"
                :text-color="'white'"
                :outline="false"
                :color="'primary'"
                :disabled="!hasSelectedRows"
                @click="openModalCancellation"
              />
            </template>

            <template #status="{ row }">
              <div class="row justify-center">
                <ShowStatus :type="Number(row?.status.id ?? 2)" />
              </div>
            </template>

            <template #actions="{ row }">
              <Button
                left-icon="Eye"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                flat
                colorIcon="#f45100"
                :tooltip="'Ver'"
                @click="
                  handleView(row.id, row.type, selectedDocumentType)
                "
              />
            </template>
          </TableList>

          <div
            class="row justify-end q-gutter-md"
            v-if="selectedDocumentType !== 'Cheque'"
          >
            <Button
              :outline="false"
              label="Continuar"
              color="orange"
              class="text-capitalize btn-filter custom"
              @click="onContinue"
            />
          </div>
        </div>
      </div>

      <AlertModalComponent
        ref="alertModalViewDetailsRef"
        marginTopBody="mt-0 "
        marginTopActions="mt-0"
        classTitle="mt-0"
        styleModal="min-width: 80%"
        :showImgDefault="false"
        :title="alertModalViewDetailsConfig.title!"
        :description_message="''"
        @confirm="alertModalViewDetailsRef.closeModal()"
      >
        <template #default-body>
          <TreasuryCancellationView
            :action="'view'"
            :id="alertModalViewDetailsConfig.id"
            :type="alertModalViewDetailsConfig.type!"
            :documentType="alertModalViewDetailsConfig.documentType!" />
        </template>
      </AlertModalComponent>

      <AlertModalComponent
        ref="cancellationModalRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="cancellationModalConfig.description"
        :description_message="''"
        @confirm="handleCancellation"
      >
        <template #default-img>
          <q-img
            src="@/assets/images/icons/alert_popup_delete.svg"
            max-width="80px"
            width="80px"
            fit="contain"
            alt="Imagen de alerta"
          />
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

import TreasuryCancellationView from '@/components/Lists/Treasury/TreasuryCancellation/TreasuryCancellationDetail/TreasuryCancellationView.vue'

import useTreasuryCancellationsList from './TreasuryCancellationsList'

const {
  filterComponentRef,
  isLoaded,
  showState,
  filterKey,
  filtersRef,
  alertModalViewDetailsRef,
  alertModalViewDetailsConfig,
  handleView,
  selectedRows,
  isTableEmpty,
  titleSection,
  filterConfig,
  handleFilter,
  onChangeFilter,
  hasSelectedRows,
  tableProperties,
  filterConfigType,
  handleFilterType,
  headerProperties,
  defaultIconsLucide,
  onChangeFilterType,
  handleClearFilters,
  handleCancellation,
  cancellationModalRef,
  selectedDocumentType,
  openModalCancellation,
  handleClearFiltersType,
  cancellationModalConfig,
  onContinue,
} = useTreasuryCancellationsList()
</script>
