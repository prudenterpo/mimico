#!/usr/bin/env node
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import YAML from "yaml";

const rootDir = process.cwd();
const args = new Set(process.argv.slice(2));
const asyncapiOnly = args.has("--asyncapi-only");

const contractPaths = {
  openapi: "contracts/openapi/mimico-v1.yaml",
  asyncapi: "contracts/asyncapi/mimico-realtime-v1.yaml",
  schemasDir: "contracts/schemas",
  samplesDir: "contracts/samples"
};

const sampleSchemaMap = {
  "error.validation.json": "error.schema.json",
  "team-assignment.valid.json": "team-assignment.schema.json",
  "match-state.active.valid.json": "match-state.schema.json",
  "match-state.paused.valid.json": "match-state.schema.json",
  "realtime-event-envelope.match-state-updated.valid.json": "realtime-event-envelope.schema.json",
  "realtime-event-envelope.match-paused.valid.json": "realtime-event-envelope.schema.json"
};

function readText(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), "utf8");
}

function readJson(relativePath) {
  try {
    return JSON.parse(readText(relativePath));
  } catch (error) {
    throw new Error(`${relativePath}: invalid JSON: ${error.message}`);
  }
}

function parseYaml(relativePath) {
  try {
    return YAML.parse(readText(relativePath));
  } catch (error) {
    throw new Error(`${relativePath}: invalid YAML: ${error.message}`);
  }
}

function requireObject(document, relativePath) {
  if (!document || typeof document !== "object" || Array.isArray(document)) {
    throw new Error(`${relativePath}: expected a YAML object at document root`);
  }
}

function validateAsyncapiShape(document) {
  const requiredKeys = ["asyncapi", "info", "channels", "operations", "components"];
  for (const key of requiredKeys) {
    if (!(key in document)) {
      throw new Error(`${contractPaths.asyncapi}: missing required root key '${key}'`);
    }
  }
}

function createAjv() {
  const ajv = new Ajv({
    allErrors: true,
    strict: true
  });
  addFormats(ajv);
  return ajv;
}

function loadSchemas(ajv) {
  const schemaDir = path.join(rootDir, contractPaths.schemasDir);
  const schemaFiles = fs
    .readdirSync(schemaDir)
    .filter((file) => file.endsWith(".schema.json"))
    .sort();

  for (const file of schemaFiles) {
    const relativePath = path.join(contractPaths.schemasDir, file);
    const schema = readJson(relativePath);
    try {
      ajv.addSchema(schema, file);
      ajv.compile(schema);
    } catch (error) {
      throw new Error(`${relativePath}: schema compile failed: ${error.message}`);
    }
  }

  return schemaFiles;
}

function validateSamples(ajv) {
  const validated = [];

  for (const [sampleFile, schemaFile] of Object.entries(sampleSchemaMap)) {
    const relativePath = path.join(contractPaths.samplesDir, sampleFile);
    const sample = readJson(relativePath);
    const validate = ajv.getSchema(schemaFile);

    if (!validate) {
      throw new Error(`${relativePath}: schema '${schemaFile}' was not registered`);
    }

    if (!validate(sample)) {
      const errorText = ajv.errorsText(validate.errors, { separator: "; " });
      throw new Error(`${relativePath}: sample failed ${schemaFile}: ${errorText}`);
    }

    validated.push(sampleFile);
  }

  return validated;
}

try {
  const asyncapiDocument = parseYaml(contractPaths.asyncapi);
  requireObject(asyncapiDocument, contractPaths.asyncapi);
  validateAsyncapiShape(asyncapiDocument);
  console.log("contracts: asyncapi parsed");

  if (!asyncapiOnly) {
    const openapiDocument = parseYaml(contractPaths.openapi);
    requireObject(openapiDocument, contractPaths.openapi);
    if (!openapiDocument.openapi || !openapiDocument.paths || !openapiDocument.components) {
      throw new Error(`${contractPaths.openapi}: missing expected OpenAPI root keys`);
    }
    console.log("contracts: openapi parsed");

    const ajv = createAjv();
    const schemaFiles = loadSchemas(ajv);
    console.log(`contracts: schemas compiled ${schemaFiles.length}`);

    const sampleFiles = validateSamples(ajv);
    console.log(`contracts: samples validated ${sampleFiles.length}`);
  }

  console.log("contracts: ok");
} catch (error) {
  console.error(`contracts: failed: ${error.message}`);
  process.exit(1);
}
