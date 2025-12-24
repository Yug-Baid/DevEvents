import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { resolve } from "path";
import {v2 as cloudinary} from 'cloudinary'

/**
 * Create a new event from multipart form data and upload the provided image to Cloudinary.
 *
 * Expects a multipart/form-data request with:
 * - `image`: file to upload (required)
 * - `tags`: JSON string representing tags
 * - `agenda`: JSON string representing agenda
 * - other event fields as form fields
 *
 * @param req - NextRequest containing the multipart form data
 * @returns JSON response object. On success (201) contains `message: "Event created Successfully"` and `event` with the created document. Returns 400 for invalid JSON format or missing image with an explanatory `message`. Returns 500 on other failures with `message: "Event Creation fail"` and an `error` string when available.
 */
export async function POST(req:NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData()
        let event;

        try {
            event = Object.fromEntries(formData.entries())
        } catch (error) {
            return NextResponse.json({message:"Invalid JSON format"},{status:400})
        }


        const file = formData.get('image') as File;

        if(!file) return NextResponse.json({message:'Image file required'},{status:400});

        let tags = JSON.parse(formData.get('tags') as string);
        let agenda = JSON.parse(formData.get('agenda') as string);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer)

        const uploadResult = await new Promise((resolve,reject)=>{
            cloudinary.uploader.upload_stream({resource_type:'image',folder:'DevEvents'},(error,results) => {
                if(error) return reject(error)

                    resolve(results)
            }).end(buffer)
        })

        event.image = (uploadResult as {secure_url:string}).secure_url;

        const creatEvent = await Event.create({
            ...event,
            tags:tags,
            agenda:agenda,
        })

        return NextResponse.json({message:"Event created Successfully",event:creatEvent},{status:201})

    } catch (e) {
        return NextResponse.json({message:"Event Creation fail"  ,error: e instanceof Error ? e.message : "Unknown"},{status:500})
    }
}

/**
 * Retrieve all events sorted by newest first.
 *
 * @returns A NextResponse whose JSON body is:
 * - on success (status 200): { message: "Events Fetched Succesfully", events: Event[] }
 * - on failure (status 500): { message: "Event fetching failed" }
 */
export async function GET(){
    try {
        await connectDB()

        const events = await Event.find().sort({createdAt:-1});

        return NextResponse.json({message:"Events Fetched Succesfully",events},{status:200})
    } catch (e) {
        return NextResponse.json({message:'Event fetching failed'},{status:500})
    }
}