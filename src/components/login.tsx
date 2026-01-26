"use client"
import Image from "next/image";
import { stringify } from "querystring";
import { useState } from "react";
export default function LoginPage() {
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const handleLogin=async()=>{
        try{
            const res=await fetch("http://localhost:5000/api/auth/login",{
                method:"POST",
                headers:{
                  "Content-Type": "application/json", 
              
                },
                body:JSON.stringify({email,password})
            })
            const data = await res.json();

if (!res.ok) {
  alert(data.message || "Login failed");
  return;
}

localStorage.setItem("token", data.token);
window.location.href = "/dashboard";
        }
        catch(e){
            console.log("error",e)
        }
    }
  return (
    <div className="min-h-screen w-full flex">
      
      {/* LEFT SIDE */}
      <div className="w-1/2 bg-[#FF7A7A] text-white px-16 py-12 flex flex-col justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2 text-xl font-semibold">
          <div className="w-6 h-6 bg-white rounded-full" />
          StoreIt
        </div>

        {/* Content */}
        <div>
          <h1 className="text-4xl font-bold leading-tight">
            Manage your files <br /> the best way
          </h1>
          <p className="mt-4 text-sm opacity-90 max-w-sm">
            Awesome, we’ve created the perfect place for you to store all your documents.
          </p>
        </div>

        {/* Illustration */}
        <div className="relative w-full h-[280px]">
          <Image
            src="/assets/file.svg" // 🔁 your image here
            alt="File management illustration"
            fill
            className="transition-all hover:rotate-2 hover:scale-105"
            priority
          />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 bg-white flex items-center justify-center">
        <div className="w-[380px]">
          
          <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
            Login
          </h2>

          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full px-4 py-3 text-black rounded-lg border border-gray-200 focus:outline-none mb-4 focus:ring-2 focus:ring-[#FF7A7A]"
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full px-4 py-3 text-black rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A7A]"
          />

          <button onClick={handleLogin} className="w-full mt-6 py-3 rounded-full bg-[#FF7A7A] text-white font-medium hover:opacity-50 transition cursor-pointer">
            Login
          </button>

          <p className="text-sm text-center text-gray-500 mt-6">
            Don’t have an account?{" "}
            <span className="text-[#FF7A7A] cursor-pointer font-medium hover:opacity-50">
              Create Account
            </span>
          </p>

        </div>
      </div>

    </div>
  );
}
