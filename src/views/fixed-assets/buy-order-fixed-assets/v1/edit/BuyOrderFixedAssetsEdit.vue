<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerPropsEdit.title"
      :breadcrumbs="headerPropsEdit.breadcrumbs"
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
                action="edit"
                :data="buyOrderData"
              />
              <div class="row justify-end q-gutter-md">
                <Button
                  label="Actualizar"
                  size="md"
                  unelevated
                  :outline="false"
                  :disable="isSubmitDisabled"
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
import InformationForm from '@/components/Forms/FixedAssets/BuyOrderFixedAssets/InformationForm/InformationForm.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

// logic view
import useBuyOrderFixedAssetsEdit from '@/views/fixed-assets/buy-order-fixed-assets/v1/edit/BuyOrderFixedAssetsEdit'

const {
  headerPropsEdit,
  tabs,
  tabActive,
  tabActiveIdx,
  formInformation,
  buyOrderData,
  isSubmitDisabled,

  onSubmit,
  goToList
} = useBuyOrderFixedAssetsEdit()
</script>
