<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      @on-back="handleBack"
    >
      <VCard class="q-mb-md">
        <template #content-card>
          <div class="row q-col-gutter-md q-pa-md">
            <div class="col-12 col-md-3">
              <p class="text-weight-medium text-grey-6 q-mb-none">Oficina</p>
              <GenericInput
                :default_value="formData.office_name || '-'"
                :disabled="true"
                dense
                outlined
              />
            </div>
            <div class="col-12 col-md-3">
              <p class="text-weight-medium text-grey-6 q-mb-none">Negocio</p>
              <GenericInput
                :default_value="formData.business_name || '-'"
                :disabled="true"
                dense
                outlined
              />
            </div>
            <div class="col-12 col-md-3">
              <p class="text-weight-medium text-grey-6 q-mb-none">Concepto</p>
              <GenericInput
                :default_value="formData.concept_name || '-'"
                :disabled="true"
                dense
                outlined
              />
            </div>
            <div class="col-12 col-md-3">
              <p class="text-weight-medium text-grey-6 q-mb-none">
                Fecha contable
              </p>
              <GenericInput
                :default_value="formData.accounting_date || '-'"
                :disabled="true"
                dense
                outlined
              />
            </div>
            <div class="col-12 col-md-3">
              <p class="text-weight-medium text-grey-6 q-mb-none">
                Tipo de persona
              </p>
              <GenericInput
                :default_value="formData.person_type || '-'"
                :disabled="true"
                dense
                outlined
              />
            </div>
            <div class="col-12 col-md-3">
              <p class="text-weight-medium text-grey-6 q-mb-none">
                Proveedor/Emisor
              </p>
              <GenericInput
                :default_value="formData.supplier || '-'"
                :disabled="true"
                dense
                outlined
              />
            </div>
            <div class="col-12 col-md-3">
              <p class="text-weight-medium text-grey-6 q-mb-none">
                Solicitud de pago
              </p>
              <GenericInput
                :default_value="formData.payment_request || '-'"
                :disabled="true"
                dense
                outlined
              />
            </div>
            <div class="col-12 col-md-3">
              <p class="text-weight-medium text-grey-6 q-mb-none">Estado</p>
              <GenericInput
                :default_value="formData.status || '-'"
                :disabled="true"
                dense
                outlined
              />
            </div>
          </div>
        </template>
      </VCard>

      <TabsComponent
        :tab-active="tabActive"
        :tabs="tabs"
        :tab-active-idx="tabActiveIdx"
        @update:tab-active="tabActive = $event"
        @update:tab-active-idx="tabActiveIdx = $event"
      />

      <VCard>
        <template #content-card>
          <LiquidationForm
            v-show="tabActive === 'settlement'"
            :key="`liquidation-${settlementRows?.length || 0}`"
            :data="{
              settlementRows: settlementRows || [],
              netValue: netValue || '0',
              settlementConceptTypes: settlement_concept_types,
              fiscalCharges: fiscal_charges,
              settlementConcepts: settlement_concept,
            }"
            @on-delete-row="handleDeleteRow"
            @on-update-rows="handleUpdateSettlementRows"
          />

          <ConceptsForm
            v-show="tabActive === 'concepts'"
            ref="conceptsFormRef"
            :settlement-id="settlementId"
            :business-id="formData.business_id"
          />

          <DiscountsPaymentsForm
            v-show="tabActive === 'discounts_payments'"
            ref="discountsPaymentsFormRef"
            :settlement-id="settlementId"
            :business-id="formData.business_id"
            :net-value="netValue"
          />

          <AccountingForm
            v-show="tabActive === 'accounting'"
            ref="accountingFormRef"
            :settlement-id="settlementId"
          />

          <section class="q-mt-md q-mb-md q-px-md">
            <q-separator class="q-mb-md" />
            <div class="row justify-end q-gutter-sm">
              <Button
                v-if="tabActiveIdx > 0"
                label="Atrás"
                :left-icon="defaultIconsLucide.arrowLeft"
                color="grey"
                :outline="true"
                @click="handleBack"
              />
              <Button
                v-if="tabActiveIdx < tabs.length - 1"
                label="Continuar"
                color="orange"
                :outline="true"
                :styleContent="{ color: 'black' }"
                @click="handleContinue"
              />
              <Button
                label="Actualizar"
                :left-icon="defaultIconsLucide.save"
                color="orange"
                :outline="false"
                @click="handleUpdate"
              />
            </div>
          </section>
        </template>
      </VCard>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import LiquidationForm from '@/components/Forms/AccountsPayable/TaxSettlement/LiquidationForm/LiquidationForm.vue'
import ConceptsForm from '@/components/Forms/AccountsPayable/TaxSettlement/ConceptsForm/ConceptsForm.vue'
import DiscountsPaymentsForm from '@/components/Forms/AccountsPayable/TaxSettlement/DiscountsPaymentsForm/DiscountsPaymentsForm.vue'
import AccountingForm from '@/components/Forms/AccountsPayable/TaxSettlement/AccountingForm/AccountingForm.vue'

// Logic
import useTaxSettlementEdit from '@/views/accounts-payable/tax-settlement/v1/edit/TaxSettlementEdit'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  defaultIconsLucide,
  formData,
  settlementRows,
  netValue,
  settlement_concept_types,
  fiscal_charges,
  settlement_concept,
  conceptsFormRef,
  discountsPaymentsFormRef,
  accountingFormRef,
  handleDeleteRow,
  handleUpdateSettlementRows,
  handleContinue,
  handleUpdate,
  handleBack,
  settlementId,
} = useTaxSettlementEdit()
</script>
