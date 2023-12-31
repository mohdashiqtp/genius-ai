import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import Replicate from "replicate"



const replicate = new Replicate({

    auth: process.env.REPLICATE_API_TOKEN!
})

export async function POST(req: Request) {



    try{

        const { userId } = auth();
        const body = await req.json();
        const { prompt } = body;


        if(!userId){

            return new NextResponse("Unathorized" , { status : 500 })

        }

        if(!prompt){

            return new NextResponse("Prompt is required" ,  { status : 400 })

        }

        const responce = await replicate.run(
            "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
            {
              input: {
                prompt: prompt
              }
            }
          );



        return NextResponse.json(responce)



    } catch(error){

        console.log("video error")

        return new NextResponse('internal error', { status :500 })
    }
    
}