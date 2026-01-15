<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('Treasury', 'PaymentMethodsList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircle"
      @to="handlerGoTo('PaymentMethodsCreate')"
    >
    </ContentComponent>

    <section class="q-mt-md">
      <FiltersComponent
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="clearFilters"
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
        <template #status_id="{ row }">
          <div class="q-pa-md">
            <ShowStatus :type="Number(row?.status_id ?? 1)" />
          </div>
        </template>

        <template #actions="{ row }">
          <!-- Ver -->
          <Button
            v-if="validateRouter('Treasury', 'PaymentMethodsList', 'show')"
            :left-icon="defaultIconsLucide.eye"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            :tooltip="'Ver'"
            @click="
              $router.push({
                name: 'PaymentMethodsDetail',
                params: {
                  id: row.id,
                },
              })
            "
          />
          <!-- Editar -->
          <Button
            v-if="validateRouter('Treasury', 'PaymentMethodsList', 'edit')"
            :left-icon="defaultIconsLucide.edit"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            :tooltip="'Editar'"
            @click="
              $router.push({
                name: 'PaymentMethodsEdit',
                params: {
                  id: row.id,
                },
              })
            "
          />

          <!-- Cambio de estado -->
          <Button
            v-if="validateRouter('Treasury', 'PaymentMethodsList', 'delete')"
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
        title="¿Desea eliminar la forma de pago?"
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

// Logic view
import usePaymentMethodsList from './PaymentMethodsList'

// Utils
import { defaultIconsLucide } from '@/utils'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'

const {
  headerProps,
  tableProps,
  alertModalRef,
  filterConfig,

  handleFilter,
  clearFilters,
  handlerGoTo,
  openAlertModal,
  changeStatusAction,
  updatePage,
  updateRows,
  validateRouter,
} = usePaymentMethodsList()
</script>
