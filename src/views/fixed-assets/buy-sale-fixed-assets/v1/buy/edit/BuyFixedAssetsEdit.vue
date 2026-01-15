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
              <DocumentsForm
                v-if="tabActive === 'documents'"
                ref="formDocuments"
                action="edit"
                :data="transactionData?.documents || null"
                @update:models="setDocumentsFormData"
              />
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
                    tabs.findIndex((tab) => tab.name === tabActive) < tabs.length - 1
                  "
                  label="Continuar"
                  :rightIcon="defaultIconsLucide.next"
                  color-icon="#fff"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="nextTab"
                />

                <Button
                  v-if="tabs.findIndex((tab) => tab.name === tabActive) === tabs.length - 1"
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
import InformationForm from '@/components/Forms/FixedAssets/BuySaleFixedAssets/InformationForm/Buy/InformationForm.vue'
import DocumentsForm from '@/components/Forms/FixedAssets/BuySaleFixedAssets/DocumentsForm/DocumentsForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

// logic view
import useBuyFixedAssetsEdit from '@/views/fixed-assets/buy-sale-fixed-assets/v1/buy/edit/BuyFixedAssetsEdit'

const {
  defaultIconsLucide,
  headerPropsEdit,
  tabs,
  tabActive,
  tabActiveIdx,
  formInformation,
  formDocuments,
  transactionData,

  // Documents
  setDocumentsFormData,

  onSubmit,
  goToList,
  backTab,
  nextTab
} = useBuyFixedAssetsEdit()
</script>
