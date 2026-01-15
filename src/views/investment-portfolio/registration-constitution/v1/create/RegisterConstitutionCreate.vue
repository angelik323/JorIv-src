<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      @on-back="$router.push({ name: 'RegisterConstitutionList' })"
    >
      <section>
        <div class="row q-mb-md items-center">
          <TabsComponent
            :tabActive="activeTab"
            :tabs="tabs"
            :tabActiveIdx="tabActiveIdx"
            @update:tab-active="activeTab = $event"
            @update:tab-active-idx="tabActiveIdx = $event"
          />
        </div>
        <VCard>
          <template #content-card>
            <InformationForm
              v-if="activeTab === 'InformationForm'"
              ref="informationForm"
            />
            <InformationFormLocalMoney
              v-else-if="activeTab === 'InformationForeignForm'"
            />
            <section class="mx-4 mb-4" v-if="activeTab === 'InformationForm'">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  label="Continuar"
                  size="md"
                  unelevated
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="validateChange"
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
import Button from '@/components/common/Button/Button.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import { useRegisterConstitutionCreate } from './RegisterConstitutionCreate'
import InformationForm from '@/components/Forms/InvestmentPortfolio/RegisterConstitution/information/InformationForm.vue'
import InformationFormLocalMoney from '@/components/Forms/InvestmentPortfolio/RegisterConstitution/information/informationLocalMoney/InformationFormLocalMoney.vue'

const {
  headerProps,
  tabs,
  activeTab,
  tabActiveIdx,
  informationForm,
  validateChange,
} = useRegisterConstitutionCreate()
</script>
