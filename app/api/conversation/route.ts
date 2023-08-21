import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { Configuration , OpenAIApi } from "openai"
import { checkApiLimit , increaseApiLimits } from '@/lib/api_limit';

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
        const { messages } = body;


        if(!userId){

            return new NextResponse("Unathorized" , { status : 500 })

        }

        if(!messages){

            return new NextResponse("Message required" ,  { status : 400 })

        }


        const freeTrial = await checkApiLimit();

        if(!freeTrial){

            return new NextResponse("Free Trial expired" , {  status : 403 })

        }


        if(!openai){

            return new NextResponse("Open ai Api key is not configured" , { status : 500 })

        }


        const responce = await openai.createChatCompletion({
            model : "gpt-3.5-turbo",
            messages
        })

        await increaseApiLimits();


        return NextResponse.json(responce.data.choices[0].message)



    } catch(error){

        console.log("conversation error")

        return new NextResponse('internal error', { status :500 })
    }
    
}