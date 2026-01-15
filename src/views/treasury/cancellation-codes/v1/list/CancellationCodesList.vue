<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="validateRouter('Treasury', 'CancellationCodesList', 'create') ? 'Crear' : undefined"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="handlerGoTo('CancellationCodesCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponent
          @filter="handleFilter"
          @clear-filters="clearRows"
          :fields="filterConfig"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :columns="tableProps.columns"
          :pages="tableProps.pages"
          :custom-columns="[
            'actions',
            'reverses_conciliation',
            'retains_consecutive_check',
          ]"
          @update-page="updatePage"
          @update-rows-per-page="updateRows"
        >
          <template #reverses_conciliation="{ row }">
            <div class="q-pa-md">
              <q-checkbox
                dense
                :model-value="row.reverses_conciliation"
                color="orange"
              />
            </div>
          </template>

          <template #retains_consecutive_check="{ row }">
            <div class="q-pa-md">
              <q-checkbox
                dense
                :model-value="row.retains_consecutive_check"
                color="orange"
              />
            </div>
          </template>

          <template #actions="{ row }">
            <!-- Editar -->
            <Button
              v-if="validateRouter('Treasury', 'CancellationCodesList', 'edit')"
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Editar'"
              @click="
                $router.push({
                  name: 'CancellationCodesEdit',
                  params: {
                    id: row.id,
                  },
                })
              "
            />

            <!-- Cambio de estado -->
            <Button
              v-if="validateRouter('Treasury', 'CancellationCodesList', 'delete')"
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
      </section>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 480px"
        title="¿Desea eliminar  el código de anulación?"
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
// Components:
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'

// Logic view
import useCancellationCodesList from './CancellationCodesList'

// Utils
import { defaultIconsLucide } from '@/utils'

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
  clearRows,
  validateRouter
} = useCancellationCodesList()
</script>
