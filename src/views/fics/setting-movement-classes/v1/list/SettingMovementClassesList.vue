<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    />

    <q-expansion-item
      v-for="(group, index) in tableGroups"
      :key="index"
      :model-value="isOpenExpansionItem"
      class="q-mb-md expansion-item-fp"
      expand-icon-class="text-black expansion-icon"
    >
      <template v-slot:header>
        <q-item-section>
          <div class="column">
            <span class="text-h6 text-weight-bold">{{ group.title }}</span>
          </div>
        </q-item-section>
      </template>

      <TableList
        :loading="false"
        :rows="group.rows"
        :columns="group.columns"
        :hide-bottom="true"
      />
    </q-expansion-item>
  </div>
</template>

<script lang="ts" setup>
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'

// Logic view
import useSettingMovementClassesList from '@/views/fics/setting-movement-classes/v1/list/SettingMovementClassesList'

const { headerProps, tableGroups, isOpenExpansionItem } =
  useSettingMovementClassesList()
</script>
