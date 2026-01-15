<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('CancellationRejectionReasonsList')"
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
            action="edit"
            ref="basicDataFormRef"
            :data="cancellation_rejection_reasons_response"
          />

          <section class="mx-2 mb-2">
            <q-separator />
            <div class="row justify-end">
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
                class="text-capitalize btn-filter custom mt-2"
                @click="handleEdit"
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
import BasicDataForm from '@/components/Forms/AccountsPayable/CancellationRejectionReasons/BasicDataForm.vue'

//Logic
import useCancellationRejectionReasonsEdit from '@/views/accounts-payable/cancellation-rejection-reasons/v1/edit/CancellationRejectionReasonsEdit'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  basicDataFormRef,
  cancellation_rejection_reasons_response,
  handleEdit,
  goToURL,
} = useCancellationRejectionReasonsEdit()
</script>
