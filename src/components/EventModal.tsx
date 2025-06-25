import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar as CalendarIcon, Palette, Repeat } from 'lucide-react';
import { Event } from '../types/Event';
import { formatDate } from '../utils/dateUtils';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<Event, 'id'>) => void;
  selectedDate: string;
  editingEvent?: Event;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  editingEvent,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    date: selectedDate,
    startTime: '09:00',
    duration: 60,
    color: '#3B82F6',
    type: 'one-day' as Event['type'],
    description: '',
    recurrence: {
      daysOfWeek: [] as number[],
      dayOfMonth: 1,
      dayAndMonth: { day: 1, month: 0 },
    },
  });

  const colorOptions = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Teal', value: '#14B8A6' },
    { name: 'Indigo', value: '#6366F1' },
  ];

  const weekDays = [
    { name: 'Sunday', value: 0 },
    { name: 'Monday', value: 1 },
    { name: 'Tuesday', value: 2 },
    { name: 'Wednesday', value: 3 },
    { name: 'Thursday', value: 4 },
    { name: 'Friday', value: 5 },
    { name: 'Saturday', value: 6 },
  ];

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title,
        date: editingEvent.date,
        startTime: editingEvent.startTime,
        duration: editingEvent.duration,
        color: editingEvent.color,
        type: editingEvent.type,
        description: editingEvent.description || '',
        recurrence: editingEvent.recurrence || {
          daysOfWeek: [],
          dayOfMonth: 1,
          dayAndMonth: { day: 1, month: 0 },
        },
      });
    } else {
      setFormData({
        title: '',
        date: selectedDate,
        startTime: '09:00',
        duration: 60,
        color: '#3B82F6',
        type: 'one-day',
        description: '',
        recurrence: {
          daysOfWeek: [],
          dayOfMonth: 1,
          dayAndMonth: { day: 1, month: 0 },
        },
      });
    }
  }, [selectedDate, editingEvent, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData: Omit<Event, 'id'> = {
      title: formData.title,
      date: formData.date,
      startTime: formData.startTime,
      duration: formData.duration,
      color: formData.color,
      type: formData.type,
      description: formData.description,
    };

    if (formData.type !== 'one-day') {
      eventData.recurrence = {};
      
      if (formData.type === 'weekly') {
        eventData.recurrence.daysOfWeek = formData.recurrence.daysOfWeek;
      } else if (formData.type === 'monthly') {
        eventData.recurrence.dayOfMonth = formData.recurrence.dayOfMonth;
      } else if (formData.type === 'yearly') {
        eventData.recurrence.dayAndMonth = formData.recurrence.dayAndMonth;
      }
    }

    onSave(eventData);
    onClose();
  };

  const handleWeekDayToggle = (day: number) => {
    const newDaysOfWeek = formData.recurrence.daysOfWeek.includes(day)
      ? formData.recurrence.daysOfWeek.filter(d => d !== day)
      : [...formData.recurrence.daysOfWeek, day];
    
    setFormData({
      ...formData,
      recurrence: {
        ...formData.recurrence,
        daysOfWeek: newDaysOfWeek,
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-50 transition-all duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {editingEvent ? 'Edit Event' : 'Create New Event'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Event Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
              placeholder="Enter event title"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <CalendarIcon className="w-4 h-4 inline mr-1" />
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
              required
            />
          </div>

          {/* Time and Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Start Time
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                min="15"
                step="15"
                required
              />
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Palette className="w-4 h-4 inline mr-1" />
              Color
            </label>
            <div className="grid grid-cols-8 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    formData.color === color.value
                      ? 'border-gray-400 dark:border-gray-300 scale-110'
                      : 'border-gray-200 dark:border-gray-600 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Repeat className="w-4 h-4 inline mr-1" />
              Event Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Event['type'] })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
            >
              <option value="one-day">One Day</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {/* Recurrence Options */}
          {formData.type === 'weekly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Days of Week
              </label>
              <div className="grid grid-cols-7 gap-1">
                {weekDays.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => handleWeekDayToggle(day.value)}
                    className={`px-2 py-1 text-xs rounded transition-colors duration-200 ${
                      formData.recurrence.daysOfWeek.includes(day.value)
                        ? 'bg-blue-500 dark:bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {day.name.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {formData.type === 'monthly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Day of Month
              </label>
              <input
                type="number"
                value={formData.recurrence.dayOfMonth}
                onChange={(e) => setFormData({
                  ...formData,
                  recurrence: {
                    ...formData.recurrence,
                    dayOfMonth: parseInt(e.target.value),
                  },
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                min="1"
                max="31"
                required
              />
            </div>
          )}

          {formData.type === 'yearly' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Day
                </label>
                <input
                  type="number"
                  value={formData.recurrence.dayAndMonth.day}
                  onChange={(e) => setFormData({
                    ...formData,
                    recurrence: {
                      ...formData.recurrence,
                      dayAndMonth: {
                        ...formData.recurrence.dayAndMonth,
                        day: parseInt(e.target.value),
                      },
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                  min="1"
                  max="31"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Month
                </label>
                <select
                  value={formData.recurrence.dayAndMonth.month}
                  onChange={(e) => setFormData({
                    ...formData,
                    recurrence: {
                      ...formData.recurrence,
                      dayAndMonth: {
                        ...formData.recurrence.dayAndMonth,
                        month: parseInt(e.target.value),
                      },
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                  required
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>
                      {new Date(0, i).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
              rows={3}
              placeholder="Add event description..."
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 font-medium"
            >
              {editingEvent ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;