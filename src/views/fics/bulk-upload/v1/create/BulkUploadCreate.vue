<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      show-back-btn
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      @on-back="handleGoToBack"
    >
      <section class="q-my-md">
        <TabsComponent
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
        />

        <InformationForm
          v-show="tabActive === 'information'"
          ref="informationFormRef"
          :action="'create'"
        />
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import InformationForm from '@/components/Forms/Fics/BulkUpload/Information/InformationForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'

// Logic view
import useBulkUploadCreate from '@/views/fics/bulk-upload/v1/create/BulkUploadCreate'

const {
  tabs,
  tabActive,
  headerProps,
  tabActiveIdx,
  handleGoToBack,
  informationFormRef,
} = useBulkUploadCreate()
</script>
