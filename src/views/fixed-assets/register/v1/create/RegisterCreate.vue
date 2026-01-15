<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerPropsCreate.title"
      :breadcrumbs="headerPropsCreate.breadcrumbs"
      show-back-btn
      @on-back="goToURL('RegisterList')"
    >
      <template #addAfter>
        <Button
          v-if="-validateRouter('FixedAssets', 'RegisterList', 'create')"
          :outline="false"
          label="Importar"
          color="primary"
          color-icon="white"
          class-custom="btn-header full-width"
          :styleContent="{ 'place-items': 'center', color: 'white' }"
          @click="goToURL('RegisterImport')"
        />
      </template>
      <section>
        <TabsComponent :tabActive :tabs :tabActiveIdx />

        <Card>
          <template #content-card>
            <div class="q-px-lg q-pb-lg q-pt-lg">
              <InformationForm
                v-show="tabActive === 'information'"
                ref="formInformationRef"
                action="create"
                :data="informationFormData"
                @update:models="setInformationFormData"
              />
              <DocumentsForm
                v-show="tabActive === 'documents'"
                ref="formDocumentsRef"
                action="create"
                :data="documentsFormData"
                @update:models="setDocumentsFormData"
              />
            </div>
          </template>
        </Card>
      </section>
      <section class="mx-4 mb-4">
        <div class="row justify-end q-gutter-md">
          <Button
            v-if="
              tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
              tabs.findIndex((tab) => tab.name === tabActive) > 0
            "
            class="text-capitalize btn-filter custom"
            color="orange"
            label="Atrás"
            size="md"
            unelevated
            outline
            @click="backTab"
          />
          <Button
            v-if="
              tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
              tabs.findIndex((tab) => tab.name === tabActive) < tabs.length - 1
            "
            class="text-capitalize btn-filter custom"
            color="orange"
            color-icon="#fff"
            label="Continuar"
            size="md"
            unelevated
            :rightIcon="defaultIconsLucide.next"
            :outline="false"
            @click="nextTab"
          />
          <Button
            v-if="
              tabs.findIndex((tab) => tab.name === tabActive) ===
              tabs.length - 1
            "
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
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
// components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

import InformationForm from '@/components/Forms/FixedAssets/Register/InformationForm/InformationForm.vue'
import DocumentsForm from '@/components/Forms/FixedAssets/Register/DocumentsForm/DocumentsForm.vue'

// logic-view
import useRegisterCreate from '@/views/fixed-assets/register/v1/create/RegisterCreate'

const {
  formInformationRef,
  formDocumentsRef,
  informationFormData,
  documentsFormData,

  headerPropsCreate,
  defaultIconsLucide,

  tabs,
  tabActive,
  tabActiveIdx,

  backTab,
  nextTab,
  onSubmit,

  validateRouter,
  goToURL,

  setInformationFormData,
  setDocumentsFormData,
} = useRegisterCreate()
</script>
