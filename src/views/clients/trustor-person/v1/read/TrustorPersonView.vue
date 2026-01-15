<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="headerProps.showBackBtn"
      @on-back="goToURL('ClientsList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />

        <VCard>
          <template #content-card>
            <InformationForm
              v-if="tabActive === 'information'"
              ref="formInformation"
              :action="'view'"
              :data="trustor_client_request"
            />

            <!-- Actions -->
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  label="Finalizar"
                  size="md"
                  unelevated
                  color="orange"
                  :outline="false"
                  class="text-capitalize btn-filter custom"
                  @click="onSubmit"
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
import useTrustorEntity from './TrustorPersonView'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import InformationForm from '@/components/Forms/Clients/TrustorPerson/information/InformationForm.vue'
import Button from '@/components/common/Button/Button.vue'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  formInformation,
  trustor_client_request,
  goToURL,
  onSubmit,
} = useTrustorEntity()
</script>
