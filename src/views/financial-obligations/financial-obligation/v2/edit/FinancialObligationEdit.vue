<template>
  <div class="q-mx-xl" v-if="!isLoading">
    <ContentComponent
      indentation
      content-indentation
      :title="headerPropsEdit.title"
      :breadcrumbs="headerPropsEdit.breadcrumbs"
      show-back-btn
      @on-back="goToURL('FinancialObligationList')"
    >
      <section>
        <TabsComponent
          :tabActive="tabActive"
          :tabs="tabs"
          :tabActiveIdx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
        />

        <Card>
          <template #content-card>
            <div class="q-px-xl q-pb-xl q-pt-lg">
              <BasicDataForm
                v-if="tabActive === 'basic_data'"
                ref="formBasicData"
                action="edit"
                :data="getBasicDataFormData"
                :auditInfo="auditInfo"
                @update:models="setBasicDataFormData"
              />

              <ObservationsTab
                v-if="tabActive === 'observations'"
                :observations="authorizationObservations"
              />
            </div>
          </template>
        </Card>
      </section>

      <section class="mx-4 mb-4">
        <div class="row justify-end q-gutter-md">
          <Button
            v-if="!isAuthorized"
            label="Editar documentos soporte"
            size="md"
            unelevated
            outline
            color="orange"
            class="text-capitalize btn-filter custom"
            @click="goToEditDocuments"
          />

          <Button
            v-if="!isAuthorized"
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
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import BasicDataForm from '@/components/Forms/FinancialObligations/FinancialObligation/v2/BasicDataForm/BasicDataForm.vue'
import ObservationsTab from '@/components/Forms/FinancialObligations/FinancialObligation/v2/ObservationsTab/ObservationsTab.vue'

// Logic view
import useFinancialObligationEdit from '@/views/financial-obligations/financial-obligation/v2/edit/FinancialObligationEdit'

const {
  headerPropsEdit,
  tabs,
  tabActive,
  tabActiveIdx,
  formBasicData,
  getBasicDataFormData,
  auditInfo,
  authorizationObservations,
  isLoading,
  isAuthorized,

  onSubmit,
  goToURL,
  goToEditDocuments,
  setBasicDataFormData,
} = useFinancialObligationEdit()
</script>
