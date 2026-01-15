<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'GuaranteesList' })"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
        />
        <VCard>
          <template #content-card>
            <div class="q-px-xl q-pb-xl q-pt-lg">
              <BasicDataForm
                v-if="tabActive === 'basic_data'"
                :data="data_information_form"
                action="view"
              />
              <AuthorizeForm
                v-if="tabActive === 'auth'"
                ref="formAuthorize"
                action="authorize"
                :data="guarantees_response?.registration_status_message"
                @update:data="observation = $event"
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
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) ===
                    tabs.length - 1
                  "
                  label="Rechazar"
                  size="md"
                  unelevated
                  :outline="false"
                  color="primary_fiduciaria"
                  class="text-capitalize btn-filter custom"
                  @click="onSubmit(false)"
                />
                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) ===
                    tabs.length - 1
                  "
                  label="Autorizar"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="onSubmit(true)"
                />
              </div>
            </section>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>

  <AlertModalComponent
    ref="alertModalRef"
    styleModal="min-width: 480px"
    :title="!pendingAction ? '¿Desea rechazar la garantía?' : '¿Desea autorizar la garantía?'"
    @confirm="confirmAuthorize"
  >
  </AlertModalComponent>
</template>

<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'
import BasicDataForm from '@/components/Forms/TrustBusiness/Guarantees/BasicDataForm/BasicData.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import AuthorizeForm from '@/components/Forms/TrustBusiness/Guarantees/AuthorizeForm/AuthorizeForm.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

import useGuaranteesAuthorize from './GuaranteesAuthorize'
import { defaultIconsLucide } from '@/utils'

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  data_information_form,
  tabs,
  observation,
  formAuthorize,
  guarantees_response,
  alertModalRef,
  pendingAction,

  backTab,
  nextTab,
  onSubmit,
  confirmAuthorize,
} = useGuaranteesAuthorize()
</script>
