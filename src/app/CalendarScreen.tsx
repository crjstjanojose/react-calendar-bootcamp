import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { useEffect, useState } from "react";
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

interface ICalendarScreen {
  onSignOut: () => void;
}

export function CalendarScreen(props: ICalendarScreen) {
  const { month } = useParams<{ month: string }>();
  const [editingEvent, setEditingEvent] = useState<IEditingEvent | null>(null);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [calendars, setCalendars] = useState<ICalendar[]>([]);
  const [calendarsSelected, setCalendarsSelected] = useState<boolean[]>([]);

  const weeks = generateCalendar(month + "-01", events, calendars, calendarsSelected);
  const firstDate = weeks[0][0].date;
  const lastDate = weeks[weeks.length - 1][6].date;

  useEffect(() => {
    Promise.all([getCalendarsEndPoint(), getEventsEndPoint(firstDate, lastDate)]).then(
      ([calendars, events]) => {
        setCalendarsSelected(calendars.map(() => true));
        setCalendars(calendars);
        setEvents(events);
      }
    );
  }, [firstDate, lastDate]);

  function handleToggleCalendar(index: number) {
    const selecteds = [...calendarsSelected];
    selecteds[index] = !selecteds[index];
    setCalendarsSelected(selecteds);
  }

  function openNewEvent(date: string) {
    setEditingEvent({
      date,
      desc: "",
      calendarId: calendars[0].id,
    });
  }

  function refeshEvents() {
    getEventsEndPoint(firstDate, lastDate).then(setEvents);
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
        <CalendarHeader month={month} onSignOut={props.onSignOut} />

        <Calendar weeks={weeks} onClickDay={openNewEvent} onClickEvent={setEditingEvent} />

        <EventFormDialog
          event={editingEvent}
          calendars={calendars}
          onCancel={() => setEditingEvent(null)}
          onSave={() => {
            setEditingEvent(null);
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
