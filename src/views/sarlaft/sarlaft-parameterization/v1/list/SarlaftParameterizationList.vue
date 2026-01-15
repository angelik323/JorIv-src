<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <div class="q-pt-md q-my-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['actions']"
          @update-page="handleUpdatePage"
          @update-rows-per-page="handleUpdatePerPage"
        >
          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter('Sarlaft', 'SarlaftParameterizationList', 'edit')
              "
              :left-icon="defaultIconsLucide.edit"
              colorIcon="#f45100"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              tooltip="Editar"
              @click="openModal(row.id)"
            /> </template
        ></TableList>
      </div>

      <AlertModalComponent
        ref="editModalRef"
        styleModal="min-width: 500px"
        :showBtnConfirm="false"
        :showBtnCancel="false"
        :showImgDefault="false"
        :showCloseBtn="true"
      >
        <template #default-body>
          <div class="q-mx-lg q-px-lg">
            <div class="flex justify-center q-mb-md">
              <q-img
                :src="questionIcon"
                max-width="80px"
                width="80px"
                fit="contain"
                alt="Imagen de alerta"
              />
            </div>

            <p class="text-weight-bold text-h6 text-center">
              Editar parámetros
            </p>

            <div class="col-12">
              <GenericInputComponent
                :default_value="selectedRow?.description"
                label="Parámetro"
                placeholder="Inserte"
                :required="false"
                disabled
                type="text"
                :rules="[]"
              />
            </div>

            <div class="col-12">
              <GenericInputComponent
                v-if="inputConfig.component === 'input'"
                :default_value="selectedRow?.value"
                label="Valor de validación"
                placeholder="Inserte"
                required
                type="text"
                :rules="inputConfig.rules"
                @update:model-value="
                  selectedRow && (selectedRow.value = $event)
                "
              />

              <InputMoneyComponent
                v-if="inputConfig.component === 'currency'"
                :model-value="selectedRow.value"
                label="Valor de validación"
                placeholder="0,00"
                required
                :rules="inputConfig.rules"
                :max_integer_digits="25"
                :max_decimal_digits="2"
                @update:model-value="
                  ({ rawValue }) => (selectedRow.value = rawValue ?? '')
                "
              />
              <GenericSelectorComponent
                v-if="inputConfig.component === 'select'"
                :default_value="inputConfig.value"
                label="Valor de validación"
                :manual_option="inputConfig.manual_option"
                :multiple="inputConfig.multiple"
                :display_value="inputConfig.display_value"
                :show_as_checkbox="inputConfig.show_as_checkbox"
                auto_complete
                map_options
                required
                :rules="inputConfig.rules"
                @update:model-value="handleSelectUpdate($event)"
              />
            </div>

            <div class="col q-mt-md">
              <q-separator />
            </div>
          </div>

          <div class="row q-mt-lg flex justify-center">
            <Button
              label="Cancelar"
              color="orange"
              class="text-capitalize btn-filter custom q-mr-md"
              outline
              @click="closeModal"
            />

            <Button
              :outline="false"
              label=" Actualizar"
              color="orange"
              class="text-capitalize btn-filter custom"
              @click="onSubmit"
            />
          </div>
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Assets
import questionIcon from '@/assets/images/icons/alert_popup_question.svg'

// Logic view
import useSarlaftParameterizationList from '@/views/sarlaft/sarlaft-parameterization/v1/list/SarlaftParameterizationList'

const {
  onSubmit,
  openModal,
  closeModal,
  tableProps,
  headerProps,
  selectedRow,
  inputConfig,
  editModalRef,
  validateRouter,
  handleUpdatePage,
  defaultIconsLucide,
  handleUpdatePerPage,
  handleSelectUpdate,
} = useSarlaftParameterizationList()
</script>
