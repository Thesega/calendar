import React from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Event } from '../types/Event';
import { getCurrentWeekDates, formatTime, addDuration } from '../utils/dateUtils';

interface ProgramsProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

const Programs: React.FC<ProgramsProps> = ({ events, onEventClick }) => {
  const weekDates = getCurrentWeekDates();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getEventsForDate = (date: string): Event[] => {
    return events.filter(event => {
      if (event.date === date) return true;
      
      if (event.type === 'weekly' && event.recurrence?.daysOfWeek) {
        const eventDate = new Date(date);
        return event.recurrence.daysOfWeek.includes(eventDate.getDay());
      }
      
      if (event.type === 'monthly' && event.recurrence?.dayOfMonth) {
        const eventDate = new Date(date);
        return eventDate.getDate() === event.recurrence.dayOfMonth;
      }
      
      if (event.type === 'yearly' && event.recurrence?.dayAndMonth) {
        const eventDate = new Date(date);
        return eventDate.getDate() === event.recurrence.dayAndMonth.day &&
               eventDate.getMonth() === event.recurrence.dayAndMonth.month;
      }
      
      return false;
    }).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const weekEvents = weekDates.map((date, index) => ({
    date,
    dayName: dayNames[index],
    events: getEventsForDate(date),
  }));

  const totalEvents = weekEvents.reduce((total, day) => total + day.events.length, 0);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Current Week Programs</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {new Date(weekDates[0]).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {' '}
          {new Date(weekDates[6]).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{totalEvents} events this week</p>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {weekEvents.map((day) => (
          <div key={day.date} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <CalendarIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{day.dayName}</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {day.events.length} {day.events.length === 1 ? 'event' : 'events'}
              </span>
            </div>

            {day.events.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                <p className="text-sm">No events scheduled</p>
              </div>
            ) : (
              <div className="space-y-3">
                {day.events.map((event) => (
                  <div
                    key={`${event.id}-${day.date}`}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md dark:hover:shadow-lg transition-all duration-200 cursor-pointer group bg-white dark:bg-gray-800"
                    onClick={() => onEventClick(event)}
                    style={{ borderLeftColor: event.color, borderLeftWidth: '4px' }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: event.color }}
                          />
                          <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
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
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                            {event.duration} min
                          </span>
                        </div>

                        {event.description && (
                          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm line-clamp-2">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Programs;