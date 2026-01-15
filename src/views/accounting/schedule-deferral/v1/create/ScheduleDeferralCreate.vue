<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'ScheduleDeferralList' })"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
        />
        <div v-if="tabActive === 'information'">
          <ScheduleDeferralForm
            ref="scheduleDeferralForm"
            :action="'create'"
            @saved="onSaved"
          />
        </div>
        <!-- Buttons -->
        <div class="mx-4 mb-4">
          <div class="row justify-end q-gutter-md">
            <Button
              v-if="
                filteredTabs.findIndex((tab) => tab.name === tabActive) ===
                filteredTabs.length - 1
              "
              :outline="false"
              :class-custom="'custom'"
              label="Crear"
              size="md"
              color="orange"
              @click="onSaved"
            />
          </div>
        </div>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import ScheduleDeferralForm from '@/components/Forms/Accounting/ScheduleDeferral/Information/InformationForm.vue'
import useScheduleDeferralCreate from '@/views/accounting/schedule-deferral/v1/create/ScheduleDeferralCreate'

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  scheduleDeferralForm,
  onSaved,
} = useScheduleDeferralCreate()
</script>
