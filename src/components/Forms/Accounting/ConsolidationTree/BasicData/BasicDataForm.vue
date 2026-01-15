<template>
  <div>
    <q-form ref="formInformation" class="q-pa-lg">
      <section>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-3">
            <p
              class="mb-0"
              :class="{
                'text-weight-medium text-grey-6': ['create', 'edit'].includes(
                  action
                ),
                'text-weight-bold': ['view'].includes(action),
              }"
            >
              Código de negocio
            </p>
            <GenericSelectorComponent
              v-if="['create'].includes(action)"
              :manual_option="bussines_parent"
              :map_options="true"
              :default_value="''"
              :clearable="false"
              :auto_complete="true"
              :required="true"
              :rules="[(val: string) => !!val || 'El código estructura es requerido']"
              @update:modelValue="onChangeSelectorParent($event)"
            />
            <GenericInput
              v-else-if="['edit'].includes(action)"
              :default_value="models.code ?? ''"
              type="text"
              disabled
            />
            <p v-else class="mb-0">{{ models.code }}</p>
          </div>
          <div class="col-12 col-md-3">
            <p
              class="mb-0"
              :class="{
                'text-weight-medium text-grey-6': ['create', 'edit'].includes(
                  action
                ),
                'text-weight-bold': ['view'].includes(action),
              }"
            >
              Nombre de negocio
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.name ?? ''"
              placeholder="-"
              type="text"
              disabled
            />
            <p v-else class="mb-0">{{ models.name }}</p>
          </div>
          <div class="col-12 col-md-3">
            <p
              class="mb-0"
              :class="{
                'text-weight-medium text-grey-6': ['create', 'edit'].includes(
                  action
                ),
                'text-weight-bold': ['view'].includes(action),
              }"
            >
              Estructura contable
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :default_value="`${models.accounting_structure.code} - ${models.accounting_structure.purpose}`"
              type="text"
              disabled
            />
            <p v-else class="mb-0">
              {{
                `${models.accounting_structure.code} - ${models.accounting_structure.purpose}`
              }}
            </p>
          </div>
          <div class="col-12 col-md-3">
            <p
              class="mb-0"
              :class="{
                'text-weight-medium text-grey-6': ['create', 'edit'].includes(
                  action
                ),
                'text-weight-bold': ['view'].includes(action),
              }"
            >
              Estado
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :manual_option="default_statuses"
              :map_options="true"
              :default_value="models.status_id"
              :clearable="false"
              :auto_complete="false"
              required
              :rules="[]"
              disabled
              placeholder="-"
            />
            <div v-else class="mb-0">
              <ShowStatus :type="Number(models?.status_id ?? 1)" />
            </div>
          </div>
        </div>
      </section>
      <q-separator class="q-my-xl" />
      <section>
        <section class="mx-4 mb-4">
          <TableList
            :loading="tableProps.loading"
            :columns="tableProps.columns"
            :rows="tableProps.rows"
            :pages="tableProps.pages"
            :custom-columns="['code', 'status_id', 'actions']"
            @update-page="updatePage"
            @update-rows-per-page="updatePerPage"
          >
            <template #custom-header>
              <div>
                <p class="q-my-none text-weight-medium text-h5">
                  {{ tableProps.title }}
                </p>
              </div>
              <q-space />

              <Button
                v-if="!['view'].includes(props.action)"
                no-caps
                unelevated
                :label="'Agregar'"
                :leftIcon="defaultIconsLucide.plusCircle"
                :color-icon="'white'"
                :text-color="'white'"
                :outline="false"
                :color="'primary'"
                :tooltip="'Agregar'"
                @click="addRowTable"
              />
            </template>

            <template #status_id="{ row }">
              <div class="q-pa-md">
                <ShowStatus
                  v-if="row.id"
                  :type="Number(row?.status_id ?? '')"
                />
              </div>
            </template>

            <template #code="{ row, index }">
              <GenericSelectorComponent
                v-if="['create', 'edit'].includes(action)"
                :manual_option="bussines_child"
                :map_options="true"
                :default_value="row.id ?? ''"
                :clearable="false"
                :auto_complete="true"
                :required="true"
                :rules="[(val: string) => !!val || 'El código estructura es requerido']"
                @update:modelValue="updateChild($event, index)"
                :disabled="disabledRowOnCreate(row.id)"
              />
              <p v-else class="text-grey-6 mb-0">
                {{ row.code ?? 'No registrado' }}
              </p>
            </template>

            <template #custom-no-data>
              <div
                class="column justify-center items-center q-col-gutter-y-lg q-mt-sm"
              >
                <img
                  src="@/assets/images/icons/no_data_accounting.svg"
                  alt="No hay datos para mostrar"
                  width="180px"
                />
                <p class="text-weight-bold text-h5 text-center mb-1">
                  Actualmente no hay negocios consolidados
                </p>
                <p
                  class="text-weight-medium text-subtitle1 text-center q-pt-none"
                >
                  Por favor, agregue uno para continuar con el proceso
                </p>
              </div>
            </template>

            <template #actions="{ row, index }">
              <Button
                :left-icon="defaultIconsLucide.trash"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                colorIcon="#f45100"
                :tooltip="'Eliminar'"
                @click="removeChild(row.id, index)"
              />
            </template>
          </TableList>
        </section>
      </section>
    </q-form>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit' | 'view'
    data?: ICashFlowStructures | null
  }>(),
  {}
)
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import useBasicDataForm from './BasicDataForm'
import { ICashFlowStructures } from '@/interfaces/customs'
import { defaultIconsLucide } from '@/utils'
import { default_statuses } from '@/constants'

const {
  models,
  tableProps,
  bussines_parent,
  bussines_child,
  addRowTable,
  updateChild,
  removeChild,
  onChangeSelectorParent,
  updatePage,
  updatePerPage,
  disabledRowOnCreate,
} = useBasicDataForm(props)
</script>
