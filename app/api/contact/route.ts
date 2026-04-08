import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { fullName, email, message } = await req.json()

    console.log("Contact form submission:", {
      fullName,
      email,
      message,
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}