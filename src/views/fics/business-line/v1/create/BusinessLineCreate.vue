<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="handleGoToList"
    >
      <section class="q-my-md">
        <TabsComponent
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <section class="q-pa-lg">
              <BusinessLineForm
                v-show="tabActive === 'information'"
                ref="businessLineForm"
                :action="'create'"
              />

              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  :class-custom="'custom'"
                  label="Crear"
                  size="md"
                  color="orange"
                  @click="onSubmit"
                />
              </div>
            </section>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
// Components
import BusinessLineForm from '@/components/Forms/Fics/BusinessLine/Information/InformationForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useBusinessLineCreate from '@/views/fics/business-line/v1/create/BusinessLineCreate'

const {
  tabs,
  onSubmit,
  tabActive,
  headerProps,
  tabActiveIdx,
  handleGoToList,
  businessLineForm,
} = useBusinessLineCreate()
</script>
