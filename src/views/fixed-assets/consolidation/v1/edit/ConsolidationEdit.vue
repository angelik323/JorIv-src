<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerPropsCreate.title"
      :breadcrumbs="headerPropsCreate.breadcrumbs"
      show-back-btn
      @on-back="goToList()"
    >
      <section>
        <TabsComponent :tabActive :tabs :tabActiveIdx />

        <Card>
          <template #content-card>
            <div class="q-px-xl q-pb-xl q-pt-lg">
              <!-- <InformationForm
                v-if="tabActive === 'information'"
                ref="formInformation"
                action="create"
                :data="getInformationFormData"
                @update:models="setInformationFormData"
              />

              <DocumentsForm
                v-if="tabActive === 'documents'"
                ref="formDocuments"
                action="create"
                :data="getDocumentsFormData"
                @update:models="setDocumentsFormData"
              /> -->
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
            label="Actualizar"
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

// Logic view
import useConsolidationEdit from '@/views/fixed-assets/consolidation/v1/edit/ConsolidationEdit'

const {
  // refs
  tabs,
  tabActive,
  tabActiveIdx,
  // formInformation,
  // formDocuments,
  headerPropsCreate,
  defaultIconsLucide,
  //   getInformationFormData,
  //   getDocumentsFormData,

  // functions
  nextTab,
  backTab,
  onSubmit,
  goToList,
  //   setInformationFormData,
  //   setDocumentsFormData,
} = useConsolidationEdit()
</script>
