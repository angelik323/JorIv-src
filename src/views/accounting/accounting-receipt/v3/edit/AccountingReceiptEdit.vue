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
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
        />
        <VCard>
          <template #content-card>
            <div>
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
                  :outline="false"
                  :class-custom="'custom'"
                  label="Actualizar"
                  :disabled="
                    accounting_receipt?.status?.id ===
                    AccountingReceiptStatusID.ANNULED
                  "
                  :tooltip="
                    accounting_receipt?.status?.id ===
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
// Components
import Button from '@/components/common/Button/Button.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import AccountingReceiptForm from '@/components/Forms/Accounting/AccountingReceipt/Information/v3/InformationForm.vue'
// Interfaces
import { AccountingReceiptStatusID } from '@/interfaces/global'
// Logic view
import useAccountingReceiptEdit from '@/views/accounting/accounting-receipt/v3/edit/AccountingReceiptEdit'

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  accountingReceiptForm,
  accountingReceiptId,
  accounting_receipt,
  onSubmit,
  goToURL,
} = useAccountingReceiptEdit()
</script>
