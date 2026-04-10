#!/usr/bin/env node
// RedShark — Data Connect emulator CLI
// Usage: node scripts/query.js <operation> [args]

const PROJECT_ID = "redshark-9950b";
const LOCATION = "asia-southeast1";
const SERVICE_ID = "redshark-service";
const EMULATOR_HOST = "http://localhost:9399";
const ENDPOINT = `${EMULATOR_HOST}/v1alpha/projects/${PROJECT_ID}/locations/${LOCATION}/services/${SERVICE_ID}:executeGraphql`;

// ── Schema metadata ───────────────────────────────────────────────────────────

const SCHEMA = {
  tag: {
    plural: "tags",
    idField: "id", idType: "Int",
    selectFields: "id name",
    singularFields: "id name",
    attributes: [
      { name: "id",   type: "Int",    constraints: "PRIMARY KEY" },
      { name: "name", type: "String", constraints: "NOT NULL UNIQUE" },
    ],
    relationships: [],
  },
  skill: {
    plural: "skills",
    idField: "id", idType: "Int",
    selectFields: "id name",
    singularFields: "id name",
    attributes: [
      { name: "id",   type: "Int",    constraints: "PRIMARY KEY" },
      { name: "name", type: "String", constraints: "NOT NULL UNIQUE" },
    ],
    relationships: [],
  },
  user: {
    plural: "users",
    idField: "id", idType: "String",
    selectFields: "id username displayName avatarUrl skillIds createdAt",
    singularFields: "id username displayName avatarUrl skillIds createdAt",
    attributes: [
      { name: "id",          type: "String",    constraints: "PRIMARY KEY  default: auth.uid" },
      { name: "username",    type: "String",    constraints: "NOT NULL UNIQUE" },
      { name: "displayName", type: "String",    constraints: "nullable" },
      { name: "avatarUrl",   type: "String",    constraints: "nullable" },
      { name: "skillIds",    type: "[Int]",     constraints: "nullable  array" },
      { name: "createdAt",   type: "Timestamp", constraints: "NOT NULL  default: request.time" },
    ],
    relationships: [
      { field: "skillIds", ref: "skill", type: "many (array)" },
    ],
  },
  idea: {
    plural: "ideas",
    idField: "id", idType: "UUID",
    selectFields: "id title description status tagIds collaboratorIds lastActivityAt createdAt deletedAt",
    singularFields: "id title description status tagIds collaboratorIds lastActivityAt createdAt deletedAt",
    attributes: [
      { name: "id",               type: "UUID",      constraints: "PRIMARY KEY  default: uuidV4()" },
      { name: "authorId",         type: "String",    constraints: "NOT NULL  FK → user.id" },
      { name: "title",            type: "String",    constraints: "NOT NULL" },
      { name: "description",      type: "String",    constraints: "NOT NULL" },
      { name: "status",           type: "String",    constraints: "NOT NULL  default: ACTIVE" },
      { name: "tagIds",           type: "[Int]",     constraints: "nullable  array" },
      { name: "collaboratorIds",  type: "[String]",  constraints: "nullable  array" },
      { name: "lastActivityAt",   type: "Timestamp", constraints: "NOT NULL  default: request.time" },
      { name: "createdAt",        type: "Timestamp", constraints: "NOT NULL  default: request.time" },
      { name: "deletedAt",        type: "Timestamp", constraints: "nullable  soft-delete" },
    ],
    relationships: [
      { field: "author",          ref: "user",  type: "many-to-one" },
      { field: "tagIds",          ref: "tag",   type: "many (array)" },
      { field: "collaboratorIds", ref: "user",  type: "many (array)" },
    ],
  },
  issue: {
    plural: "issues",
    idField: "id", idType: "UUID",
    selectFields: "id title content status createdAt deletedAt",
    singularFields: "id title content status createdAt deletedAt",
    attributes: [
      { name: "id",        type: "UUID",      constraints: "PRIMARY KEY  default: uuidV4()" },
      { name: "ideaId",    type: "UUID",      constraints: "NOT NULL  FK → idea.id" },
      { name: "authorId",  type: "String",    constraints: "NOT NULL  FK → user.id" },
      { name: "title",     type: "String",    constraints: "NOT NULL" },
      { name: "content",   type: "String",    constraints: "NOT NULL" },
      { name: "status",    type: "String",    constraints: "NOT NULL  default: OPEN" },
      { name: "createdAt", type: "Timestamp", constraints: "NOT NULL  default: request.time" },
      { name: "deletedAt", type: "Timestamp", constraints: "nullable  soft-delete" },
    ],
    relationships: [
      { field: "idea",   ref: "idea", type: "many-to-one" },
      { field: "author", ref: "user", type: "many-to-one" },
    ],
  },
  comment: {
    plural: "comments",
    idField: "id", idType: "Int64",
    selectFields: "id content createdAt deletedAt",
    singularFields: "id content createdAt deletedAt",
    attributes: [
      { name: "id",        type: "Int64",     constraints: "PRIMARY KEY" },
      { name: "ideaId",    type: "UUID",      constraints: "NOT NULL  FK → idea.id" },
      { name: "authorId",  type: "String",    constraints: "NOT NULL  FK → user.id" },
      { name: "content",   type: "String",    constraints: "NOT NULL" },
      { name: "createdAt", type: "Timestamp", constraints: "NOT NULL  default: request.time" },
      { name: "deletedAt", type: "Timestamp", constraints: "nullable  soft-delete" },
    ],
    relationships: [
      { field: "idea",   ref: "idea", type: "many-to-one" },
      { field: "author", ref: "user", type: "many-to-one" },
    ],
  },
  notification: {
    plural: "notifications",
    idField: "id", idType: "Int64",
    selectFields: "id type isRead targetId metaData createdAt",
    singularFields: "id type isRead targetId metaData createdAt",
    attributes: [
      { name: "id",          type: "Int64",     constraints: "PRIMARY KEY" },
      { name: "recipientId", type: "String",    constraints: "NOT NULL  FK → user.id" },
      { name: "actorId",     type: "String",    constraints: "NOT NULL  FK → user.id" },
      { name: "type",        type: "String",    constraints: "NOT NULL" },
      { name: "targetId",    type: "UUID",      constraints: "nullable" },
      { name: "metaData",    type: "Any",       constraints: "nullable  JSON" },
      { name: "isRead",      type: "Boolean",   constraints: "NOT NULL  default: false" },
      { name: "createdAt",   type: "Timestamp", constraints: "NOT NULL  default: request.time" },
    ],
    relationships: [
      { field: "recipient", ref: "user", type: "many-to-one" },
      { field: "actor",     ref: "user", type: "many-to-one" },
    ],
  },
  conversation: {
    plural: "conversations",
    idField: "id", idType: "UUID",
    selectFields: "id type participantIds lastMessageAt createdAt",
    singularFields: "id type participantIds lastMessageAt createdAt",
    attributes: [
      { name: "id",             type: "UUID",      constraints: "PRIMARY KEY  default: uuidV4()" },
      { name: "type",           type: "String",    constraints: "NOT NULL  default: DIRECT" },
      { name: "participantIds", type: "[String]",  constraints: "nullable  array  FK → user.id" },
      { name: "lastMessageAt",  type: "Timestamp", constraints: "NOT NULL  default: request.time" },
      { name: "createdAt",      type: "Timestamp", constraints: "NOT NULL  default: request.time" },
    ],
    relationships: [
      { field: "participantIds", ref: "user", type: "many (array)" },
    ],
  },
  message: {
    plural: "messages",
    idField: "id", idType: "Int64",
    selectFields: "id content messageType createdAt deletedAt",
    singularFields: "id content messageType createdAt deletedAt",
    attributes: [
      { name: "id",             type: "Int64",     constraints: "PRIMARY KEY" },
      { name: "conversationId", type: "UUID",      constraints: "NOT NULL  FK → conversation.id" },
      { name: "senderId",       type: "String",    constraints: "NOT NULL  FK → user.id" },
      { name: "content",        type: "String",    constraints: "NOT NULL" },
      { name: "messageType",    type: "String",    constraints: "NOT NULL  default: TEXT" },
      { name: "createdAt",      type: "Timestamp", constraints: "NOT NULL  default: request.time" },
      { name: "deletedAt",      type: "Timestamp", constraints: "nullable  soft-delete" },
    ],
    relationships: [
      { field: "conversation", ref: "conversation", type: "many-to-one" },
      { field: "sender",       ref: "user",         type: "many-to-one" },
    ],
  },
};

