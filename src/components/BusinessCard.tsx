'use client';

import React, { useState } from 'react';
import { useEffect } from 'react';
import { Star } from 'lucide-react';
import Image from 'next/image';

import {
  Card,
  CardDescription,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { useRouter } from 'next/navigation';
import epicimg from './img/epicuriaimg.png';
import { replaceSpaceWithDash } from '@/lib/utils';
import BusinessCardStar from './ui/businesscardstar';
import toast, { Toaster } from "react-hot-toast";

interface Props {
  businessName: string,
  category: string,
  address: string,
  rating: number,
  description: string,
  businessID: number,
  reviewCount: number
}

export default function BusinessCard(props: Props) {
  const router = useRouter();
  const name = props.businessName;
  const starRating = props.rating;
  const desc = props.description;
  const businessID = props.businessID;
  const reviewCount = props.reviewCount;
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const checkLoginStatus = async () => {
    try {
      const res = await fetch('http://localhost:8080/user/check-login', {
        method: 'GET',
        credentials: 'include'
      });
      const isLogged = await res.json();

      if (isLogged) {
        router.push(`/review/${name}`);
      } else {
        router.push("/auth/signin");
        toast.error("Please sign in before making a review.");
      }
    } catch (error) {
      console.error("Error checking login status", error);
      setIsLoggedIn(false);
    }
  };

  const routePush = () => {
    router.push(`/dining/${replaceSpaceWithDash(props.category.toLowerCase())}/${props.businessName.toLowerCase()}/${businessID}`);
  }
  return (
    <Card className="w-[40vw] h-[20vh] flex flex-row p-4 gap-4 shadow-lg hover:shadow-2xl hover:scale-105">
      <div className='cursor-pointer' onClick={() => routePush()}>
        <Image src={epicimg} height={120} width={120} alt="epicuria image" className="rounded-md" />
      </div>
      <div className='flex items-center'>
        <div className='w-[27vw] h-full'>
          <CardTitle onClick={() => routePush()} className="cursor-pointer text-xl text-[#238dd3] hover:underline">{name}</CardTitle>
          <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => {
            const fillPercentage = Math.max(0, Math.min(100, (starRating - i) * 100));
            return (
              <BusinessCardStar
                fillPercentage={fillPercentage}
                key={i}
              />
            );
          })}
            <span className="text-gray-600 text-sm">{starRating.toFixed(1)} ({reviewCount} {reviewCount == 1 ? "Review" : "Reviews" })</span>
          </div>
          <CardDescription className="text-gray-500 text-sm mt">{desc}</CardDescription>
          <div className='flex flex-row items-end justify-end'>
            <Button className="mt-2 bg-[#238dd3] text-white rounded-md text-sm hover:bg-[#2375d3] hover:border-gray-500" onClick={() => checkLoginStatus()}>Leave Review</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
