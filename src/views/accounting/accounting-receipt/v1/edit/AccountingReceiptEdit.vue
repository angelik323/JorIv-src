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
                :action="'edit'"
                :id="accountingReceiptId"
              />
            </div>
            <!-- Buttons -->
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) ===
                    filteredTabs.length - 1
                  "
                  :outline="false"
                  :class-custom="'custom'"
                  label="Actualizar"
                  :disabled="
                    accounting_receipt.status.id ===
                    AccountingReceiptStatusID.ANNULED
                  "
                  :tooltip="
                    accounting_receipt.status.id ===
                    AccountingReceiptStatusID.ANNULED
                      ? 'El comprobante ha sido anulado'
                      : ''
                  "
                  size="md"
                  color="orange"
                  @click="onSubmit"
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
import AccountingReceiptForm from '@/components/Forms/Accounting/AccountingReceipt/Information/InformationForm.vue'
import { AccountingReceiptStatusID } from '@/interfaces/global'
import useAccountingReceiptEdit from '@/views/accounting/accounting-receipt/v1/edit/AccountingReceiptEdit'

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  accountingReceiptForm,
  accountingReceiptId,
  accounting_receipt,
  onSubmit,
} = useAccountingReceiptEdit()
</script>
