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
                :action="'create'"
              />

              <NotificationForm
                v-show="tabActive === 'notification'"
                ref="notificationFormRef"
                :action="'create'"
                formType="notification"
                :exclude-ids-users="excludeIdsUsers"
              />

              <NotificationForm
                v-show="tabActive === 'confirmation'"
                ref="confirmationFormRef"
                :action="'create'"
                formType="confirmation"
                :tab-active="tabActive"
                :exclude-ids-users="excludeIdsUsers"
              />

              <section class="mt-2">
                <div class="row justify-end q-gutter-md">
                  <Button
                    v-if="
                      filteredTabs.findIndex((tab) => tab.name === tabActive) >
                      0
                    "
                    :outline="true"
                    label="Atrás"
                    :left-icon="defaultIconsLucide.chevronLeft"
                    color-icon="#762344"
                    color="orange"
                    class="text-capitalize btn-filter"
                    @click="backTab"
                  />

                  <Button
                    v-if="
                      filteredTabs.findIndex((tab) => tab.name === tabActive) <
                      filteredTabs.length - 1
                    "
                    :outline="false"
                    label="Continuar"
                    :right-icon="defaultIconsLucide.chevronRight"
                    color-icon="white"
                    color="orange"
                    class="text-capitalize btn-filter custom"
                    @click="nextTab"
                  />

                  <Button
                    v-if="
                      filteredTabs.findIndex(
                        (tab) => tab.name === tabActive
                      ) ===
                      filteredTabs.length - 1
                    "
                    :outline="false"
                    label="Crear"
                    color="orange"
                    class="text-capitalize btn-filter custom"
                    @click="handleSubmitForm"
                  />
                </div>
              </section>
            </div>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
// Components
import NotificationForm from '@/components/Forms/CalendarEvents/notification/NotificationForm.vue'
import InformationForm from '@/components/Forms/CalendarEvents/information/InformationForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useCalendarEventCreate from '@/views/agenda/config-agenda/v1/create/CalendarEventCreate'

const {
  nextTab,
  backTab,
  tabActive,
  filteredTabs,
  tabActiveIdx,
  handleGoToList,
  excludeIdsUsers,
  headerProperties,
  handleSubmitForm,
  informationFormRef,
  defaultIconsLucide,
  notificationFormRef,
  confirmationFormRef,
} = useCalendarEventCreate()
</script>
