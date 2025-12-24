'use server'

import connectDB from '../mongodb';
import { Booking } from '@/database';

const createBooking = async ({eventId,slug,email}:{eventId:string;slug:string;email:string}) => {
  try {
    await connectDB();

  await Booking.create({eventId,slug,email})

    return {success:true};

  } catch (error) {
    console.log(error)
    return {success:false}
  }
}

export default createBooking