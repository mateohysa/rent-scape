"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { fetchAuthSession } from "aws-amplify/auth";

const CallToActionSection = () => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    userRole: "",
    isLoading: true
  });
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await fetchAuthSession();
        const isLoggedIn = !!session.tokens;
        
        if (isLoggedIn && session.tokens) {
          const userRole = session.tokens.idToken?.payload["custom:role"] as string || "";
          setAuthState({
            isLoggedIn: true,
            userRole: userRole.toLowerCase(),
            isLoading: false
          });
        } else {
          setAuthState({
            isLoggedIn: false,
            userRole: "",
            isLoading: false
          });
        }
      } catch (error) {
        // User is not authenticated - this is an expected case
        setAuthState({
          isLoggedIn: false,
          userRole: "",
          isLoading: false
        });
      }
    };
    
    checkAuth();
  }, []);
  
  const { isLoggedIn, userRole, isLoading } = authState;
  const isManager = userRole === "manager";
  const isTenant = userRole === "tenant";

  return (
    <div className="relative py-24">
      <Image
        src="/landing-call-to-action.jpg"
        alt="Rentiful Search Section Background"
        fill
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative max-w-4xl xl:max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-12"
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 md:mr-10">
            <h2 className="text-2xl font-bold text-white">
              Find Your Dream Rental Property
            </h2>
          </div>
          <div>
            <p className="text-white mb-3">
              Discover a wide range of rental properties in your desired
              location.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              {/* Show Search button for tenants or not logged in users */}
              {(!isLoggedIn || isTenant) && (
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="inline-block text-primary-700 bg-white rounded-lg px-6 py-3 font-semibold hover:bg-primary-500 hover:text-primary-50"
                >
                  Search
                </button>
              )}
              
              {/* Show Sign Up button only for not logged in users */}
              {!isLoggedIn && (
                <Link
                  href="/signup"
                  className="inline-block text-white bg-secondary-500 rounded-lg px-6 py-3 font-semibold hover:bg-secondary-600"
                  scroll={false}
                >
                  Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CallToActionSection;