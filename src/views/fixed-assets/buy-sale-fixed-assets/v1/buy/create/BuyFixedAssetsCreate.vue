<template>
  <!-- Paso 1: Selección de orden de compra -->
  <div v-if="isSelectOrderStep" class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerPropsCreate.title"
      :breadcrumbs="headerPropsCreate.breadcrumbs"
      show-back-btn
      @on-back="handleBack"
    >
      <SelectPurchaseOrder @select="handleOrderSelected" />
    </ContentComponent>
  </div>

  <!-- Paso 2: Formulario de creación -->
  <div class="q-mx-xl" v-else>
    <ContentComponent
      indentation
      content-indentation
      :title="headerPropsCreate.title"
      :breadcrumbs="headerPropsCreate.breadcrumbs"
      show-back-btn
      @on-back="handleBack"
    >
      <template #addAfter>
        <Button
          label="Importar"
          :left-icon="defaultIconsLucide.upload"
          color="orange"
          unelevated
          :outline="false"
          class="text-capitalize"
          tooltip="Importar compra de activos fijos y bienes"
          @click="handleGoToImport"
        />
      </template>
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
              <DocumentsForm
                v-if="tabActive === 'documents'"
                ref="formDocuments"
                action="create"
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
import InformationForm from '@/components/Forms/FixedAssets/BuySaleFixedAssets/InformationForm/Buy/InformationForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import SelectPurchaseOrder from '@/components/Forms/FixedAssets/BuySaleFixedAssets/SelectPurchaseOrder/SelectPurchaseOrder.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import DocumentsForm from '@/components/Forms/FixedAssets/BuySaleFixedAssets/DocumentsForm/DocumentsForm.vue'

// logic view
import useBuyFixedAssetsCreate from '@/views/fixed-assets/buy-sale-fixed-assets/v1/buy/create/BuyFixedAssetsCreate'

const {
  defaultIconsLucide,

  isSelectOrderStep,

  handleOrderSelected,

  // Header & Form
  headerPropsCreate,
  tabs,
  tabActive,
  tabActiveIdx,
  formInformation,
  formDocuments,

  // Documents
  setDocumentsFormData,

  // Actions
  onSubmit,
  handleBack,
  backTab,
  nextTab,
  handleGoToImport
} = useBuyFixedAssetsCreate()
</script>
