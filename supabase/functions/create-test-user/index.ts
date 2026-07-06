import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const email = "merchant@connect.app";
  const password = "Merchant@123";

  // Check if user exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existing = existingUsers?.users?.find((u) => u.email === email);

  let userId: string;

  if (existing) {
    userId = existing.id;
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    userId = data.user.id;
  }

  // Ensure merchant role exists
  const { data: existingRole } = await supabase
    .from("user_roles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", "merchant")
    .maybeSingle();

  if (!existingRole) {
    await supabase.from("user_roles").insert({ user_id: userId, role: "merchant" });
  }

  // Ensure merchant record exists
  const { data: existingMerchant } = await supabase
    .from("merchants")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!existingMerchant) {
    await supabase.from("merchants").insert({
      user_id: userId,
      store_name: "متجر تجريبي",
      description: "متجر تجريبي للاختبار",
      city: "بيروت",
      phone: "+961 71 123456",
      is_approved: true,
      subscription_active: true,
    });
  } else {
    // Make sure it's approved and active
    await supabase.from("merchants").update({ is_approved: true, subscription_active: true }).eq("user_id", userId);
  }

  return new Response(JSON.stringify({ 
    message: "Merchant account ready", 
    email, 
    password, 
    user_id: userId 
  }), {
    headers: { "Content-Type": "application/json" },
  });
});
