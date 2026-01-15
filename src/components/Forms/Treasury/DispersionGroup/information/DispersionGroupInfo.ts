import { IDispersionGroupInformationForm } from "@/interfaces/customs";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useDispersionGroupStore, useResourceStore } from "@/stores";
import { isEmptyOrZero } from "@/utils";

const useInformationForm = (props: {
  action?: "create" | "edit" | "view";
  data?: IDispersionGroupInformationForm;
}) => {
  const { _setDataInformationForm } = useDispersionGroupStore("v1");
  const { data_information_form } = storeToRefs(useDispersionGroupStore("v1"));

  const { qualification_actions } = storeToRefs(useResourceStore("v1"));
  const formElementRef = ref();

  const initialModelsValues: IDispersionGroupInformationForm = {
    id: "",
    business_name: "",
    bank_name: "",
    account: "",
    dispersion_group: "",
    validity: "",
  };

  const models = ref<IDispersionGroupInformationForm>({
    ...initialModelsValues,
  });
  const handlerActionForm = (action: "create" | "edit" | "view") => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_information_form.value ? _setValueModel : setFormEdit,
      view: _setFormView,
    };
    actionHandlers[action]?.();
  };

  const setFormData = (data: IDispersionGroupInformationForm) => {
    models.value.business_name = data.business_name ?? "";
    models.value.bank_name = data.bank_name ?? "";
    models.value.dispersion_group = data?.dispersion_group ?? "";
    models.value.account = data?.account ?? "";
    models.value.validity = data?.validity ?? "";
  };

  const setFormEdit = async () => {
    clearForm();
    if (props.data) {
      setFormData(props.data);
    }
  };

  const _setFormView = async () => {
    if (!data_information_form.value) return;

    Object.assign(models.value, data_information_form.value);
  };

  const _setValueModel = () => {
    if (!data_information_form.value) return;

    Object.assign(models.value, data_information_form.value);
  };

  const clearForm = () => {
    Object.assign(models.value, initialModelsValues);
  };

  onMounted(async () => {
    handlerActionForm(props.action || "view");
  });

  onUnmounted(async () => {
    _setDataInformationForm(null);
  });

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action || "view");
      }
    },
    { deep: true }
  );

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataInformationForm(null);
      } else {
        _setDataInformationForm({ ...models.value });
      }
    },
    { deep: true }
  );

  watch(
    () => data_information_form.value,
    (val) => {
      if (val) {
        handlerActionForm(props.action || "view");
      }
    },
    { deep: true }
  );
  return {
    models,
    formElementRef,
    qualification_actions,
  };
};

export default useInformationForm;
