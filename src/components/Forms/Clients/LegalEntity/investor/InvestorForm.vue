<template>
  <q-form ref="formInvestor" class="q-pa-lg">
    <section>
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Clasificación del inversionista y calificación del perfil de riesgo
        </p>
        <p
          v-if="['create', 'edit'].includes(action)"
          class="text-grey-6 text-weight-medium q-mb-none"
        >
          Proporcione los datos necesarios para identificar la clasificación del
          inversionista y la calificación del perfil de riesgo.
        </p>
      </div>
    </section>

    <!-- Table -->
    <section class="q-mt-xl" v-if="tableProps.rows.length > 0">
      <TableList
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :pages="tableProps.pages"
        :custom-columns="['actions']"
        @update-page=""
      >
        <!-- Custom title table -->
        <template #custom-header>
          <div class="row q-col-gutter-sm" style="width: 100%">
            <div class="col-xs-12 col-sm-12 col-md-9 col-lg-10 self-center">
              <p class="q-my-none text-weight-medium text-h5">
                {{ tableProps.title }}
              </p>
            </div>
          </div>
        </template>

        <template #actions="{ row }">
          <!-- Ver -->
          <q-btn
            flat
            rounded
            size="14px"
            :icon="defaultIcons.eye"
            color="indigo-10"
            @click=""
          >
            <q-tooltip
              transition-show="flip-right"
              transition-hide="flip-left"
              class="primary"
            >
              <p class="q-ma-none text-body2">Ver</p>
            </q-tooltip>
          </q-btn>

          <!-- Editar -->
          <q-btn
            flat
            rounded
            size="14px"
            :icon="defaultIcons.edit"
            color="indigo-10"
            @click=""
          >
            <q-tooltip
              transition-show="flip-right"
              transition-hide="flip-left"
              class="primary"
            >
              <p class="q-ma-none text-body2">Editar</p>
            </q-tooltip>
          </q-btn>

          <!-- Activar -->
          <q-btn
            v-if="row?.status_id == 2"
            flat
            rounded
            size="14px"
            :icon="defaultIcons.play"
            color="indigo-10"
            @click=""
          >
            <q-tooltip
              transition-show="flip-right"
              transition-hide="flip-left"
              class="primary"
            >
              <p class="q-ma-none text-body2">Activar</p>
            </q-tooltip>
          </q-btn>

          <!-- Inactivar -->
          <q-btn
            v-if="row?.status_id == 1"
            flat
            rounded
            size="14px"
            :icon="defaultIcons.pause"
            color="indigo-10"
            @click=""
          >
            <q-tooltip
              transition-show="flip-right"
              transition-hide="flip-left"
              class="primary"
            >
              <p class="q-ma-none text-body2">Inactivar</p>
            </q-tooltip>
          </q-btn>
        </template>
      </TableList>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import TableList from '@/components/table-list/TableList.vue'
import { defaultIcons } from '@/utils'
import useInvestorForm from './InvestorForm'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit' | 'view'
    data?: any | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const { formInvestor, tableProps } = useInvestorForm(props)

defineExpose({
  validateForm: () => formInvestor.value?.validate(),
})
</script>