// Delete order: leaf entities first (respect FK constraints)
const DELETE_ORDER = [
  "message", "notification", "comment", "issue",
  "idea", "conversation", "user", "skill", "tag",
];

// ── Seed data ─────────────────────────────────────────────────────────────────

const SEED_TAGS = [
  { id: 1, name: "React Native" }, { id: 2, name: "React" },
  { id: 3, name: "Vue" }, { id: 4, name: "Flutter" },
  { id: 5, name: "Spring Boot" }, { id: 6, name: "Django" },
  { id: 7, name: "FastAPI" }, { id: 8, name: "Node.js" },
  { id: 9, name: "PostgreSQL" }, { id: 10, name: "MongoDB" },
  { id: 11, name: "Docker" }, { id: 12, name: "Kubernetes" },
  { id: 13, name: "AWS" }, { id: 14, name: "Firebase" },
  { id: 15, name: "Python" }, { id: 16, name: "Java" },
  { id: 17, name: "Go" }, { id: 18, name: "Rust" },
  { id: 19, name: "UI/UX" }, { id: 20, name: "Machine Learning" },
];

const SEED_SKILLS = [
  { id: 1, name: "React Native" }, { id: 2, name: "Spring Boot" },
  { id: 3, name: "Python" }, { id: 4, name: "Docker" },
  { id: 5, name: "PostgreSQL" }, { id: 6, name: "Kubernetes" },
  { id: 7, name: "Machine Learning" }, { id: 8, name: "UI/UX" },
  { id: 9, name: "Node.js" }, { id: 10, name: "AWS" },
];

