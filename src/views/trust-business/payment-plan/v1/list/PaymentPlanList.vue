<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :btn-label="
        validateRouter('BusinessTrust', 'PaymentPlanList', 'create')
          ? headerProperties.btn.label
          : undefined
      "
      :btn-icon="headerProperties.btn.icon"
      @to="goToURL('PaymentPlanCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponent
          ref="filterComponentRef"
          :fields="filterConfig"
          trigger_event_by_field
          @filter="handleFilterSearch"
          @update:values="handleFilterUpdate"
          @clear-filters="handleClearFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :columns="tableProperties.columns"
          :rows="tableProperties.rows"
          :pages="tableProperties.pages"
          :custom-columns="['actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #actions="{ row }">
            <Button
              v-if="
                row.id &&
                validateRouter('BusinessTrust', 'PaymentPlanList', 'show')
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              @click="goToURL('PaymentPlanView', row.id)"
            />

            <Button
              v-if="
                row.id &&
                validateRouter('BusinessTrust', 'PaymentPlanList', 'edit')
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="goToURL('PaymentPlanEdit', row.id)"
            />

            <Button
              v-if="
                row.id &&
                validateRouter('BusinessTrust', 'PaymentPlanList', 'delete')
              "
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="openModalDelete(row.id)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>

  <AlertModalComponent
    ref="deleteModalRef"
    styleModal="min-width: 470px"
    :showImgDefault="false"
    :title="alertModalConfig.description"
    @confirm="handleDelete"
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
</template>

<script setup lang="ts">
// Components
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Utils & Composables
import { defaultIconsLucide } from '@/utils'
import { useGoToUrl } from '@/composables'

// Logic view
import usePaymentPlanList from './PaymentPlanList'

const { goToURL } = useGoToUrl()

const {
  headerProperties,
  filterComponentRef,
  filterConfig,
  tableProperties,
  deleteModalRef,
  alertModalConfig,
  handleFilterUpdate,
  handleClearFilters,
  handleFilterSearch,
  updatePage,
  updateRowsPerPage,
  openModalDelete,
  handleDelete,
  validateRouter,
} = usePaymentPlanList()
</script>
