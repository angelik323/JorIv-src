<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      @on-back="handleGoBackList"
    >
      <VCard class="q-mb-md">
        <template #content-card>
          <div class="row q-col-gutter-md q-pa-md">
            <div class="col-12 col-md-3">
              <p class="text-weight-medium text-grey-6 q-mb-none">Oficina</p>
              <p class="q-mt-xs q-mb-none">
                {{ headerData?.office_id || '-' }}
              </p>
            </div>
            <div class="col-12 col-md-3">
              <p class="text-weight-medium text-grey-6 q-mb-none">Negocio</p>
              <p class="q-mt-xs q-mb-none">
                {{ headerData?.business_id || '-' }}
              </p>
            </div>
            <div class="col-12 col-md-3">
              <p class="text-weight-medium text-grey-6 q-mb-none">Concepto</p>
              <p class="q-mt-xs q-mb-none">
                {{ headerData?.concept || '-' }}
              </p>
            </div>
            <div class="col-12 col-md-3">
              <p class="text-weight-medium text-grey-6 q-mb-none">
                Fecha contable
              </p>
              <p class="q-mt-xs q-mb-none">
                {{ headerData?.accounting_date || '-' }}
              </p>
            </div>
            <div class="col-12 col-md-3">
              <p class="text-weight-medium text-grey-6 q-mb-none">
                Tipo de persona
              </p>
              <p class="q-mt-xs q-mb-none">
                {{ headerData?.person_type || '-' }}
              </p>
            </div>
            <div class="col-12 col-md-3">
              <p class="text-weight-medium text-grey-6 q-mb-none">
                Proveedor/Emisor
              </p>
              <p class="q-mt-xs q-mb-none">
                {{ headerData?.supplier_name || '-' }}
              </p>
            </div>
            <div class="col-12 col-md-3">
              <p class="text-weight-medium text-grey-6 q-mb-none">
                Solicitud de pago
              </p>
              <p class="q-mt-xs q-mb-none">
                {{ headerData?.payment_request_code || '-' }}
              </p>
            </div>
            <div class="col-12 col-md-3">
              <p class="text-weight-medium text-grey-6 q-mb-none">Estado</p>
              <p class="q-mt-xs q-mb-none">
                {{ headerData?.status || '-' }}
              </p>
            </div>
          </div>
        </template>
      </VCard>

      <TabsComponent
        :tab-active="tabActive"
        :tabs="tabs"
        :tab-active-idx="tabActiveIdx"
        @update:tab-active="handleTabChange"
        @update:tab-active-idx="handleTabIdxChange"
      />

      <VCard>
        <template #content-card>
          <!-- Pestaña Liquidación -->
          <div v-if="tabActive === 'settlement'">
            <LiquidationTab :settlement-id="settlementId" />

            <section class="q-mt-md q-mb-md q-px-md">
              <q-separator class="q-mb-md" />
              <div class="row justify-end q-gutter-sm">
                <Button
                  label="Continuar"
                  color="orange"
                  :outline="true"
                  :styleContent="{ color: 'black' }"
                  @click="handleContinue"
                />
              </div>
            </section>
          </div>

          <!-- Pestaña Conceptos -->
          <div v-if="tabActive === 'concepts'">
            <ConceptsTab :settlement-id="settlementId" />

            <section class="q-mt-md q-mb-md q-px-md">
              <q-separator class="q-mb-md" />
              <div class="row justify-end q-gutter-sm">
                <Button
                  label="Atrás"
                  :left-icon="defaultIconsLucide.arrowLeft"
                  color="grey"
                  :outline="true"
                  @click="handleBackTab"
                />
                <Button
                  label="Continuar"
                  color="orange"
                  :outline="true"
                  :styleContent="{ color: 'black' }"
                  @click="handleContinue"
                />
              </div>
            </section>
          </div>

          <!-- Pestaña Descuentos/Pagos -->
          <div v-if="tabActive === 'discounts_payments'">
            <DiscountsPaymentsTab :settlement-id="settlementId" />

            <section class="q-mt-md q-mb-md q-px-md">
              <q-separator class="q-mb-md" />
              <div class="row justify-end q-gutter-sm">
                <Button
                  label="Atrás"
                  :left-icon="defaultIconsLucide.arrowLeft"
                  color="grey"
                  :outline="true"
                  @click="handleBackTab"
                />
                <Button
                  label="Continuar"
                  color="orange"
                  :outline="true"
                  :styleContent="{ color: 'black' }"
                  @click="handleContinue"
                />
              </div>
            </section>
          </div>

          <!-- Pestaña Contabilidad -->
          <div v-if="tabActive === 'accounting'">
            <AccountingTab :settlement-id="settlementId" />

            <section class="q-mt-md q-mb-md q-px-md">
              <q-separator class="q-mb-md" />
              <div class="row justify-end q-gutter-sm">
                <Button
                  label="Atrás"
                  :left-icon="defaultIconsLucide.arrowLeft"
                  color="grey"
                  :outline="true"
                  @click="handleBackTab"
                />
                <Button
                  label="Finalizar"
                  :left-icon="defaultIconsLucide.save"
                  color="orange"
                  :outline="false"
                  @click="handleFinalize"
                />
              </div>
            </section>
          </div>
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
import LiquidationTab from './LiquidationTab.vue'
import ConceptsTab from './ConceptsTab.vue'
import DiscountsPaymentsTab from './DiscountsPaymentsTab.vue'
import AccountingTab from './AccountingTab.vue'

// Logic
import useTaxSettlementView from '@/views/accounts-payable/tax-settlement/v1/view/TaxSettlementView'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  defaultIconsLucide,
  headerData,
  settlementId,
  handleTabChange,
  handleTabIdxChange,
  handleContinue,
  handleBackTab,
  handleGoBackList,
  handleFinalize,
} = useTaxSettlementView()
</script>
