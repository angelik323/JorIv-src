<template>
  <q-form ref="formElementRef" class="q-pa-xl">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div
          :class="[
            'col-xs-12 col-sm-12',
            ['view'].includes(action) ? 'col-md-20p' : '',
          ]"
        >
          <p
            :class="[
              'text-weight-medium mb-0',
              ['view'].includes(action) ? 'text-black-10' : 'text-grey-6',
            ]"
          >
            Negocio
          </p>

          <p class="text-grey-6 mb-3">
            {{ models.business_name ? models.business_name: "No registrado" }}
          </p>
        </div>

        <div
          :class="[
            'col-xs-12 col-sm-12',
            ['view'].includes(action) ? 'col-md-20p' : '',
          ]"
        >
          <p
            :class="[
              'text-weight-medium mb-0',
              ['view'].includes(action) ? 'text-black-10' : 'text-grey-6',
            ]"
          >
            Banco
          </p>

          <p class="text-grey-6 mb-3">
            {{ models.bank_name || "No registrado" }}
          </p>
        </div>
        <div
          :class="[
            'col-xs-12 col-sm-12',
            ['view'].includes(action) ? 'col-md-20p' : '',
          ]"
        >
          <p
            :class="[
              'text-weight-medium mb-0',
              ['view'].includes(action) ? 'text-black-10' : 'text-grey-6',
            ]"
          >
            Cuenta
          </p>

          <p class="text-grey-6 mb-3">
            {{ models.account || "No registrado" }}
          </p>
        </div>
        <div
          :class="[
            'col-xs-12 col-sm-12',
            ['view'].includes(action) ? 'col-md-20p' : '',
          ]"
        >
          <p
            :class="[
              'text-weight-medium mb-0',
              ['view'].includes(action) ? 'text-black-10' : 'text-grey-6',
            ]"
          >
            Grupo
          </p>

          <p class="text-grey-6 mb-3">
            {{ models.dispersion_group || "No registrado" }}
          </p>
        </div>
        <div
          :class="[
            'col-xs-12 col-sm-12',
            ['view'].includes(action) ? 'col-md-20p' : '',
          ]"
        >
          <p
            :class="[
              'text-weight-medium mb-0',
              ['view'].includes(action) ? 'text-black-10' : 'text-grey-6',
            ]"
          >
            Vigencia
          </p>

          <p class="text-grey-6 mb-3">
            {{ models.validity || "No registrado" }}
          </p>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script lang="ts" setup>
import { IDispersionGroupInformationForm } from "@/interfaces/customs";
import useInformationForm from "./DispersionGroupInfo";

const props = withDefaults(
  defineProps<{
    action: "create" | "edit" | "view";
    data?: IDispersionGroupInformationForm;
  }>(),
  {}
);

const emits = defineEmits(["validate:form"]);

const { models, formElementRef } = useInformationForm(props);

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
});
</script>
<style scoped>
.col-md-20p0p {
  width: 100%;
}
@media (768px < width < 992px) {
  .col-md-20p {
    width: 50%;
  }
}
@media (width > 992px) {
  .col-md-20p {
    width: 20%;
  }
}
</style>