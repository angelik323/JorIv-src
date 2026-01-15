import { onBeforeMount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import html2pdf from 'html2pdf.js'

import fiduprevisoraLogo from '@/assets/images/fiduprevisora-logo.svg'

import { useGoToUrl, useMainLoader } from '@/composables'

import {
  IMarkedDay,
  IOffDays,
} from '@/interfaces/customs/agenda/CalendarEvents'

import { useConfigCalendarStore } from '@/stores/agenda/config-calendar'
import { useResourceStore } from '@/stores/resources-selects'
import { useLogin as useLoginStore } from '@/stores/login'

const useConfigCalendarView = () => {
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const { config_calendar_list } = storeToRefs(useConfigCalendarStore('v1'))
  const { year_list, month_list } = storeToRefs(useResourceStore('v1'))
  const { _getConfigCalendar } = useConfigCalendarStore('v1')
  const { loggedUser } = storeToRefs(useLoginStore())

  const offDays = ref<IOffDays[][]>(Array.from({ length: 12 }, () => []))
  const yearSelected = ref(new Date().getFullYear())

  const headerProperties = {
    title: 'Ver calendario',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Agenda y notificaciones',
      },
      {
        label: 'Configurar calendario',
        route: 'ConfigCalendarList',
      },
      {
        label: 'Ver calendario',
        route: 'ConfigCalendarView',
      },
    ],
  }

  const listAction = async () => {
    openMainLoader(true)

    await _getConfigCalendar({
      'filter[years]': yearSelected.value,
    })

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const buildCalendar = (markedDays: IMarkedDay[]) => {
    const months: IOffDays[][] = Array.from({ length: 12 }, () => [])

    for (const { marked_day, marking_reason, id } of markedDays) {
      const [year, month, day] = marked_day.split(/\D/).map(Number)
      const date = new Date(year, month - 1, day)

      const dayObject: IOffDays = {
        day: date.getDate(),
        isHoliday: !id,
        isMarkedDay: !!id,
        markingReason: marking_reason || '',
      }

      months[date.getMonth()].push(dayObject)
    }

    offDays.value = months
  }

  const downloadCalendar = () => {
    const container = document.querySelector(
      '.container-calendar-list'
    ) as HTMLElement
    if (!container) return

    const today = new Date()
    const formattedDate = today
      .toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      .replace(/\//g, '-')

    const user = loggedUser?.value?.user
    const generatedBy = `${user?.name ?? ''} ${user?.last_name ?? ''}`.trim()
    const year = yearSelected.value

    const headerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-family: 'Arial', sans-serif;
        background: #ffffff;
        padding: 20px 0;
        margin-bottom: 50px;
      ">
        <div style="display: flex; align-items: center;">
          <div
            style="
              background-color: #6e0032;
              color: white;
              font-weight: bold;
              font-size: 20px;
              padding: 12px 20px;
              margin-right: 20px;
              font-family: 'Georgia', serif;
              display: flex;
              align-items: center;
              gap: 10px;
            "
          >
            <img src="${fiduprevisoraLogo}" alt="Logo Fiduprevisora" style="height: 40px;" />
          </div>

          <div style="line-height: 1.3; font-size: 12px; color: #000;">
            <div style="font-weight: bold; font-size: 13px;">SOCIEDAD FIDUCIARIA LA PREVISORA</div>
            <div>Agenda y notificaciones</div>
            <div style="font-size: 11px; margin-top: 2px;">
              ${formattedDate} ${today
      .getHours()
      .toString()
      .padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}
              - Generado por ${generatedBy || '---'}
            </div>
          </div>
        </div>

        <div style="
          background-color: #f5f5f5;
          text-align: center;
          padding: 10px 30px;
          box-shadow: 0 0 2px rgba(0,0,0,0.1);
        ">
          <div style="font-weight: bold; font-size: 16px; color: #000;">Calendario con festivos</div>
          <div style="font-size: 14px; color: #000;">${year}</div>
        </div>
      </div>
    `

    const sidebarHTML = `
      <div style="
        position: absolute;
        top: 50%;
        left: -5px;
        transform: rotate(-90deg) translate(-50%, 0);
        transform-origin: left top;
        font-family: 'Arial', sans-serif;
        font-size: 14px;
        color: #000;
        opacity: 0.9;
        white-space: nowrap;
      ">
        Vigilado por la Superintendencia Financiera de Colombia — MIS_5_2_2_FR44(V9)
      </div>
    `

    const wrapper = document.createElement('div')
    wrapper.classList.add('pdf-wrapper')
    wrapper.innerHTML = sidebarHTML + headerHTML

    const calendarClone = container.cloneNode(true) as HTMLElement
    calendarClone.classList.add('pdf-calendar-grid')
    wrapper.appendChild(calendarClone)

    const offDaysWrapper = document.createElement('div')
    offDaysWrapper.classList.add('pdf-offdays')
    offDaysWrapper.style.marginTop = '20px'
    offDaysWrapper.style.fontSize = '12px'
    offDaysWrapper.innerHTML = `<strong>Días no laborables</strong><br>`

    offDays.value.forEach((monthDays: IOffDays[], monthIndex: number) => {
      monthDays.forEach((dayObj: IOffDays) => {
        if (dayObj.isMarkedDay) {
          const monthName = new Date(year, monthIndex).toLocaleString('es-ES', {
            month: 'long',
          })
          offDaysWrapper.innerHTML += `${dayObj.markingReason} ${(
            '0' + dayObj.day
          ).slice(-2)} ${monthName} ${year}<br>`
        }
      })
    })

    wrapper.appendChild(offDaysWrapper)
    document.body.appendChild(wrapper)

    html2pdf()
      .set({
        margin: 10,
        filename: `Calendario${year}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          windowWidth: 800,
        },
        jsPDF: {
          unit: 'pt',
          format: [1080, wrapper.scrollHeight + 40],
          orientation: 'portrait',
        },
      })
      .from(wrapper)
      .save()
      .then(() => {
        document.body.removeChild(wrapper)
      })
  }

  const handleGoToList = () => goToURL('ConfigCalendarList')

  watch(
    () => yearSelected.value,
    () => {
      listAction()
    }
  )

  watch(
    () => config_calendar_list.value,
    () => {
      buildCalendar(config_calendar_list.value)
    }
  )

  onBeforeMount(async () => listAction())

  return {
    offDays,
    year_list,
    month_list,
    yearSelected,
    handleGoToList,
    headerProperties,
    downloadCalendar,
  }
}

export default useConfigCalendarView
