"use client"
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
export default function RegisterPage() {
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const handleRegiter=async()=>{
        try{
            const res=await fetch("http://localhost:5000/api/auth/register",{
                method:"POST",
                credentials:"include",
                body:JSON.stringify({name,email,password})
            })
            const data=await res.json()
            window.location.href="/login"
        }
        catch(e){
            console.log("error occured",e)
        }
    }
  return (
    <div className="min-h-screen w-full flex">
       
      <div className="w-1/2 bg-[#FF7A7A] text-white px-16 py-12 flex flex-col justify-between">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <div className="w-6 h-6 bg-white rounded-full" />
          StoreIt
        </div>

        <div>
          <h1 className="text-4xl font-bold leading-tight">
            Manage your files <br /> the best way
          </h1>
          <p className="mt-4 text-sm opacity-90 max-w-sm">
            Awesome, we’ve created the perfect place for you to store all your documents.
          </p>
        </div>

        <div className="relative w-full h-[280px]">
          <Image
            src="/assets/file.svg"
            alt="illustration"
            fill
            className="transition-all hover:rotate-2 hover:scale-105"
          />
        </div>
      </div>
 
      <div className="w-1/2 bg-white flex items-center justify-center">
        <div className="w-[400px]">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
            Create Account
          </h2>

          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            className="w-full mb-4 px-4 py-3 text-black rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FF7A7A] outline-none"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border text-black border-red-400 focus:ring-2 focus:ring-red-400 outline-none mb-4"
          /> <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border text-black border-red-400 focus:ring-2 focus:ring-red-400 outline-none"
          />
          <p className="text-xs text-red-400 mt-1">Invalid email</p>

          <button onClick={handleRegiter} className="w-full mt-6 py-3 rounded-full bg-[#FF7A7A] text-white font-medium hover:opacity-50 cursor-pointer transition">
            Create Account
          </button>

          <p className="text-sm text-center text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#FF7A7A] font-medium cursor-pointer hover:opacity-50">
              Login
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}
