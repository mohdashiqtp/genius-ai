"use client"
import { Heading } from '@/components/Heading'
import { MessageSquare, Music } from 'lucide-react'
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

function MusicPage() {

  const router = useRouter();

  const [music, setMusic] = useState<string>()

  const form = useForm<z.infer<typeof fromSchema>>({
    resolver: zodResolver(fromSchema),
    defaultValues: {
      prompt: ""
    }
  })


  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof fromSchema>) => {
    try {

      setMusic(undefined)


      const responce = await axios.post('/api/music')


      setMusic(responce.data.audio)
      form.reset()



    } catch (error: any) {

      console.log(error)

    } finally {
      router.refresh();
    }
  }

  return (
    <div>
      <Heading title="Music Generation" description="Turn your prompt into Music" icon={Music} iconColor="text-emerald-500" bgColor="bg-emerald-500/10" />

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
                      placeholder="Piano Solo"
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
            !music && !isLoading && (
              <Empty label="No Music Generated" />
            )
          }
         {
          music && (
            <audio controls className='w-ful mt-8'>
              <source src={music} />
            </audio>
          )
         }
        </div>


      </div>
    </div>
  )
}

export default MusicPage