import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Event, CalendarDay } from '../types/Event';
import { 
  formatDate, 
  getWeekDays, 
  getMonthName, 
  getDaysInMonth, 
  getFirstDayOfMonth,
  isToday,
  formatTime,
  addDuration
} from '../utils/dateUtils';

interface CalendarProps {
  events: Event[];
  onDateClick: (date: string) => void;
  onEventClick: (event: Event) => void;
  selectedDate?: string;
}

const Calendar: React.FC<CalendarProps> = ({ 
  events, 
  onDateClick, 
  onEventClick, 
  selectedDate 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  
  // Get events for a specific date
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
    });
  };

  // Generate calendar days
  const generateCalendarDays = (): CalendarDay[] => {
    const days: CalendarDay[] = [];
    
    // Previous month's trailing days
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
    
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = formatDate(new Date(prevYear, prevMonth, day));
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isToday(date),
        events: getEventsForDate(date),
      });
    }
    
    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = formatDate(new Date(year, month, day));
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isToday(date),
        events: getEventsForDate(date),
      });
    }
    
    // Next month's leading days
    const totalDays = days.length;
    const remainingDays = 42 - totalDays; // 6 weeks * 7 days
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    
    for (let day = 1; day <= remainingDays; day++) {
      const date = formatDate(new Date(nextYear, nextMonth, day));
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isToday(date),
        events: getEventsForDate(date),
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = getWeekDays();

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(month - 1);
    } else {
      newDate.setMonth(month + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {getMonthName(month)} {year}
          </h2>
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Today
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Week Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="p-2 text-center">
              <span className="text-sm font-medium text-gray-500">{day}</span>
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`relative min-h-[120px] p-2 border border-gray-100 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
              } ${
                day.isToday ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              } ${
                selectedDate === day.date ? 'ring-2 ring-purple-500 bg-purple-50' : ''
              }`}
              onClick={() => onDateClick(day.date)}
            >
              {/* Date Number */}
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-medium ${
                  day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                } ${
                  day.isToday ? 'text-blue-700' : ''
                }`}>
                  {new Date(day.date).getDate()}
                </span>
                {day.isCurrentMonth && (
                  <Plus className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>

              {/* Events */}
              <div className="space-y-1">
                {day.events.slice(0, 3).map((event, eventIndex) => (
                  <div
                    key={`${event.id}-${eventIndex}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className={`px-2 py-1 rounded text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity truncate`}
                    style={{ 
                      backgroundColor: event.color + '20',
                      color: event.color,
                      border: `1px solid ${event.color}40`
                    }}
                  >
                    {formatTime(event.startTime)} {event.title}
                  </div>
                ))}
                {day.events.length > 3 && (
                  <div className="px-2 py-1 text-xs text-gray-500 font-medium">
                    +{day.events.length - 3} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;