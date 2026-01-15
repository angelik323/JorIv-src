<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="handleGoToList"
    >
      <section class="q-my-md">
        <TabsComponent
          :tabs="tabs"
          :tab-active="activeTab"
          :tab-active-idx="tabActiveIdx"
        />

        <Card>
          <template #content-card>
            <section class="q-pa-lg">
              <InformationForm
                v-if="activeTab === 'InformationForm'"
                ref="informationFormRef"
                :action="'view'"
                :data="operating_offices_response"
              />

              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  label="Finalizar"
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
// Components
import InformationForm from '@/components/Forms/Fics/OperatingOffices/Information/InformationForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import Card from '@/components/common/VCard/VCard.vue'

// logic view
import useOperatingOfficesView from '@/views/fics/operating-offices/v1/view/OperatingOfficesView'

const {
  tabs,
  onSubmit,
  activeTab,
  tabActiveIdx,
  handleGoToList,
  headerProperties,
  informationFormRef,
  operating_offices_response,
} = useOperatingOfficesView()
</script>
