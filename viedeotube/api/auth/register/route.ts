import { connectToDatabase } from "@/models/lib/db"
import User from "@/models/User"
import { error } from "console"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request:NextRequest) {
    try{
        const {email,password}=await request.json()

        if(!email||!password){
            return NextResponse.json(
                {error:"Email and password are reqired"},
                {status:400}
            )
        }

         await connectToDatabase()

         const existingUser = await User.findOne({email})
         if(existingUser){
             return NextResponse.json(
                {error:"User already registerd"},
                {status:400}
            )
         }
         await User.create({
            email,
            password
         })

         return NextResponse.json(
                {error:"User registered successfully"},
               
            )



    } catch(error){
        console.error("Registration error",error)
        return NextResponse.json(
                {error:"User registration failed"},
                {status:400}
            )

    }
    
}