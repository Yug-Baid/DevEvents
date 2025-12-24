import EventCard from "@/components/EventCard"
import ExploreBtn from "@/components/ExploreBtn"
import { IEvent } from "@/database"
import { events } from "@/lib/constants"
import { cacheLife } from "next/cache"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const Home = async () => {
  'use cache'
  cacheLife('hours')
  // const response = await fetch(`${BASE_URL}/api/events`)
  // const {events} = await response.json()

  return (
    <section>
      <h1 className="text-center mt-10">
        The Hub for every Dev  <br /> Event You can't miss 
      </h1>
      <p className="text-center mt-5">Hackathon, Meetups and Conferences, All in one place</p>
      <ExploreBtn/>
        <div className="my-20 space-y-7 mx-20">
          <h3>Featured Events</h3>

          <ul className="events">
            {events && events.length > 0 && events.map((event : IEvent)=>(
             <li style={{listStyle:"none"}} key={event.title}>
               <EventCard  {...event}/>
             </li>
            ))}
          </ul>
        </div>
    </section>

  )
}

export default Home