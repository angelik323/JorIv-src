<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <template #addAfter>
        <Button
          v-if="
            validateRouter(
              'AccountsPayable',
              'SupportDocumentNumberingList',
              'create'
            )
          "
          :outline="false"
          label="Crear"
          size="md"
          color="primary"
          class="btn-filter"
          icon="PlusCircle"
          color-icon="white"
          @click="
            goToURL(
              'SupportDocumentNumberingResolutionsCreate',
              supportDocumentNumberingId
            )
          "
        />
      </template>
    </ContentComponent>
    <section class="q-my-md">
      <TabsComponent
        :tab-active="tabActive"
        :tabs="tabs"
        :tab-active-idx="tabActiveIdx"
      />

      <VCard>
        <template #content-card>
          <BasicDataForm
            v-if="tabActive === 'information'"
            action="view"
            ref="basicDataFormRef"
            :data="basic_data_form"
          />
          <q-separator class="mx-2"></q-separator>
          <section class="mt-4 mb-2 mx-2">
            <p class="text-grey-90 text-subtitle1 text-weight-bold">
              Listado de resoluciones DIAN por emisor
            </p>
            <VCard>
              <template #content-card>
                <SupportDocumentNumberingResolutionsList
                  :third_party_id="supportDocumentNumberingId"
                  @selected-resolution="selectedResolution = $event"
                />
              </template>
            </VCard>
          </section>

          <section class="mt-4 mx-2">
            <NoDataState
              v-show="!selectedResolution"
              type="empty"
              title="Seleccione una resolución"
              subtitle="Aqui visualizara los negocios asociados al emisor"
            />
            <div v-show="selectedResolution">
              <p class="text-grey-90 text-subtitle1 text-weight-bold">
                Listado de negocios asociados al emisor
              </p>
              <VCard>
                <template #content-card>
                  <SupportDocumentNumberingBusinessList
                    :resolution-id="selectedResolution"
                    :third_party_id="
                      basic_data_form ? basic_data_form.id ?? null : null
                    "
                  />
                </template>
              </VCard>
            </div>
          </section>

          <section class="mx-2 mb-2">
            <div class="row justify-end">
              <Button
                label="Finalizar"
                size="md"
                unelevated
                :outline="false"
                color="orange"
                class="text-capitalize btn-filter custom"
                @click="goToURL('SupportDocumentNumberingList')"
              />
            </div>
          </section>
        </template>
      </VCard>
    </section>
  </div>
</template>
<script setup lang="ts">
//Components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import BasicDataForm from '@/components/Forms/AccountsPayable/SupportDocumentNumbering/BasicDataForm/BasicDataForm.vue'
import SupportDocumentNumberingResolutionsList from '@/components/Lists/AccountsPayable/SupportDocumentNumbering/SupportDocumentNumberingResolutions/SupportDocumentNumberingResolutionsList.vue'
import SupportDocumentNumberingBusinessList from '@/components/Lists/AccountsPayable/SupportDocumentNumbering/SupportDocumentNumberingBusiness/SupportDocumentNumberingBusinessList.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'

//Logic
import useSupportDocumentNumberingView from '@/views/accounts-payable/support-document-numbering/v1/view/SupportDocumentNumberingView'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  supportDocumentNumberingId,
  basicDataFormRef,
  basic_data_form,
  selectedResolution,
  goToURL,
  validateRouter,
} = useSupportDocumentNumberingView()
</script>
