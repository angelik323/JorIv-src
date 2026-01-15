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

        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <BasicData
                v-if="tabActive === 'basic-data'"
                :data="basic_data_form"
                ref="basicDataFormRef"
                action="create"
                @update:data="basic_data_form = $event"
              />
            </div>

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  label="Crear"
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
import useInvoiceGenerationOtherItemsCreate from '@/views/billing-portfolio/invoice-generation-other-items/v1/create/InvoiceGenerationOtherItemsCreate'

const {
  basic_data_form,
  basicDataFormRef,
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,

  onSubmit,
  goToURL,
} = useInvoiceGenerationOtherItemsCreate()
</script>
