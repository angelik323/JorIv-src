<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerPropsRead.title"
      :breadcrumbs="headerPropsRead.breadcrumbs"
      @on-back="goToList"
    >
      <section>
        <TabsComponent :tabActive :tabs :tabActiveIdx />
        <Card>
          <template #content-card>
            <div class="q-pa-lg">
              <InformationForm
                v-if="tabActive === 'information'"
                ref="formInformation"
                action="view"
                :data="buyOrderData"
              />
              <div class="row justify-end q-gutter-md">
                <Button
                  label="Finalizar"
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
// Components
import InformationForm from '@/components/Forms/FixedAssets/BuyOrderFixedAssets/InformationForm/InformationForm.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useBuyOrderFixedAssetsRead from '@/views/fixed-assets/buy-order-fixed-assets/v1/read/BuyOrderFixedAssetsRead'

const {
  headerPropsRead,
  tabs,
  tabActive,
  tabActiveIdx,
  formInformation,
  buyOrderData,

  onSubmit,
  goToList
} = useBuyOrderFixedAssetsRead()
</script>
