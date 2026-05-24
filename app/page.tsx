"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { useGeolocation } from "@/lib/useGeolocation";
import { useCloudSync } from "@/lib/useCloudSync";
import Header from "@/components/layout/Header";
import FamilyFilterBar from "@/components/layout/FamilyFilterBar";
import ViewToggle from "@/components/calendar/ViewToggle";
import AgendaView from "@/components/calendar/AgendaView";
import MonthView from "@/components/calendar/MonthView";
import FAB from "@/components/ui/FAB";
import AddEventModal from "@/components/modals/AddEventModal";
import EventDetailModal from "@/components/modals/EventDetailModal";
import type { CalendarEvent } from "@/types";

export default function CalendarPage() {
  const { currentView } = useStore();
  const location = useGeolocation();
  useCloudSync(); // handles auth detection + 15s polling

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [defaultDate, setDefaultDate] = useState<string | undefined>();

  function openAdd(dateStr?: string) {
    setDefaultDate(dateStr);
    setEditingEvent(null);
    setAddModalOpen(true);
  }

  function openEdit(event: CalendarEvent) {
    setSelectedEvent(null);
    setEditingEvent(event);
    setAddModalOpen(true);
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <ViewToggle />
      <FamilyFilterBar />

      {(currentView === "agenda" || currentView === "3day") && (
        <AgendaView onEventClick={setSelectedEvent} onAddEvent={(d) => openAdd(d)} location={location} />
      )}
      {currentView === "month" && (
        <MonthView onDayClick={(d) => openAdd(d)} />
      )}

      {/* FAB */}
      <FAB onClick={() => openAdd()} />

      {/* Add / Edit modal */}
      <AddEventModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        editEvent={editingEvent}
        defaultDate={defaultDate}
      />

      {/* Event detail modal */}
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onEdit={openEdit}
      />
    </div>
  );
}


