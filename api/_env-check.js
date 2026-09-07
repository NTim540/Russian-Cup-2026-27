export default function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  res.status(200).json({
    supabaseUrl:Boolean(process.env.SUPABASE_URL||process.env.NEXT_PUBLIC_SUPABASE_URL),
    serviceRole:Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    anonKey:Boolean(process.env.SUPABASE_ANON_KEY||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  });
}
