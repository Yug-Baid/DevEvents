'use client'
import createBooking from "@/lib/actions/booking.actions";
import posthog from "posthog-js";
import { useState } from "react"

const BookEvent = ({eventId,slug}:{eventId:string;slug:string}) => {
    const [email,setEmail] = useState('');
    const [submitted,setSubmitted] = useState(false)

    const handleSubmit = async (e : React.FormEvent)=>{
        e.preventDefault()
        const {success} = await createBooking({eventId,slug,email})
        if(success){
            setSubmitted(true)
            posthog.capture('event-booked',{eventId,slug,email})
        }else{
            console.log("Submission Faile")
            posthog.captureException("Submission Failed")
        }
    }
  return (
    <div id='book-event'>
        {submitted ? (
            <p className='text-sm'>Thanks for signing up !</p>
        ) : (
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="text" id='email' onChange={(e) => setEmail(e.target.value)} value={email} placeholder='Enter your Email' />

                </div>
                <button className='button-submit' type='submit'>Submit</button>
            </form>
        )}
    </div>
  )
}

export default BookEvent