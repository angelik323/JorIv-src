<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <section class="q-my-md">
        <TableList
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :hideBottom="tableProps.hideBottom"
        />
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'

// Logic view
import { useSystemOperationChannelsList } from '@/views/fics/system-operation-channels/v1/list/SystemOperationChannelsList'

const { tableProps, headerProps } = useSystemOperationChannelsList()
</script>