// ── HTTP ──────────────────────────────────────────────────────────────────────

async function gqlRun(gql, { silent = false } = {}) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: gql }),
  });
  const json = await res.json();
  if (json.errors?.length) {
    if (!silent) {
      console.error("Error:\n" + json.errors.map(e => `  ${e.message}`).join("\n"));
    }
    return { ok: false, errors: json.errors, data: json.data };
  }
  return { ok: true, data: json.data };
}

// ── GraphQL input serializer ──────────────────────────────────────────────────

function gqlVal(v) {
  if (Array.isArray(v)) return `[${v.map(gqlVal).join(", ")}]`;
  if (typeof v === "object" && v !== null) {
    return `{ ${Object.entries(v).map(([k, x]) => `${k}: ${gqlVal(x)}`).join(", ")} }`;
  }
  if (typeof v === "string") return JSON.stringify(v);
  return String(v);
}

function parseId(entity, id) {
  const { idType } = SCHEMA[entity];
  if (idType === "Int" || idType === "Int64") return isNaN(id) ? id : Number(id);
  return id; // UUID or String — keep as-is
}

// ── Operations ────────────────────────────────────────────────────────────────

async function opSeed() {
  const gql = `mutation Seed {
    tag_upsertMany(data: ${gqlVal(SEED_TAGS)})
    skill_upsertMany(data: ${gqlVal(SEED_SKILLS)})
  }`;
  console.log("Seeding tags and skills...");
  const { ok } = await gqlRun(gql);
  if (ok) console.log(`  tags:   ${SEED_TAGS.length} records\n  skills: ${SEED_SKILLS.length} records\nDone.`);
  else process.exit(1);
}

