"use client"
import { Heading } from '@/components/Heading'
import { MessageSquare, VideoIcon } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from "zod"
import axios from "axios"
import { fromSchema } from './constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChatCompletionRequestMessage } from "openai"
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import {Empty} from '@/components/Empty'
import { Loader } from '@/components/Loader'
import { cn } from '@/lib/utils'
import { UserAvatar } from '@/components/User-avatar'
import { BotAvatar } from '@/components/Bot-avatar'

function VideoPage() {

  const router = useRouter();

  const [video, setVideo] = useState<string>();

  const form = useForm<z.infer<typeof fromSchema>>({
    resolver: zodResolver(fromSchema),
    defaultValues: {
      prompt: ""
    }
  })


  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof fromSchema>) => {
    try {

      setVideo(undefined)

      const responce = await axios.post('/api/video' , values)


      setVideo(responce.data[0])

      form.reset()



    } catch (error: any) {

      console.log(error)

    } finally {
      router.refresh();
    }
  }

  return (
    <div>
      <Heading title="Video Generation" description="Turn your Prompt into video" icon={VideoIcon} iconColor="text-orange-700" bgColor="bg-orange-700/10" />

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
                      placeholder="Clown Fish swimming around a cral reef"
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
            !video  && !isLoading && (
              <Empty label="No conversation started" />
            )
          }
          {
            !video && !isLoading && (
              <Empty label="No Videos Generated" />
            )
          }
         {
          video && (
            <video controls className='w-full aspect-video mt-8 rounded-lg border bg-black'>
              <source  src={video}/>
            </video>
          )
         }
        </div>


      </div>
    </div>
  )
}

export default VideoPage