"use client"
import React from 'react'
import {motion} from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const ContainerVariants = {
    hidden: {opacity: 0, y:50},
    visible: {
        opacity: 1, y:0,
        transition: {
            duration: 0.5,
            staggerChildren: 0.2,
        }
    }
}

const ItemVariants = {
    hidden: {opacity: 0, y:20},
    visible: {opacity: 1, y:0}
}

const FeaturesSection = () => {
  return (
    <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{once: true}}
    variants={ContainerVariants}
    className="py-24 px-6 sm:px-8 lg:px-12 xl:px-16 bg-white"
    >
        <div className="max-w-4xl xl:max-w-6xl mx-auto">
            <motion.h2
            variants={ItemVariants}
            className="text-center text-3xl font-bol mb-12 w-full text-primary-700"
            >
                Quickly find the perfect rental for your needs!
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:gap-12 xl:gap-16 gap-8">
                {[0,1,2].map((index) =>(
                    <motion.div key={index} variants={ItemVariants}>
                        <FeatureCard 
                        imageSrc={`/landing-search${3 - index}.png`}
                        title={[
                                "Trustworthy and verified listings",
                                "Browse rental listings with ease",
                                "User-friendly interface for quick searches",
                                ][index]}
                        description={[
                            "Our platform ensures that all listings are thoroughly verified to maintain the highest standards of quality and authenticity.",
                            "Easily navigate through a wide range of rental properties, from apartments to houses and commercial spaces.",
                            "Quickly find the perfect rental by using our intuitive search filters and personalized recommendations.",
                        ][index]}
                        linkText={["Explore", "Search", "Discover"][index]} 
                        linkHref={["/explore", "/search", "/discover"][index]} 
                        />
                    </motion.div>
                ))}
            </div>
            
        </div>
    </motion.div>
  )
}

const FeatureCard = ({
    imageSrc,
    title,
    description,
    linkText,
    linkHref
}:{
    imageSrc: string;
    title: string;
    description: string;
    linkText: string;
    linkHref: string;
}) => {
    return (
        <div className=" text-center">
            <div className="p-4 rounded-lg mb-4 flex items-center justify-center h-48">
                <Image
                src={imageSrc}
                alt={title}
                width={400}
                height={400}
                className="w-full h-full object-contain" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
                {title}
            </h3>
            <p className="mb-4">
                {description}
            </p>
            <Link href={linkHref} 
            className="inline-block border border-gray-300 rounded px-4 py-2 hover:bg-gray-100"
            scroll={false}
            >
                {linkText}
            </Link>
        </div>
    )
}

export default FeaturesSection