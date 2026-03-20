#!/usr/bin/env node
/**
 * Run Supabase migration using supabase-js client.
 * Executes SQL via the rpc endpoint.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const sqlPath = resolve(__dirname, '..', 'supabase', 'migration.sql');
const sql = readFileSync(sqlPath, 'utf-8');

async function main() {
  console.log(`Supabase URL: ${SUPABASE_URL}`);
  console.log(`Migration file: ${sqlPath}\n`);

  // Try using supabase.rpc to call a raw SQL function
  // First, test connectivity
  console.log('Testing Supabase connectivity...');

  try {
    const { data, error } = await supabase.from('profiles').select('id').limit(0);
    if (error && !error.message.includes('does not exist')) {
      console.log(`Table query result: ${JSON.stringify(error)}`);
    } else if (error) {
      console.log('Tables do not exist yet - migration needed.');
    } else {
      console.log('Connected to Supabase successfully. Tables may already exist.');
    }
  } catch (err) {
    console.error(`Cannot connect to Supabase: ${err.message}`);
    console.error('\nThis environment may not have network access to Supabase.');
    console.error('Please run the migration manually from your local machine:');
    console.error('  node scripts/run-migration.mjs');
    console.error('Or paste supabase/migration.sql into the Supabase SQL Editor.');
    process.exit(1);
  }

  // Try executing SQL via fetch to the management endpoint
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    'apikey': SERVICE_ROLE_KEY,
  };

  // Try multiple SQL execution endpoints
  const endpoints = [
    { url: `${SUPABASE_URL}/rest/v1/rpc/exec_sql`, method: 'POST', body: JSON.stringify({ query: sql }) },
    { url: `${SUPABASE_URL}/pg/query`, method: 'POST', body: JSON.stringify({ query: sql }) },
  ];

  for (const ep of endpoints) {
    try {
      console.log(`\nTrying ${ep.url}...`);
      const res = await fetch(ep.url, { method: ep.method, headers, body: ep.body });
      if (res.ok) {
        const result = await res.json();
        console.log('Migration executed successfully!');
        console.log(JSON.stringify(result, null, 2));
        return;
      }
      const text = await res.text();
      console.log(`  Failed (${res.status}): ${text.substring(0, 200)}`);
    } catch (err) {
      console.log(`  Failed: ${err.message}`);
    }
  }

  console.error('\nCould not execute SQL migration programmatically.');
  console.error('Please run the migration manually:');
  console.error('1. Go to your Supabase dashboard → SQL Editor');
  console.error('2. Paste the contents of supabase/migration.sql');
  console.error('3. Click "Run"');
  process.exit(1);
}

main();
