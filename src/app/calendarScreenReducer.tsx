import { ICalendar, IEditingEvent, IEvent } from "./backend";

export interface ICalendarScreenState {
  calendars: ICalendar[];
  calendarsSelected: boolean[];
  events: IEvent[];
  editingEvent: IEditingEvent | null;
}

export type ICalendarScreenAction =
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
export function reducer(
  state: ICalendarScreenState,
  action: ICalendarScreenAction
): ICalendarScreenState {
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
