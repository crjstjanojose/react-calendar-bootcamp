import Box from "@material-ui/core/Box";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { ICalendar } from "./backend";

interface ICalendarViewProps {
  calendars: ICalendar[];
  handleToggleCalendar: (indexSelected: number) => void;
  calendarsSelected: boolean[];
}

export function CalendarsView(props: ICalendarViewProps) {
  const { calendars, calendarsSelected, handleToggleCalendar } = props;
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
                onChange={() => handleToggleCalendar(index)}
              />
            }
            label={calendar.name}
          />
        </div>
      ))}
    </Box>
  );
}
