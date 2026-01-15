<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('Treasury', 'BankAccountBalancesList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="handlerGoTo('BankAccountBalancesCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          ref="filterComponentRef"
          :fields="filterConfig"
          :show_actions="true"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :columns="tableProps.columns"
          :pages="tableProps.pages"
          :custom-columns="['status', 'nit', 'actions']"
          @update-page=""
        >
          <template #status="{ row }">
            <ShowStatus
              :type="row.status_id ?? 1"
              class-custom="q-px-sm q-py-xs"
            />
          </template>

          <template #nit="{ row }">
            <span>{{ row.nit.nit }}</span>
          </template>

          <template #actions="{ row }">
            <!-- Editar -->
            <Button
              v-if="
                validateRouter('Treasury', 'BankAccountBalancesList', 'edit')
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="
                $router.push({
                  name: 'BankAccountBalancesEdit',
                  params: {
                    id: row.id,
                  },
                })
              "
            />

            <!-- Eliminar -->
            <Button
              v-if="
                validateRouter('Treasury', 'BankAccountBalancesList', 'delete')
              "
              :left-icon="defaultIconsLucide.delete"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="openAlertModal(row.id)"
            />
          </template>
        </TableList>
      </section>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 480px"
        :title="'¿Está seguro que desea eliminar el saldo inicial?'"
        :show-img-default="false"
        @confirm="changeStatusAction"
      >
        <template #default-img>
          <q-img
            src="@/assets/images/icons/alert_popup_delete.svg"
            max-width="80px"
            width="80px"
            fit="contain"
          />
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'

// Logic view
import useBankAccountBalancesList from './BankAccountBalancesList'

// Utils
import { defaultIconsLucide } from '@/utils'

const {
  headerProps,
  tableProps,
  alertModalRef,
  filterConfig,
  filterComponentRef,
  handleFilter,
  handlerGoTo,
  openAlertModal,
  changeStatusAction,
  handleClearFilters,
  validateRouter,
} = useBankAccountBalancesList()
</script>
