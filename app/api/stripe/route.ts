import {  auth , currentUser } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import prismadb from '@/lib/prisma'
import { stripe } from '@/lib/stripe'



