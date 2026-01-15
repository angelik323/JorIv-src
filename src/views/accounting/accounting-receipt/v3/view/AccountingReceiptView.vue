<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('AccountingReceiptList')"
    >
      <section :key="componentKey" class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
        />
        <VCard>
          <template #content-card>
            <div v-show="tabActive === 'information'">
              <AccountingReceiptForm
                ref="accountingReceiptForm"
                :action="'view'"
                :id="accountingReceiptId"
              />
            </div>
            <div v-show="tabActive === 'view_logs'">
              <ViewLogsTab />
            </div>
            <q-separator class="q-ma-lg" />
            <section class="q-ma-lg">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) > 0
                  "
                  :outline="true"
                  label="Atrás"
                  :leftIcon="defaultIconsLucide.chevronLeft"
                  :color-icon="'#762344'"
                  color="orange"
                  class="text-capitalize btn-filter"
                  @click="changeTab('back')"
                />

                <Button
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) <
                    filteredTabs.length - 1
                  "
                  :outline="false"
                  label="Continuar"
                  :rightIcon="defaultIconsLucide.chevronRight"
                  :color-icon="'white'"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="changeTab('next')"
                />

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
                  @click="goToURL('AccountingReceiptList')"
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
// Components
import Button from '@/components/common/Button/Button.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import AccountingReceiptForm from '@/components/Forms/Accounting/AccountingReceipt/Information/v3/InformationForm.vue'
import ViewLogsTab from '@/views/accounting/accounting-receipt/v3/view/ViewLogsTab.vue'
// Composables
import { useGoToUrl } from '@/composables/useGoToUrl'
// Logic view
import useAccountingReceiptView from '@/views/accounting/accounting-receipt/v3/view/AccountingReceiptView'

const { goToURL } = useGoToUrl()

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  accountingReceiptForm,
  accountingReceiptId,
  componentKey,
  defaultIconsLucide,
  changeTab,
} = useAccountingReceiptView()
</script>
