<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'BusinessPermissionsList' })"
    >
      <VCard class="q-pa-lg q-mt-sm">
        <template #content-card>
          <q-form ref="formElementRef" @submit.prevent="handleFilter">
            <div class="row items-center q-col-gutter-x-md q-col-gutter-y-sm">
              <div class="col-12 col-md-4 col-lg-3">
                <p class="text-grey-6 text-weight-medium mb-0">
                  Código y nombre de negocio*
                </p>
                <GenericSelectorComponent
                  :default_value="selectedBusiness"
                  :manual_option="business_trusts_with_code"
                  :use_advanced_filter="true"
                  map_options
                  first_filter_option="label"
                  second_filter_option="label"
                  auto_complete
                  required
                  :match_mode="'partial'"
                  readonly
                  :rules="[(val: string) => is_required(val)]"
                />
              </div>

              <div class="col-12 col-md-4 col-lg-3">
                <p class="text-grey-10 text-weight-medium mb-0">
                  Código y nombre de usuario*
                </p>
                <GenericSelectorComponent
                  :default_value="selectedUser"
                  :manual_option="users_with_document"
                  :use_advanced_filter="true"
                  map_options
                  first_filter_option="label"
                  second_filter_option="label"
                  auto_complete
                  required
                  :match_mode="'partial'"
                  :rules="[(val: string) => is_required(val)]"
                  @update:modelValue="selectedUser = $event"
                />
              </div>

              <div class="col">
                <Button
                  type="submit"
                  class="text-capitalize btn-filter custom"
                  size="md"
                  label="Buscar"
                  color="primary_fiduciaria"
                  :leftIcon="defaultIconsLucide.magnify"
                  color-icon="#fff"
                  unelevated
                  :outline="false"
                />
              </div>
            </div>
          </q-form>

          <section class="q-mt-lg">
            <TableList
              ref="tableListRef"
              :loading="tableProps.loading"
              :columns="tableProps.columns"
              :rows="tableProps.rows"
              :pages="tableProps.pages"
              selection="multiple"
              @selected="handleRowSelection"
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

                  <div class="col-auto flex q-gutter-x-md q-gutter-y-sm">
                    <Button
                      v-if="
                        validateRouter(
                          'BusinessTrust',
                          'BusinessPermissionsList',
                          'action_give_permissions'
                        )
                      "
                      class-custom="custom"
                      label="Dar permisos"
                      color="orange"
                      outline
                      no-caps
                      :styleContent="{
                        'place-items': 'center',
                        color: 'black',
                      }"
                      :disabled="
                        !selectedBusiness ||
                        selectedRows.length === 0
                      "
                      @click="onManagePermissions('add')"
                    />

                    <Button
                      v-if="
                        validateRouter(
                          'BusinessTrust',
                          'BusinessPermissionsList',
                          'action_remove_permissions'
                        )
                      "
                      class-custom="custom"
                      label="Quitar permisos"
                      color="orange"
                      :outline="false"
                      no-caps
                      :disabled="
                        !selectedBusiness ||
                        selectedRows.length === 0
                      "
                      @click="onManagePermissions('remove')"
                    />
                  </div>
                </div>
              </template>
            </TableList>
          </section>

          <section class="row justify-end q-gutter-md">
            <Button
              v-if="pendingPermissions.size > 0"
              label="Actualizar"
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
import useBusinessPermissionsCreate from '@/views/trust-business/permissions/business-permissions/v1/create/BusinessPermissionsCreate'

const {
  business_trusts_with_code,
  users_with_document,
  headerProps,
  tableProps,
  formElementRef,
  tableListRef,
  selectedBusiness,
  selectedUser,
  selectedRows,
  pendingPermissions,

  is_required,
  handleFilter,
  updatePage,
  updateRowsPerPage,
  handleRowSelection,
  onManagePermissions,
  onSubmit,
  validateRouter,
} = useBusinessPermissionsCreate()
</script>