async function opSelect(entity, id) {
  const meta = SCHEMA[entity];
  if (!meta) return unknownEntity(entity);

  let gql;
  if (id !== undefined) {
    const idVal = parseId(entity, id);
    gql = `query { ${entity}(id: ${gqlVal(idVal)}) { ${meta.singularFields} } }`;
  } else {
    gql = `query { ${meta.plural} { ${meta.selectFields} } }`;
  }

  const { ok, data } = await gqlRun(gql);
  if (!ok) process.exit(1);
  console.log(JSON.stringify(id !== undefined ? data[entity] : data[meta.plural], null, 2));
}

async function opInsert(entity, rawJson) {
  if (!SCHEMA[entity]) return unknownEntity(entity);
  const data = JSON.parse(rawJson);
  const { ok, data: res } = await gqlRun(`mutation { ${entity}_insert(data: ${gqlVal(data)}) }`);
  if (!ok) process.exit(1);
  console.log("Inserted:", JSON.stringify(res, null, 2));
}

async function opUpsert(entity, rawJson) {
  if (!SCHEMA[entity]) return unknownEntity(entity);
  const data = JSON.parse(rawJson);
  const { ok, data: res } = await gqlRun(`mutation { ${entity}_upsert(data: ${gqlVal(data)}) }`);
  if (!ok) process.exit(1);
  console.log("Upserted:", JSON.stringify(res, null, 2));
}

async function opUpsertMany(entity) {
  const seedMap = { tag: SEED_TAGS, skill: SEED_SKILLS };
  const data = seedMap[entity];
  if (!data) {
    console.error(`No seed data for: ${entity}. Available: ${Object.keys(seedMap).join(", ")}`);
    process.exit(1);
  }
  const { ok } = await gqlRun(`mutation { ${entity}_upsertMany(data: ${gqlVal(data)}) }`);
  if (!ok) process.exit(1);
  console.log(`Upserted ${data.length} ${entity} records.`);
}

async function opUpdate(entity, id, rawJson) {
  if (!SCHEMA[entity]) return unknownEntity(entity);
  const idVal = parseId(entity, id);
  const data = { [SCHEMA[entity].idField]: idVal, ...JSON.parse(rawJson) };
  const { ok, data: res } = await gqlRun(`mutation { ${entity}_update(data: ${gqlVal(data)}) }`);
  if (!ok) process.exit(1);
  console.log("Updated:", JSON.stringify(res, null, 2));
}

async function opDelete(entity, id) {
  if (!SCHEMA[entity]) return unknownEntity(entity);
  const idVal = parseId(entity, id);
  const { ok } = await gqlRun(`mutation { ${entity}_delete(id: ${gqlVal(idVal)}) }`);
  if (!ok) process.exit(1);
  console.log(`Deleted ${entity} ${id}.`);
}

async function opDeleteAll() {
  console.log("Wiping all data (in FK-safe order)...");
  for (const entity of DELETE_ORDER) {
    const meta = SCHEMA[entity];
    // Fetch all IDs
    const { ok, data } = await gqlRun(
      `query { ${meta.plural} { ${meta.idField} } }`,
      { silent: true }
    );
    if (!ok) { console.log(`  ${entity}: skipped (query error)`); continue; }

    const records = data?.[meta.plural] ?? [];
    if (records.length === 0) { console.log(`  ${entity}: 0 records`); continue; }

    // Batch delete with aliases
    const aliases = records
      .map((r, i) => `d${i}: ${entity}_delete(id: ${gqlVal(r[meta.idField])})`)
      .join("\n    ");
    const { ok: dok } = await gqlRun(`mutation { ${aliases} }`, { silent: true });
    console.log(`  ${entity}: ${dok ? "deleted" : "partial error"} ${records.length} records`);
  }
  console.log("Done.");
}

