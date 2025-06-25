import React from 'react';
import { X, Clock, Calendar as CalendarIcon, Repeat, Palette, Edit, Trash2 } from 'lucide-react';
import { Event } from '../types/Event';
import { formatTime, addDuration } from '../utils/dateUtils';

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({
  isOpen,
  onClose,
  event,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !event) return null;

  const getRecurrenceText = (event: Event): string => {
    if (event.type === 'one-day') return 'One-time event';
    if (event.type === 'weekly') {
      const days = event.recurrence?.daysOfWeek || [];
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return `Repeats weekly on ${days.map(d => dayNames[d]).join(', ')}`;
    }
    if (event.type === 'monthly') {
      return `Repeats monthly on day ${event.recurrence?.dayOfMonth}`;
    }
    if (event.type === 'yearly') {
      const { day, month } = event.recurrence?.dayAndMonth || { day: 1, month: 0 };
      const monthName = new Date(0, month).toLocaleString('default', { month: 'long' });
      return `Repeats yearly on ${monthName} ${day}`;
    }
    return 'Unknown recurrence';
  };

  const formatEventDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleEdit = () => {
    onEdit(event);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      onDelete(event.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-50 transition-all duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: event.color }}
            />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{event.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Date and Time */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 transition-colors duration-200">
            <div className="flex items-center space-x-3 mb-3">
              <CalendarIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">Date & Time</span>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700 dark:text-gray-300">{formatEventDate(event.date)}</p>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">
                  {formatTime(event.startTime)} - {formatTime(addDuration(event.startTime, event.duration))}
                </span>
                <span className="text-gray-500 dark:text-gray-400">({event.duration} minutes)</span>
              </div>
            </div>
          </div>

          {/* Recurrence */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 transition-colors duration-200">
            <div className="flex items-center space-x-3 mb-3">
              <Repeat className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">Recurrence</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">{getRecurrenceText(event)}</p>
          </div>

          {/* Color */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 transition-colors duration-200">
            <div className="flex items-center space-x-3 mb-3">
              <Palette className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">Color</span>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: event.color }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 font-mono">{event.color}</span>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 transition-colors duration-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white">Description</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{event.description}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleEdit}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 font-medium"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Event</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-200 font-medium"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Event</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;