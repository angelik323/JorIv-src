<template>
  <div class="q-mx-xl">
    <ContentComponent
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      @on-back="$router.push({ name: 'CollectionAccountingBlocksList' })"
    >
      <section>
        <TabsComponent
          :tabActive="activeTab"
          :tabs="tabs"
          :tabActiveIdx="tabActiveIdx"
          @update:tab-active="activeTab = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />

        <VCard>
          <template #content-card>
            <InformationForm
              v-if="activeTab === 'InformationForm'"
              action="edit"
              :data="
                data_information_form ? [data_information_form] : undefined
              "
            />

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  label="Actualizar"
                  size="md"
                  unelevated
                  color="orange"
                  @click="onSubmit"
                  class="text-capitalize btn-filter custom"
                />
              </div>
            </section>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import InformationForm from '@/components/Forms/Treasury/AccountingParameters/Information/InformationForm.vue'
import Button from '@/components/common/Button/Button.vue'
import { useAccountingParametersEdit } from './AccountingParametersEdit'

const {
  headerProps,
  data_information_form,
  activeTab,
  tabActiveIdx,
  tabs,
  onSubmit,
} = useAccountingParametersEdit()
</script>
