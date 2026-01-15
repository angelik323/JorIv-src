/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useAlert, useRules } from '@/composables'
import {
  useFiltersStore,
  useResourcesStore,
  usePermissionStore,
  useRolesModule,
  usePermissionFormStore,
  useDataFormStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { defineComponent, onMounted, ref, watch, nextTick } from 'vue'
import { IPermissionRole } from '@/interfaces/customs'
// Components:
import FiltersComponent from '@/components/common/Filters/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import BannerListComponent from '@/components/common/BannerList/BannerListComponent.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import Badge from '@/components/common/Badge/Badge.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

import {
  defaultIcons,
  defaultIconsLucide,
  returnArrayRulesValidation,
} from '@/utils'

export default defineComponent({
  name: 'PermissionsForm',
  props: {
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
      default: 'Crear',
    },
    btnIcon: {
      type: String,
      required: false,
      default: defaultIcons.next,
    },
    showBackBtn: {
      type: Boolean,
      required: false,
      defaulte: false,
    },
    btnBackLabel: {
      type: String,
      required: false,
      default: 'Atrás',
    },
    btnBackIcon: {
      type: String,
      required: false,
      default: defaultIcons.back,
    },
  },
  components: {
    FiltersComponent,
    TableList,
    BannerListComponent,
    ShowStatus,
    Badge,
    Button,
    AlertModalComponent,
  },
  setup(props, { emit }) {
    const {
      _setStoreFirtsTime,
      _setStoreValidateForm,
      _setStoreFormDataRole,
      _setStorePermissionsDataRole,
    } = useRolesModule()
    // Bandera para evitar bucle infinito entre watchers
    let isSyncingPermissions = false
    const { formDataRole, firtsTime } = storeToRefs(useRolesModule())
    const { permissions_status_roles, modules } = storeToRefs(
      useResourcesStore()
    )
    const { permissions } = storeToRefs(usePermissionFormStore())
    const { permissionListData } = storeToRefs(usePermissionStore())
    const { setFiltersState } = useFiltersStore()
    const { userDataForm } = storeToRefs(useDataFormStore())
    const { getPermissionList } = usePermissionStore()
    const { openMainLoader } = useMainLoader()
    const { showAlert } = useAlert()
    const { is_required } = useRules()
    // FormData
    const formData = ref()
    const name = ref()
    const description = ref()
    const priority_level = ref()
    const authorization_level_id = ref()
    const arrayPaginate: any = ref([])
    const pages = ref({
      currentPage: 1,
      lastPage: 1,
    })
    const validInputsFlags = ref<{ [key: string]: any }>({
      name: false,
      description: false,
      priority_level: false,
      authorization_level_id: false,
    })
    //
    const dataForm = ref<{
      name: string | null
      description: string | null
      priority_level: number | string | null
      authorization_level_id: any
      permissions: string[] | [] | IPermissionRole[] | any
    }>({
      name: null,
      description: null,
      priority_level: null,
      authorization_level_id: null,
      permissions: [],
    })

    const list = ref<{
      [key: string]: any
    }>({
      priority_level: [],
      authorization_level_id: [],
    })

    const filterParams = ref<{
      'filter[module]': string | number | null
      'filter[status_id]': number | string | null
      'filter[search]': string | null
    }>({
      'filter[module]': null,
      'filter[status_id]': null,
      'filter[search]': null,
    })

    const filterConfig = ref([
      {
        name: 'module',
        label: 'Módulo',
        type: 'q-select',
        value: null,
        class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4 q-py-md',
        options: modules.value,
        disable: false,
        clean_value: true,
        placeholder: 'Seleccione',
      },
      {
        name: 'status_id',
        label: 'Estado',
        type: 'q-select',
        value: null,
        class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4 q-py-md',
        options: permissions_status_roles.value,
        disable: false,
        clean_value: true,
        placeholder: 'Seleccione',
      },
      {
        name: 'search',
        label: 'Buscador',
        type: 'q-input',
        value: null,
        class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4 q-py-md',
        disable: false,
        icon: 'mdi-magnify',
        clean_value: true,
        placeholder: 'Buscar por permiso',
      },
    ])

    const bannerProps = ref({
      message:
        'El usuario debe volver a iniciar sesión para aplicar los cambios.',
    })

    const models_modal_permission_managment = ref<{
      id: number | null
      description: string | null
      children:
        | Array<{
            id: number
            name: string
            description: string
            status_id: number
            status: string
            isChecked: boolean
          }>
        | []
    }>({
      id: null,
      description: null,
      children: [],
    })

    const alertModalRef = ref()

    const returnColumns = () => {
      const columns = [
        {
          name: 'module',
          required: false,
          label: 'Módulo',
          align: 'left',
          field: 'module',
          sortable: true,
        },
        {
          name: 'description',
          required: false,
          label: 'Permiso',
          align: 'left',
          field: 'description',
          sortable: true,
          style: 'white-space: pre-wrap',
        },
        {
          name: 'status',
          required: false,
          label: 'Estado',
          align: 'left',
          field: 'status',
          sortable: true,
          style: {
            'white-space': 'pre-wrap',
            'min-width': `200px`,
            'max-width': `200px`,
            'overflow-wrap': 'break-word',
          },
        },
        {
          name: 'actions',
          required: true,
          label: 'Acciones',
          align: 'center',
          field: 'actions',
        },
      ]

      if (props.formType == 'view') {
        for (let i = 0; i < columns.length; i++) {
          if (columns[i].name === 'actions') {
            columns.splice(i, 1)
            break
          }
        }
      }
      return columns
    }

    const tableProperties = ref({
      title: 'Listado de permisos',
      loading: false,
      columns: returnColumns(),
      pages: pages.value,
      rows: [] as any,
    })

    const paginateRegisters = (
      array: any,
      limitRegisterForPage: number,
      currentPage?: number
    ): any => {
      arrayPaginate.value = []
      const lastPage = Math.ceil(array.length / limitRegisterForPage)
      for (let indexPaginate = 0; indexPaginate < lastPage; indexPaginate++) {
        arrayPaginate.value[indexPaginate] = {
          currentPage: indexPaginate + 1,
          registers: [],
          lastPage: lastPage,
        }
        if (indexPaginate > 0) {
          array = array.slice(indexPaginate * limitRegisterForPage - 1)
        }
        for (let index = 0; index < limitRegisterForPage; index++) {
          if (array[index]) {
            const element = array[index]
            arrayPaginate.value[indexPaginate].registers.push(element)
          }
        }
      }
      pages.value.lastPage = lastPage
      pages.value.currentPage = currentPage ? currentPage : 1
      tableProperties.value.rows = arrayPaginate.value[
        pages.value.currentPage - 1
      ]
        ? arrayPaginate.value[pages.value.currentPage - 1].registers
        : []
    }

    const updatePage = async (page: number) => {
      pages.value.currentPage = page
      tableProperties.value.rows = arrayPaginate.value[page - 1].registers
    }

    const returnLabel = (id: number | string, array: any) => {
      for (let i = 0; i < array.length; i++) {
        if (array[i].value === id) {
          return array[i].label
        }
      }
    }

    const filterPermissionList = async (
      filters: {
        'filter[module]': string | number | null
        'filter[status_id]': number | string | null
        'filter[search]': string | null
      },
      currentPage?: number
    ) => {
      tableProperties.value.loading = true

      if (Object.keys(filters).length === 0) {
        tableProperties.value.rows = [...dataForm.value.permissions]
        await paginateRegisters(tableProperties.value.rows, 200, currentPage)
        setTimeout(() => {
          tableProperties.value.loading = false
        }, 1000)
        return
      }

      const normalizedFilters = {
        module: filters['filter[module]'] ?? null,
        statusId: !filters['filter[status_id]']
          ? null
          : Number(filters['filter[status_id]']),
        search: filters['filter[search]']?.toLowerCase() ?? null,
      }

      // Update current filters
      filterParams.value = filters

      tableProperties.value.rows = dataForm.value.permissions.filter(
        (item: any) => {
          const matchesModule = normalizedFilters.module
            ? item.module === normalizedFilters.module
            : true
          const matchesStatus =
            normalizedFilters.statusId !== null
              ? item.status_id === normalizedFilters.statusId
              : true
          const matchesSearch = normalizedFilters.search
            ? item.description.toLowerCase().includes(normalizedFilters.search)
            : true

          return matchesModule && matchesStatus && matchesSearch
        }
      )

      await paginateRegisters(tableProperties.value.rows, 200, currentPage)
      tableProperties.value.loading = false
    }

    const handleClickButton = () => {
      formData.value.validate().then((success: boolean) => {
        if (success) {
          if (
            permissions.value.length > 0 ||
            (formDataRole.value &&
              formDataRole.value.permissions &&
              formDataRole.value.permissions.length > 0)
          ) {
            emit('onContinue')
          } else {
            showAlert(
              '¡Se debe establecer por lo menos 1 permiso!',
              'error',
              undefined,
              3000
            )
          }
        } else {
          showAlert(
            'Debe diligenciar todos los datos del rol correctamente',
            'error',
            undefined,
            3000
          )
        }
      })
    }

    const clearFilters = async () => {
      filterParams.value['filter[module]'] = null
      filterParams.value['filter[status_id]'] = 0
      filterParams.value['filter[search]'] = null
      await filterPermissionList(filterParams.value)
    }

    const allowDisallowAllPermissions = async (status_id: number) => {
      for (let index = 0; index < dataForm.value.permissions.length; index++) {
        dataForm.value.permissions[index]!.status_id = status_id
      }
      for (let index = 0; index < tableProperties.value.rows.length; index++) {
        tableProperties.value.rows[index]!.status_id = status_id
      }
      // await filterPermissionList(filterParams.value)
    }

    const getPermissionsList = async () => {
      openMainLoader(true)
      await getPermissionList(
        userDataForm.value?.role ? userDataForm.value?.role : null
      )

      dataForm.value.permissions =
        permissionListData.value.length !== 0
          ? Object.assign(permissionListData.value)
          : []
      tableProperties.value.rows = Object.assign(dataForm.value.permissions)

      //await filterPermissionList(filterParams.value)
      openMainLoader(false)
    }

    const updateStatus = async (itemId: number, newStatus: number) => {
      for (let index = 0; index < dataForm.value.permissions.length; index++) {
        if (dataForm.value.permissions[index].id === itemId) {
          dataForm.value.permissions[index].status_id = newStatus
        }
      }
      for (let index = 0; index < tableProperties.value.rows.length; index++) {
        if (tableProperties.value.rows[index].id === itemId) {
          tableProperties.value.rows[index].status_id = newStatus
        }
        break
      }
      _setStorePermissionsDataRole(dataForm.value.permissions)
      await filterPermissionList(filterParams.value, pages.value.currentPage)
    }

    const getInformation = async () => {
      dataForm.value = {
        name: formDataRole.value?.name ?? null,
        description: formDataRole.value?.description ?? null,
        priority_level: formDataRole.value?.priority_level ?? null,
        authorization_level_id:
          formDataRole.value?.authorization_level_id ?? null,
        permissions: formDataRole.value?.permissions ?? [],
      }

      // if (props.formType === 'view') {
      tableProperties.value.rows = [...(formDataRole.value?.permissions ?? [])]
      // }
      if (props.formType !== 'view') {
        handlerValidationInput('name')
        handlerValidationInput('description')
        handlerValidationInput('authorization_level_id')
        handlerValidationInput('priority_level')
      }
    }

    const handlerValidationInput = async (nameInput: any) => {
      nextTick(() => {
        setTimeout(() => {
          validInputsFlags.value[nameInput] = eval(nameInput).value?.validate()
          for (const flag in validInputsFlags.value) {
            if (validInputsFlags.value[flag] == false) {
              _setStoreValidateForm(true)
              break
            } else {
              _setStoreValidateForm(false)
            }
          }
        }, 50)
        _setStoreFormDataRole(Object.assign(dataForm.value))
      })
    }

    const openAlertModal = async (row: any) => {
      models_modal_permission_managment.value.id = row.id
      models_modal_permission_managment.value.description = row.description
      models_modal_permission_managment.value.children =
        row?.children?.map((item: any) => ({
          ...item,
          isChecked: (item.isChecked || item.status_id == 1) ?? false,
        })) ?? []

      await alertModalRef.value.openModal()
    }

    const applyChildPermissionChanges = () => {
      const parentId = models_modal_permission_managment.value.id
      const updatedChildren = models_modal_permission_managment.value.children

      if (parentId && updatedChildren) {
        // Buscar el permiso padre en tableProperties.value.rows
        const parentPermission = tableProperties.value.rows.find(
          (row: any) => row.id === parentId
        )

        if (parentPermission) {
          // Actualizar los hijos del permiso padre con los nuevos estados
          updatedChildren.forEach((updatedChild: any) => {
            const childPermission = parentPermission.children.find(
              (child: any) => child.id === updatedChild.id
            )
            if (childPermission) {
              childPermission.isChecked = updatedChild.isChecked
              if (childPermission.isChecked)
                dataForm.value.permissions.push(childPermission)
            }
          })
        }
      }

      setTimeout(() => {
        alertModalRef.value.closeModal()
      }, 1000)
    }

    const translateLabel = (name: string) => {
      if (name.includes('create')) return 'Crear'
      if (name.includes('edit')) return 'Editar'
      if (name.includes('show')) return 'Ver'
      if (name.includes('delete')) return 'Eliminar'
      if (name.includes('undo')) return 'Deshacer'
      if (name.includes('list')) return 'Listar'
      if (name.includes('export')) return 'Exportar'
      if (name.includes('templates')) return 'Plantillas'
      if (name.includes('validate')) return 'Validar'
      if (name.includes('process')) return 'Procesar'
      if (name.includes('action_give_permissions')) return 'Dar permisos'
      if (name.includes('action_remove_permissions')) return 'Quitar permisos'
      if (name.includes('action_transfer_permissions')) return 'Transferir permisos'
      if (name.includes('action_program')) return 'Programar'
      if (name.includes('action_homologate')) return 'Homologar'
      if (name.includes('action_generate')) return 'Generar'
      if (name.includes('action_outdated')) return 'Desactualizar'
      if (name.includes('action_authorize')) return 'Autorizar'
      if (name.includes('action_import')) return 'Importar'
      if (name.includes('action_reject')) return 'Rechazar'
      if (name.includes('action_change_status')) return 'Cambiar estado'
      if (name.includes('action_annul')) return 'Anular'
      if (name.includes('action_update')) return 'Actualizar'
      if (name.includes('export_individual')) return 'Exportar individual'

      return name
    }

    onMounted(async () => {
      _setStoreFirtsTime()
      // returnCounterNumbers(10, 'priority_level')
      setFiltersState(filterConfig.value)
      if (props.formType === 'create' && firtsTime.value == 1) {
        openMainLoader(true)
        await getPermissionsList()
        await paginateRegisters(dataForm.value.permissions, 200)
        openMainLoader(false)
      }
      if (props.formType && firtsTime.value > 1) {
        setTimeout(async () => {
          openMainLoader(true)
          await getInformation()
          await paginateRegisters(dataForm.value.permissions, 200)
          openMainLoader(false)
        }, 4000)
      }
    })

    watch(
      () => dataForm.value.permissions,
      (val) => {
        if (!isSyncingPermissions) {
          isSyncingPermissions = true
          _setStorePermissionsDataRole(val)
          // Permitir que el siguiente watcher se ejecute solo una vez
          setTimeout(() => {
            isSyncingPermissions = false
          }, 0)
        }
      },
      { deep: true }
    )

    watch(
      () => formDataRole.value,
      async () => {
        if (!isSyncingPermissions) {
          isSyncingPermissions = true
          await getInformation()
          setTimeout(() => {
            isSyncingPermissions = false
          }, 0)
        }
      }
    )

    return {
      tableProperties,
      bannerProps,
      defaultIcons,
      defaultIconsLucide,
      dataForm,
      formData,
      name,
      description,
      priority_level,
      authorization_level_id,
      updatePage,
      //
      returnLabel,
      returnArrayRulesValidation,
      handleClickButton,
      filterPermissionList,
      clearFilters,
      updateStatus,
      allowDisallowAllPermissions,
      handlerValidationInput,
      props,
      list,
      //
      firtsTime,
      models_modal_permission_managment,
      alertModalRef,

      // Methods
      openAlertModal,
      applyChildPermissionChanges,
      translateLabel,
      is_required,
    }
  },
})
