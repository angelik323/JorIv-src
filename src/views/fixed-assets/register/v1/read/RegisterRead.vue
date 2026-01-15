<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerPropsRead.title"
      :breadcrumbs="headerPropsRead.breadcrumbs"
      show-back-btn
      @on-back="goToURL('RegisterList')"
    >
      <template #addAfter>
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-md-auto">
            <Button
              label="Descargar PDF"
              no-caps
              outline
              color="orange"
              text-color="black"
              class-custom="btn-header full-width"
              :styleContent="{ 'place-items': 'center', color: 'black' }"
              @click="downloadPdfById"
            />
          </div>
          <div class="col-12 col-md-auto">
            <Button
              :outline="false"
              label="Descargar excel"
              color="primary"
              color-icon="white"
              class-custom="btn-header full-width"
              :styleContent="{ 'place-items': 'center', color: 'white' }"
              @click="downloadExcelById"
            />
          </div>
        </div>
      </template>
      <section>
        <TabsComponent
          v-model:tabActive="tabActive"
          v-model:tabActiveIdx="tabActiveIdx"
          :tabs="tabs"
        />

        <Card>
          <template #content-card>
            <div class="q-px-xl q-pb-xl q-pt-lg">
              <InformationForm
                v-if="tabActive === 'information'"
                action="view"
                :data="informationFormData"
              />
              <DocumentsForm
                v-if="tabActive === 'documents'"
                action="view"
                :data="documentsFormData"
              />
              <EntryInformationForm
                v-if="
                  tabActive === 'entryInformation' &&
                  entryInformationFormData !== null
                "
                :data="entryInformationFormData"
              />
              <AccountingInformationForm
                v-if="
                  tabActive === 'accountingInformation' &&
                  accountingInformationFormData !== null
                "
                :data="accountingInformationFormData"
              />
              <NoveltyHistoryForm
                v-if="
                  tabActive === 'noveltyHistory' &&
                  noveltyHistoryFormData !== null
                "
                :data="noveltyHistoryFormData"
              />
              <DepreciationHistoryForm
                v-if="
                  tabActive === 'depreciationHistory' &&
                  depreciationHistoryFormData !== null
                "
                :data="depreciationHistoryFormData"
              />
              <AddressHistoryForm
                v-if="
                  tabActive === 'addressHistory' &&
                  addressHistoryFormData !== null
                "
                :data="addressHistoryFormData"
              />
            </div>
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
                    tabs.findIndex((tab) => tab.name === tabActive) <
                      tabs.length - 1
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
                  label="Finalizar"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="onSubmit"
                />
              </div>
            </section>
          </template>
        </Card>
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
import EntryInformationForm from '@/components/Forms/FixedAssets/Register/EntryInformationForm/EntryInformationForm.vue'
import AccountingInformationForm from '@/components/Forms/FixedAssets/Register/AccountingInformationForm/AccountingInformationForm.vue'
import NoveltyHistoryForm from '@/components/Forms/FixedAssets/Register/NoveltyHistoryForm/NoveltyHistoryForm.vue'
import DepreciationHistoryForm from '@/components/Forms/FixedAssets/Register/DepreciationHistoryForm/DepreciationHistoryForm.vue'
import AddressHistoryForm from '@/components/Forms/FixedAssets/Register/AddressHistoryForm/AddressHistoryForm.vue'

// logic
import useRegisterRead from '@/views/fixed-assets/register/v1/read/RegisterRead'

const {
  defaultIconsLucide,

  headerPropsRead,
  tabs,
  tabActive,
  tabActiveIdx,

  informationFormData,
  documentsFormData,
  entryInformationFormData,
  accountingInformationFormData,
  noveltyHistoryFormData,
  depreciationHistoryFormData,
  addressHistoryFormData,

  nextTab,
  backTab,
  onSubmit,
  goToURL,

  downloadExcelById,
  downloadPdfById,
} = useRegisterRead()
</script>
