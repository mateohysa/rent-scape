"use client"
import React from 'react'
import {motion} from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const ContainerVariants = {
    hidden: {opacity: 0},
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        }
    }
}

const ItemVariants = {
    hidden: {opacity: 0, y:20},
    visible: {opacity: 1, y:0}
}

const DiscoverSection = () => {
  return (
    <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{once: true, amount: 0.8}}
    variants={ContainerVariants}
    className="py-12 mb-16 bg-white"
    >
        <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
            <motion.div
            variants={ItemVariants}
            className="my-12 text-center"
            >
                <h2 className="text-3xl font-semibold leading-tight  text-gray-800">
                    Discover
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                    Find your dream rental today!
                </p>
                <p className="mt-2 text-gray-500 max-w-3xl mx-auto">
                    Searching for your dream rental? We've got you covered.
                </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:gap-12 xl:gap-16 gap-8 text-center">
                {[
                    {
                        imageSrc: "/landing-icon-wand.png",
                        title: "Search for properties",
                        description: "Browse through our wide range of properties and find the perfect match for your needs.",
                    },
                    {
                        imageSrc: "/landing-icon-calendar.png",
                        title: "Book your rental",
                        description: "Once you find the perfect rental, book it online with just a few clicks.",
                    },
                    {
                        imageSrc: "/landing-icon-heart.png",
                        title: "Enjoy your new home",
                        description: "Move in with confidence knowing that your rental is a perfect fit.",
                    }
                ].map((card, index)=>(
                    <motion.div key={index} variants={ItemVariants}>
                        <DiscoverCard {...card} />
                    </motion.div>
                ))}
                
            </div>
            
        </div>
    </motion.div>
  )
}

const DiscoverCard = ({
    imageSrc,
    title,
    description
}:{
    imageSrc: string;
    title: string;
    description: string;
}) => {
    return (
        <div className="px-4 py-12 shadow-lg rounded-lg bg-primary-50 md:h-72">
            <div className="bg-primary-700 p-[0.6rem] rounded-full mb-4 h-10 w-10 mx-auto">
                <Image
                src={imageSrc}
                alt={title}
                width={30}
                height={30}
                className="w-full h-full" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-800">
                {title}
            </h3>
            <p className="mb-2 text-base text-gray-500">
                {description}
            </p>
        </div>
    )
}

export default DiscoverSection