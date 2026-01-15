<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      @on-back="handlerGoTo('AccountingConsolidationList')"
    >
      <TabsComponent
        :tabActive="activeTab"
        :tabs="tabs"
        :tabActiveIdx="tabActiveIdx"
        @update:tab-active="activeTab = $event"
        @update:tab-active-idx="tabActiveIdx = $event"
      />
      <VCard>
        <template #content-card>
          <div class="mx-3 mt-0 mb-3">
            <InformationForm
              v-if="activeTab === 'InformationForm'"
              ref="informationFormRef"
              :action="'view'"
              :data="data_accounting_consolidation_view"
            />
            <q-separator class="q-mt-sm q-mb-md" color="grey-4" />
            <section class="q-mt-xl">
              <TableList
                :title="tableProps.title"
                :loading="tableProps.loading"
                :rows="tableProps.rows"
                :columns="tableProps.columns"
                :custom-columns="['status', 'actions']"
                :rowsPerPage="10"
              >
              </TableList>
            </section>
            <q-separator class="q-ma-lg" />
            <section class="q-ma-lg">
              <div class="row justify-end q-gutter-md">
                <Button
                  label="Finalizar"
                  :outline="false"
                  size="md"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="$router.push({ name: 'AccountingConsolidationList' })"
                />
              </div>
            </section>
          </div>
        </template>
      </VCard>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import { useAccountingConsolidationView } from './AccountingConsolidationView'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import InformationForm from '@/components/Forms/Treasury/AccountingConsolidation/InformationForm.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

const {
  tabs,
  activeTab,
  headerProps,
  tabActiveIdx,
  tableProps,
  data_accounting_consolidation_view,
  handlerGoTo,
} = useAccountingConsolidationView()
</script>
