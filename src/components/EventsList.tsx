import React from 'react';
import { Clock, Calendar as CalendarIcon, Repeat, Edit, Trash2 } from 'lucide-react';
import { Event } from '../types/Event';
import { formatTime, addDuration, formatDate } from '../utils/dateUtils';

interface EventsListProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
}

const EventsList: React.FC<EventsListProps> = ({
  events,
  onEventClick,
  onEditEvent,
  onDeleteEvent,
}) => {
  const getRecurrenceText = (event: Event): string => {
    if (event.type === 'one-day') return 'One-time';
    if (event.type === 'weekly') {
      const days = event.recurrence?.daysOfWeek || [];
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return `Weekly on ${days.map(d => dayNames[d]).join(', ')}`;
    }
    if (event.type === 'monthly') {
      return `Monthly on day ${event.recurrence?.dayOfMonth}`;
    }
    if (event.type === 'yearly') {
      const { day, month } = event.recurrence?.dayAndMonth || { day: 1, month: 0 };
      const monthName = new Date(0, month).toLocaleString('default', { month: 'long' });
      return `Yearly on ${monthName} ${day}`;
    }
    return 'Unknown';
  };

  const sortedEvents = [...events].sort((a, b) => {
    const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateCompare !== 0) return dateCompare;
    return a.startTime.localeCompare(b.startTime);
  });

  const groupedEvents = sortedEvents.reduce((acc, event) => {
    const date = event.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
        <p className="text-gray-500">Create your first event to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">All Events</h2>
        <p className="text-gray-600 mt-1">{events.length} events total</p>
      </div>

      <div className="divide-y divide-gray-200">
        {Object.entries(groupedEvents).map(([date, dateEvents]) => (
          <div key={date} className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>
            </div>

            <div className="space-y-3">
              {dateEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => onEventClick(event)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: event.color }}
                        />
                        <h4 className="text-lg font-semibold text-gray-900">
                          {event.title}
                        </h4>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {formatTime(event.startTime)} - {formatTime(addDuration(event.startTime, event.duration))}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Repeat className="w-4 h-4" />
                          <span>{getRecurrenceText(event)}</span>
                        </div>
                      </div>

                      {event.description && (
                        <p className="text-gray-600 mt-2 text-sm">
                          {event.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditEvent(event);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit event"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteEvent(event.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsList;