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
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
        />

        <Card>
          <template #content-card>
            <div class="q-pa-lg">
              <InformationForm
                v-show="tabActive === 'InformationForm'"
                ref="informationFormRef"
                :action="'edit'"
                :data="config_calendar_request"
              />

              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  label="Actualizar"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="onSubmit"
                />
              </div>
            </div>
          </template>
        </Card>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
// Components
import InformationForm from '@/components/Forms/ConfigCalendar/information/InformationForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import Card from '@/components/common/VCard/VCard.vue'

// Logic view
import useConfigCalendarEdit from '@/views/agenda/config-calendar/v1/edit/ConfigCalendarEdit'

const {
  tabs,
  onSubmit,
  tabActive,
  tabActiveIdx,
  handleGoToList,
  headerProperties,
  informationFormRef,
  config_calendar_request,
} = useConfigCalendarEdit()
</script>