async function opInfo() {
  // Fetch counts per entity in parallel (individual queries so auth failures don't cascade)
  const results = await Promise.all(
    Object.entries(SCHEMA).map(async ([entity, meta]) => {
      const { ok, data } = await gqlRun(
        `query { ${meta.plural} { ${meta.idField} } }`,
        { silent: true }
      );
      return [entity, ok ? (data?.[meta.plural]?.length ?? 0) : "?"];
    })
  );
  const counts = Object.fromEntries(results);

  const lines = [];
  lines.push("─".repeat(60));
  for (const [entity, meta] of Object.entries(SCHEMA)) {
    const count = counts[entity] ?? "?";
    lines.push(`  ${entity.toUpperCase().padEnd(14)} ${count} record${count !== 1 ? "s" : ""}`);
    lines.push("");

    // Attributes
    const nameW = Math.max(...meta.attributes.map(a => a.name.length));
    const typeW = Math.max(...meta.attributes.map(a => a.type.length));
    for (const attr of meta.attributes) {
      lines.push(
        `    ${attr.name.padEnd(nameW + 2)}${attr.type.padEnd(typeW + 2)}${attr.constraints}`
      );
    }

    // Relationships
    if (meta.relationships.length > 0) {
      lines.push("");
      lines.push("    Relationships:");
      for (const rel of meta.relationships) {
        lines.push(`      ${rel.field.padEnd(18)}→ ${rel.ref}  (${rel.type})`);
      }
    }
    lines.push("─".repeat(60));
  }
  console.log(lines.join("\n"));
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function unknownEntity(entity) {
  console.error(`Unknown entity: ${entity}\nAvailable: ${Object.keys(SCHEMA).join(" | ")}`);
  process.exit(1);
}

function usage() {
  return `
RedShark Data Connect CLI — ${EMULATOR_HOST}

Usage: node scripts/query.js <operation> [args]

Operations:
  seed                             Upsert all seed data (tags + skills)
  select   <entity> [id]          List all records, or fetch one by id
  insert   <entity> '<json>'      Insert one record
  upsert   <entity> '<json>'      Upsert one record
  upsertMany <entity>             Bulk upsert seed data (tag | skill)
  update   <entity> <id> '<json>' Update fields by id
  delete   <entity> <id>          Delete one record by id
  delete   all                    Wipe all data (FK-safe order)
  info                            Schema: entities, counts, fields, relationships
  gql      '<graphql>'            Run arbitrary GraphQL

Entities: ${Object.keys(SCHEMA).join(" | ")}

Examples:
  node scripts/query.js seed
  node scripts/query.js info
  node scripts/query.js select tag
  node scripts/query.js select tag 5
  node scripts/query.js select user
  node scripts/query.js insert tag '{"id":21,"name":"TypeScript"}'
  node scripts/query.js upsert skill '{"id":11,"name":"GraphQL"}'
  node scripts/query.js update tag 21 '{"name":"TypeScript (TS)"}'
  node scripts/query.js delete tag 21
  node scripts/query.js delete all
  node scripts/query.js gql 'query { ideas { id title status } }'
`.trim();
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const [, , op, ...args] = process.argv;

  if (!op || op === "--help" || op === "-h") {
    console.log(usage());
    return;
  }

  switch (op) {
    case "seed":       return opSeed();
    case "info":       return opInfo();
    case "select":     return opSelect(args[0], args[1]);
    case "insert":     return opInsert(args[0], args[1]);
    case "upsert":     return opUpsert(args[0], args[1]);
    case "upsertMany": return opUpsertMany(args[0]);
    case "update":     return opUpdate(args[0], args[1], args[2]);
    case "delete":
      if (args[0] === "all") return opDeleteAll();
      return opDelete(args[0], args[1]);
    case "gql":
      return gqlRun(args.join(" ")).then(({ ok, data }) => {
        if (!ok) process.exit(1);
        console.log(JSON.stringify(data, null, 2));
      });
    default:
      console.error(`Unknown operation: ${op}\n`);
      console.log(usage());
      process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  console.error("Is the emulator running?  firebase emulators:start --only dataconnect");
  process.exit(1);
});
