<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="
        goToURL('SupportDocumentNumberingView', supportDocumentNumberingId)
      "
    ></ContentComponent>
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
            resolution-form
            :data="basic_data_form"
            ref="basicDataFormRef"
          />
          <q-separator class="mx-2"></q-separator>
          <SupportDocumentNumberingResolutionsForm
            action="edit"
            :data="resolution_data_form"
            @update:data="resolution_data_form = $event"
            ref="resolutionDataFormRef"
          />

          <section class="mx-2 mb-2">
            <q-separator></q-separator>
            <div class="row justify-end">
              <Button
                label="Actualizar"
                size="md"
                unelevated
                :outline="false"
                color="orange"
                class="text-capitalize btn-filter custom mt-2"
                @click="handleSubmit"
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
import SupportDocumentNumberingResolutionsForm from '@/components/Forms/AccountsPayable/SupportDocumentNumbering/SupportDocumentNumberingResolutions/SupportDocumentNumberingResolutionsForm.vue'

//Logic
import useSupportDocumentNumberingResolutionsEdit from '@/views/accounts-payable/support-document-numbering/v1/edit/SupportDocumentNumberingResolutionsEdit'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  supportDocumentNumberingId,
  basic_data_form,
  resolutionDataFormRef,
  resolution_data_form,
  handleSubmit,
  goToURL,
} = useSupportDocumentNumberingResolutionsEdit()
</script>
