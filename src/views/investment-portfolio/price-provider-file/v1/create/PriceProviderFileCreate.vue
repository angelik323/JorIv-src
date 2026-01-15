<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'PriceProviderFile' })"
    >
      <section class="q-my-md q-pl-lg">
        <TabsComponent
          :tab-active="activeTab"
          :tabs="tabs"
          :tab-active-idx="activeTabIdx"
          @update:tab-active="activeTab = $event"
        />
        <VCard>
          <template #content-card>
            <div>
              <PriceProviderFileForm
                ref="priceProviderFileForm"
                action="create"
              />
            </div>
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  class-custom="custom"
                  label="Crear"
                  size="md"
                  @click="onSubmit"
                  :color="disabledButtom ? 'orange' : 'grey'"
                  :disabled="!disabledButtom"
                />
              </div>
            </section>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
// Components
import PriceProviderFileForm from '@/components/Forms/InvestmentPortfolio/PriceProviderFile/PriceProviderFileForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import { usePriceProviderFileCreate } from '@/views/investment-portfolio/price-provider-file/v1/create/PriceProviderFileCreate'

const {
  headerProps,
  tabs,
  activeTab,
  activeTabIdx,
  onSubmit,
  priceProviderFileForm,
  disabledButtom,
} = usePriceProviderFileCreate()
</script>
