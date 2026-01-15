<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerPropsRead.title"
      :breadcrumbs="headerPropsRead.breadcrumbs"
      show-back-btn
      @on-back="goToList"
    >
      <TabsComponent :tabActive :tabs :tabActiveIdx />
      <Card>
        <template #content-card>
          <div class="q-px-lg q-pb-lg q-pt-lg">
            <InformationForm
              ref="informationFormRef"
              action="view"
              :data="data_information_form"
            />
          </div>

          <section>
            <div class="row justify-end q-gutter-md q-pb-lg q-pr-lg">
              <Button
                label="Finalizar"
                size="md"
                unelevated
                color="orange"
                class="text-capitalize btn-filter custom"
                :outline="false"
                @click="goToList"
              />
            </div>
          </section>
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

// logic
import useVisitRecordsRead from '@/views/fixed-assets/visit-records/v1/read/VisitRecordsRead'

const {
  headerPropsRead,
  tabs,
  tabActive,
  tabActiveIdx,

  informationFormRef,
  data_information_form,

  goToList,
} = useVisitRecordsRead()
</script>
