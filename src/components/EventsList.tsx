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
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-12 text-center border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <CalendarIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No events yet</h3>
        <p className="text-gray-500 dark:text-gray-400">Create your first event to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Events</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{events.length} events total</p>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {Object.entries(groupedEvents).map(([date, dateEvents]) => (
          <div key={date} className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CalendarIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
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
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md dark:hover:shadow-lg transition-all duration-200 cursor-pointer group bg-white dark:bg-gray-800"
                  onClick={() => onEventClick(event)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: event.color }}
                        />
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {event.title}
                        </h4>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
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
                        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                          {event.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditEvent(event);
                        }}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
                        title="Edit event"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteEvent(event.id);
                        }}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-200"
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