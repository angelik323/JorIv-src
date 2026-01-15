<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('ProjectManagementList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <BasicDataForm
              ref="basicDataFormRef"
              :action="ActionTypeEnum.EDIT"
              :basic-data-form="basicDataForm"
              @update:basic-data-form="basicDataForm = $event"
            />
            <AssociateBusinessList
              ref="associatedBusinessFormRef"
              :action="ActionTypeEnum.EDIT"
              :associated-business-form="associatedBusinessForm"
              @update:associated-business-form="associatedBusinessForm = $event"
              @update:selected-associated-business-list="
                selectedAssociatedBusinessList = $event
              "
            />

            <section class="mx-2 mb-2">
              <div class="row justify-end q-gutter-md">
                <Button
                  label="Actualizar"
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

    <AlertModalComponent
      ref="alertModalWarningRef"
      :title="alertModalConfig.title"
      @confirm="warningAction"
    />
  </div>
</template>

<script setup lang="ts">
// Components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Forms
import BasicDataForm from '@/components/Forms/DerivativeContracting/ProjectManagement/BasicData/BasicDataForm.vue'
import AssociateBusinessList from '@/components/Lists/DerivativeContracting/ProjectManagement/AssociateBusiness/AssociateBusinessList.vue'

// Interfaces
import { ActionTypeEnum } from '@/interfaces/global'

// Logic view
import useProjectManagementEdit from '@/views/derivative-contracting/project-management/v1/edit/ProjectManagementEdit'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  basicDataFormRef,
  basicDataForm,
  associatedBusinessFormRef,
  associatedBusinessForm,
  selectedAssociatedBusinessList,
  alertModalWarningRef,
  alertModalConfig,

  onSubmit,
  goToURL,
  warningAction,
} = useProjectManagementEdit()
</script>
