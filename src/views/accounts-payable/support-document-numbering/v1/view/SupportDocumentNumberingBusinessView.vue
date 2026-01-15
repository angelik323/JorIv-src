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
          <SupportDocumentNumberingBusinessForm
            action="view"
            :data="business_data_form"
            @update:data="business_data_form = $event"
            ref="businessDataFormRef"
          />

          <section class="mx-2 mb-2">
            <q-separator></q-separator>
            <div class="row justify-end">
              <Button
                label="Finalizar"
                size="md"
                unelevated
                :outline="false"
                color="orange"
                class="text-capitalize btn-filter custom mt-2"
                @click="
                  goToURL(
                    'SupportDocumentNumberingView',
                    supportDocumentNumberingId
                  )
                "
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
import SupportDocumentNumberingBusinessForm from '@/components/Forms/AccountsPayable/SupportDocumentNumbering/SupportDocumentNumberingBusiness/SupportDocumentNumberingBusinessForm.vue'

//Logic
import useSupportDocumentNumberingBusinessView from '@/views/accounts-payable/support-document-numbering/v1/view/SupportDocumentNumberingBusinessView'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  supportDocumentNumberingId,
  businessDataFormRef,
  business_data_form,
  goToURL,
} = useSupportDocumentNumberingBusinessView()
</script>
