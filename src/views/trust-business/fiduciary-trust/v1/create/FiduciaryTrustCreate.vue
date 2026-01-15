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
      <section>
        <TabsComponent :tabs :tabActive :tabActiveIdx />

        <VCard>
          <template #content-card>
            <section class="q-pa-lg">
              <InformationForm
                v-show="tabActive === 'information'"
                ref="informationFormRef"
                action="create"
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
import InformationForm from '@/components/Forms/TrustBusiness/FiduciaryTrust/BasicData.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

import useFiduciaryTrustCreate from './FiduciaryTrustCreate'

const {
  tabs,
  tabActive,
  headerProps,
  tabActiveIdx,
  handleGoToList,
  handleSubmitForm,
  informationFormRef,
} = useFiduciaryTrustCreate()
</script>
