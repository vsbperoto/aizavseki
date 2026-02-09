import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Всички полета са задължителни." },
        { status: 400 }
      );
    }

    if (name.length < 2) {
      return NextResponse.json(
        { error: "Името трябва да е поне 2 символа." },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: "Съобщението трябва да е поне 10 символа." },
        { status: 400 }
      );
    }

    const supabase = await createServiceClient();

    const { error } = await supabase
      .from("contact_submissions")
      .insert({ name, email, message });

    if (error) {
      console.error("Contact insert error:", error);
      return NextResponse.json(
        { error: "Възникна грешка. Моля, опитайте отново." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Съобщението е изпратено!",
    });
  } catch {
    return NextResponse.json(
      { error: "Възникна грешка. Моля, опитайте отново." },
      { status: 500 }
    );
  }
}
