<template>
  <div class="q-mx-md">
    <section class="q-mt-md">
      <FiltersComponentV2
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="handleClear"
      />
    </section>

    <section class="q-mt-xl">
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

    <section class="q-mt-xl" v-if="tableProps.rows.length > 0">
      <Card>
        <template #content-card>
          <q-list>
            <q-expansion-item default-opened>
              <template #header>
                <q-item-section> Listado contactos bancarios </q-item-section>

                <q-item-section side>
                  <Button
                    :outline="false"
                    label="Crear"
                    icon="mdi-plus-circle-outline"
                    flat
                    size="md"
                    color="primary"
                    text-color="white"
                    class="btn-header"
                    v-close-popup
                    @click="
                      $router.push({
                        name: 'BankContactsCreate',
                        params: { bank: $route.params.id },
                      })
                    "
                  >
                  </Button>
                </q-item-section>
              </template>
              <BankContactsList />
            </q-expansion-item>
          </q-list>
        </template>
      </Card>
    </section>

    <AlertModalComponent
      ref="alertModalRef"
      styleModal="min-width: 470px"
      :showImgDefault="false"
      :title="alertModalConfig.description"
      :description_message="''"
      @confirm="deleteBankingEntitie()"
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
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'

import BankContactsList from '@/views/treasury/bank-contacts/v1/list/BankContactsList.vue'

import Card from '@/components/common/VCard/VCard.vue'

import useBankBranchesList from './BankBranchesList'
import { defaultIconsLucide } from '@/utils'

const {
  tableProps,
  alertModalRef,
  alertModalConfig,
  filterConfig,
  deleteBankingEntitie,
  handleFilter,
  handleClear,
  handleOptions,
  updatePage,
  updatePerPage,
} = useBankBranchesList()
</script>
