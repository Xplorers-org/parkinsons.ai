import { NextRequest, NextResponse } from "next/server";
import { saveGaitResult } from "@/lib/db";

export const runtime = "nodejs";

const GAIT_API_URL = process.env.GAIT_API_URL;

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export async function POST(req: NextRequest) {
  if (!GAIT_API_URL) {
    return NextResponse.json(
      { error: "GAIT_API_URL is not configured." },
      { status: 500 },
    );
  }

  const formData = await req.formData();

  const session_id = formData.get("session_id") as string;
  const file = formData.get("video") as File;
  const gender = formData.get("gender") as string; // From UI (patientData.gender)

  if (!session_id || !file || !gender) {
    return NextResponse.json(
      { error: "session_id, gender, and video are required." },
      { status: 400 },
    );
  }

  // Validate session_id is a valid UUID
  if (!isUuid(session_id)) {
    return NextResponse.json(
      { error: "Invalid session_id format." },
      { status: 400 },
    );
  }

  // ── 1. Forward to Gait API ─────────────────────────────────────────────────
  const upstream = new FormData();
  upstream.append("video", file);
  upstream.append("gender", gender);

  const gaitBaseUrl = GAIT_API_URL.replace(/\/+$/, "");

  let apiResult: Record<string, unknown>;
  const t0 = Date.now();
  try {
    const response = await fetch(`${gaitBaseUrl}/analyze`, {
      method: "POST",
      body: upstream,
    });
    if (!response.ok) {
      const detail = await response.text();
      return NextResponse.json(
        { error: `Gait API: ${detail}` },
        { status: response.status },
      );
    }
    apiResult = await response.json();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown network error";
    return NextResponse.json(
      { error: `Could not reach Gait API. ${message}` },
      { status: 502 },
    );
  }
  const processing_time_ms = Date.now() - t0;

  console.log("[gait] Response keys:", Object.keys(apiResult));

  // Extract necessary fields
  const gait_score_candidate =
    (apiResult.gait_stability_score as number | undefined) ??
    (apiResult.gait_score as number | undefined) ??
    (apiResult.score as number | undefined);

  const gait_score =
    typeof gait_score_candidate === "number" ? gait_score_candidate : undefined;

  // Extract gait parameters
  const features = apiResult.features as Record<string, unknown> | undefined;
  const stride_variability =
    typeof features?.stride_variability === "number"
      ? features.stride_variability
      : undefined;
  const cadence =
    typeof features?.cadence === "number" ? features.cadence : undefined;
  const gait_symmetry =
    typeof features?.symmetry_ratio === "number"
      ? features.symmetry_ratio
      : undefined;
  const overall_arm_swing =
    typeof features?.l_arm_amp === "number" ? features.l_arm_amp : undefined;
  const arm_swing_asymmetry =
    typeof features?.arm_asymmetry_index === "number"
      ? features.arm_asymmetry_index
      : undefined;

  if (typeof gait_score === "undefined") {
    return NextResponse.json(
      { error: "Gait API did not return a gait score field." },
      { status: 500 },
    );
  }

  // ── 2. Save to Supabase (OPTIONAL - Skip if columns don't exist yet) ──────────────────────
  let saved = false;
  try {
    // Try to save to database, but don't fail if columns are missing
    await saveGaitResult(session_id, {
      gait_score: gait_score,
      processing_time_ms,
    });
    saved = true;
    console.log("[gait] ✅ Saved to database");
  } catch {
    console.warn(
      "[gait] ⚠️  Database save skipped (columns may not exist yet). Data still in response.",
    );
    // Don't fail the entire request - we still have the data in the response
    saved = false;
  }

  return NextResponse.json({
    gait_score: gait_score,
    processing_time_ms,
    stride_variability,
    cadence,
    gait_symmetry,
    overall_arm_swing,
    arm_swing_asymmetry,
    saved,
  });
}
