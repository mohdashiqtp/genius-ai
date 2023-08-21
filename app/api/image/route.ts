import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { Configuration , OpenAIApi } from "openai"

const configuration = new Configuration({
    apiKey : process.env.OPENAI_API_KEY ,

})

const openai = new OpenAIApi(configuration);



// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
// });


export async function POST(req: Request) {

    try{

        const { userId } = auth();
        const body = await req.json();
        const { prompt , amount="1" , resolution="512x512" } = body;


        if(!userId){

            return new NextResponse("Unathorized" , { status : 500 })

        }

        if(!prompt){

            return new NextResponse("prompt required" ,  { status : 400 })

        }

        if(!amount){

            return new NextResponse("amount required" ,  { status : 400 })

        }

        if(!resolution){

            return new NextResponse("resolution required" ,  { status : 400 })

        }


        if(!openai){

            return new NextResponse("Open ai Api key is not configured" , { status : 500 })

        }


        const responce = await openai.createImage({
            prompt,
            n: parseInt(amount , 10),
            size : resolution
        })

        // const responce = await openai.chat.completions.create({
        //     model: "gpt-3.5-turbo",
        //     messages
        //   });


        //   console.log(responce)


        return NextResponse.json(responce.data.data)



    } catch(error){

        console.log("image error")

        return new NextResponse('internal error', { status :500 })
    }
    
}