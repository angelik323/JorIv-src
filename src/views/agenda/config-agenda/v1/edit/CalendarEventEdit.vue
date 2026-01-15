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
                v-if="isLoaded"
                v-show="tabActive === 'information'"
                ref="informationFormRef"
                :action="'edit'"
                :data="modelForm"
              />

              <NotificationForm
                v-show="tabActive === 'notification'"
                ref="notificationFormRef"
                :action="'edit'"
                :data="modelForm"
                :formType="'notification'"
                :tab-active="tabActive"
                :exclude-ids-users="excludeIdsUsers"
              />

              <NotificationForm
                v-show="tabActive === 'confirmation'"
                ref="confirmationFormRef"
                :action="'edit'"
                :data="modelForm"
                :formType="'confirmation'"
                :tab-active="tabActive"
                :exclude-ids-users="excludeIdsUsers"
              />

              <section class="mt-2">
                <div class="row justify-end q-gutter-md">
                  <Button
                    v-if="tabActiveIdx > 0"
                    outline
                    label="Atrás"
                    :leftIcon="defaultIconsLucide.chevronLeft"
                    :color-icon="'#762344'"
                    color="orange"
                    class="text-capitalize btn-filter"
                    @click="backTab"
                  />

                  <Button
                    v-if="tabActiveIdx < filteredTabs.length - 1"
                    :outline="false"
                    label="Continuar"
                    :rightIcon="defaultIconsLucide.chevronRight"
                    :color-icon="'white'"
                    color="orange"
                    class="text-capitalize btn-filter custom"
                    @click="nextTab"
                  />

                  <Button
                    v-if="tabActiveIdx === filteredTabs.length - 1"
                    :outline="false"
                    label="Actualizar"
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
import useCalendarEventEdit from '@/views/agenda/config-agenda/v1/edit/CalendarEventEdit'

const {
  nextTab,
  backTab,
  isLoaded,
  tabActive,
  modelForm,
  filteredTabs,
  tabActiveIdx,
  handleGoToList,
  excludeIdsUsers,
  handleSubmitForm,
  headerProperties,
  defaultIconsLucide,
  informationFormRef,
  notificationFormRef,
  confirmationFormRef,
} = useCalendarEventEdit()
</script>
