<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerPropsRead.title"
      :breadcrumbs="headerPropsRead.breadcrumbs"
      show-back-btn
      @on-back="goToList()"
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

            <section>
              <div class="row justify-end q-gutter-md">
                <Button
                  label="Finalizar"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="goToList"
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

import InformationForm from '@/components/Forms/FixedAssets/AccountingConfiguration/v1/InformationForm.vue'

// logic view
import useAccountingConfigurationRead from '@/views/fixed-assets/accounting-configuration/v1/read/AccountingConfigurationRead'

const {
  headerPropsRead,

  tabs,
  tabActive,
  tabActiveIdx,

  informationFormRef,
  data_information_form,

  goToList,
} = useAccountingConfigurationRead()
</script>
