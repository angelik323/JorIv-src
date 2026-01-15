<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <VCard class="q-pa-lg q-mt-sm">
        <template #content-card>
          <q-form ref="formElementRef">
            <div class="row items-start q-col-gutter-x-lg q-col-gutter-y-sm">
              <div class="col-12 col-md-6">
                <div class="column-content">
                  <p
                    class="text-black-10 text-weight-bold q-mb-lg"
                    style="font-size: 18px"
                  >
                    Usuario que transfiere permisos
                  </p>

                  <div class="row items-center q-gutter-x-md q-gutter-y-xs">
                    <div class="col-grow">
                      <p class="text-grey-10 text-weight-medium mb-0">
                        Código y nombre de usuario*
                      </p>
                      <GenericSelectorComponent
                        :default_value="transferFromUser"
                        :manual_option="users_with_document"
                        :use_advanced_filter="true"
                        map_options
                        first_filter_option="label"
                        second_filter_option="label"
                        auto_complete
                        required
                        :rules="[(val: string) => is_required(val)]"
                        @update:modelValue="(val: number) => {
                          transferFromUser = val;

                          const isSameUser = transferToUser === val;
                          if (!val || isSameUser) {
                            transferToUser = null;
                          } 
                        }"
                      />
                    </div>

                    <div class="col-auto">
                      <Button
                        class="text-capitalize btn-filter custom"
                        size="md"
                        label="Buscar"
                        color="primary_fiduciaria"
                        :leftIcon="defaultIconsLucide.magnify"
                        color-icon="#fff"
                        unelevated
                        :disabled="!transferFromUser"
                        :outline="false"
                        @click="handleFilter"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-12 col-md-6 right-column">
                <div class="column-content">
                  <p
                    class="text-black-10 text-weight-bold q-mb-lg"
                    style="font-size: 18px"
                  >
                    Usuario que recibe permisos
                  </p>

                  <div>
                    <p class="text-grey-10 text-weight-medium mb-0">
                      Código y nombre de usuario*
                    </p>
                    <GenericSelectorComponent
                      :default_value="transferToUser"
                      :manual_option="users_with_document"
                      :use_advanced_filter="true"
                      map_options
                      first_filter_option="label"
                      second_filter_option="label"
                      auto_complete
                      required
                      :disabled="!transferFromUser"
                      :rules="[(val: string) => is_required(val)]"
                      @update:modelValue="transferToUser = $event"
                    />
                  </div>
                </div>
              </div>
            </div>
          </q-form>

          <section class="q-mt-lg">
            <TableList
              :loading="tableProps.loading"
              :columns="tableProps.columns"
              :rows="tableProps.rows"
              :pages="tableProps.pages"
              @update-page="updatePage"
              @update-rows-per-page="updateRowsPerPage"
            >
              <template #custom-header>
                <div
                  class="row justify-between items-end q-col-gutter-x-md q-col-gutter-y-sm q-mb-sm"
                  style="width: 100%"
                >
                  <div class="col-auto">
                    <p class="text-h6 text-weight-medium no-margin">
                      {{ tableProps.title }}
                    </p>
                  </div>
                </div>
              </template>
            </TableList>
          </section>

          <section class="row justify-end q-gutter-md">
            <Button
              v-if="
                validateRouter(
                  'BusinessTrust',
                  'UserPermissionsTransferList',
                  'action_transfer_permissions'
                )
              "
              label="Transferir permisos"
              size="md"
              unelevated
              :outline="false"
              color="orange"
              class="text-capitalize btn-filter custom"
              @click="onSubmit"
            />
          </section>
        </template>
      </VCard>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Utils & Assets
import { defaultIconsLucide } from '@/utils'

// Logic view
import useUserPermissionsTransferList from '@/views/trust-business/permissions/user-permissions-transfer/v1/list/UserPermissionsTransferList'

const {
  users_with_document,
  headerProps,
  tableProps,
  formElementRef,
  transferFromUser,
  transferToUser,

  is_required,
  handleFilter,
  updatePage,
  updateRowsPerPage,
  onSubmit,
  validateRouter,
} = useUserPermissionsTransferList()
</script>

<style scoped lang="scss">
.column-content {
  max-width: 80%;
}
.right-column {
  border-left: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
