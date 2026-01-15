<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerPropsEdit.title"
      :breadcrumbs="headerPropsEdit.breadcrumbs"
      show-back-btn
      @on-back="goToURL('RegisterList')"
    >
      <section>
        <TabsComponent :tabActive :tabs :tabActiveIdx />

        <Card>
          <template #content-card>
            <div class="q-px-xl q-pb-xl q-pt-lg">
              <InformationForm
                v-show="tabActive === 'information'"
                ref="formInformationRef"
                action="edit"
                :data="informationFormData"
                @update:models="setInformationFormData"
              />
              <DocumentsForm
                v-show="tabActive === 'documents'"
                ref="formDocumentsRef"
                action="edit"
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
            v-if="
              tabs.findIndex((tab) => tab.name === tabActive) ===
              tabs.length - 1
            "
            label="Actualizar "
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

// logic
import useRegisterEdit from '@/views/fixed-assets/register/v1/edit/RegisterEdit'

const {
  defaultIconsLucide,

  headerPropsEdit,
  tabs,
  tabActive,
  tabActiveIdx,

  formInformationRef,
  formDocumentsRef,
  informationFormData,
  documentsFormData,

  setInformationFormData,
  setDocumentsFormData,

  goToURL,
  nextTab,
  backTab,
  onSubmit,
} = useRegisterEdit()
</script>
