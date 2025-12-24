'use client'
import { useState } from "react"

const BookEvent = () => {
    const [email,setEmail] = useState('');
    const [submitted,setSubmitted] = useState(false)

    const handleSubmit = (e : React.FormEvent)=>{
        e.preventDefault();

        setTimeout(() => {
            setSubmitted(true);
        }, 1000);

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