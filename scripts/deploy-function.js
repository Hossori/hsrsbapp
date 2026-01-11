const { execSync } = require('child_process');

const name = process.env.npm_config_name;
if (!name) {
  console.error('Error: --name is required. Usage: npm run functions:deploy --name=<function-name>');
  process.exit(1);
}

execSync(`npx supabase functions deploy ${name} --import-map supabase/functions/deno.json`, { stdio: 'inherit' });
