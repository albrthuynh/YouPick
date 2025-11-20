import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'

interface Event {
    id: string;
    title: string;
    date: Date;
    color: string;
}

interface Hangout {
    _id: string;
    hangoutName: string;
    finalDate?: string;
    finalTime?: string;
    finalActivity?: string;
}

export default function CalendarPage() {
    const { user, isAuthenticated } = useAuth0();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated || !user?.email) {
            setLoading(false);
            return;
        }

        const fetchHangouts = async () => {
            try {
                const response = await axios.get(`/api/user/hangouts/${user.email}`);
                
                if (response.data.success && response.data.finalizedHangouts) {
                    // Convert finalized hangouts to calendar events
                    const calendarEvents: Event[] = response.data.finalizedHangouts
                        .filter((hangout: Hangout) => hangout.finalDate) // Only include hangouts with a finalized date
                        .map((hangout: Hangout) => {
                            // Parse the date string (assuming format like "MM/DD/YYYY" or similar)
                            const dateString = hangout.finalDate || '';
                            const dateParts = dateString.split('/');
                            let eventDate: Date;
                            
                            if (dateParts.length === 3) {
                                // Assuming MM/DD/YYYY format
                                const month = parseInt(dateParts[0]) - 1; // Month is 0-indexed
                                const day = parseInt(dateParts[1]);
                                const year = parseInt(dateParts[2]);
                                eventDate = new Date(year, month, day);
                            } else {
                                // Fallback: try to parse the date directly
                                eventDate = new Date(dateString);
                            }

                            return {
                                id: hangout._id,
                                title: hangout.hangoutName,
                                date: eventDate,
                                color: 'bg-blue-500'
                            };
                        });
                    
                    setEvents(calendarEvents);
                } else {
                    setEvents([]);
                }
            } catch (err) {
                console.error("Error fetching hangouts for calendar:", err);
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHangouts();
    }, [isAuthenticated, user]);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek, year, month };
    };

    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const getEventsForDay = (day: number) => {
        return events.filter(event => {
            const eventDate = event.date;
            return eventDate.getDate() === day &&
                eventDate.getMonth() === month &&
                eventDate.getFullYear() === year;
        });
    };

    const isToday = (day: number) => {
        const today = new Date();
        return day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-foreground mb-2">
                        Please log in to view your calendar
                    </h2>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-foreground">
                        Loading your Calendar 
                    </h2>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-border/50 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-bold text-foreground">
                                {monthNames[month]} {year}
                            </h1>
                            <Button
                                onClick={goToToday}
                                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg"
                            >
                                Today
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={previousMonth}
                                className="bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-lg"
                            >
                                ←
                            </Button>
                            <Button
                                onClick={nextMonth}
                                className="bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-lg"
                            >
                                →
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg border border-border/50 overflow-hidden">
                    {/* Day Names Header */}
                    <div className="grid grid-cols-7 border-b border-border/30">
                        {dayNames.map((day) => (
                            <div
                                key={day}
                                className="p-4 text-center font-semibold text-muted-foreground border-r border-border/30 last:border-r-0"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7">
                        {/* Empty cells for days before month starts */}
                        {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                            <div
                                key={`day-${-(index + 1)}`}
                                className="min-h-[120px] bg-muted/20 border-r border-b border-border/30 last:border-r-0"
                            />
                        ))}

                        {/* Actual days of the month */}
                        {Array.from({ length: daysInMonth }).map((_, index) => {
                            const day = index + 1;
                            const dayEvents = getEventsForDay(day);
                            const today = isToday(day);

                            return (
                                <div
                                    key={day}
                                    className={`min-h-[120px] border-r border-b border-border/30 last:border-r-0 p-2 hover:bg-muted/30 transition-colors ${today ? 'bg-primary/5' : ''
                                        }`}
                                >
                                    <div
                                        className={`text-sm font-semibold mb-2 ${today
                                            ? 'w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center'
                                            : 'text-foreground'
                                            }`}
                                    >
                                        {day}
                                    </div>

                                    {/* Events for this day */}
                                    <div className="space-y-1">
                                        {dayEvents.map((event) => (
                                            <div
                                                key={event.id}
                                                className={`${event.color} text-white text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity`}
                                                title={event.title}
                                            >
                                                {event.title}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}