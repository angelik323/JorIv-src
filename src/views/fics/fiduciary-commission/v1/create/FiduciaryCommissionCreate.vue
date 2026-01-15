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
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <section class="q-pa-lg">
              <InformationForm
                v-show="tabActive === 'information'"
                ref="informationFormRef"
                :action="'create'"
              />

              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  label="Crear"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="handleSubmitForm"
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
import InformationForm from '@/components/Forms/Fics/FiduciaryCommission/information/InformationForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useFiduciaryCommissionCreate from '@/views/fics/fiduciary-commission/v1/create/FiduciaryCommissionCreate'

const {
  tabs,
  tabActive,
  tabActiveIdx,
  handleGoToList,
  headerProperties,
  handleSubmitForm,
  informationFormRef,
} = useFiduciaryCommissionCreate()
</script>
