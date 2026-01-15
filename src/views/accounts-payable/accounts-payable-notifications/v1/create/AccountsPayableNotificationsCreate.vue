<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('AccountsPayableNotificationsList')"
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
              v-if="tabActive === 'information'"
              ref="basicDataFormRef"
              :data="basic_data_form"
              action="create"
              @update:data="basic_data_form = $event"
            />

            <section class="mx-2 mb-2">
              <div class="row justify-end">
                <Button
                  label="Crear"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="handleCreate"
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
//Components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import BasicDataForm from '@/components/Forms/AccountsPayable/AccountsPayableNotifications/BasicDataForm.vue'

//Logic
import useAccountsPayableNotificationsCreate from '@/views/accounts-payable/accounts-payable-notifications/v1/create/AccountsPayableNotificationsCreate'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  basicDataFormRef,
  basic_data_form,
  handleCreate,
  goToURL,
} = useAccountsPayableNotificationsCreate()
</script>
