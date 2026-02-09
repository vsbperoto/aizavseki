import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createServiceClient } from "@/lib/supabase/server";

function base64UrlDecode(str: string): Buffer {
  // Replace URL-safe characters and add padding
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64");
}

function parseSignedRequest(signedRequest: string, appSecret: string) {
  const [encodedSig, payload] = signedRequest.split(".");
  if (!encodedSig || !payload) return null;

  const sig = base64UrlDecode(encodedSig);
  const expectedSig = crypto
    .createHmac("sha256", appSecret)
    .update(payload)
    .digest();

  if (
    sig.length !== expectedSig.length ||
    !crypto.timingSafeEqual(sig, expectedSig)
  ) {
    return null;
  }

  const decodedPayload = base64UrlDecode(payload).toString("utf-8");
  return JSON.parse(decodedPayload);
}

// POST: Handle both Meta callback and user form submissions
export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aizavseki.eu";

  try {
    // Case A: Meta signed_request callback (form-encoded)
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      const signedRequest = formData.get("signed_request") as string;

      if (!signedRequest) {
        return NextResponse.json(
          { error: "Missing signed_request" },
          { status: 400 }
        );
      }

      const appSecret = process.env.META_APP_SECRET;
      if (!appSecret) {
        return NextResponse.json(
          { error: "Server configuration error" },
          { status: 500 }
        );
      }

      const data = parseSignedRequest(signedRequest, appSecret);
      if (!data) {
        return NextResponse.json(
          { error: "Invalid signed_request" },
          { status: 400 }
        );
      }

      const confirmationCode = crypto.randomUUID();
      const supabase = await createServiceClient();

      await supabase.from("data_deletion_requests").insert({
        confirmation_code: confirmationCode,
        facebook_user_id: data.user_id || null,
        status: "pending",
        source: "meta_callback",
      });

      return NextResponse.json({
        url: `${siteUrl}/data-deletion/status?id=${confirmationCode}`,
        confirmation_code: confirmationCode,
      });
    }

    // Case B: User form submission (JSON)
    const body = await request.json();
    const { email, facebook_user_id, reason } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Имейл адресът е задължителен." },
        { status: 400 }
      );
    }

    const confirmationCode = crypto.randomUUID();
    const supabase = await createServiceClient();

    await supabase.from("data_deletion_requests").insert({
      confirmation_code: confirmationCode,
      email,
      facebook_user_id: facebook_user_id || null,
      reason: reason || null,
      status: "pending",
      source: "user",
    });

    return NextResponse.json({
      success: true,
      confirmation_code: confirmationCode,
      url: `${siteUrl}/data-deletion/status?id=${confirmationCode}`,
    });
  } catch (error) {
    console.error("Data deletion error:", error);
    return NextResponse.json(
      { error: "Възникна грешка. Моля, опитайте отново." },
      { status: 500 }
    );
  }
}

// GET: Check deletion status by confirmation code
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Липсва код за потвърждение." },
      { status: 400 }
    );
  }

  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("data_deletion_requests")
      .select("status, requested_at, completed_at")
      .eq("confirmation_code", code)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Заявката не е намерена." },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Възникна грешка." },
      { status: 500 }
    );
  }
}
