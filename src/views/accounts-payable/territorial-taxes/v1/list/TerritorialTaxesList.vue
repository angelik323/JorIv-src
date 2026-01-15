<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('AccountsPayable', 'TerritorialTaxesList', 'create')
          ? headerProps.actionLabel
          : undefined
      "
      :btn-icon="headerProps.actionIcon"
      @to="goToURL('TerritorialTaxesCreate')"
    >
      <section>
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
        />
      </section>

      <NoDataState
        v-if="isTerritorialTaxesListEmpty"
        :type="!showState ? 'empty' : 'no-results'"
      />

      <TableList
        v-else
        :title="tableProperties.title"
        :loading="tableProperties.loading"
        :columns="tableProperties.columns"
        :rows="tableProperties.rows"
        :pages="tableProperties.pages"
        :custom-columns="['status', 'actions']"
        @update-page="updatePage"
        @update-rows-per-page="updatePerPage"
      >
        <template #status="{ row }">
          <ShowStatus :type="Number(row?.status?.id ?? 1)" />
        </template>

        <template #actions="{ row }">
          <Button
            v-if="
              validateRouter('AccountsPayable', 'TerritorialTaxesList', 'edit')
            "
            :left-icon="defaultIconsLucide.edit"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            tooltip="Editar"
            @click="goToURL('TerritorialTaxesEdit', { id: String(row.id) })"
          />
          <Button
            v-if="
              validateRouter(
                'AccountsPayable',
                'TerritorialTaxesList',
                'delete'
              )
            "
            :left-icon="defaultIconsLucide.trash"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            tooltip="Eliminar"
            @click="openAlertModal(row)"
          />
        </template>
      </TableList>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="alertModalConfig.description"
        :textBtnConfirm="alertModalConfig.textBtnConfirm"
        :textBtnCancel="alertModalConfig.textBtnCancel"
        @confirm="handleDelete"
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
// components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// logic
import useTerritorialTaxesList from '@/views/accounts-payable/territorial-taxes/v1/list/TerritorialTaxesList'

const {
  // configs
  headerProps,
  filterConfig,
  tableProperties,
  alertModalConfig,

  // flags
  showState,
  isTerritorialTaxesListEmpty,

  // refs
  alertModalRef,

  // utils
  defaultIconsLucide,
  goToURL,
  validateRouter,

  // actions
  handleFilter,
  handleClearFilters,
  handleDelete,
  openAlertModal,
  updatePage,
  updatePerPage,
} = useTerritorialTaxesList()
</script>