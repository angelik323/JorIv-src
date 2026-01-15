<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :show-back-btn="true"
      @on-back="handleGoToList"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <section class="q-pa-lg">
              <InformationForm
                v-if="initialData"
                v-show="tabActive === 'information'"
                ref="informationFormRef"
                :action="'edit'"
                :data="initialData"
              />

              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  label="Actualizar"
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
import InformationForm from '@/components/Forms/Accounting/PucAccountEquivalence/InformationForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import usePucAccountEquivalenceEdit from './PucAccountEquivalenceEdit'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

const {
  tabs,
  tabActive,
  initialData,
  tabActiveIdx,
  handleGoToList,
  headerProperties,
  handleSubmitForm,
  informationFormRef,
} = usePucAccountEquivalenceEdit()
</script>
