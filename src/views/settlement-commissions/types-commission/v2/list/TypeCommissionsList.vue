<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      @to="goToURL('TypeCommissionsCreate')"
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
          @update-rows-per-page="updatePerPage"
        >
          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'SettlementCommissions',
                  'CommissionTypesList',
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
              @click="goToURL('TypeCommissionsEdit', { id: row.id })"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useTypeCommissionList from '@/views/settlement-commissions/types-commission/v2/list/TypeCommissionsList'

const {
  headerProperties,
  tableProperties,
  defaultIconsLucide,

  updatePage,
  updatePerPage,
  goToURL,
  validateRouter,
} = useTypeCommissionList()
</script>
