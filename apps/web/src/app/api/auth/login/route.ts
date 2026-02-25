import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getFacebookAuthUrl } from "@/lib/facebook/oauth";

export async function GET() {
  const state = randomBytes(16).toString("hex");
  const url = getFacebookAuthUrl(state);
  return NextResponse.redirect(url);
}
