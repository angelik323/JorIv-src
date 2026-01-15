<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      @on-back="$router.push({ name: 'GroundsForBankRefund' })"
    >
      <section class="q-mt-xs px-4">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />

        <Card>
          <template #content-card>
            <!-- Views -->
            <BasicDataComponent
              ref="GroundsForBankRefundDataRef"
              :action="'create'"
            />

            <!-- Actions -->

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) ===
                    tabs.length - 1
                  "
                  :label="'Crear'"
                  :rightIcon="useUtils().defaultIconsLucide.chevronRight"
                  :color-icon="'#fff'"
                  :size="'md'"
                  :unelevated="true"
                  :outline="false"
                  :color="'orange'"
                  :class="'text-capitalize btn-filter custom'"
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
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import BasicDataComponent from '@/components/Forms/BasicDataComponent/BasicDataComponent.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useGroundsForBankRefundCreate from './GroundsForBankRefundCreate'

// Utils
import { useUtils } from '@/composables'

const {
  GroundsForBankRefundDataRef,
  tabActiveIdx,
  headerProps,
  tabActive,
  tabs,
  onSubmit,
} = useGroundsForBankRefundCreate()
</script>
