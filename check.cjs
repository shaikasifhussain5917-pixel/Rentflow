const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const env = fs.readFileSync('.env.local', 'utf-8').split('\n').reduce((acc, line) => {
  const [k, v] = line.split('=');
  if (k && v) acc[k.trim()] = v.trim();
  return acc;
}, {});
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function checkDuplicates() {
  const { data: tenants, error } = await supabase
    .from('tenants')
    .select('id, unit_id, name, status, created_at')
    .eq('status', 'active');
    
  if (error) {
    console.error('Error fetching tenants:', error);
    return;
  }
  
  const unitCounts = {};
  const nullUnitTenants = [];
  
  tenants.forEach(t => {
    if (t.unit_id === null) {
      nullUnitTenants.push(t);
    } else {
      if (!unitCounts[t.unit_id]) {
        unitCounts[t.unit_id] = [];
      }
      unitCounts[t.unit_id].push(t);
    }
  });
  
  const duplicates = Object.keys(unitCounts).filter(uid => unitCounts[uid].length > 1);
  
  console.log('--- DUPLICATE ACTIVE TENANTS BY UNIT_ID ---');
  if (duplicates.length === 0) {
    console.log('0 duplicate active tenants found.');
  } else {
    duplicates.forEach(uid => {
      console.log('Unit ID:', uid);
      unitCounts[uid].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).forEach(t => {
        console.log(`  - ID: ${t.id}, Name: ${t.name}, Status: ${t.status}`);
      });
    });
  }
  
  console.log('\n--- ACTIVE TENANTS WITH NULL UNIT_ID ---');
  if (nullUnitTenants.length === 0) {
    console.log('0 active tenants with NULL unit_id found.');
  } else {
    nullUnitTenants.forEach(t => {
      console.log(`  - ID: ${t.id}, Name: ${t.name}, Status: ${t.status}`);
    });
  }
  
  console.log('\n--- ALL ACTIVE TENANTS (Sorted) ---');
  const validTenants = tenants.filter(t => t.unit_id !== null).sort((a, b) => {
    if (a.unit_id === b.unit_id) return new Date(a.created_at) - new Date(b.created_at);
    return a.unit_id.localeCompare(b.unit_id);
  });
  validTenants.forEach(t => {
    console.log(`ID: ${t.id} | Unit: ${t.unit_id} | Name: ${t.name}`);
  });
}

checkDuplicates();
