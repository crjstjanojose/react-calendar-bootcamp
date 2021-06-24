export interface ICalendar {
  id: number;
  name: string;
  color: string;
}

export interface IEditingEvent {
  id?: number;
  date: string;
  time?: string;
  desc: string;
  calendarId: number;
}
export interface IEvent extends IEditingEvent {
  id: number;
}

export function getCalendarsEndPoint(): Promise<ICalendar[]> {
  return fetch("http://localhost:8080/calendars").then(handleResponse);
}

export function getEventsEndPoint(from: string, to: string): Promise<IEvent[]> {
  return fetch(`http://localhost:8080/events?date_gte=${from}&date_lte=${to}&_sort=date,time`).then(
    handleResponse
  );
}

export function createEventEndPoint(event: IEditingEvent): Promise<IEvent> {
  return fetch(`http://localhost:8080/events`, {
    method: "POST",
    body: JSON.stringify(event),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(handleResponse);
}

export function updateEventEndPoint(event: IEditingEvent): Promise<IEvent> {
  return fetch(`http://localhost:8080/events/${event.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  }).then(handleResponse);
}

export function deleteEventEndPoint(eventId: number): Promise<void> {
  return fetch(`http://localhost:8080/events/${eventId}`, {
    method: "DELETE",
  }).then(handleResponse);
}

export function getUserEndPoint(): Promise<void> {
  return fetch(`http://localhost:8080/auth/user`, {
    method: "GET",
  }).then(handleResponse);
}

function handleResponse(response: Response) {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(response.statusText);
  }
}
