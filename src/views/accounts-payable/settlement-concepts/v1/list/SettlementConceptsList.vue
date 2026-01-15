<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('AccountsPayable', 'SettlementConceptsList', 'create')
          ? headerProps.btn.label
          : undefined
      "
      :btn-icon="headerProps.btn.icon"
      @to="goToURL('SettlementConceptsCreate')"
    >
      <section>
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
        />
      </section>

      <NoDataState
        v-if="tableProps.rows.length === 0"
        :type="!showState ? 'empty' : 'no-results'"
      />

      <TableList
        v-else
        :title="tableProps.title"
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :pages="tableProps.pages"
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
              validateRouter(
                'AccountsPayable',
                'SettlementConceptsList',
                'show'
              )
            "
            :left-icon="defaultIconsLucide.eye"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            tooltip="Ver"
            @click="goToURL('SettlementConceptsView', row.id)"
          />

          <Button
            v-if="
              validateRouter(
                'AccountsPayable',
                'SettlementConceptsList',
                'edit'
              )
            "
            :left-icon="defaultIconsLucide.edit"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            tooltip="Editar"
            @click="goToURL('SettlementConceptsEdit', row.id)"
          />

          <Button
            v-if="
              validateRouter(
                'AccountsPayable',
                'SettlementConceptsList',
                'delete'
              )
            "
            :outline="false"
            :left-icon="defaultIconsLucide.trash"
            color="orange"
            :flat="true"
            :class-custom="'custom'"
            tooltip="Eliminar"
            @click="openDeleteModal(row.id)"
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
        @confirm="handleDelete()"
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
// components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// logic view
import useSettlementConceptsList from '@/views/accounts-payable/settlement-concepts/v1/list/SettlementConceptsList'

const {
  // configs
  headerProps,
  filterConfig,
  tableProps,
  alertModalConfig,

  // refs
  showState,
  alertModalRef,

  // icons
  defaultIconsLucide,

  // methods
  handleFilter,
  handleClearFilters,
  handleDelete,
  openDeleteModal,
  goToURL,
  updatePage,
  updatePerPage,
  validateRouter,
} = useSettlementConceptsList()
</script>

