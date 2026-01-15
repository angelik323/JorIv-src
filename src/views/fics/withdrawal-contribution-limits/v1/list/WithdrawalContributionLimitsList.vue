<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
      <div class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />

        <div v-if="tableProperties.rows.length === 0" class="q-mt-lg">
          <div class="flex justify-between items-start q-mb-md">
            <p class="text-weight-bold text-h6">
              {{
                tabActiveType
                  ? 'Montos de retiros y cancelación'
                  : 'Montos de aportes'
              }}
            </p>

            <Button
              v-if="
                validateRouter(
                  'Fics',
                  'WithdrawalContributionLimitsList',
                  'create'
                )
              "
              no-caps
              unelevated
              :label="'Crear'"
              :leftIcon="defaultIconsLucide.plusCircleOutline"
              :color-icon="'white'"
              :text-color="'white'"
              :outline="false"
              :color="'primary'"
              :tooltip="'Crear'"
              @click="handleOptions('create')"
            />
          </div>

          <VCard>
            <template #content-card>
              <div
                class="flex column justify-center items-center items-center q-py-xl"
                aria-label="Mensaje informativo"
              >
                <img
                  src="@/assets/images/icons/no_data_accounting.svg"
                  class="q-mb-lg"
                  alt="No hay datos para mostrar"
                />

                <p class="text-weight-bold text-h6 text-center">
                  {{
                    tabActiveType
                      ? 'Actualmente no hay montos de retiro y cancelación'
                      : 'Actualmente no hay montos de aportes'
                  }}
                </p>

                <p class="text-weight-light text-h6 text-center">
                  Por favor, agregue uno para continuar con el proceso
                </p>
              </div>
            </template>
          </VCard>
        </div>

        <div v-else>
          <div
            class="flex justify-between items-start q-mb-md q-mt-lg"
            aria-label="Sección de listado"
          >
            <p class="text-weight-bold text-h6">
              {{
                tabActiveType
                  ? 'Montos de retiros y cancelación'
                  : 'Montos de aportes'
              }}
            </p>

            <Button
              v-if="
                validateRouter(
                  'Fics',
                  'WithdrawalContributionLimitsList',
                  'create'
                )
              "
              no-caps
              unelevated
              label="Crear"
              :left-icon="defaultIconsLucide.plusCircleOutline"
              color-icon="white"
              text-color="white"
              :outline="false"
              color="primary"
              @click="handleOptions('create')"
            />
          </div>

          <TableList
            :loading="tableProperties.loading"
            :rows="tableProperties.rows"
            :columns="tableProperties.columns"
            :pages="tableProperties.pages"
            :custom-columns="['actions']"
            @update-page="handleUpdatePage"
            @update-rows-per-page="handleUpdatePerPage"
          >
            <template #actions="{ row }">
              <Button
                v-if="
                  validateRouter(
                    'Fics',
                    'WithdrawalContributionLimitsList',
                    'edit'
                  )
                "
                flat
                :left-icon="defaultIconsLucide.edit"
                color-icon="#f45100"
                :class-custom="'custom'"
                :outline="false"
                tooltip="Editar"
                @click="handleOptions('edit', row.id)"
              />
              <Button
                v-if="
                  validateRouter(
                    'Fics',
                    'WithdrawalContributionLimitsList',
                    'delete'
                  )
                "
                flat
                :left-icon="defaultIconsLucide.trash"
                colorIcon="#f45100"
                :class-custom="'custom'"
                :outline="false"
                tooltip="Eliminar"
                @click="handleOptions('delete', row.id)"
              />
            </template>
          </TableList>
        </div>
      </div>

      <AlertModalComponent
        ref="createEditModalRef"
        styleModal="min-width: 500px"
        :showBtnConfirm="false"
        :showBtnCancel="false"
        :showImgDefault="false"
        :showCloseBtn="true"
      >
        <template #default-body>
          <div class="q-mx-lg q-px-lg">
            <p class="text-weight-bold text-h6">
              {{
                tabActiveType
                  ? currentOption === 'create'
                    ? 'Agregar monto de retiro y cancelación'
                    : 'Editar monto de retiro y cancelación'
                  : currentOption === 'create'
                  ? 'Agregar monto de aporte'
                  : 'Editar monto de aporte'
              }}
            </p>

            <div class="col-12">
              <GenericSelectorComponent
                :default_value="formData.position"
                label="Cargo"
                :manual_option="user_roles"
                auto_complete
                map_options
                required
                :rules="[
                  (val: string) => useRules().is_required(val, 'El cargo es requerido'),
                ]"
                @update:model-value="onSelectPosition"
              />
            </div>

            <div class="col-12">
              <GenericInputComponent
                :default_value="formData.minimum_amount"
                label="Monto mínimo"
                placeholder="Inserte"
                required
                disabled
                type="text"
                :rules="[
                  (val: string) => useRules().is_required(val, 'El monto mínimo es requerido.'),
                  (val: string) => useRules().only_number_with_decimals(val),
                ]"
                @update:modelValue="formData.minimum_amount = $event"
              />
            </div>

            <div class="col-12">
              <GenericInputComponent
                :default_value="formData.maximum_amount"
                label="Monto máximo"
                placeholder="Inserte"
                required
                type="text"
                :rules="[
                  (val: string) => useRules().is_required(val, 'El monto máximo es requerido.'),
                  (val: string) => useRules().only_number_with_decimals(val),
                ]"
                @update:modelValue="formData.maximum_amount = $event"
              />
            </div>
          </div>

          <div class="row q-mt-lg flex justify-center">
            <Button
              label="Cancelar"
              color="orange"
              class="text-capitalize btn-filter custom q-mr-md"
              outline
              @click="handleCloseModal"
            />

            <Button
              :outline="false"
              :label="currentOption === 'create' ? 'Agregar' : 'Actualizar'"
              color="orange"
              class="text-capitalize btn-filter custom"
              @click="handleSubmitForm(currentOption)"
            />
          </div>
        </template>
      </AlertModalComponent>

      <AlertModalComponent
        ref="deleteModalRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="deleteModalConfig.description"
        :description_message="''"
        @confirm="handleDeleteItem"
      >
        <template #default-img>
          <q-img
            src="@/assets/images/icons/alert_popup_delete.svg"
            max-width="80px"
            width="80px"
            fit="contain"
            alt="Imagen de alerta"
          />
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Composables
import { useRules } from '@/composables'

// Logic view
import useWithdrawalContributionLimitsList from '@/views/fics/withdrawal-contribution-limits/v1/list/WithdrawalContributionLimitsList'

const {
  formData,
  tabActive,
  user_roles,
  tabActiveIdx,
  filteredTabs,
  currentOption,
  tabActiveType,
  handleOptions,
  deleteModalRef,
  validateRouter,
  tableProperties,
  handleSubmitForm,
  handleDeleteItem,
  headerProperties,
  handleUpdatePage,
  handleCloseModal,
  onSelectPosition,
  deleteModalConfig,
  createEditModalRef,
  defaultIconsLucide,
  handleUpdatePerPage,
} = useWithdrawalContributionLimitsList()
</script>
