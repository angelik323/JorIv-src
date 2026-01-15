<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'BankAccountBalancesList' })"
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
              :action="'create'"
            />

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) ===
                    tabs.length - 1
                  "
                  :label="'Crear'"
                  :rightIcon="defaultIconsLucide.chevronRight"
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
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

// composables
import useBankAccountBalancesCreate from './BankAccountBalancesCreate'

// utils
import { defaultIconsLucide } from '@/utils'

// forms
import InformationForm from '@/components/Forms/Treasury/BankAccountBalances/information/InformationForm.vue'

const {
  headerProps,
  tabs,
  formInformation,
  tabActive,
  tabActiveIdx,
  onSubmit,
} = useBankAccountBalancesCreate()
</script>
