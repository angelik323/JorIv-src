<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="handleGoToList"
    >
      <section class="q-my-md">
        <TabsComponent :tabs :tabActive :tabActiveIdx />

        <VCard v-if="rejection_reasons_response">
          <template #content-card>
            <div class="q-pa-lg">
              <InformationForm
                v-if="tabActive === 'information'"
                v-model:data="data_information_form"
                ref="informationFormRef"
                action="edit"
              />

              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  label="Actualizar"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="onSubmit"
                />
              </div>
            </div>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import InformationForm from '@/components/Forms/Fics/OperationRejectionReasons/Information/InformationForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useOperationRejectionReasonsEdit from '@/views/fics/operation-rejection-reasons/v1/edit/OperationRejectionReasonsEdit'

const {
  tabs,
  onSubmit,
  tabActive,
  headerProps,
  tabActiveIdx,
  handleGoToList,
  informationFormRef,
  data_information_form,
  rejection_reasons_response,
} = useOperationRejectionReasonsEdit()
</script>
