<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('Accounting', 'TypeAccountingReceiptList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="useUtils().defaultIconsLucide.plusCircle"
      @to="handlerGoTo('TypeAccountingReceiptCreate')"
    >
    </ContentComponent>

    <section class="q-mt-md">
      <FiltersComponent
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="handleClearFilters"
      />
    </section>

    <section class="q-mt-xl">
      <TableList
        :title="tableProps.title"
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :pages="tableProps.pages"
        :custom-columns="['actions', 'status_id']"
        @update-page="updatePage"
        @update-rows-per-page="updateRows"
      >
        <template #custom-header-action>
          <Button
            v-if="
              validateRouter(
                'Accounting',
                'TypeAccountingReceiptList',
                'export'
              )
            "
            :label="'Descargar'"
            :size="'md'"
            :unelevated="true"
            :outline="false"
            :color="'orange'"
            :class="'text-capitalize btn-filter custom'"
            @click="handlerGoTo('TypeAccountingReceiptDownload')"
          />
        </template>
        <template #status_id="{ row }">
          <ShowStatus
            :type="Number(row?.status?.id ?? 1)"
            :clickable="
              validateRouter(
                'Accounting',
                'TypeAccountingReceiptList',
                'action_change_status'
              )
            "
            @click="openAlertModal('eliminar', row.id, row.status.id)"
          />
        </template>
        <template #actions="{ row }">
          <!-- Ver -->
          <Button
            v-if="
              validateRouter('Accounting', 'TypeAccountingReceiptList', 'show')
            "
            :left-icon="useUtils().defaultIconsLucide.eye"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            :tooltip="'Ver'"
            @click="
              $router.push({
                name: 'TypeAccountingReceiptView',
                params: {
                  id: row.id,
                },
              })
            "
          />
          <!-- Editar -->
          <Button
            v-if="
              validateRouter('Accounting', 'TypeAccountingReceiptList', 'edit')
            "
            :left-icon="useUtils().defaultIconsLucide.edit"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            :tooltip="'Editar'"
            @click="
              $router.push({
                name: 'TypeAccountingReceiptEdit',
                params: {
                  id: row.id,
                },
              })
            "
          />
        </template>
      </TableList>
      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 480px"
        title="¿Desea cambiar el estado del tipo de comprobante?"
        @confirm="changeStatusAction"
      >
      </AlertModalComponent>
    </section>
  </div>
</template>

<script setup lang="ts">
// Components:
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'

// Logic view
import useTypesAccountingReceiptList from './TypesAccountingReceiptList'

// Utils
import { useUtils } from '@/composables'

const {
  headerProps,
  tableProps,
  alertModalRef,
  filterConfig,

  handleFilter,
  handlerGoTo,
  openAlertModal,
  changeStatusAction,
  updatePage,
  updateRows,
  handleClearFilters,
  validateRouter,
} = useTypesAccountingReceiptList()
</script>
