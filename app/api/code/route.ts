import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { Configuration , OpenAIApi , ChatCompletionRequestMessage } from 'openai'


const configuration = new Configuration({
    apiKey : process.env.OPENAI_API_KEY ,

})

const openai = new OpenAIApi(configuration);


const instructionMessage : ChatCompletionRequestMessage = {
    role : 'system' ,
    content : "You are a code generator . You must answer only in markdown snippets . Use code comment for explanations"
}

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


        if(!configuration.apiKey){

            return new NextResponse("Open ai Api key is not configured" , { status : 500 })

        }


        const responce = await openai.createChatCompletion({
            model : "gpt-3.5-turbo",
            messages : [instructionMessage , ...messages]
        })


        return NextResponse.json(responce.data.choices[0].message)



    } catch(error){

        console.log("code error")

        return new NextResponse('internal error', { status :500 })
    }
    
}