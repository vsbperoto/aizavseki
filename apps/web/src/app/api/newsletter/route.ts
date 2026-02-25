import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Моля, въведете валиден имейл адрес." },
        { status: 400 }
      );
    }

    const supabase = await createServiceClient();

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, is_active")
      .eq("email", email)
      .single();

    if (existing) {
      if (existing.is_active) {
        return NextResponse.json(
          { error: "Вече сте абонирани!" },
          { status: 400 }
        );
      }

      // Re-subscribe
      await supabase
        .from("newsletter_subscribers")
        .update({ is_active: true, unsubscribed_at: null })
        .eq("id", existing.id);

      return NextResponse.json({
        success: true,
        message: "Успешно се абонирахте отново!",
      });
    }

    // New subscriber
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email, source: "website" });

    if (error) {
      console.error("Newsletter insert error:", error);
      return NextResponse.json(
        { error: "Възникна грешка. Моля, опитайте отново." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Успешно се абонирахте!",
    });
  } catch {
    return NextResponse.json(
      { error: "Възникна грешка. Моля, опитайте отново." },
      { status: 500 }
    );
  }
}
