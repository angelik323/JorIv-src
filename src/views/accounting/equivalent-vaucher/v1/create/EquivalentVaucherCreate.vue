<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerEquivalenVaucherCreate.title"
      :breadcrumbs="headerEquivalenVaucherCreate.breadcrumbs"
      :show-back-btn="headerEquivalenVaucherCreate.showBackBtn"
      @on-back="goToURL('EquivalentVaucherList')"
    >
      <section class="q-my-md q-pl-lg">
        <TabsComponent
          :tab-active="activeTab"
          :tabs="tabs"
          :tab-active-idx="activeTabIdx"
          @update:tab-active="activeTab = $event"
        />
        <VCard>
          <template #content-card>
            <div v-show="activeTab === 'basic_data'">
              <EquivalentVaucherForm
                ref="equivalentVaucherForm"
                action="create"
              />
            </div>

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  color="orange"
                  class-custom="custom"
                  label="Crear"
                  size="md"
                  @click="onCreate"
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
import VCard from '@/components/common/VCard/VCard.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import { useGoToUrl } from '@/composables/useGoToUrl'
import useEquivalentVaucherCreate from './EquivalentVaucherCreate'
import EquivalentVaucherForm from '@/components/Forms/Accounting/EquivalentVaucher/EquivalentVaucherForm.vue'

const { goToURL } = useGoToUrl()

const {
  headerEquivalenVaucherCreate,
  tabs,
  activeTab,
  activeTabIdx,
  equivalentVaucherForm,
  onCreate,
} = useEquivalentVaucherCreate()
</script>
