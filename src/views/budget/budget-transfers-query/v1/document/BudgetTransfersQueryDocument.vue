<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="handleGoToList"
    >
      <section class="q-my-md">
        <TabsComponent
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <TableList
                :title="tableProperties.title"
                :loading="tableProperties.loading"
                :rows="tableProperties.rows"
                :columns="tableProperties.columns"
                :custom-columns="['actions']"
                hidePagination
              >
                <template #actions="{ row }">
                  <Button
                    flat
                    left-icon="Eye"
                    color="orange"
                    :class-custom="'custom'"
                    :outline="false"
                    colorIcon="#f45100"
                    :tooltip="'Ver'"
                    @click="handleViewDocument(row.id)"
                  />
                </template>
              </TableList>
            </div>
          </template>
        </VCard>

        <div class="flex justify-end">
          <Button
            :outline="false"
            label="Finalizar"
            color="orange"
            class="text-capitalize btn-filter custom"
            @click="handleGoToList"
          />
        </div>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'
// Logic view
import useBudgetTransferQueryDocument from '@/views/budget/budget-transfers-query/v1/document/BudgetTransfersQueryDocument'

const {
  tabs,
  tabActive,
  tabActiveIdx,
  tableProperties,
  headerProperties,
  handleGoToList,
  handleViewDocument,
} = useBudgetTransferQueryDocument()
</script>
