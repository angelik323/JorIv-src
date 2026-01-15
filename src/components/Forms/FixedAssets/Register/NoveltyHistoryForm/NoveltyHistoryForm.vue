<template>
  <div class="q-mx-xs">
    <section>
      <TableList
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :pages="tableProps.pages"
        :custom-columns="['actions']"
      >
        <template #actions="{ row }">
          <Button
            tooltip="Ver"
            flat
            :outline="false"
            :left-icon="defaultIconsLucide.eye"
            @click="goToNovelty(row.id)"
          />
        </template>
        <template #custom-no-data>
          <span>No hay registros de novedades</span>
        </template>
      </TableList>
    </section>
  </div>
</template>
<script setup lang="ts">
// interfaces
import { INoveltyHistory } from '@/interfaces/customs/fixed-assets/v1/Register'

// components
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// logic
import useNoveltyHistoryForm from '@/components/Forms/FixedAssets/Register/NoveltyHistoryForm/NoveltyHistoryForm'

const props = defineProps<{
  data: INoveltyHistory[]
}>()

const { tableProps, defaultIconsLucide, goToNovelty } = useNoveltyHistoryForm({
  data: props.data,
})
</script>
