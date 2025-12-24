import { notFound } from "next/navigation";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
import { IEvent } from "@/database";
import { getSimilarEvent } from "@/lib/actions/event.actions";
import EventCard from "@/components/EventCard";
import { cacheLife } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const booking = 10

// --- Sub-components ---
const EventDetailItem = ({ icon, alt, label }: { icon: string; alt: string; label: string; }) => (
    <div className="flex-row-gap-2 items-center">
        <Image src={icon} alt={alt} width={17} height={17} />
        <p>{label}</p>
    </div>
)

const EventAgenda = ({ agendaItems }: { agendaItems?: string[] }) => (
    <div className="agenda">
        <h2>Agenda</h2>
        <ul>
            {/* Fix: logical OR || ensures we map over an empty array if undefined */}
            {(agendaItems || []).map((item) => (
                <li key={item}>{item}</li>
            ))}
        </ul>
    </div>
)

const EventTags = ({ tags }: { tags?: string[] }) => (
    <div className="flex flex-row gap-1.5 flex-wrap">
        {/* Fix: Optional chaining or fallback */}
        {tags?.map((tag) => (
            <div className="pill" key={tag}>{tag}</div>
        ))}
    </div>
)



const EventDetails = async ({ params }: {params:Promise<string>}) => {
   'use cache'
    cacheLife('hours')
    // Fix: Destructure the slug from the resolved params object
    const  slug  = await params;
    
    let event;
    try {
        const request = await fetch(`${BASE_URL}/api/events/${slug}`);

        if (!request.ok) {
            if (request.status === 404) return notFound();
            throw new Error(`Failed to fetch event: ${request.statusText}`);
        }

        const response = await request.json();
        console.log(response)
        event = response.data;

        if (!event) return notFound();
        
    } catch (error) {
        console.error('Error fetching event:', error);
        // Note: You might want to return a custom error UI here instead of generic 404
        return notFound();
    }

    const similarEvent : IEvent[] = await getSimilarEvent(slug)
    const { description, image, overview, date, time, location, mode, agenda, audience, tags, organizer } = event;

    if (!description) return notFound();

    return (
        <section id="event" className="m-10">
            <div className="header">
                <h1>Event Description</h1>
                <p>{description}</p>
            </div>

            <div className="details">
                <div className="content">
                    {/* Ensure width/height matches aspect ratio or use fill={true} */}
                    <Image src={image} alt="Event Banner" width={800} height={400} className="banner" />

                    <section className="flex-col-gap-2">
                        <h2>Overview</h2>
                        <p>{overview}</p>
                    </section>

                    <section className="flex-col-gap-2">
                        <h2>Event Details</h2>
                        <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={date} />
                        <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
                        <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
                        <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
                        <EventDetailItem icon="/icons/audience.svg" alt="audience" label={audience} />
                    </section>

                    {/* Pass data safely */}
                    <EventAgenda agendaItems={agenda} />

                    <section className="flex-col-gap-2">
                        <h2>About the Organizer</h2>
                        <p>{organizer}</p>
                    </section>

                    {/* Pass data safely */}
                    <EventTags tags={tags} />
                </div>

                <aside className="booking">
                    <div className="signup-card">
                        <h2>Book Your Spot</h2>
                        {booking > 0 ? (
                            <p className="text-sm">Join {booking} people who have already booked thier seat</p>
                        ):(
                            <p className="text-sm">Be the first to book your sear !</p>
                        )}
                       <BookEvent eventId={event._id} slug={slug}/>
                    </div>
                </aside>
            </div>
            <div className="flex w-full flex-col gap-4 pt-20">
                        <h2>Similar Events</h2>
                        <div className="events">
                            {similarEvent.length > 0 && similarEvent.map((similarEvent:IEvent)=>(
                                <EventCard key={similarEvent.title} {...similarEvent} />
                            ))}
                        </div>
            </div>
        </section>
    )
}

export default EventDetails