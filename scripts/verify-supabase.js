const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Manual .env loading
try {
    const envPath = path.resolve(__dirname, '../.env.local');
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, ...values] = line.split('=');
        if (key && values.length > 0) {
            process.env[key.trim()] = values.join('=').trim();
        }
    });
} catch (e) {
    console.error('Error loading .env.local', e);
    process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
    console.log('--- Verifying Supabase Setup ---');
    console.log('URL:', supabaseUrl);

    // 1. Check Tables (Orders)
    console.log('\n[1] Checking "orders" table...');
    const orderCheck = await supabase.from('orders').select('*').limit(1);
    if (orderCheck.error) {
        console.error('❌ Error checking orders table:', orderCheck.error.message);
    } else {
        console.log('✅ "orders" table exists and is accessible.');
    }

    // 2. Check Storage Buckets
    console.log('\n[2] Checking Storage Buckets...');
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();

    if (bucketError) {
        console.error('❌ Error listing buckets:', bucketError.message);
    } else {
        const productsBucket = buckets.find(b => b.name === 'products');
        if (productsBucket) {
            console.log('✅ "products" bucket exists.');
            console.log('   Public:', productsBucket.public);
        } else {
            console.error('❌ "products" bucket DOES NOT exist.');
            console.log('   Available buckets:', buckets.map(b => b.name).join(', ') || 'None');
        }
    }
}

verify();
