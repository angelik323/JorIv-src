<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'AccountingReceiptList' })"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
        />
        <VCard>
          <template #content-card>
            <div v-if="tabActive === 'information'">
              <AccountingReceiptForm
                ref="accountingReceiptForm"
                :action="'view'"
                :id="accountingReceiptId"
              />
            </div>
            <q-separator class="q-ma-lg" />
            <section class="q-ma-lg">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) ===
                    filteredTabs.length - 1
                  "
                  label="Finalizar"
                  :outline="false"
                  size="md"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="$router.push({ name: 'AccountingReceiptList' })"
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
import Button from '@/components/common/Button/Button.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import AccountingReceiptForm from '@/components/Forms/Accounting/AccountingReceipt/Information/v2/InformationForm.vue'
import useAccountingReceiptView from '@/views/accounting/accounting-receipt/v2/view/AccountingReceiptView'

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  accountingReceiptForm,
  accountingReceiptId,
} = useAccountingReceiptView()
</script>
