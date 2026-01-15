<template>
  <div class="q-mx-xl" v-if="!isLoading">
    <ContentComponent
      indentation
      content-indentation
      :title="headerPropsCreate.title"
      :breadcrumbs="headerPropsCreate.breadcrumbs"
      show-back-btn
      @on-back="goToList()"
    >
      <section>
        <TabsComponent :tabActive :tabs :tabActiveIdx @update:tabActiveIdx="handleTabChange($event)" />

        <Card>
          <template #content-card>
            <div class="q-px-xl q-pb-xl q-pt-lg">
              <InformationForm
                v-if="tabActive === 'information'"
                ref="formInformation"
                action="edit"
                :data="getInformationFormData"
                @update:models="setInformationFormData"
              />

              <DocumentsForm
                v-if="tabActive === 'documents'"
                ref="formDocuments"
                action="edit"
                :data="getDocumentsFormData"
                :entityId="searchId"
                @update:models="setDocumentsFormData"
              />

              <FinanceForm
                v-if="tabActive === 'finance'"
                ref="formFinance"
                action="view"
                :data="getFinanceFormData"
              />

              <NotificationForm
                v-if="tabActive === 'notification'"
                ref="formNotification"
                action="edit"
                :data="getNotificationFormData"
                @update:models="setNotificationFormData"
              />
            </div>
          </template>
        </Card>
      </section>
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
              tabs.findIndex((tab) => tab.name === tabActive) < tabs.length - 1
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
            label="Actualizar "
            size="md"
            unelevated
            :outline="false"
            color="orange"
            class="text-capitalize btn-filter custom"
            @click="onSubmit"
          />
        </div>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import InformationForm from '@/components/Forms/TrustBusiness/TrustBusinessManagement/v2/InformationForm/InformationForm.vue'
import DocumentsForm from '@/components/Forms/TrustBusiness/TrustBusinessManagement/v2/DocumentsForm/DocumentsForm.vue'
import FinanceForm from '@/components/Forms/TrustBusiness/TrustBusinessManagement/v2/FinanceForm/FinanceForm.vue'
import NotificationForm from '@/components/Forms/TrustBusiness/TrustBusinessManagement/v2/NotificationForm/NotificationForm.vue'

// Logic view
import useTrustBusinessManagementEdit from './TrustBusinessManagementEdit'

const {
  headerPropsCreate,
  tabs,
  defaultIconsLucide,
  tabActive,
  tabActiveIdx,
  formInformation,
  formDocuments,
  formFinance,
  formNotification,
  getInformationFormData,
  getDocumentsFormData,
  getFinanceFormData,
  getNotificationFormData,
  isLoading,
  searchId,

  nextTab,
  backTab,
  handleTabChange,
  onSubmit,
  goToList,
  setInformationFormData,
  setDocumentsFormData,
  setNotificationFormData,
} = useTrustBusinessManagementEdit()
</script>
