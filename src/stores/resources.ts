import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { IBranchOptions, IResource, IResourceCustom } from '@/interfaces/global'
import { IBranchV2, ISelectorResources } from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global/errorMessage'
import { useAlert } from '@/composables/useAlert'
import { useShowError } from '@/composables/useShowError'

const URL_PATH_RESOURCES = 'assets/api/assets/utils/select-tables'
const URL_PATH_DIAGNOSTIC = '/diagnostics'
const URL_PATH_PROCEDURES = '/procedure'
const URL_PATH_MEDICINES = '/medicine'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useResourcesStore = defineStore('resources', {
  state: () => {
    return {
      users: [] as IResource[],
      users_modules: [] as IResource[],
      cost_centers: [] as IResource[],
      document_types_third_party: [] as IResource[],
      cities: [] as IResource[],
      roles: [] as IResource[],
      roles_inactive_options: [] as IResource[],
      banks: [] as IResource[],
      modules: [] as IResource[],
      modules_log: [] as IResource[],
      authorization_level: [] as IResource[],
      branches: [] as IBranchOptions[],
      ciius: [] as IResource[],
      departments: [] as IResource[],
      areas_filter: [] as IResource[],
      areas: [] as IResource[],
      third_party: [] as IResource[],
      third_party_filter: [] as IResource[],
      asset_groups: [] as IResource[],
      asset_groups_options: [] as IResource[],
      asset_group_roles: [] as IResource[],
      asset_group_roles_filter: [] as IResource[],
      group_type: [] as IResource[],
      group_type_filter: [] as IResource[],
      group_type_filter_assets_role: [] as IResource[],
      group_type_assets_role: [] as IResource[],
      classification: [] as IResource[],
      classification_filter: [] as IResource[],
      asset_classes: [] as IResource[],
      items: [] as IResource[],
      consumer_items: [] as IResource[],
      locations: [] as IResource[],
      consumer_origin: [] as IResource[],
      consumer_good_class: [] as IResource[],
      consumer_locations: [] as IResource[],
      consumer_warehouses: [] as IResource[],
      unit_measurement: [] as IResource[],
      consumer_warehouses_filter: [] as IResource[],
      assets: [],
      accounts_chart: [] as IResource[],
      security_questions: [] as IResource[],
      insurers: [] as IResource[],
      general_assets: [] as IResource[],
      assets_depreciation: [] as IResource[],
      asset_groups_asset: [] as IResource[],
      assets_id: [] as IResource[],
      consumer_goods: [] as IResource[],
      movement_types: [] as IResource[],
      asset_type: [] as IResource[],
      transaction_types: [] as IResource[],
      current_active_group_role: null as number | null,
      regionals: [] as IResource[],
      sectionals: [] as IResource[],
      accounting_period: [] as IResource[],
      asset_groups_accounting_closure: [] as IResource[],
      movement_types_erp: [] as IResource[],
      dispatch_types: [] as IResource[],
      dispatch_types_filter: [] as IResource[],
      retentions: [] as IResource[],
      applicant_type_nature_client: [] as IResource[],
      document_types: [] as IResource[],
      correspondence: [] as IResource[],
      economic_activities: [] as IResource[],
      request_types: [] as IResource[],
      // occupations: [] as IResource[],
      tins: [] as IResource[],
      bankAccounts: [] as IResource[],
      document_types_user: [] as IResource[],
      user_roles: [] as IResource[],

      transaction_status: [
        { label: 'Todos', value: 0 },
        { label: 'Finalizado', value: 7 },
        { label: 'Por rechazar', value: 27 },
        { label: 'Rechazado / anulado', value: 28 },
        { label: 'Por registrar', value: 12 },
        { label: 'Nuevo', value: 3 },
        { label: 'Trámite de ingreso', value: 4 },
        { label: 'Devuelto', value: 5 },
        { label: 'Pendiente', value: 25 },
      ],

      // * Custom selects ERP:
      sex: [
        { label: 'Masculino', value: 'Masculino' },
        { label: 'Femenino', value: 'Femenino' },
      ] as IResource[],
      status: [
        { label: 'Todos', value: 0 },
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 2 },
      ] as IResource[],
      well_status: [
        { label: 'Todos', value: 0 },
        { label: 'Bueno', value: '17' },
        { label: 'Regular', value: '18' },
        { label: 'Malo', value: '19' },
      ] as IResource[],
      permissions_status: [
        { label: 'Permitido', value: 1 },
        { label: 'No permitido', value: 2 },
      ] as IResource[],
      permissions_status_roles: [
        { label: 'Todos', value: 0 },
        { label: 'Permitido', value: 1 },
        { label: 'No permitido', value: 2 },
      ] as IResource[],
      bank_type: [
        { label: 'Ahorros', value: 'Ahorros' },
        { label: 'Corriente', value: 'Corriente' },
      ] as IResource[],
      relationship_type: [
        { label: 'Padre', value: 'Padre' },
        { label: 'Madre', value: 'Madre' },
        { label: 'Hijo(a)', value: 'Hijo(a)' },
        { label: 'Tío(a)', value: 'Tío(a)' },
        { label: 'Abuelo(a)', value: 'Abuelo(a)' },
        { label: 'Amigo(a)', value: 'Amigo(a)' },
        { label: 'Esposo(a)', value: 'Esposo(a)' },
        { label: 'Pareja', value: 'Pareja' },
        { label: 'Otro(a)', value: 'Otro(a)' },
      ] as IResource[],

      isActive: [
        {
          label: 'Si',
          value: true,
        },
        {
          label: 'No',
          value: false,
        },
      ] as IResourceCustom[],
      paymentMode: [
        { label: 'Débito', value: 'Débito' },
        { label: 'Crédito', value: 'Crédito' },
      ] as IResource[],
      dependencies: [
        { label: 'Todos', value: 'Todos' },
        { label: 'Bodega y dependencia', value: 'Bodega y dependencia' },
        { label: 'Solo dependencia', value: 'Solo dependencia' },
      ] as IResource[],

      location_type: [
        { label: 'Todos', value: 'Todos' },
        { label: 'Sede', value: 'Sede' },
        { label: 'Piso', value: 'Piso' },
        { label: 'Área', value: 'Área' },
        { label: 'Seccional', value: 'Seccional' },
        { label: 'Regional', value: 'Regional' },
      ] as IResource[],

      retentions_types: [
        { label: 'Todos', value: 'Todos' },
        { label: 'Otras retenciones', value: 'OTHER' },
        { label: 'Rete fuente', value: 'SOURCE' },
        { label: 'Rete IVA', value: 'VAT' },
        { label: 'Rete ICA', value: 'ICA' },
      ] as IResource[],

      nature_accounts_filters: [
        { label: 'Todos', value: 'Todos' },
        { label: 'Crédito', value: 'Crédito' },
      ] as IResource[],

      // * -----------------------------------------------------

      // ! Valores antiguos, se irán borrando progresivamente...
      care_centers: [] as IResource[],
      backgrounds: [] as IResource[],
      diagnostics: [] as IResource[],
      procedures: [] as IResource[],
      exam_states: [] as IResource[],
      classifications: [] as IResource[],
      units: [] as IResource[],
      document_types_patient: [] as IResource[],
      type_consults: [] as IResource[],
      medicines: [] as IResource[],
      countries: [] as IResource[],
      marital_statuses: [] as IResource[],
      educations: [] as IResource[],
      blood_types: [] as IResource[],
      population_types: [] as IResource[],
      population_groups: [] as IResource[],
      regimens: [] as IResource[],
      administrators: [] as IResource[],
      arls: [] as IResource[],
      memberships: [] as IResource[],
      prepaids: [] as IResource[],
      history: [] as any[],
      categories: [] as IResource[],
      medicine_classes: [] as IResource[],
      medicine_types: [] as IResource[],
      unit_of_measures: [] as IResource[],
      minimum_dispensing_unit: [] as IResource[],
      service_types: [] as IResource[],
      pharmaceutical_forms: [] as IResource[],
      administration_routes: [] as IResource[],
      vat_types: [] as IResource[],
      manufacturers: [] as IResource[],
      authentication_methods: [] as IResource[],
      entry_types: [] as IResource[],
      asset_cost_centers: [] as IResource[],
      bulk_modules: [] as IResource[],
      provider_third_party: [] as IResource[],
      dependencies_options: [] as IResource[],
      amount_units: [] as IResource[],
      amount_units_filter: [] as IResource[],
      type_person: null as string | null,

      reference_center: [{ label: '', value: 1 }] as IResource[],
      role_type: [
        { label: 'Jefe', value: 1 },
        { label: 'Auxiliar', value: 2 },
      ] as IResource[],
      disabilities: [
        { label: 'SI', value: 'Si' },
        { label: 'NO', value: 'No' },
      ] as IResource[],
      vital_status: [
        { label: 'Vivo', value: 'Vivo' },
        { label: 'Muerto', value: 'Muerto' },
      ] as IResource[],
      gender: [] as IResource[],
      zones: [
        { label: 'Urbana', value: 'Urbana' },
        { label: 'Rural', value: 'Rural' },
        { label: 'Centro poblado', value: 'Centro poblado' },
      ] as IResource[],
      pagesHistory: {
        currentPage: 0,
        lastPage: 0,
      },
      required_health_plan: [
        { label: 'Si', value: 1 },
        { label: 'No', value: 2 },
      ] as IResource[],
      armor_levels: [
        { label: '0', value: 0 },
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
      ] as IResource[],
      status_depreciation: [
        { label: 'Todos', value: 'Todos' },
        { label: 'Reversado', value: 23 },
        { label: 'Procesado', value: 24 },
        { label: 'Pendiente', value: 25 },
      ] as IResource[],
      fuel_types: [
        { label: 'Gasolina', value: 'Gasolina' },
        { label: 'Diesel', value: 'Diesel' },
        { label: 'Gas', value: 'Gas' },
        { label: 'Eléctrico', value: 'Eléctrico' },
        { label: 'Híbrido', value: 'Híbrido' },
      ] as IResource[],
      insurance_types: [
        { label: 'SOAT', value: 'SOAT' },
        { label: 'Todo riesgo', value: 'Todo riesgo' },
        { label: 'Otros seguros', value: 'Otros seguros' },
      ] as IResource[],
      accident_status: [
        { label: 'En proceso', value: 26 },
        { label: 'Finalizado', value: 7 },
        { label: 'Rechazado', value: 10 },
      ] as IResource[],
      branch_type: [
        { label: 'Seccional', value: 'Seccional' },
        { label: 'Regional', value: 'Regional' },
      ] as IResource[],
      consumer_good_status: [
        { label: 'Todos', value: 0 },
        { label: 'Nuevo', value: 3 },
        { label: 'Reutilizable', value: 22 },
        { label: 'Regular', value: 18 },
        { label: 'Malo ', value: 19 },
      ] as IResource[],
      measure_units: [
        { label: 'KG', value: 'KG' },
        { label: 'G', value: 'G' },
        { label: 'L', value: 'L' },
        { label: 'ML', value: 'ML' },
        { label: 'M', value: 'M' },
        { label: 'CM', value: 'CM' },
        { label: 'UNIT', value: 'UNIT' },
        { label: 'BOX', value: 'BOX' },
      ],
      transaction_asset_types: [
        { label: 'Todos', value: 0 },
        { label: 'Activo fijo', value: 1 },
        { label: 'Bien de consumo', value: 2 },
      ] as IResource[],

      impairments_status: [
        { label: 'Todos', value: '' },
        { label: 'Activos', value: 1 },
        { label: 'Reversado', value: 23 },
      ] as IResource[],

      restringed_reversions_filter: [
        { label: 'Todos', value: 'Todos' },
        { label: 'Sí', value: 1 },
        { label: 'No', value: 0 },
      ] as IResource[],

      status_accounts_closure: [
        { label: 'Todos', value: 'Todos' },
        { label: 'Realizado', value: 37 },
        { label: 'Pendiente - Depreciación', value: 38 },
        { label: 'Reversado', value: 23 },
      ] as IResource[],

      closure_type: [
        { label: 'Cierre general', value: 'Cierre general' },
        { label: 'Cierre por grupo', value: 'Cierre por grupo' },
      ] as IResource[],

      adjustment_type: [
        { label: 'Error contable', value: 'Error contable' },
        { label: 'Provisión', value: 'Provisión' },
      ] as IResource[],

      options_boolean: [
        { label: 'SI', value: 'SI' },
        { label: 'NO', value: 'NO' },
      ],

      occupations: [
        { label: 'Abogado', value: 1 },
        { label: 'Médico', value: 2 },
        { label: 'Ingeniero Civil', value: 3 },
        { label: 'Ingeniero de Sistemas', value: 4 },
        { label: 'Contador Público', value: 5 },
        { label: 'Arquitecto', value: 6 },
        { label: 'Psicólogo', value: 7 },
        { label: 'Profesor', value: 8 },
        { label: 'Enfermero(a)', value: 9 },
        { label: 'Administrador de Empresas', value: 10 },
        { label: 'Diseñador Gráfico', value: 11 },
        { label: 'Periodista', value: 12 },
        { label: 'Cocinero(a)', value: 13 },
        { label: 'Farmacéutico(a)', value: 14 },
        { label: 'Abogado Laboral', value: 15 },
        { label: 'Economista', value: 16 },
        { label: 'Veterinario(a)', value: 17 },
        { label: 'Biologo(a)', value: 18 },
        { label: 'Ingeniero Industrial', value: 19 },
        { label: 'Contador Auditor', value: 20 },
        { label: 'Sociologo(a)', value: 21 },
        { label: 'Nutricionista', value: 22 },
        { label: 'Estilista', value: 23 },
        { label: 'Físico(a)', value: 24 },
        { label: 'Químico(a)', value: 25 },
        { label: 'Musicoterapeuta', value: 26 },
        { label: 'Técnico en Sistemas', value: 27 },
        { label: 'Logopeda', value: 28 },
        { label: 'Chef', value: 29 },
        { label: 'Traductor(a) e Intérprete', value: 30 },
      ],
      phone_number_types: [
        {
          value: 1,
          label: 'Fijo',
        },
        {
          value: 2,
          label: 'Celular',
        },
      ] as IResource[],
      user_types: [
        {
          value: 'interno',
          label: 'Interno',
        },
        {
          value: 'externo',
          label: 'Externo',
        },
      ] as IResource[],
      user_profile: [
        {
          value: 'Administrador',
          label: 'Administrador',
        },
        {
          value: 'Operador',
          label: 'Operador',
        },
        {
          value: 'Consulta',
          label: 'Consulta',
        },
      ] as IResource[],

      user_status: [
        {
          value: 1,
          label: 'Activo',
        },
        {
          value: 2,
          label: 'Inactivo',
        },
        {
          value: 52,
          label: 'Retirado',
        },
        {
          value: 53,
          label: 'Vacaciones',
        },
        {
          value: 3,
          label: 'Nuevo',
        },
        {
          value: 51,
          label: 'Bloqueado',
        },
        {
          value: 54,
          label: 'Directorio activo',
        },
      ] as IResource[],
    }
  },

  actions: {
    // ERP Fiscalía resources
    async getResources(keys: string) {
      await executeApi()
        .get(`${URL_PATH_RESOURCES}?${keys}`)
        .then((response) => {
          if (response.data.success) {
            // Usuarios
            if (response.data.data.users) {
              this.users = []
              this.users =
                response.data.data.users.map((user: ISelectorResources) => ({
                  ...user,
                  value: user.id,
                  label: user.name + ' ' + user.last_name,
                  status_id: user.status_id,
                })) || []
            }

            // Usuarios activos por módulo
            if (response.data.data.users_modules) {
              this.users_modules = []
              this.users_modules =
                response.data.data.users_modules.map(
                  (user: ISelectorResources) => ({
                    ...user,
                    value: user.id,
                    label: user.name + ' ' + user.last_name,
                    status_id: user.status_id,
                  })
                ) || []
            }

            // Centros de costos
            if (response.data.data.cost_centers) {
              this.cost_centers = []
              this.cost_centers =
                response.data.data.cost_centers.map(
                  (center: ISelectorResources) => ({
                    value: center.id,
                    label: center.name,
                    code: center.code,
                    status_id: center.status_id,
                    warehouses_count: center.warehouses_count,
                  })
                ) || []
            }

            // dependencies
            if (response.data.data.dependencies) {
              this.dependencies_options = []
              this.dependencies_options =
                response.data.data.dependencies.map(
                  (dependency: ISelectorResources) => ({
                    value: dependency.id,
                    label: dependency.name,
                  })
                ) || []
            }

            // Sedes
            if (response.data.data.branches) {
              this.branches =
                response.data.data.branches.map((branch: IBranchV2) => ({
                  value: branch.id,
                  label: branch.name,
                  status_id: branch.status_id,
                  type: branch.type,
                  parent_branch_id: branch.parent_branch_id,
                  child_branches: branch.child_branches,
                })) || []
            }

            // CIIUs
            if (response.data.data.ciius) {
              this.ciius =
                response.data.data.ciius.map((ciiu: ISelectorResources) => ({
                  value: ciiu.id,
                  label: `${ciiu.code} - ${ciiu.description}`,
                  code: ciiu.code,
                  description: ciiu.description,
                })) || []
            }

            // Paises
            if (response.data.data.countries) {
              this.countries =
                response.data.data.countries.map(
                  (country: ISelectorResources) => ({
                    value: country.id,
                    label: country.name?.toUpperCase(),
                    code: country.code,
                  })
                ) || []
            }

            // Departamentos
            if (response.data.data.departments) {
              this.departments =
                response.data.data.departments.map(
                  (department: ISelectorResources) => ({
                    value: department.id,
                    label: department.name,
                  })
                ) || []
            }

            // Document_types_third_party
            if (response.data.data.document_types_third_party) {
              this.document_types_third_party =
                response.data.data.document_types_third_party.map(
                  (document_types_third_party: ISelectorResources) => ({
                    value: document_types_third_party.id,
                    label:
                      document_types_third_party.abbreviation +
                      ': ' +
                      document_types_third_party.name,
                  })
                ) ?? []
            }

            // Roles inactive:
            if (response.data.data.role_inactive_options) {
              this.roles_inactive_options =
                response.data.data.role_inactive_options.map(
                  (roles: ISelectorResources) => ({
                    value: roles.id,
                    label: roles.option,
                  })
                ) ?? []
            }

            // Roles:
            if (response.data.data.roles) {
              this.roles =
                response.data.data.roles.map((roles: ISelectorResources) => ({
                  value: roles.id,
                  label: roles.name,
                  status_id: roles.status_id,
                })) ?? []
            }

            // Banks:
            if (response.data.data.banks) {
              this.banks =
                response.data.data.banks.map((banks: ISelectorResources) => ({
                  value: banks.id,
                  label: banks.description,
                  status_id: banks.status_id,
                })) ?? []
            }

            // Cities:
            if (response.data.data.cities) {
              this.cities =
                response.data.data.cities.map((cities: ISelectorResources) => ({
                  value: cities.id,
                  label: `${cities.code} - ${cities.name}`,
                  code: cities.code,
                  name: cities.name,
                })) ?? []
            }

            // Tipos de número de telefono
            if (true) {
              this.phone_number_types = [
                {
                  value: 1,
                  label: 'Fijo',
                },
                {
                  value: 2,
                  label: 'Celular',
                },
              ]
            }

            //// NATURE PERSON

            // Ocupations
            // if (true) {
            //   this.occupations = [
            //     { label: 'Empleado', value: '1' },
            //     { label: 'Desempleado con Ingresos', value: '2' },
            //     { label: 'Desempleado sin Ingresos', value: '3' },
            //     { label: 'Independiente', value: '4' },
            //     { label: 'Pensionado', value: '5' },
            //     { label: 'Rentista de Capital', value: '6' },
            //     { label: 'Subsidiado por Tercero', value: '7' },
            //   ]
            // }

            // // Correspondence
            // if (true) {
            //   this.correspondence = [
            //     { label: 'Email', value: '1' },
            //     { label: 'Correspondencia Física', value: '2' },
            //   ]
            // }

            // // Tipo de aplicacion
            // if (true) {
            //   this.applicant_type_nature_client = [
            //     { label: 'Fideicomitente', value: '1' },
            //     { label: 'Inversionista', value: '2' },
            //     { label: 'Beneficiario de Contrato', value: '3' },
            //     { label: 'Aportante en Negocio Fiduciario', value: '4' },
            //   ]
            // }

            // // Tipo de documentos
            // if (true) {
            //   this.document_types = [
            //     { label: 'CC', value: '1' },
            //     { label: 'CE', value: '2' },
            //     { label: 'Pasaporte', value: '3' },
            //     { label: 'NUIP (Registro Civil)', value: '4' },
            //     { label: 'Tarjeta de Identidad', value: '5' },
            //     { label: 'Pasaporte', value: '6' },
            //   ]
            // }

            // // Actividades economicas
            // if (true) {
            //   this.economic_activities = [{ label: 'Ejemplo 1', value: '1' }]
            // }

            // // Tipo de contribuyente
            // if (true) {
            //   this.request_types = [{ label: 'Ejemplo 1', value: '1' }]
            // }

            // if (true) {
            //   this.tins = [{ label: 'Ejemplo 1', value: '1' }]
            // }

            // if (true) {
            //   this.bankAccounts = [{ label: 'Ejemplo 1', value: '1' }]
            // }

            ////////////

            // Modules:
            if (response.data.data.module_app) {
              this.modules =
                response.data.data.module_app.map(
                  (modules: ISelectorResources) => ({
                    value: modules.description,
                    label: modules.description,
                  })
                ) ?? []
            }

            // Areas:
            if (response.data.data.areas) {
              this.areas =
                response.data.data.areas.map((area: ISelectorResources) => ({
                  label: area.name,
                  value: area.id,
                  status_id: area.status_id,
                })) ?? []
              this.areas_filter = [
                { label: 'Todos', value: 'Todos' },
                ...this.areas,
              ]
            }

            // Terceros:
            if (response.data.data.third_party) {
              this.third_party =
                response.data.data.third_party.map(
                  (third_party: ISelectorResources) => ({
                    value: third_party.id,
                    label: third_party.name ?? third_party.description,
                    status_id: third_party.status_id,
                    classification: third_party.third_party_classification,
                    code: third_party.code,
                  })
                ) ?? []

              // Con opción 'Todos' para el filtro:
              this.third_party_filter = [
                { value: 'Todos', label: 'Todos' },
                ...this.third_party,
              ]
            }

            // Authorization Level:
            if (response.data.data.authorization_level) {
              this.authorization_level =
                response.data.data.authorization_level.map((item: any) => ({
                  value: item.id,
                  label: item.description,
                })) ?? []
            }

            // Authentication methods:
            if (response.data.data.authentication_methods) {
              this.authentication_methods =
                response.data.data.authentication_methods.map(
                  (auth_method: ISelectorResources) => ({
                    value: auth_method.abbreviation,
                    label: auth_method.method,
                  })
                ) ?? []
            }

            // Grupos de activos
            if (response.data.data.asset_groups) {
              const assetGroups = response.data.data.asset_groups.map(
                (asset_group: ISelectorResources) => ({
                  value: asset_group.id,
                  label: asset_group.name,
                  description: asset_group.group_type?.type,
                  status_id: asset_group.status_id,
                  years: asset_group?.classification?.useful_life_in_years,
                  asset_group_role: asset_group?.asset_group_role?.role,
                  code: asset_group?.code,
                })
              )

              const assetGroupsOptions = [...assetGroups]

              const assetsGroupsFullOptions = [
                {
                  label: 'Todos',
                  value: 'todos',
                  status_id: 1,
                },
                ...assetGroups,
              ]

              this.asset_groups = assetsGroupsFullOptions
              this.current_active_group_role = Number(
                response.data.data.asset_groups[0].asset_group_role_id
              )
              this.asset_groups_options = this.asset_groups
              this.asset_groups_options = assetGroupsOptions
            }

            // Grupos de activos con activos asociados
            if (response.data.data.asset_groups_asset) {
              this.asset_groups_asset =
                response.data.data.asset_groups_asset.map(
                  (asset_group: ISelectorResources) => ({
                    value: asset_group.id,
                    label: asset_group.name,
                    status_id: asset_group.status_id,
                  })
                ) || []
            }

            // Grupos de activos con activos asociados
            if (response.data.data.assets_id) {
              this.assets_id =
                response.data.data.asset_groups_asset.map(
                  (asset_group: ISelectorResources) => ({
                    value: asset_group.id,
                    label: asset_group.name,
                    status_id: asset_group.status_id,
                  })
                ) || []
            }

            // Roles grupos de activos
            if (response.data.data.asset_group_roles) {
              this.asset_group_roles = response.data.data.asset_group_roles.map(
                (group_roles: ISelectorResources) => ({
                  value: group_roles.id,
                  label: group_roles.role,
                })
              )
              // Con opción 'Todos' para el filtro:
              this.asset_group_roles_filter = [
                { value: 'Todos', label: 'Todos' },
                ...this.asset_group_roles,
              ]
            }

            // Tipos de grupos de activos
            if (response.data.data.group_type) {
              this.group_type_assets_role = response.data.data.group_type.map(
                (group_type: ISelectorResources) => ({
                  value: group_type.id,
                  label: group_type.type,
                })
              )

              // Con opción 'Todos' para el filtro:
              this.group_type_filter_assets_role = [
                { value: 'Todos', label: 'Todos' },
                ...this.group_type_assets_role,
              ]

              this.group_type = this.group_type_assets_role.filter(
                (group_type) => group_type.value !== 3
              )
              // Con opción 'Todos' para el filtro:
              this.group_type_filter = [
                { value: 'Todos', label: 'Todos' },
                ...this.group_type,
              ]
            }

            // Clasificaciones
            if (response.data.data.classification) {
              this.classification = response.data.data.classification.map(
                (classification: ISelectorResources) => ({
                  value: classification.id,
                  label: classification.name,
                  status_id: classification.status_id,
                })
              )
              // Con opción 'Todos' para el filtro:
              this.classification_filter = [
                { value: 'Todos', label: 'Todos' },
                ...this.classification,
              ]
            }

            // Clase de activos
            if (response.data.data.asset_classes) {
              this.asset_classes = response.data.data.asset_classes.map(
                (assetClass: ISelectorResources) => ({
                  value: assetClass.id,
                  label: assetClass.name,
                  status_id: assetClass.status_id,
                  code: assetClass.code,
                })
              )

              this.asset_classes.unshift({
                label: 'Todos',
                value: 'todos',
                status_id: 1,
              })
            }

            // Tipos de entrada
            if (response.data.data.entry_types) {
              this.entry_types =
                response.data.data.entry_types.map(
                  (entry_type: ISelectorResources) => ({
                    value: entry_type.id,
                    label: entry_type.name,
                  })
                ) || []
            }

            // Artículos
            if (response.data.data.items) {
              this.items =
                response.data.data.items.map((item: ISelectorResources) => ({
                  value: item.id,
                  label: item.name,
                  status_id: item.status_id,
                  code: item.code,
                })) || []

              this.consumer_items =
                response.data.data.items.map((item: ISelectorResources) => ({
                  value: item.id,
                  label: item.code + ' ' + item.name,
                  status_id: item.status_id,
                })) || []
            }

            // Ubicaciones
            if (response.data.data.locations) {
              this.locations =
                response.data.data.locations.map(
                  (location: ISelectorResources) => ({
                    value: location.id,
                    label: location.name,
                    status_id: location.status_id,
                  })
                ) || []
              this.consumer_locations =
                response.data.data.locations.map(
                  (location: ISelectorResources) => ({
                    value: location.id,
                    label: location.code + ' ' + location.name,
                    status_id: location.status_id,
                  })
                ) || []
            }

            // Gestión de activos
            if (response.data.data.assets) {
              this.general_assets =
                response.data.data.assets.map((asset: ISelectorResources) => ({
                  value: asset.id,
                  label: asset.plate_code + ' - ' + asset.description,
                  status_id: asset.status_id,
                  plate_code: asset.plate_code,
                  description: asset.description,
                })) || []

              this.assets =
                response.data.data.assets.map((assetManagement: any) => ({
                  value: assetManagement.id,
                  label: assetManagement.item.name,
                  status_id: assetManagement.status_id,
                  ...assetManagement,
                })) || []
            }

            // Depreciación de activos
            if (response.data.data.assets_data) {
              // ! Variable para depreciación de activos:
              this.assets_depreciation =
                response.data.data.assets_data.map(
                  (asset: ISelectorResources) => ({
                    value: asset.id,
                    label: asset.description,
                    status_id: asset.status_id,
                    useful_life_in_years:
                      asset?.asset_group?.classification?.useful_life_in_years,
                    entry_date: asset?.entry_date,
                    adquisition_value: asset?.adquisition_value,
                  })
                ) || []

              this.general_assets =
                response.data.data.assets_data.map(
                  (asset: ISelectorResources) => ({
                    value: asset.id,
                    label: asset.plate_code + ' - ' + asset.description,
                    status_id: asset.status_id,
                    plate_code: asset.plate_code,
                    description: asset.description,
                  })
                ) || []
            }

            // Preguntas de seguridad
            if (response.data.data.security_questions) {
              this.security_questions =
                response.data.data.security_questions.map(
                  (sq: ISelectorResources) => ({
                    value: sq.id,
                    label: sq.question,
                  })
                )
            }

            // Plan de cuentas
            if (response.data.data.accounts_chart) {
              this.accounts_chart = response.data.data.accounts_chart.map(
                (ac: ISelectorResources) => ({
                  value: ac.id,
                  label: ac.code + ' ' + ac.name,
                  status_id: Number(ac.status_id),
                  nature: ac.nature,
                })
              )
            }

            // Tipos de transacciones
            if (response.data.data.transaction_types) {
              this.transaction_types =
                response.data.data.transaction_types.map(
                  (transaction_type: ISelectorResources) => ({
                    value: transaction_type.id,
                    label: transaction_type.name,
                    status_id: transaction_type.status_id,
                  })
                ) || []
            }
            // Aseguradoras
            if (response.data.data.insurer) {
              this.insurers = []
              this.insurers = response.data.data.insurer.map(
                (insure: ISelectorResources) => ({
                  value: insure.id,
                  label: insure.name,
                })
              )
            }

            // Tipos de bien
            if (response.data.data.asset_type) {
              this.asset_type = response.data.data.asset_type.map(
                (type: ISelectorResources) => ({
                  value: type.id,
                  label: type.name,
                })
              )
              this.asset_type.unshift({
                label: 'Todos',
                value: 0,
              })
            }

            // Consumos de bienes
            if (response.data.data.consumer_goods) {
              this.consumer_goods = response.data.data.consumer_goods.map(
                (consumer: ISelectorResources) => ({
                  value: consumer.id,
                  label: consumer?.item?.name,
                  status_id: consumer.status_id,
                })
              )
            }

            // Centros de costos de activos fijos
            if (response.data.data.asset_cost_centers) {
              this.asset_cost_centers =
                response.data.data.asset_cost_centers.map(
                  (cost_center: ISelectorResources) => ({
                    value: cost_center.id,
                    label: cost_center.name,
                    status_id: cost_center.status_id,
                    section_id: cost_center?.section_id,
                  })
                ) || []
            }

            // Import bulk modules:
            if (response.data.data.bulk_modules) {
              this.bulk_modules =
                response.data.data.bulk_modules.map(
                  (bulk_module: ISelectorResources) => ({
                    value: bulk_module.value,
                    label: bulk_module.name,
                  })
                ) || []
            }
            // Proveedores de terceros:
            if (response.data.data.provider_third_party) {
              this.provider_third_party =
                response.data.data.provider_third_party.map(
                  (provider_third_party: ISelectorResources) => ({
                    value: provider_third_party.id,
                    label: provider_third_party.name,
                    status_id: provider_third_party.status_id,
                    nit: provider_third_party?.nit,
                  })
                )
            }

            // Proveedores de terceros:
            if (response.data.data.units) {
              this.amount_units = response.data.data.units.map(
                (amount_units: ISelectorResources) => ({
                  value: amount_units.id,
                  label: amount_units.name,
                  status_id: amount_units.status_id,
                })
              )

              this.amount_units_filter = [
                { value: 'Todos', label: 'Todos' },
                ...this.amount_units,
              ]
            }

            // Bodegas:
            if (response.data.data.warehouses) {
              this.consumer_warehouses = response.data.data.warehouses.map(
                (wh: ISelectorResources) => ({
                  value: wh.id,
                  label: wh.description,
                  status_id: wh.status_id,
                })
              )

              this.consumer_warehouses_filter = [
                { value: 'Todos', label: 'Todos' },
                ...this.consumer_warehouses,
              ]
            }

            // Regionales:
            if (response.data.data.regionals) {
              this.regionals = response.data.data.regionals.map(
                (regional: ISelectorResources) => ({
                  value: regional.id,
                  label: regional.name,
                  status_id: regional.status_id,
                })
              )
            }

            // Seccionales:
            if (response.data.data.sectionals) {
              this.sectionals = response.data.data.sectionals.map(
                (sectional: ISelectorResources) => ({
                  value: sectional.id,
                  label: sectional.name,
                  status_id: sectional.status_id,
                })
              )
            }

            // Tipos de movimientos Erp:
            if (response.data.data.movement_types_erp) {
              this.movement_types_erp =
                response.data.data.movement_types_erp.map(
                  (movement_type: ISelectorResources) => ({
                    value: movement_type.id,
                    label: movement_type.name,
                  })
                )
            }

            // Retenciones:
            if (response.data.data.retentions) {
              this.retentions = response.data.data.retentions.map(
                (retention: ISelectorResources) => ({
                  value: retention.id,
                  label: `${retention.name} ${retention.code}`,
                  account_chart: retention.account_chart,
                  third_party: retention.third_party,
                  status_id: retention.status_id,
                  percentage: retention.percentage,
                  code: retention.code,
                  type: retention.type,
                })
              )
            }
            // Tipos de movimientos
            if (response.data.data.movement_types) {
              this.movement_types = response.data.data.movement_types.map(
                (movement_type: ISelectorResources) => ({
                  value: movement_type.id,
                  label: movement_type.name,
                })
              )

              this.movement_types.unshift({
                label: 'Todos',
                value: 0,
              })
            }

            // Periodos contables:
            if (response.data.data.accounting_period) {
              this.accounting_period = response.data.data.accounting_period.map(
                (ap: ISelectorResources) => ({
                  value: ap.id,
                  label: ap.name,
                  status_id: ap.status_id,
                  initial_date: ap.formatted_query_initial_date,
                  end_date: ap.formatted_query_end_date,
                })
              )
            }

            // Grupos de activos cierres contables:
            if (response.data.data.asset_groups) {
              this.asset_groups_accounting_closure =
                response.data.data.asset_groups.map(
                  (agac: ISelectorResources) => ({
                    value: agac.id,
                    label: agac.name,
                    status_id: agac.status_id,
                  })
                )
            }

            // origin bienes de consumo:
            if (response.data.data.origin) {
              this.consumer_origin = response.data.data.origin.map(
                (origin: ISelectorResources) => ({
                  value: origin,
                  label: origin,
                })
              )
            }

            // unidades de medida:
            if (response.data.data.unit_measurement) {
              this.unit_measurement = response.data.data.unit_measurement.map(
                (unit: ISelectorResources) => ({
                  value: unit.id,
                  label: unit.name,
                })
              )
              // Tipo de envios:
              if (response.data.data.dispatch_types) {
                this.dispatch_types = response.data.data.dispatch_types.map(
                  (dt: ISelectorResources) => ({
                    value: dt.id,
                    label: dt.type,
                  })
                )

                this.dispatch_types_filter = [
                  { value: 'Todos', label: 'Todos' },
                  ...this.dispatch_types,
                ]
              }
            }

            // Tipos de documentos USERS FIDU:
            if (response.data.data.document_types_user) {
              this.document_types_user =
                response.data.data.document_types_user.map(
                  (document_types_user: ISelectorResources) => ({
                    value: document_types_user.id,
                    label:
                      document_types_user.abbreviation +
                      ': ' +
                      document_types_user.name,
                  })
                ) ?? []
            }

            // Roles usuarios:
            if (response.data.data.roles) {
              this.user_roles =
                response.data.data.roles.map((roles: ISelectorResources) => ({
                  value: roles.id,
                  label: roles.name,
                  status_id: roles.status_id,
                })) ?? []
            }
          }
        })
        .catch((e) => {
          const error = e as IErrors
          showAlert(showCatchError(error), 'error')
        })
    },

    async _getDiagnosticsList(paginate: boolean = false) {
      this.diagnostics = []
      await executeApi()
        .get(`${URL_PATH_DIAGNOSTIC}?paginate=${paginate}`)
        .then((response) => {
          if (response.data.success) {
            if (response.data.data) {
              this.diagnostics =
                response.data.data.map((diagnostic: ISelectorResources) => ({
                  value: diagnostic.id,
                  label: `${diagnostic.code} - ${diagnostic.name}`,
                  name: diagnostic.name,
                  code: diagnostic.code,
                })) || []
            }
          }
        })
    },
    async _getProceduresList(paginate: boolean = false) {
      this.procedures = []
      await executeApi()
        .get(`${URL_PATH_PROCEDURES}?paginate=${paginate}`)
        .then((response) => {
          if (response.data.success) {
            if (response.data.data) {
              this.procedures =
                response.data.data.map((procedure: ISelectorResources) => ({
                  value: procedure.id,
                  label: `${procedure.code} - ${procedure.description}`,
                  description: procedure.description,
                  code: procedure.code,
                })) || []
            }
          }
        })
    },
    async _getMedicinesList(paginate: boolean = false) {
      this.medicines = []
      await executeApi()
        .get(`${URL_PATH_MEDICINES}?paginate=${paginate}`)
        .then((response) => {
          if (response.data.success) {
            if (response.data.data) {
              this.medicines =
                response.data.data.map((medicine: ISelectorResources) => ({
                  value: medicine.id,
                  label: `${medicine.code} - ${medicine.description}`,
                  description: medicine.description,
                  code: medicine.code,
                })) || []
            }
          }
        })
    },

    _setTypePerson(state: string | null) {
      this.type_person = null
      if (state) {
        this.type_person = state
      }
    },
  },
  persist: true,
})
