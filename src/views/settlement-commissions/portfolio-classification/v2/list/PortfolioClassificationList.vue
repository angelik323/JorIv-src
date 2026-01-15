<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :btn-label="
        validateRouter(
          'SettlementCommissions',
          'PortfolioClassificationList',
          'create'
        )
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('PortfolioClassificationCreate')"
    >
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
                validateRouter(
                  'SettlementCommissions',
                  'PortfolioClassificationList',
                  'edit'
                )
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="goToURL('PortfolioClassificationEdit', { id: row.id })"
            />

            <Button
              v-if="
                validateRouter(
                  'SettlementCommissions',
                  'PortfolioClassificationList',
                  'delete'
                )
              "
              :left-icon="defaultIconsLucide.delete"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="openAlertModal(row)"
            />
          </template>
        </TableList>

        <AlertModalComponent
          ref="alertModalRef"
          styleModal="min-width: 470px"
          :title="alertModalConfig.title"
          :description_message="alertModalConfig.description"
          @confirm="handleDeleteAction"
        />
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Logic view
import usePortfolioClassificationsList from '@/views/settlement-commissions/portfolio-classification/v2/list/PortfolioClassificationList'

const {
  headerProperties,
  tableProperties,
  alertModalRef,
  alertModalConfig,
  defaultIconsLucide,

  updateRowsPerPage,
  updatePage,
  handleDeleteAction,
  goToURL,
  openAlertModal,
  validateRouter,
} = usePortfolioClassificationsList()
</script>
