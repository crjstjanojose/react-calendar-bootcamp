import Box from "@material-ui/core/Box";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { ICalendar } from "./backend";
import React from "react";
import { ICalendarScreenAction } from "./calendarScreenReducer";

interface ICalendarViewProps {
  calendars: ICalendar[];
  dispatch: React.Dispatch<ICalendarScreenAction>;
  calendarsSelected: boolean[];
}

export const CalendarsView = React.memo(function (props: ICalendarViewProps) {
  const { calendars, calendarsSelected } = props;
  return (
    <Box marginTop="32px">
      <h3>Agendas</h3>
      {calendars.map((calendar, index) => (
        <div key={calendar.id}>
          <FormControlLabel
            control={
              <Checkbox
                key={calendar.id}
                style={{ color: calendar.color }}
                checked={calendarsSelected[index]}
                onChange={() => props.dispatch({ type: "toggleCalendar", payload: index })}
              />
            }
            label={calendar.name}
          />
        </div>
      ))}
    </Box>
  );
});
