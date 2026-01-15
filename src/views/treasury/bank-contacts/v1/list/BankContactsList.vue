<template>
  <div class="q-mx-md">
    <section class="q-mt-md">
      <Card>
        <template #content-card>
          <div class="q-pa-md">
            <TableList
              ref="scrollContainer"
              class="scrollable"
              :loading="tableProps.loading"
              :rows="tableProps.rows"
              :columns="tableProps.columns"
              :pages="tableProps.pages"
              :custom-columns="['status', 'actions']"
              @update-page="updatePage"
              @update-rows-per-page="updatePerPage"
              v-bind="$attrs"
            >
              <template #status="{ row }">
                <ShowStatus
                  :type="row.status.id ?? 1"
                  class-custom="q-px-sm q-py-xs"
                />
              </template>

              <template #actions="{ row }">
                <!-- ver -->
                <Button
                  :left-icon="defaultIconsLucide.eye"
                  color="orange"
                  :class-custom="'custom'"
                  :outline="false"
                  :flat="true"
                  colorIcon="#f45100"
                  tooltip="Ver"
                  @click="
                    $router.push({
                      name: 'BankContactsView',
                      params: { bank: $route.params.id, id: row.id },
                    })
                  "
                />

                <!-- Editar -->
                <Button
                  :left-icon="defaultIconsLucide.edit"
                  color="orange"
                  :class-custom="'custom'"
                  :outline="false"
                  :flat="true"
                  colorIcon="#f45100"
                  tooltip="Editar"
                  @click="handleOptions('edit', row.id)"
                />

                <!-- Eliminar -->
                <Button
                  :left-icon="defaultIconsLucide.delete"
                  color="orange"
                  :class-custom="'custom'"
                  :outline="false"
                  :flat="true"
                  colorIcon="#f45100"
                  tooltip="Eliminar"
                  @click="handleOptions('delete', row.id)"
                />
              </template>
            </TableList>
          </div>
        </template>
      </Card>
    </section>

    <AlertModalComponent
      ref="alertModalRef"
      styleModal="min-width: 470px"
      :showImgDefault="false"
      :title="alertModalConfig.description"
      :description_message="''"
      @confirm="deleteBankContacts()"
    >
      <template #default-img>
        <q-img
          src="@/assets/images/icons/alert_popup_delete.svg"
          max-width="80px"
          width="80px"
          fit="contain"
        />
      </template>
    </AlertModalComponent>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Card from '@/components/common/VCard/VCard.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import { defaultIconsLucide } from '@/utils'
import useBankContactsList from './BankContactsList'

const {
  tableProps,
  alertModalConfig,
  alertModalRef,
  handleOptions,
  deleteBankContacts,
  updatePage,
  updatePerPage,
} = useBankContactsList()
</script>
