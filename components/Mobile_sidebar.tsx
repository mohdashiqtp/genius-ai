"use-client"
import { Button } from './ui/button'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import Sidebar from './Sidebar'
import { useState, useEffect } from 'react'
import { getApiLimitCounts } from '@/lib/api_limit'

export const MobileSidebar  =  async () => {

  const [isMounted, setIsMounted] = useState(false)

   const apiLimitCount = await getApiLimitCounts();


  

  useEffect(() => {

    setIsMounted(true)

  }, [])

  if (!isMounted) {
    return null;
  }


  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className="p-0">
        <Sidebar apiLimitCount={apiLimitCount} />
      </SheetContent>
    </Sheet>
  )
}