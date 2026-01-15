<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('GenerateInvoicesOtherConceptsList')"
    >
      <section>
        <TabsComponent :tabActive :tabs :tabActiveIdx />

        <VCard v-if="invoice_generation_other_items_response">
          <template #content-card>
            <div class="q-pa-lg">
              <BasicData
                v-if="tabActive === 'basic-data'"
                :data="basic_data_form"
                ref="basicDataFormRef"
                action="view"
                @update:data="basic_data_form = $event"
              />
            </div>

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
                    tabs.findIndex((tab) => tab.name === tabActive) > 0
                  "
                  label="Atrás"
                  size="md"
                  unelevated
                  outline
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="backTab"
                />

                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
                    tabs.findIndex((tab) => tab.name === tabActive) <
                      tabs.length - 1
                  "
                  label="Continuar"
                  :rightIcon="utils.defaultIconsLucide.next"
                  color-icon="#fff"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="nextTab"
                />

                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) ===
                    tabs.length - 1
                  "
                  label="Finalizar"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
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
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import BasicData from '@/components/Forms/BillingPortfolio/InvoiceGenerationOtherItems/BasicData.vue'

// Logic view
import InvoiceGenerationOtherItemsView from '@/views/billing-portfolio/invoice-generation-other-items/v1/view/InvoiceGenerationOtherItemsView'

const {
  invoice_generation_other_items_response,
  basic_data_form,
  basicDataFormRef,
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  utils,

  nextTab,
  backTab,
  onSubmit,
  goToURL,
} = InvoiceGenerationOtherItemsView()
</script>
