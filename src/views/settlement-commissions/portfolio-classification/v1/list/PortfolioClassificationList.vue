<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      btn-label="Crear"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="$router.push({ name: 'PortfolioClassificationCreate' })"
    >
      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="
                $router.push({
                  name: 'PortfolioClassificationEdit',
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
          styleModal="min-width: 470px"
          :title="alertModalConfig.description"
          @confirm="changeStatusAction"
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

// Utils & Assets
import { defaultIconsLucide } from '@/utils'

// Logic view
import usePortfolioClassificationsList from '@/views/settlement-commissions/portfolio-classification/v1/list/PortfolioClassificationList'

const {
  headerProps,
  tableProps,
  alertModalRef,
  alertModalConfig,
  updatePerPage,
  updatePage,
  changeStatusAction,
} = usePortfolioClassificationsList()
</script>
