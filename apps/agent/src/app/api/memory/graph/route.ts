import { NextRequest, NextResponse } from "next/server";
import type {
  MemoryEntityRow,
  MemoryFactRow,
  MemoryRelationRow,
} from "@/lib/agent/types";
import { getAuthenticatedContext } from "@/lib/api/auth";

function isFactActive(validUntil: string | null) {
  if (!validUntil) {
    return true;
  }
  return new Date(validUntil).getTime() > Date.now();
}

export async function GET(request: NextRequest) {
  const { supabase, user, errorResponse } = await getAuthenticatedContext();
  if (errorResponse || !user) {
    return errorResponse;
  }

  const limitParam = Number(request.nextUrl.searchParams.get("limit") || "80");
  const limit = Number.isFinite(limitParam)
    ? Math.min(Math.max(Math.floor(limitParam), 10), 200)
    : 80;

  const [{ data: entities, error: entitiesError }, { data: relations, error: relationsError }, { data: facts, error: factsError }] =
    await Promise.all([
      supabase
        .from("memory_entities")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(limit),
      supabase
        .from("memory_relations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(limit * 2),
      supabase
        .from("memory_facts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(limit * 2),
    ]);

  if (entitiesError || relationsError || factsError) {
    return NextResponse.json(
      {
        error:
          entitiesError?.message ||
          relationsError?.message ||
          factsError?.message ||
          "Failed to load graph.",
      },
      { status: 500 },
    );
  }

  const entityRows = (entities || []) as MemoryEntityRow[];
  const relationRows = (relations || []) as MemoryRelationRow[];
  const factRows = ((facts || []) as MemoryFactRow[]).filter((fact) =>
    isFactActive(fact.valid_until),
  );

  const nameById = new Map(entityRows.map((entity) => [entity.id, entity.canonical_name]));

  return NextResponse.json({
    entities: entityRows.map((entity) => ({
      id: entity.id,
      name: entity.canonical_name,
      type: entity.entity_type,
      attributes: entity.attributes_json ?? {},
      updatedAt: entity.updated_at,
    })),
    relations: relationRows.map((relation) => ({
      id: relation.id,
      sourceEntityId: relation.source_entity_id,
      sourceName: nameById.get(relation.source_entity_id) || relation.source_entity_id,
      relationType: relation.relation_type,
      targetEntityId: relation.target_entity_id,
      targetName: nameById.get(relation.target_entity_id) || relation.target_entity_id,
      confidence: relation.confidence,
      validFrom: relation.valid_from,
      validUntil: relation.valid_until,
    })),
    facts: factRows.map((fact) => ({
      id: fact.id,
      entityId: fact.entity_id,
      entityName: fact.entity_id ? nameById.get(fact.entity_id) || null : null,
      text: fact.fact_text,
      confidence: fact.confidence,
      validFrom: fact.valid_from,
      validUntil: fact.valid_until,
    })),
  });
}

