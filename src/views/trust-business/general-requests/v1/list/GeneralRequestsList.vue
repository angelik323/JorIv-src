<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('BusinessTrust', 'GeneralRequestsList', 'create')
          ? headerProps.btn.label
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="handleGoTo('GeneralRequestsCreate')"
    >
      <FiltersComponentV2
        :fields="filterConfig"
        @filter="handleFilter"
        trigger_event_by_field
        @clear-filters="handleClearFilters"
        @update:values="handleFieldChange"
      />

      <NoDataState
        v-if="isGeneralRequestsEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <section v-else class="q-pt-md q-my-xl">
        <TableList
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :title="tableProps.title"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['record_status_id', 'actions']"
          @update-page="handleUpdatePage"
          @update-rows-per-page="handleUpdatePerPage"
        >
          <template #record_status_id="{ row }">
            <ShowStatus :type="Number(row?.record_status_id ?? 0)" />
          </template>

          <template #actions="{ row }">
            <Button
              v-if="
                row.id &&
                validateRouter('BusinessTrust', 'GeneralRequestsList', 'show')
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="handleOptions('view', row.id)"
            />

            <Button
              v-if="
                row.id &&
                validateRouter('BusinessTrust', 'GeneralRequestsList', 'edit')
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="handleOptions('edit', row.id)"
            />

            <Button
              v-if="
                row.id &&
                validateRouter('BusinessTrust', 'GeneralRequestsList', 'delete')
              "
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Eliminar'"
              :disabled="row.status_id === 10 || row.point_asociate"
              @click="handleOptions('delete', row.id)"
            />
          </template>
        </TableList>
      </section>

      <AlertModalComponent
        ref="deleteModalRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="deleteModalConfig.description"
        :description_message="''"
        @confirm="handleDeleteItem()"
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

<script setup lang="ts">
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

import { defaultIconsLucide } from '@/utils'

import useGeneralRequestsList from '@/views/trust-business/general-requests/v1/list/GeneralRequestsList'

const {
  showState,
  tableProps,
  handleGoTo,
  headerProps,
  handleFilter,
  filterConfig,
  handleOptions,
  deleteModalRef,
  handleDeleteItem,
  handleUpdatePage,
  deleteModalConfig,
  handleFieldChange,
  handleClearFilters,
  handleUpdatePerPage,
  isGeneralRequestsEmpty,
  validateRouter,
} = useGeneralRequestsList()
</script>
