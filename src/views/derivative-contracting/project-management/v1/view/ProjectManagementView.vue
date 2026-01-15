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
              :action="ActionTypeEnum.VIEW"
              :basic-data-form="basicDataForm"
            />
            <AssociateBusinessList
              ref="associatedBusinessFormRef"
              :action="ActionTypeEnum.VIEW"
              :associated-business-form="associatedBusinessForm"
            />

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  label="Finalizar"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="goToURL('ProjectManagementList')"
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
// Components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

// Forms
import BasicDataForm from '@/components/Forms/DerivativeContracting/ProjectManagement/BasicData/BasicDataForm.vue'
import AssociateBusinessList from '@/components/Lists/DerivativeContracting/ProjectManagement/AssociateBusiness/AssociateBusinessList.vue'

// Interfaces
import { ActionTypeEnum } from '@/interfaces/global'

// Logic view
import useProjectManagementView from '@/views/derivative-contracting/project-management/v1/view/ProjectManagementView'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  basicDataFormRef,
  basicDataForm,
  associatedBusinessFormRef,
  associatedBusinessForm,

  goToURL,
} = useProjectManagementView()
</script>
