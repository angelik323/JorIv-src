<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      show-back-btn
      :title="headerPropsCreate.title"
      :breadcrumbs="headerPropsCreate.breadcrumbs"
      @on-back="goToList"
    >
      <TabsComponent :tabActive="tabActive" :tabs :tabActiveIdx />
      <Card>
        <template #content-card>
          <div class="q-px-lg q-pb-lg q-pt-lg">
            <InformationForm
              ref="informationFormRef"
              action="edit"
              :data="data_information_form"
              @update:data="data_information_form = $event"
            />
            <section>
              <div class="row justify-end q-gutter-md">
                <Button
                  label="Actualizar"
                  size="md"
                  unelevated
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  :outline="false"
                  @click="onSubmit"
                />
              </div>
            </section>
          </div>
        </template>
      </Card>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
// components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

import InformationForm from '@/components/Forms/FixedAssets/VisitRecords/InformationForm.vue'

// logic view
import useVisitRecordsEdit from '@/views/fixed-assets/visit-records/v1/edit/VisitRecordsEdit'

const {
  headerPropsCreate,

  tabs,
  tabActive,
  tabActiveIdx,

  informationFormRef,
  data_information_form,

  onSubmit,
  goToList,
} = useVisitRecordsEdit()
</script>
