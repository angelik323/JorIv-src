<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'ChartAccountsList' })"
    >
      <template #addAfter>
        <Button
          outline
          :label="'Importar'"
          :left-icon="defaultIconsLucide.cloudUpload"
          color="orange"
          class-custom="custom"
          color-icon="black"
          :styleContent="{
            'place-items': 'center',
            'border-radius': '20px',
            width: '100px',
            height: '32px',
            'font-size': '13px',
            color: 'black',
          }"
          @click="
            $router.push({
              name: 'ChartAccountsImport',
              query: {
                structureId: data_information_form?.account_structure_id,
              },
            })
          "
          :disabled="!data_information_form?.account_structure_id"
        />
      </template>
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <InformationForm
              v-if="tabActive === 'information'"
              ref="formInformation"
              :action="'create'"
            />

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) ===
                    tabs.length - 1
                  "
                  :label="'Crear'"
                  :iconRight="'mdi-chevron-right'"
                  :size="'md'"
                  :unelevated="true"
                  :outline="false"
                  :color="'orange'"
                  :class="'text-capitalize btn-filter custom'"
                  @click="onSubmit"
                />
              </div>
            </section>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
// components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

// composables
import useChartAccountsCreate from './ChartAccountsCreate'

// Utils
import { defaultIconsLucide } from '@/utils'

// Forms
import InformationForm from '@/components/Forms/Accounting/ChartAccounts/information/InformationForm.vue'
const {
  headerProps,
  tabs,
  formInformation,
  data_information_form,
  tabActive,
  tabActiveIdx,
  onSubmit,
} = useChartAccountsCreate()
</script>
