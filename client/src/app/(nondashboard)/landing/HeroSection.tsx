"use client"
import React from 'react'
import Image from 'next/image'
import {motion} from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const HeroSection = () => {
  return (
    <div className="relative h-screen w-full">
        <Image src="/landing-splash.jpg" 
        alt="Hero Background" 
        fill 
        className="object-cover object-center"
        priority />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <motion.div
            initial={{opacity: 0, y:20}}
            animate={{opacity: 1, y:0}}
            transition={{duration: 0.8}}
            className="absolute top-1/3 trasform -translate-x-1/2 -translate-y-1/2 text-center w-full"
        >
            <div className="max-w-4xl mx-auto px-16 sm:px-12">
                <h1 className="text-5xl font-bold text-white mb-4">
                    Explore handpicked rental listings that capture the spirit of Albania.
                </h1>
                <p className="text-xl text-white mb-8">
                    From vibrant city living to peaceful coastal retreats, discover the perfect place to call home.
                </p>
                <div className="flex justify-center">
                    <Input
                        type="text"
                        value="search query"
                        onChange={() => {}}
                        placeholder="Search by city, neighborhood, or address"
                        className="w-full max-w-lg rounded-none rounded-l-xl border-none bg-white h-12"
                        />
                        <Button 
                            onClick={() => {}}
                            className="bg-secondary-500 text-white rounded-none rounded-r-xl h-12 border-none hover:bg-secondary-600"

                        >Search</Button>
                </div>
            </div>
        </motion.div>
    </div>
  )
}

export default HeroSection