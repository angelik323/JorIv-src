<template>
  <q-form ref="formInformation">
    <section>
      <div class="mx-3 mt-0 mb-3">
        <h4 class="textsubtitle2 text-subtitle2" style="font-size: 16px">
          Partida contable
        </h4>
        <div class="row q-col-gutter-lg mt-1">
          <div class="col-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="['view'].includes(action) ? 'text-black-10' : ''"
            >
              Cuenta contable
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.account_chart_id"
              :manual_option="account_chart_id"
              map_options
              auto_complete
              :placeholder="'Ingrese cuenta'"
              required
              :rules="[]"
              @update:model-value="(val) => (models.account_chart_id = val)"
            />
          </div>
        </div>
        <div class="row q-col-gutter-lg mt-1">
          <div class="col-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="['view'].includes(action) ? 'text-black-10' : ''"
            >
              Centro de costos
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.cost_center_id"
              :manual_option="cost_center_structure_id"
              map_options
              auto_complete
              :placeholder="'Ingrese centro de costos'"
              required
              :rules="[]"
              @update:model-value="(val) => (models.cost_center_id = val)"
            />
          </div>
          <div class="col-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="['view'].includes(action) ? 'text-black-10' : ''"
            >
              Tipo de auxiliar
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.aux_type"
              :manual_option="aux_type"
              map_options
              auto_complete
              :placeholder="'Ingrese auxiliar'"
              required
              :rules="[]"
              @update:model-value="(val) => (models.aux_type = val)"
            />
          </div>
        </div>
        <div class="row q-col-gutter-lg mt-1">
          <div class="col-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="['view'].includes(action) ? 'text-black-10' : ''"
            >
              Tercero
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.third_party_id"
              :manual_option="third_party_id"
              map_options
              auto_complete
              :placeholder="'Ingrese tercero'"
              required
              :rules="[]"
              @update:model-value="(val) => (models.third_party_id = val)"
            />
          </div>
          <div class="col-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="['view'].includes(action) ? 'text-black-10' : ''"
            >
              Flujo de caja
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.cash_flow_structure_id"
              :manual_option="cash_flow_structure_id"
              map_options
              auto_complete
              :placeholder="'Ingrese descripción'"
              required
              :rules="[]"
              @update:model-value="
                (val) => (models.cash_flow_structure_id = val)
              "
            />
          </div>
        </div>
        <q-separator class="q-my-lg" />

        <h4 class="textsubtitle2 text-subtitle2" style="font-size: 16px">
          Contrapartida contable
        </h4>
        <div class="row q-col-gutter-lg mt-1">
          <div class="col-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="['view'].includes(action) ? 'text-black-10' : ''"
            >
              Cuenta contable
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.contra_account_chart_id"
              :manual_option="account_chart_id"
              map_options
              auto_complete
              :placeholder="'Ingrese cuenta contable'"
              required
              :rules="[]"
              @update:model-value="
                (val) => (models.contra_account_chart_id = val)
              "
            />
          </div>
        </div>
        <div class="row q-col-gutter-lg mt-1">
          <div class="col-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="['view'].includes(action) ? 'text-black-10' : ''"
            >
              Centro de costos
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.contra_cost_center_id"
              :manual_option="cost_center_structure_id"
              map_options
              auto_complete
              :placeholder="'Ingrese centro de costos'"
              required
              :rules="[]"
              @update:model-value="
                (val) => (models.contra_cost_center_id = val)
              "
            />
          </div>
          <div class="col-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="['view'].includes(action) ? 'text-black-10' : ''"
            >
              Tipo de auxiliar
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.contra_aux_type"
              :manual_option="aux_type"
              map_options
              auto_complete
              :placeholder="'Ingrese tipo auxiliar'"
              required
              :rules="[]"
              @update:model-value="(val) => (models.contra_aux_type = val)"
            />
          </div>
        </div>
        <div class="row q-col-gutter-lg mt-1">
          <div class="col-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="['view'].includes(action) ? 'text-black-10' : ''"
            >
              Tercero
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.contra_third_party_id"
              :manual_option="third_party_id"
              map_options
              auto_complete
              :placeholder="'Ingrese tercero'"
              required
              :rules="[]"
              @update:model-value="
                (val) => (models.contra_third_party_id = val)
              "
            />
          </div>
          <div class="col-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="['view'].includes(action) ? 'text-black-10' : ''"
            >
              Flujo de caja
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.contra_cash_flow_structure_id"
              :manual_option="cash_flow_structure_id"
              map_options
              auto_complete
              :placeholder="'Ingrese descripción'"
              required
              :rules="[]"
              @update:model-value="
                (val) => (models.contra_cash_flow_structure_id = val)
              "
            />
          </div>
        </div>

        <q-separator class="q-my-lg" />
        <h4 class="textsubtitle2 text-subtitle2" style="font-size: 16px">
          Presupuesto asociado
        </h4>
        <div class="row q-col-gutter-lg mt-1">
          <div class="col-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="['view'].includes(action) ? 'text-black-10' : ''"
            >
              Rubro
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="[]"
              :placeholder="'Ingrese descripción'"
              required
              :rules="[]"
            />
          </div>
        </div>
        <div class="row q-col-gutter-lg mt-1">
          <div class="col-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="['view'].includes(action) ? 'text-black-10' : ''"
            >
              Área
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="[]"
              :placeholder="'Ingresa un área'"
              required
              :rules="[]"
            />
          </div>
          <div class="col-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="['view'].includes(action) ? 'text-black-10' : ''"
            >
              Recurso
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="[]"
              :placeholder="'Ingresa un recurso'"
              required
              :rules="[]"
            />
          </div>
        </div>
        <div class="row q-col-gutter-lg mt-1">
          <div class="col-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="['view'].includes(action) ? 'text-black-10' : ''"
            >
              Documento presupuesto
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="[]"
              :placeholder="'Documento presupuesto'"
              required
              :rules="[]"
            />
          </div>
          <div class="col-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="['view'].includes(action) ? 'text-black-10' : ''"
            >
              Movimiento presupuesto
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="[]"
              :placeholder="'Movimiento presupuesto'"
              required
              :rules="[]"
            />
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script lang="ts" setup>
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import useInformationForm from './InformationForm'
import { IAccountingParameters } from '@/interfaces/customs'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit'
    data?: IAccountingParameters[]
  }>(),
  {}
)

const {
  models,
  aux_type,
  cost_center_structure_id,
  cash_flow_structure_id,
  third_party_id,
  account_chart_id,
} = useInformationForm(props)
</script>
