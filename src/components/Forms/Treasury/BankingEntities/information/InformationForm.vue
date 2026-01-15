<template>
  <q-form ref="formInformation">
    <section>
      <div class="mx-3 mt-1 mb-3">
        <div class="row q-col-gutter-lg mt-1">
          <div class="col-xs-12 col-sm-12" :class="['view'].includes(action) ? 'col-md-3' : 'col-md-12'">
            <p class="text-weight-medium mb-0" :class="['view'].includes(action) ? 'text-black-90 ' : 'text-grey-7'">
              Fecha y hora de creación
            </p>
            <p class="text-grey-7 mb-0">
              {{ models.created_at ?? '' }}
            </p>
          </div>

          <div class="col-xs-12 col-sm-12" :class="['view'].includes(action) ? 'col-md-3' : 'col-md-12'">
            <p class="text-weight-medium mb-0" :class="['view'].includes(action) ? 'text-black-90 ' : 'text-grey-7'">
              Usuario creador
            </p>
            <p class="text-grey-7 mb-0">
              {{ models.created_by ?? '' }}
            </p>
          </div>

          <div class="col-xs-12 col-sm-12" :class="['view'].includes(action) ? 'col-md-3' : 'col-md-12'">
            <p class="text-weight-medium mb-0" :class="['view'].includes(action) ? 'text-black-90 ' : 'text-grey-7'">
              Fecha y hora de edición
            </p>
            <p class="text-grey-7 mb-0">
              {{ models.updated_at ?? '' }}
            </p>
          </div>

          <div class="col-xs-12 col-sm-12" :class="['view'].includes(action) ? 'col-md-3' : 'col-md-12'">
            <p class="text-weight-medium mb-0" :class="['view'].includes(action) ? 'text-black-90 ' : 'text-grey-7'">
              Usuario responsable de la edición
            </p>
            <p class="text-grey-7 mb-0">
              {{ models.updated_by ?? '' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="['view'].includes(action) ? 'col-md-4' : 'col-md-12'"
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Nombre{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :required="true"
              :default_value="models.description"
              :placeholder="'Ingrese el nombre'"
              :rules="[
                (v: string) => !!v || 'El nombre es requerido',
                (v: string) =>
                  /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚüÜ\s-_]*$/.test(v) ||
                  'No se permiten caracteres especiales',

                (v: string) =>
                  v.length >= 3 || 'Debe contener al menos 3 caracteres',
                (v: string) =>
                  v.length <= 60 || 'Debe contener como máximo 60 caracteres',
                (v: string) =>
                  !/\s{2,}/.test(v) || 'No debe contener espacios consecutivos',
              ]"
              @update:model-value="updateDescription($event)"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.description ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="['edit'].includes(action) ? 'col-md-3' : 'col-md-6'"
            v-if="['edit'].includes(action)"
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Código
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :readonly="true"
              hint="Dato generado por el sistema"
              :default_value="models.code"
              @update:model-value="models.code = $event"
            />
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="{
              'col-md-3': ['edit'].includes(action),
              'col-md-6': ['create'].includes(action),
              'col-md-4': ['view'].includes(action),
            }"
            v-if="['edit', 'create'].includes(action)"
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              NIT{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.nit"
              :manual_option="third_party_nit"
              :auto_complete="true"
              :required="true"
              :map_options="true"
              :rules="[(val: string) => !!val || 'El NIT es requerido']"
              @update:model-value="models.nit = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.nit ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="{
              'col-md-3': ['edit'].includes(action),
              'col-md-6': ['create'].includes(action),
              'col-md-4': ['view'].includes(action),
            }"
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Código bancario{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :required="true"
              hint="Corresponde al código definido por la SFC"
              :default_value="models.bank_code"
              :rules="[
                (v: string) => !!v || 'Código bancario es requerido',
                (v: string) =>
                  /^[a-zA-Z0-9À-ÿ\s-]+$/.test(v) ||
                  'No se permiten caracteres especiales',
                (v: string) =>
                  v.length >= 4 || 'Debe contener al menos 4 caracteres',
                (v: string) =>
                  v.length <= 4 || 'Debe contener como máximo 4 caracteres',
                (v: string) =>
                  !/\s{2,}/.test(v) || 'No debe contener espacios consecutivos',
                (v: string) =>
                  /^[0-9]*$/.test(v) || 'Debe contener solo números',
              ]"
              @update:model-value="models.bank_code = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.bank_code ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="{
              'col-md-3': ['edit'].includes(action),
              'col-md-4': ['view'].includes(action),
            }"
            v-if="['edit', 'view'].includes(action)"
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Estado
            </p>

            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="
                models.status === 55 ? 'Por autorizar' : models.status
              "
              :manual_option="statusBanking"
              :readonly="models.status === 55"
              :required="true"
              :map_options="true"
              :rules="[(val: string) => !!val || 'El NIT es requerido']"
              @update:model-value="models.status = $event"
            />
            <p v-else class="text-grey-6">
              <ShowStatus :type="models?.status ?? 0" />
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>
<script setup lang="ts">
import useInformationForm from '@/components/Forms/Treasury/BankingEntities/information/InformationForm'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import { IBankingEntitiesList } from '@/interfaces/customs'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit' | 'view'
    data?: IBankingEntitiesList
  }>(),
  {}
)
const {
  models,
  updateDescription,
  formInformation,
  statusBanking,
  third_party_nit,
} = useInformationForm(props)

defineExpose({
  validateForm: () => formInformation.value?.validate(),
})
</script>
