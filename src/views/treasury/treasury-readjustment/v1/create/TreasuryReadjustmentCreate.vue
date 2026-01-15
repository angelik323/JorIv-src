<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'FicParticipationsAdditionLocalCurrencyCreate' })"
    >
      <section>
        <TabsComponent
          :tabs="filteredTabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />

        <VCard>
          <template #content-card>
            <div class="q-px-xl q-pb-xl q-pt-lg">
              <InformationForm
                v-if="tabActive === 'information'"
                v-model:data="data_information_form"
                ref="informationFormRef"
                action="create"
              />
            </div>

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
                    tabs.findIndex((tab) => tab.name === tabActive) > 0
                  "
                  label="Atrás"
                  size="md"
                  unelevated
                  outline
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="backTab"
                />

                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
                    tabs.findIndex((tab) => tab.name === tabActive) <
                      tabs.length - 1
                  "
                  label="Continuar"
                  :rightIcon="defaultIconsLucide.next"
                  color-icon="#fff"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="nextTab"
                />

                <Button
                  :outline="false"
                  label="Limpiar"
                  size="md"
                  color="orange"
                  colorIcon="white"
                  :left-icon="useUtils().defaultIconsLucide.reload"
                  @click="clearForm()"
                />

                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) ===
                    tabs.length - 1
                  "
                  label="Procesar"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="onSubmit"
                />
              </div>

              <AlertModalComponent
                ref="alertModalRef"
                styleModal="min-width: 480px"
                title="¿Desea ejecutar el proceso?"
                @confirm="treasuryBalanceAdjustmentProcess"
              >
              </AlertModalComponent>
            </section>

          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import InformationForm from '@/components/Forms/Treasury/TreasuryReadjustment/Information/InformationForm.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

import useTreasuryReadjustmentCreate from '@/views/treasury/treasury-readjustment/v1/create/TreasuryReadjustmentCreate'
import { useUtils } from '@/composables'
import { defaultIconsLucide } from '@/utils'

const {
  headerProps,
  tabs,
  filteredTabs,
  tabActive,
  tabActiveIdx,

  data_information_form,
  informationFormRef,
  alertModalRef,

  nextTab,
  backTab,
  onSubmit,
  treasuryBalanceAdjustmentProcess,
  clearForm,
} = useTreasuryReadjustmentCreate()
</script>