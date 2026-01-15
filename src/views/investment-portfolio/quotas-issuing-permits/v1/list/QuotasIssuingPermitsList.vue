<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :btn-label="
        validateRouter(
          'InvestmentPortfolio',
          'QuotasIssuingPermitsList',
          'create'
        )
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="handleGoTo('QuotasIssuingPermitsCreate')"
    >
      <FiltersComponent
        show_actions
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="handleClearFilters"
      />

      <NoDataState
        v-if="isQuotasIssuingPermitsEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <div
        v-else
        class="q-pt-md"
        aria-label="Tabla de permisos de emision de cuotas"
      >
        <TableList
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :rows="tableProperties.rows"
          :columns="tableProperties.columns"
          :pages="tableProperties.pages"
          :custom-columns="['actions']"
          @update-page="handleUpdatePage"
          @update-rows-per-page="handleUpdatePerPage"
        >
          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'InvestmentPortfolio',
                  'QuotasIssuingPermitsList',
                  'show'
                )
              "
              :left-icon="defaultIconsLucide.eye"
              color-icon="#f45100"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              tooltip="Ver"
              @click="handleOptions('view', row.id)"
            />
            <Button
              v-if="
                validateRouter(
                  'InvestmentPortfolio',
                  'QuotasIssuingPermitsList',
                  'edit'
                )
              "
              :left-icon="defaultIconsLucide.edit"
              color-icon="#f45100"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              tooltip="Editar"
              @click="handleOptions('edit', row.id)"
            />
            <Button
              v-if="
                validateRouter(
                  'InvestmentPortfolio',
                  'QuotasIssuingPermitsList',
                  'delete'
                )
              "
              :left-icon="defaultIconsLucide.trash"
              colorIcon="#f45100"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              tooltip="Eliminar"
              @click="handleOptions('delete', row.id)"
            />
          </template>
        </TableList>
      </div>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="alertModalConfig.description"
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
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

import useQuotasIssuingPermitsList from './QuotasIssuingPermitsList'

const {
  showState,
  handleGoTo,
  handleFilter,
  filterConfig,
  alertModalRef,
  handleOptions,
  tableProperties,
  headerProperties,
  handleUpdatePage,
  handleDeleteItem,
  alertModalConfig,
  handleClearFilters,
  defaultIconsLucide,
  handleUpdatePerPage,
  isQuotasIssuingPermitsEmpty,
  validateRouter,
} = useQuotasIssuingPermitsList()
</script>
