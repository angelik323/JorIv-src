<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
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
              <BusinessLineForm
                v-show="tabActive === 'information'"
                ref="businessLineForm"
                :action="'edit'"
                :id="businessLineId"
              />

              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  :class-custom="'custom'"
                  label="Actualizar"
                  size="md"
                  color="orange"
                  :disabled="
                    business_line.initial_status_id ===
                    BusinessLineStatusID.CANCELLED
                  "
                  @click="updateBusinessLine"
                />
              </div>
            </section>
          </template>
        </VCard>
      </section>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 480px"
        :title="updateModalTitle"
        :description_message="updateModalDescription"
        @confirm="onSubmit"
      />
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import BusinessLineForm from '@/components/Forms/Fics/BusinessLine/Information/InformationForm.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Interfaces
import { BusinessLineStatusID } from '@/interfaces/global'

// Logic view
import useBusinessLineEdit from '@/views/fics/business-line/v1/edit/BusinessLineEdit'

const {
  tabs,
  onSubmit,
  tabActive,
  headerProps,
  tabActiveIdx,
  alertModalRef,
  business_line,
  handleGoToList,
  businessLineId,
  businessLineForm,
  updateModalTitle,
  updateBusinessLine,
  updateModalDescription,
} = useBusinessLineEdit()
</script>
