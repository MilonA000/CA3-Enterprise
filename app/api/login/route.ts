import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const studentId = body.studentId?.trim();
    const password = body.password?.trim();

    if (!studentId || !password) {
      return NextResponse.json(
        { success: false, message: "Enter student ID and password." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, student_id, name, course")
      .eq("student_id", studentId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { success: false, message: "Invalid student ID or password." },
        { status: 401 }
      );
    }

    if (!profile.email) {
      return NextResponse.json(
        { success: false, message: "Account not set up correctly." },
        { status: 500 }
      );
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: profile.email,
      password,
    });

    if (signInError) {
      return NextResponse.json(
        { success: false, message: "Invalid student ID or password." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        studentId: profile.student_id,
        name: profile.name,
        course: profile.course,
        loggedIn: true,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong during login." },
      { status: 500 }
    );
  }
}