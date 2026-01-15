<script setup lang="ts">
import { defaultIcons } from '@/utils'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import { useRetentionsForm } from './RetentionsForm'

// Props
const props = defineProps({
  formType: {
    type: String,
    required: true,
  },
  showBtn: {
    type: Boolean,
    required: false,
    default: false,
  },
  btnLabel: {
    type: String,
    required: false,
    default: 'Continuar',
  },
  btnIcon: {
    type: String,
    required: false,
    default: defaultIcons.next,
  },
  showBackBtn: {
    type: Boolean,
    required: false,
    default: false,
  },
})

// Handle emits to view:
const emit = defineEmits(['onContinue', 'onBack'])

const {
  formValues,
  opsRetentions,
  retentions_types,
  tableProperties,
  submit,
  getRetention,
  deleteRetention,
  addRetention,
} = useRetentionsForm(props, emit)
</script>
<template>
  <q-form @submit.prevent="submit">
    <section>
      <div class="q-px-lg">
        <h2 class="text-h5 text-weight-500">Datos generales</h2>
        <div class="row">
          <div
            class="col-4 q-py-lg q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <GenericSelectorComponent
              :default_value="formValues.name"
              :manual_option="opsRetentions"
              label="Nombre"
              auto_complete
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="false"
              map_options
              :rules="[]"
              @update:modelValue="getRetention($event)"
            />
          </div>

          <div
            class="col-4 q-py-lg q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <GenericSelectorComponent
              :default_value="formValues.account"
              :manual_option="[]"
              label="Cuenta"
              auto_complete
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="false"
              map_options
              disabled
              :rules="[]"
              @update:modelValue="formValues.account = $event"
            />
          </div>

          <div
            class="col-4 q-py-lg q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <GenericSelectorComponent
              :default_value="formValues.type"
              :manual_option="retentions_types"
              label="Tipo"
              auto_complete
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="false"
              map_options
              disabled
              :rules="[]"
              @update:modelValue="formValues.type = $event"
            />
          </div>

          <div
            class="col-4 q-py-lg q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <p class="text-grey-6 text-weight-medium mb-0">Porcentaje</p>
            <q-input
              outlined
              v-model="formValues.percentage"
              dense
              type="text"
              placeholder="Inserte"
              disable
              :required="false"
            />
          </div>
        </div>

        <div class="q-px-xl q-mt-xl q-mb-lg">
          <div class="row justify-end">
            <div class="q-px-sm">
              <q-btn
                v-if="showBackBtn"
                class="text-initial btn__history col-2"
                color="indigo-10"
                size="md"
                unelevated
                no-caps
                :icon="defaultIcons.plus"
                label="Añadir"
                :style="{ width: '130px', height: '50px' }"
                @click="() => addRetention()"
              />
            </div>
          </div>
        </div>
        <q-separator />
      </div>
    </section>

    <!-- Table -->
    <section class="q-mt-xl">
      <TableList
        :title="tableProperties.title"
        :loading="tableProperties.loading"
        :rows="tableProperties.rows"
        :columns="tableProperties.columns"
        :pages="tableProperties.pages"
        :custom-columns="['status', 'actions']"
      >
        <template #status="{ row }">
          <ShowStatus :type="Number(row.status_id)" />
        </template>

        <template #actions="{ row }">
          <!-- Eliminar -->
          <q-btn
            flat
            rounded
            size="14px"
            :icon="defaultIcons.delete"
            color="indigo-10"
            @click="deleteRetention(row.id)"
          >
            <q-tooltip
              transition-show="flip-right"
              transition-hide="flip-left"
              class="indigo-10"
            >
              <p class="q-ma-none text-body2">Eliminar</p>
            </q-tooltip>
          </q-btn>
        </template>
      </TableList>
    </section>

    <!-- Submit Button -->
    <section v-if="showBtn === false">
      <div class="q-px-xl q-mt-xl q-mb-lg">
        <div class="row justify-end">
          <div class="q-px-sm">
            <q-btn
              v-if="showBackBtn"
              class="text-initial btn__history col-2"
              color="primary"
              type="submit"
              size="md"
              unelevated
              outline
              no-caps
              :icon="defaultIcons.back"
              @click="() => emit('onBack', true)"
              :label="'Atrás'"
              :style="{ width: '110px', height: '50px' }"
            />
          </div>

          <div class="q-px-sm">
            <q-btn
              class="text-initial btn__history col-2"
              color="indigo-10"
              type="submit"
              size="md"
              unelevated
              no-caps
              :label="btnLabel"
              :style="{ width: '110px', height: '50px' }"
            />
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>
