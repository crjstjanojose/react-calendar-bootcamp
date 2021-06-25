import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { useEffect, useCallback, useMemo, useReducer } from "react";
import {
  getCalendarsEndPoint,
  getEventsEndPoint,
  ICalendar,
  IEvent,
  IEditingEvent,
} from "./backend";
import { useParams } from "react-router-dom";
import { CalendarsView } from "./CalendarsView";
import { CalendarHeader } from "./CalendarHeader";
import { EventFormDialog } from "./EventFormDialog";
import { Calendar, ICalendarCell, IEventWithCalendar } from "./Calendar";
import { getToday } from "./dateFunctions";

interface ICalendarScreenState {
  calendars: ICalendar[];
  calendarsSelected: boolean[];
  events: IEvent[];
  editingEvent: IEditingEvent | null;
}

type ICalendarScreenAction =
  | {
      type: "load";
      payload: {
        events: IEvent[];
        calendars?: ICalendar[];
      };
    }
  | {
      type: "edit";
      payload: IEvent;
    }
  | {
      type: "closeDialog";
    }
  | {
      type: "new";
      payload: string;
    }
  | {
      type: "toggleCalendar";
      payload: number;
    };

// state nosso estado inicial
// objeto que representa uma acao -> action vai ter um type e pode ter um payload associado a esta acão
function reducer(state: ICalendarScreenState, action: ICalendarScreenAction): ICalendarScreenState {
  switch (action.type) {
    case "load":
      const calendars = action.payload.calendars ?? state.calendars;
      const calendarsSelected = action.payload.calendars
        ? action.payload.calendars.map(() => true)
        : state.calendarsSelected;
      return {
        ...state,
        events: action.payload.events,
        calendars,
        calendarsSelected,
      };
    case "edit":
      return { ...state, editingEvent: action.payload };
    case "closeDialog":
      return { ...state, editingEvent: null };
    case "new":
      return {
        ...state,
        editingEvent: {
          date: action.payload,
          desc: "",
          calendarId: state.calendars[0].id,
        },
      };
    case "toggleCalendar":
      const newValue = [...state.calendarsSelected];
      newValue[action.payload] = !newValue[action.payload];
      return { ...state, calendarsSelected: newValue };
    default:
      return state;
  }
}

export function CalendarScreen() {
  const { month } = useParams<{ month: string }>();

  // segundo parâmetro é o estado inicial que vai ser definido no objeto ICalendarScreenState
  const [state, dispatch] = useReducer(reducer, {
    calendars: [],
    calendarsSelected: [],
    events: [],
    editingEvent: null,
  });

  const { events, calendars, calendarsSelected, editingEvent } = state;

  const weeks = useMemo(() => {
    return generateCalendar(month + "-01", events, calendars, calendarsSelected);
  }, [month, events, calendars, calendarsSelected]);

  const firstDate = weeks[0][0].date;
  const lastDate = weeks[weeks.length - 1][6].date;

  useEffect(() => {
    Promise.all([getCalendarsEndPoint(), getEventsEndPoint(firstDate, lastDate)]).then(
      ([calendars, events]) => {
        dispatch({ type: "load", payload: { events, calendars } });
      }
    );
  }, [firstDate, lastDate]);

  const handleToggleCalendar = useCallback((index: number) => {
    dispatch({ type: "toggleCalendar", payload: index });
  }, []);

  const openNewEvent = useCallback((date: string) => {
    dispatch({ type: "new", payload: date });
  }, []);

  const closeDialog = useCallback(() => {
    dispatch({ type: "closeDialog" });
  }, []);

  const editEvent = useCallback((event: IEvent) => {
    dispatch({ type: "edit", payload: event });
  }, []);

  function refeshEvents() {
    getEventsEndPoint(firstDate, lastDate).then((events) => {
      dispatch({ type: "load", payload: { events } });
    });
  }

  return (
    <Box display="flex" height="100%" alignItems="stretch">
      <Box borderRight="1px solid rgb(224,224,224)" width="14em" padding="8px 16px">
        <h2>Agenda React</h2>
        <Button variant="contained" color="primary" onClick={() => openNewEvent(getToday())}>
          Criar Evento
        </Button>

        <CalendarsView
          calendars={calendars}
          handleToggleCalendar={handleToggleCalendar}
          calendarsSelected={calendarsSelected}
        ></CalendarsView>
      </Box>

      <Box display="flex" flexDirection="column" flex="1">
        <CalendarHeader month={month} />

        <Calendar weeks={weeks} onClickDay={openNewEvent} onClickEvent={editEvent} />

        <EventFormDialog
          event={editingEvent}
          calendars={calendars}
          onCancel={closeDialog}
          onSave={() => {
            closeDialog();
            refeshEvents();
          }}
        />
      </Box>
    </Box>
  );
}

function generateCalendar(
  date: string,
  allEvents: IEvent[],
  calendars: ICalendar[],
  calendarsSelected: boolean[]
): ICalendarCell[][] {
  const weeks: ICalendarCell[][] = [];
  const jsDate = new Date(date + "T12:00:00");
  const currentMonth = jsDate.getMonth();

  const currentDay = new Date(jsDate.valueOf());
  currentDay.setDate(1);
  const dayOfWeek = currentDay.getDay();
  currentDay.setDate(1 - dayOfWeek);

  do {
    const week: ICalendarCell[] = [];

    for (let i = 0; i < 7; i++) {
      const formatDay = currentDay.getDate().toString().padStart(2, "0");
      const formatMonth = (currentDay.getMonth() + 1).toString().padStart(2, "0");
      const isoDate = `${currentDay.getFullYear()}-${formatMonth}-${formatDay}`;

      const events: IEventWithCalendar[] = [];

      for (const event of allEvents) {
        if (event.date === isoDate) {
          const calendarIndex = calendars.findIndex((calendar) => calendar.id === event.calendarId);
          if (calendarsSelected[calendarIndex]) {
            events.push({ ...event, calendar: calendars[calendarIndex] });
          }
        }
      }

      week.push({
        dayOfMonth: currentDay.getDate(),
        date: isoDate,
        events,
      });
      currentDay.setDate(currentDay.getDate() + 1);
    }

    weeks.push(week);
  } while (currentDay.getMonth() === currentMonth);

  return weeks;
}
