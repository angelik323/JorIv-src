<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="handlerGoTo('DesactivateDailyClosingList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />
        <VCard>
          <template #content-card>
            <InformationForm
              v-if="tabActive === 'information'"
              ref="formInformation"
              action="create"
            />
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) ===
                    tabs.length - 1
                  "
                  label="Crear"
                  :right-icon="defaultIconsLucide.chevronRight"
                  :color-icon="'white'"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
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
// components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

// logic
import useDesactivateDailyClousingVouchersCreate from './DesactivateDailyClosingVouchersCreate'

// utils
import { defaultIconsLucide } from '@/utils'

import InformationForm from '@/components/Forms/Accounting/DesactivateDailyClosingVouchers/information/InformationForm.vue'

const {
  headerProps,
  tabActive,
  tabActiveIdx,
  tabs,
  formInformation,
  handlerGoTo,
  onSubmit,
} = useDesactivateDailyClousingVouchersCreate()
</script>
