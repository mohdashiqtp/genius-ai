"use client"
import { Heading } from '@/components/Heading'
import { Code , Settings } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from "zod"
import axios from "axios"
import { fromSchema } from './constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChatCompletionRequestMessage }  from "openai"
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import {Empty} from '@/components/Empty'
import { Loader } from '@/components/Loader'
import { cn } from '@/lib/utils'
import { UserAvatar } from '@/components/User-avatar'
import { BotAvatar } from '@/components/Bot-avatar'
import ReactMarkdown from "react-markdown"

function CodePage() {

  const router = useRouter();

  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([])

  const form = useForm<z.infer<typeof fromSchema>>({
    resolver: zodResolver(fromSchema),
    defaultValues: {
      prompt: ""
    }
  })


  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof fromSchema>) => {
    try {

      const userMessage: ChatCompletionRequestMessage = {
        role: 'user',
        content: values.prompt,
      }


      const newMessages = [...messages, userMessage]


      const responce = await axios.post('/api/code', {
        messages: newMessages
      })


      setMessages((current) => [...current, userMessage, responce.data])


      form.reset()



    } catch (error: any) {

      console.log(error)

    } finally {
      router.refresh();
    }
  }

  return (
    <div>
      <Heading title="Code Generation" description="generated code using descriptivr text" icon={Code} iconColor="text-green-700" bgColor="bg-green-700/10" />

      <div className='px-4 lg:px-8'>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='rounded-lg w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2' >
              <FormField name='prompt' render={({ field }) => (
                <FormItem className='col-span-12 lg:col-span-10'>
                  <FormControl className='m-0 p-0'>
                    <Input
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      disabled={isLoading}
                      placeholder="simple toggle button using react js"
                      {...field}

                    />

                  </FormControl>
                </FormItem>
              )} />
              <Button className='col-span-12 lg:col-span-2 w-full' disabled={isLoading} >
                Generate
              </Button>
            </form>

          </Form>
        </div>
        <div className='space-y-4 mt-4'>
          {
            isLoading && (
              <div className='p-8 rounded-lg w-full flex items-center justify-center bg-muted'>

                <Loader />

              </div>
            )
          }
          {
            messages.length === 0 && !isLoading && (
              <Empty label="No Code Generated" />
            )
          }
          <div className='flex flex-col-reverse gap-y-4'>

            {messages.map((message) => (
              <div
                className={cn('p-8 w-full flex items-start gap-x-8 rounded-lg',
                  message.role === "user" ? "bg-white border border-black/10" : "bg-muted"
                )}
                key={message.content}>
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}

                <ReactMarkdown
                 components={{
                  pre : ({node ,  ...props}) => (
                    <div className='overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg'>

                      <pre {...props} />

                    </div>
                  ),
                  code : ({node , ...props}) => (
                    <code className='bg-black/10 rounded-lg p-1' {...props} />
                  )
                 }}
                 className="text-sm overflow-hidden leading-7"
                >
                  { message.content || "" }
                </ReactMarkdown>

              </div>
            ))}

          </div>
        </div>


      </div>
    </div>
  )
}

export default CodePage