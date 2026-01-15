<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="headerProps.btn.label"
      :btn-icon="headerProps.btn.icon"
      @to="goToURL('CancellationRejectionReasonsCreate')"
    >
      <section>
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
        />
        <NoDataState
          v-if="isCancellationRejectionReasonsListEmpty"
          :type="!showState ? 'empty' : 'no-results'"
          :title="
            !showState
              ? 'Realice una búsqueda para ver los datos'
              : 'No se encontraron resultados'
          "
          :subtitle="
            !showState
              ? 'Aquí visualizará los resultados de su búsqueda'
              : 'Pruebe con otra búsqueda'
          "
        />
        <section v-else>
          <TableList
            :title="tableProps.title"
            :loading="tableProps.loading"
            :columns="tableProps.columns"
            :rows="tableProps.rows"
            :pages="tableProps.pages"
            :custom-columns="['actions']"
            @update-page="updatePage"
            @update-rows-per-page="updateRowsPerPage"
          >
            <template #actions="{ row }">
              <!-- Editar -->
              <Button
                :left-icon="defaultIconsLucide.edit"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                tooltip="Editar"
                @click="goToURL('CancellationRejectionReasonsEdit', row.id)"
              />
              <!-- Eliminar -->
              <Button
                :outline="false"
                :left-icon="defaultIconsLucide.trash"
                color="orange"
                :flat="true"
                :class-custom="'custom'"
                tooltip="Eliminar"
                @click="openAlertModal(row)"
              />
            </template>
          </TableList>
        </section>
      </section>

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
//Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

//Utils
import { defaultIconsLucide } from '@/utils'

//Logic
import useCancellationRejectionReasons from '@/views/accounts-payable/cancellation-rejection-reasons/v1/list/CancellationRejectionReasonsList'

const {
  headerProps,
  filterConfig,
  tableProps,
  showState,
  isCancellationRejectionReasonsListEmpty,
  alertModalRef,
  alertModalConfig,
  handleFilter,
  handleClearFilters,
  openAlertModal,
  handleDelete,
  updatePage,
  updateRowsPerPage,
  goToURL,
} = useCancellationRejectionReasons()
</script>
