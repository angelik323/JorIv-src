<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerPropsCreate.title"
      :breadcrumbs="headerPropsCreate.breadcrumbs"
      show-back-btn
      @on-back="handleBack"
    >
      <section>
        <TabsComponent :tabActive :tabs :tabActiveIdx />

        <Card>
          <template #content-card>
            <div class="q-pa-lg">
              <InformationForm
                v-show="tabActive === 'information'"
                ref="formInformation"
                action="create"
              />
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
            </div>
          </template>
        </Card>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// components
import InformationForm from '@/components/Forms/FixedAssets/BuySaleFixedAssets/InformationForm/Sale/InformationForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

// logic view
import useSaleFixedAssetsCreate from '@/views/fixed-assets/buy-sale-fixed-assets/v1/sale/create/SaleFixedAssetsCreate'

const {
  // Header & Form
  headerPropsCreate,
  tabs,
  tabActive,
  tabActiveIdx,
  formInformation,

  // Actions
  onSubmit,
  handleBack
} = useSaleFixedAssetsCreate()
</script>
