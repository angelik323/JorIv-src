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
      <section class="q-my-md" aria-label="Sección de creación de formulario">
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
//Components
import InformationForm from '@/components/Forms/Accounting/RangesForDeferred/InformationForm/InformationForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
//Logic
import useRangesForDeferredCreate from '@/views/accounting/ranges-for-deferred/v1/create/RangesForDeferredCreate'

const {
  tabs,
  tabActive,
  tabActiveIdx,
  headerProperties,
  informationFormRef,

  handleGoToList,
} = useRangesForDeferredCreate()
</script>
