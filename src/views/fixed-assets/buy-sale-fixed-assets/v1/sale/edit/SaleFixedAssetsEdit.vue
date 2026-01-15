<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerPropsEdit.title"
      :breadcrumbs="headerPropsEdit.breadcrumbs"
      show-back-btn
      @on-back="goToList"
    >
      <section>
        <TabsComponent :tabActive :tabs :tabActiveIdx />

        <Card>
          <template #content-card>
            <div class="q-pa-lg">
              <InformationForm
                v-show="tabActive === 'information'"
                ref="formInformation"
                action="edit"
                :data="transactionData"
              />
              <div class="row justify-end q-gutter-md">
                <Button
                  label="Actualizar"
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
import useSaleFixedAssetsEdit from '@/views/fixed-assets/buy-sale-fixed-assets/v1/sale/edit/SaleFixedAssetsEdit'

const {
  headerPropsEdit,
  tabs,
  tabActive,
  tabActiveIdx,
  formInformation,
  transactionData,

  onSubmit,
  goToList
} = useSaleFixedAssetsEdit()
</script>
