import EventDetails from "@/components/EventDetails";
import { Suspense } from "react";

type Props = {
    params: Promise<{ slug: string }>;
};

const EventDetailsPage = async ({ params }: Props) => {
   const slug = params.then((p)=>p.slug)
   return(
    <main>
    <Suspense fallback={<div>Loading...</div>}>
        <EventDetails params={slug}/>
    </Suspense>
    </main>
   )
}

export default EventDetailsPage;