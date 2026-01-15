<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      @on-back="goToURL('AccountsPayableClosingList')"
    >
      <TabsComponent
        :tab-active="tabActive"
        :tabs="tabs"
        :tab-active-idx="tabActiveIdx"
      />
      <section class="q-my-md">
        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <TableList
                :rows="tableProps.rows"
                :columns="tableProps.columns"
                :loading="tableProps.loading"
                :pages="tableProps.pages"
                :hide-bottom="true"
                :hide-pagination="true"
                :custom-columns="['status']"
              >
                <template #status="{ row }">
                  <ShowStatus
                    :type="row.status?.id ?? 0"
                    :statusType="'accountsPayable'"
                    class-custom="q-px-sm q-py-xs"
                  />
                </template>
              </TableList>
            </div>
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  :class-custom="'custom'"
                  label="Finalizar"
                  size="md"
                  color="orange"
                  @click="goToURL('AccountsPayableClosingList')"
                />
              </div>
            </section>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import useAccountsPayableClosingView from '@/views/accounts-payable/accounts-payable-closing/v1/view/AccountsPayableClosingView'

const { headerProps, tabs, tabActiveIdx, tabActive, tableProps, goToURL } =
  useAccountsPayableClosingView()
</script>
