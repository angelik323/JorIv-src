<template>
  <div class="q-px-xl" role="main">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="goToURL('RegisterAuthorizationChangesList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tabs="filteredTabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />

        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <InformationForm
                v-show="tabActive === 'information'"
                ref="informationFormRef"
                :action="'edit'"
                :data="noveltyData || undefined"
                :audit-info="auditInfo"
              />

              <UploadForm
                v-show="tabActive === 'documents'"
                ref="uploadFormRef"
                :novelty-status="noveltyStatus"
                :documents="documentsData"
              />

              <div class="row justify-end q-gutter-md q-mt-md">
                <Button
                  v-if="tabActiveIdx > 0"
                  label="Atrás"
                  :outline="true"
                  :leftIcon="defaultIconsLucide.chevronLeft"
                  @click="backTab"
                />

                <Button
                  v-if="tabActiveIdx < filteredTabs.length - 1"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  :outline="false"
                  label="Continuar"
                  :rightIcon="defaultIconsLucide.chevronRight"
                  @click="nextTab"
                />

                <Button
                  v-if="tabActiveIdx === filteredTabs.length - 1"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  :outline="false"
                  label="Actualizar"
                  @click="handleSubmitForm"
                />
              </div>
            </div>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import InformationForm from '@/components/Forms/FixedAssets/RegisterAuthhorizationsChanges/InformationForm/InformationForm.vue'
import UploadForm from '@/components/Forms/FixedAssets/RegisterAuthhorizationsChanges/UploadForm/UploadForm.vue'

// logic view
import useRegisterAuthorizationChangesEdit from '@/views/fixed-assets/register-authorization-changes/v1/edit/RegisterAuthorizationChangesEdit'

const {
  noveltyStatus,
  noveltyData,
  auditInfo,
  documentsData,
  headerProperties,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  informationFormRef,
  uploadFormRef,
  defaultIconsLucide,
  goToURL,
  nextTab,
  backTab,
  handleSubmitForm,
} = useRegisterAuthorizationChangesEdit()
</script>
