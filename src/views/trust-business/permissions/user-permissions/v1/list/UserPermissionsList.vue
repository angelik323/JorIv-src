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
          <div class="row items-center q-col-gutter-x-md q-col-gutter-y-sm">
            <div class="col-12 col-md-5 col-lg-3">
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
                class="text-capitalize btn-filter custom"
                size="md"
                label="Buscar"
                color="primary_fiduciaria"
                :leftIcon="defaultIconsLucide.magnify"
                color-icon="#fff"
                unelevated
                :disabled="!selectedUser"
                :outline="false"
                @click="handleFilter"
              />
            </div>
          </div>

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

                  <div class="col-auto">
                    <Button
                      v-if="
                        validateRouter(
                          'BusinessTrust',
                          'UserPermissionsList',
                          'list'
                        )
                      "
                      class-custom="custom"
                      label="Gestionar permisos"
                      color="orange"
                      outline
                      no-caps
                      :styleContent="{
                        'place-items': 'center',
                        color: 'black',
                      }"
                      :disabled="!selectedUser"
                      @click="
                        $router.push({
                          name: 'UserPermissionsCreate',
                          params: {
                            id: selectedUser,
                          },
                        })
                      "
                    />
                  </div>
                </div>
              </template>
            </TableList>
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
import useUserPermissionsList from '@/views/trust-business/permissions/user-permissions/v1/list/UserPermissionsList'

const {
  users_with_document,
  headerProps,
  tableProps,
  selectedUser,

  is_required,
  handleFilter,
  updatePage,
  updateRowsPerPage,
  validateRouter,
} = useUserPermissionsList()
</script>
