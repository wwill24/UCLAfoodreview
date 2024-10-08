'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { CircleUserRound, LogOut, UserRound } from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Shadcn Components
import { Button } from "@/components/ui/button";

import uclalogo from './img/uclalogo.png';
import toast, { Toaster } from "react-hot-toast";

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<String | null>(null);

  async function Logout() {
    try {
      const logoutReq = await fetch("http://localhost:8080/user/logout", {
        method: "POST", 
        headers: { 'Content-Type': 'application/json' }, 
        credentials: 'include'
      });

      if (logoutReq) {
        toast.success("Log out successful!");
        setIsLoggedIn(false);
        router.push("/");
      }
      else{
        
      }
    }
    catch (e){
      console.error(e);
      toast.error("Could not log out. Please try again!")
    }
  }

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await fetch('http://localhost:8080/user/check-login', {
          method: 'GET',
          credentials: 'include'
        });

        if (res.ok) {
          const isLogged = await res.json();
          setIsLoggedIn(isLogged);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking login status", error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    (async() => await getUsername())()
  }, []);

  async function getUsername() {
    try {
      const userIdReq = await fetch("http://localhost:8080/user/id", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      if (userIdReq.ok){
        const userId: number = await userIdReq.json();
        try {
          const usernameReq = await fetch(`http://localhost:8080/user/username/${userId}`);

          if (usernameReq.ok) {
              const username: String = await usernameReq.text();
              setUsername(username);
              console.log(username);
          }
        }
        catch (e) {
            console.error(e);
        }
      }
    }
    catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="flex flex-row items-center gap-4 bg-gray-50 px-6 py-4 shadow-md h-[var(--navBarHeight)]">
      <Link href="/">
        <Image
          src={uclalogo}
          alt="UCLA Bruins Logo"
          height={80}
          width={80}
          className="cursor-pointer"
        />
      </Link>
      <Button className="text-lg" variant="ghost" onClick={() => {router.push('/dining/dining-halls')}}>Dining Halls</Button>
      <Button className="text-lg" variant="ghost" onClick={() => {router.push('/dining/food-trucks')}}>Food Trucks</Button>
      <Button className="text-lg" variant="ghost" onClick={() => {router.push('/dining/restaurants')}}>Restaurants</Button>

      <div className='ml-auto'>
        {isLoggedIn ? (    
          <>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>
                    <CircleUserRound />
                  </AvatarFallback>
                </Avatar>  
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='cursor-pointer' onClick={() => router.push(`/profile/${username}`)}><UserRound className='mr-2'/>Profile</DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer' onClick={() => Logout()}><LogOut className='mr-2'/>Log Out</DropdownMenuItem> 
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <div>
              <Button variant="secondary" className="rounded-r-none" onClick={() => {router.push('/auth/signin')}}>Sign In</Button>
              <Button variant="default" className="rounded-l-none bg-[#007ec4] hover:bg-[#00a6ff]" onClick={() => {router.push('/auth/signup')}}>Sign Up</Button>
            </div>       
          </>
        )
      }
      </div>
      <Toaster position='bottom-right'/>
    </div>
  );
}
