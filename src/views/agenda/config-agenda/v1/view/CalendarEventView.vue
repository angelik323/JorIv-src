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

        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <InformationForm
                v-if="isLoaded"
                v-show="tabActive === 'information'"
                :action="'view'"
                :data="initialData"
              />
            </div>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
// Components
import InformationForm from '@/components/Forms/CalendarEvents/information/InformationForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useCalendarEventView from '@/views/agenda/config-agenda/v1/view/CalendarEventView'

const {
  tabs,
  isLoaded,
  tabActive,
  initialData,
  tabActiveIdx,
  handleGoToList,
  headerProperties,
} = useCalendarEventView()
</script>
