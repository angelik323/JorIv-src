<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="handleGoToList"
    >
      <section class="q-my-md">
        <TabsComponent
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <section class="q-pa-lg">
              <InformationForm
                v-show="tabActive === 'information'"
                ref="informationFormRef"
              />

              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  label="Generar"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="openAlertModal"
                />
              </div>
            </section>
          </template>
        </VCard>
      </section>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 300px; max-width: 400px"
        :showImgDefault="false"
        :title="alertModalConfig.description"
        @confirm="handleSubmitForm"
      >
        <template #default-img>
          <q-img
            src="@/assets/images/icons/alert_popup.svg"
            max-width="80px"
            width="80px"
            fit="contain"
            alt="Imagen de alerta"
          />
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import InformationForm from '@/components/Forms/Fics/GenerateExtracts/InformationForm/InformationForm.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useGenerateExtractsCreate from '@/views/fics/generate-extracts/v1/create/GenerateExtractsCreate'

const {
  tabs,
  tabActive,
  tabActiveIdx,
  alertModalRef,
  handleGoToList,
  openAlertModal,
  headerProperties,
  handleSubmitForm,
  alertModalConfig,
  informationFormRef,
} = useGenerateExtractsCreate()
</script>
