import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Sidebar from './components/Sidebar';
import Calendar from './components/Calendar';
import EventsList from './components/EventsList';
import Programs from './components/Programs';
import EventModal from './components/EventModal';
import EventDetailModal from './components/EventDetailModal';
import { Event } from './types/Event';
import { formatDate } from './utils/dateUtils';
import MobileTopbar from './components/MobileTopbar';
import { SidebarClose } from 'lucide-react';

function App() {
  const [activeView, setActiveView] = useState<'home' | 'events' | 'programs'>('home');
  const [events, setEvents] = useState<Event[]>([]);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isEventDetailModalOpen, setIsEventDetailModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Initialize with sample events
  useEffect(() => {
    const today = new Date();
    const sampleEvents: Event[] = [
      {
        id: '1',
        title: 'Meeting1',
        date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)),
        startTime: '15:00',
        duration: 60,
        color: '#3B82F6',
        type: 'weekly',
        recurrence: {
          daysOfWeek: [1, 4], // Monday and Thursday
        },
        description: 'Weekly team meeting to discuss project progress and upcoming tasks.',
      },
      {
        id: '2',
        title: 'Movies on Saturday',
        date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3)),
        startTime: '19:00',
        duration: 180,
        color: '#8B5CF6',
        type: 'weekly',
        recurrence: {
          daysOfWeek: [6], // Saturday
        },
        description: 'Weekly movie night with friends and family.',
      },
    ];
    setEvents(sampleEvents);
  }, []);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEventDetailModalOpen(true);
  };

  const handleSaveEvent = (eventData: Omit<Event, 'id'>) => {
    if (editingEvent) {
      // Update existing event
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === editingEvent.id
            ? { ...eventData, id: editingEvent.id }
            : event
        )
      );
    } else {
      // Create new event
      const newEvent: Event = {
        ...eventData,
        id: Date.now().toString(),
      };
      setEvents(prevEvents => [...prevEvents, newEvent]);
    }
    setEditingEvent(null);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setSelectedDate(event.date);
    setIsEventModalOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
  };

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return (
          <Calendar
            events={events}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
            selectedDate={selectedDate}
          />
        );
      case 'events':
        return (
          <EventsList
            events={events}
            onEventClick={handleEventClick}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        );
      case 'programs':
        return (
          <Programs
            events={events}
            onEventClick={handleEventClick}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
  {/* Sidebar - only visible on md and up */}
  <div className="hidden md:block">
    <Sidebar activeView={activeView} onViewChange={setActiveView} />
  </div>

  {/* Main area */}
  <div className="flex-1 flex flex-col">
    {/* Topbar - only visible on small screens */}
    <div className="block md:hidden">
      <MobileTopbar activeView={activeView} onViewChange={setActiveView} />
    </div>

    {/* Main content */}
    <main className="flex-1 overflow-auto p-6">
      <div className="max-w-7xl mx-auto">{renderContent()}</div>
    </main>
  </div>

  {/* Modals */}
  <EventModal
    isOpen={isEventModalOpen}
    onClose={() => {
      setIsEventModalOpen(false);
      setEditingEvent(null);
    }}
    onSave={handleSaveEvent}
    selectedDate={selectedDate}
    editingEvent={editingEvent}
  />

  <EventDetailModal
    isOpen={isEventDetailModalOpen}
    onClose={() => {
      setIsEventDetailModalOpen(false);
      setSelectedEvent(null);
    }}
    event={selectedEvent}
    onEdit={handleEditEvent}
    onDelete={handleDeleteEvent}
  />
</div>

    </ThemeProvider>
  );
}

export default App;