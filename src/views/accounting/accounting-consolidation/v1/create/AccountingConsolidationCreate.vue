<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      @on-back="$router.push({ name: 'AccountingConsolidationList' })"
    >
      <section class="q-mt-md">
        <TabsComponent
          :tabActive="activeTab"
          :tabs="tabs"
          :tabActiveIdx="tabActiveIdx"
          @update:tab-active="activeTab = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />
      </section>
      <VCard>
        <template #content-card>
          <div class="mx-3 mt-0 mb-3">
            <InformationForm action="create" />

            <VCard>
              <template #content-card>
                <div class="q-pa-lg">
                  <section class="q-mt-xl">
                    <TableList
                      :title="tableProps.title"
                      :loading="tableProps.loading"
                      :rows="tableProps.rows"
                      :columns="tableProps.columns"
                      :custom-columns="['status_id', 'actions']"
                      :rowsPerPage="10"
                    >
                      <template #status_id="{ row }">
                        <ShowStatus :type="Number(row?.status.id ?? 1)" />
                      </template>
                    </TableList>
                  </section>
                </div>
              </template>
            </VCard>
            <div class="row justify-end q-gutter-md">
              <Button
                :outline="false"
                label="Crear"
                size="md"
                color="orange"
                class="text-capitalize btn-filter custom"
                @click="onSubmit"
              />
            </div>
          </div>
        </template>
      </VCard>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import { useAccountingConsolidationCreate } from './AccountingConsolidationCreate'
import TableList from '@/components/table-list/TableList.vue'
import InformationForm from '@/components/Forms/Treasury/AccountingConsolidation/InformationForm.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'

const { activeTab, tabs, tabActiveIdx, headerProps, tableProps, onSubmit } =
  useAccountingConsolidationCreate()
</script>
