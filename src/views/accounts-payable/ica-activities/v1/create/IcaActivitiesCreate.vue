<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      @to="goToURL('IcaActivitiesImport')"
      @on-back="goToURL('IcaActivitiesList')"
    >
      <template #addBefore>
        <div class="btn-move-md">
          <Button
            :outline="true"
            :label="headerProps.btn.label"
            color="orange"
            color-icon="black"
            :left-icon="defaultIconsLucide.cloudUpload"
            class-custom="custom full-width"
            :styleContent="{
              'place-items': 'center',
              padding: '0.3rem',
              color: 'black',
            }"
            :disabled="false"
            @click="goToURL('IcaActivitiesImport')"
          />
        </div>
      </template>

      <TabsComponent
        :tab-active="tabActive"
        :tabs="tabs"
        :tab-active-idx="tabActiveIdx"
      />

      <VCard>
        <template #content-card>
          <BasicDataForm
            v-if="tabActive === 'information'"
            action="create"
            ref="basicDataFormRef"
            :data="activities_form"
            @update:data="activities_form = $event"
          />

          <section class="mx-2 mb-2">
            <div class="row justify-end">
              <Button
                label="Crear"
                size="md"
                unelevated
                :outline="false"
                class-custom="custom"
                color="orange"
                @click="handleCreate"
              />
            </div>
          </section>
        </template>
      </VCard>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
// components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import BasicDataForm from '@/components/Forms/AccountsPayable/IcaActivities/BasicData/BasicDataForm.vue'

// styles
import '@/views/accounts-payable/ica-activities/v1/create/IcaActivitiesCreate.scss'

// logic view
import useIcaActivitiesCreate from '@/views/accounts-payable/ica-activities/v1/create/IcaActivitiesCreate'

const {
  // configs
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,

  // refs
  basicDataFormRef,
  activities_form,
  defaultIconsLucide,

  // methods
  handleCreate,
  goToURL,
} = useIcaActivitiesCreate()
</script>
