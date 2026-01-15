<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="validateRouter('Treasury', 'GroundsForBankRefund', 'create') ? 'Crear' : undefined"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="$router.push({ name: 'GroundsForBankRefundCreate' })"
    >
    </ContentComponent>

    <section class="q-mt-md">
      <FiltersComponent
        @filter="handleFilter"
        :fields="filterConfig"
        @clear-filters="clearRows"
      />
    </section>

    <section class="q-mt-xl">
      <TableList
        :title="tableProps.title"
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :pages="tableProps.pages"
        :custom-columns="['status', 'actions']"
        @update-page="updatePage"
        @update-rows-per-page="updateRows"
      >
        <template #status="{ row }">
          <ShowStatus :type="row?.status === 'Activo' ? 1 : 2" />
        </template>

        <template #actions="{ row }">
          <!-- Editar -->
          <Button
            v-if="validateRouter('Treasury', 'GroundsForBankRefund', 'edit')"
            :left-icon="defaultIconsLucide.edit"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            :tooltip="'Editar'"
            @click="
              $router.push({
                name: 'GroundsForBankRefundUpdate',
                params: {
                  id: row.id,
                },
              })
            "
          />
          <Button
            v-if="validateRouter('Treasury', 'GroundsForBankRefund', 'delete')"
            :left-icon="defaultIconsLucide.trash"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            :tooltip="'Eliminar'"
            @click="openAlertModal('eliminar', row.id)"
          />
        </template>
      </TableList>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 480px"
        title="¿Desea eliminar la causal de devolución bancaria?"
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
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Logic view
import useGroundsForBankRefund from './GroundsForBankRefund'

// Utils
import { defaultIconsLucide } from '@/utils'

const {
  // Props
  headerProps,
  tableProps,
  alertModalRef,
  filterConfig,

  // Methods
  handleFilter,
  openAlertModal,
  changeStatusAction,
  updatePage,
  updateRows,
  clearRows,
  validateRouter
} = useGroundsForBankRefund()
</script>
