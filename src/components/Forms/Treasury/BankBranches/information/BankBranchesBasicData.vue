<template>
  <q-form ref="BankBranchesBasicDataRef">
    <section>
      <div class="mx-3 mt-1 mb-3">
        <div class="row q-col-gutter-lg mt-1">
          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create'].includes(action) ? 'col-md-6' : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Código sucursal{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :required="true"
              :default_value="models.code"
              :placeholder="'Inserte'"
              :readonly="action === 'edit'"
              :rules="[
                (v: string) => !!v || 'El Código es requerido',
                (v: string) =>
                  /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚüÜ\s-_]*$/.test(v) ||
                  'No se permiten caracteres especiales',

                (v: string) =>
                  v.length >= 3 || 'Debe contener al menos 3 caracteres',
                (v: string) =>
                  v.length <= 8 || 'Debe contener como máximo 8 caracteres',
                (v: string) =>
                  !/\s{2,}/.test(v) || 'No debe contener espacios consecutivos',
              ]"
              @update:model-value="models.code = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.code ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create'].includes(action) ? 'col-md-6' : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Nombre de la oficina{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :required="true"
              :default_value="models.name"
              :placeholder="'Inserte'"
              :rules="[
                (v: string) => !!v || 'El nombre de la oficina es requerida',
                (v: string) =>
                  /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚüÜ\s-_,.;:!?]*$/.test(v) ||
                  'No se permiten caracteres especiales',

                (v: string) =>
                  v.length >= 3 || 'Debe contener al menos 3 caracteres',
                (v: string) =>
                  v.length <= 60 || 'Debe contener como máximo 60 caracteres',
                (v: string) =>
                  !/\s{2,}/.test(v) || 'No debe contener espacios consecutivos',
              ]"
              @update:model-value="updateOfficeName($event)"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.name ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="
              ['edit', 'create'].includes(action) ? 'col-md-6' : 'col-md-12'
            "
          >
            <p
              class="text-weight-medium q-mb-none"
              :class="
                ['edit', 'create'].includes(action) ? 'col-md-6' : 'col-md-12'
              "
            >
              Dirección{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <q-input
              v-if="['create', 'edit'].includes(action)"
              :model-value="models.address"
              placeholder="Inserte"
              dense
              outlined
              readonly
              required
              :rules="[(val: string) => !!val || 'La dirección es requerida']"
              class="full-width"
              @click="isAddressGeneratorOpen = true"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.address ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="{
              'col-md-3': ['edit'].includes(action),
              'col-md-6': ['create'].includes(action),
            }"
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Ciudad{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.city_id"
              :auto_complete="true"
              :required="true"
              readonly
              :manual_option="cities"
              :map_options="true"
              :rules="[(val: string) => !!val || 'La ciudad es requerida']"
              @click="isAddressGeneratorOpen = true"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.city_id ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-xs-12 col-sm-12"
            :class="{
              'col-md-3': ['edit'].includes(action),
            }"
            v-if="['edit'].includes(action)"
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
              :default_value="models.status_id"
              :manual_option="statusBankBranches"
              :required="true"
              :map_options="true"
              :rules="[(val: string) => !!val || 'El NIT es requerido']"
              @update:model-value="models.status_id = $event"
            />
            <p v-else class="text-grey-6">
              <ShowStatus :type="Number(models?.status_id) ?? 0" />
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
  <AddressGenerator
    v-model:is-open="isAddressGeneratorOpen"
    required
    :enabledFields="['city']"
    :rules="[(val: string) => !!val || 'La dirección es requerida']"
    :locationToEdit="{
      address: models.address || '',
      city: { id: Number(models.city_id) },
    }"
    @save="
      ($event: any) => {
        models.address = $event.address ?? null
        models.city_id = $event.city?.id ?? null
      }
    "
  />
</template>

<script setup lang="ts">
import useBankBrankBranchesBasicData from '@/components/Forms/Treasury/BankBranches/information/BankBranchesBasicData'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import AddressGenerator from '@/components/Forms/AddressGenerator/AddressGenerator.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import { IBankBranchesList } from '@/interfaces/customs'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit'
    data?: IBankBranchesList
  }>(),
  {}
)

defineExpose({
  validateForm: () => BankBranchesBasicDataRef.value?.validate(),
})

const {
  BankBranchesBasicDataRef,
  models,
  updateOfficeName,
  isAddressGeneratorOpen,
  cities,
  statusBankBranches,
} = useBankBrankBranchesBasicData(props)
</script>
