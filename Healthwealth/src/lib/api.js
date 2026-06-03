import { requireSupabase } from "./supabase";

export async function getCurrentSession() {
  const { data, error } = await requireSupabase().auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function signInWithEmail(email, password) {
  const { data, error } = await requireSupabase().auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signUpWithEmail(email, password, profile) {
  const { data, error } = await requireSupabase().auth.signUp({
    email,
    password,
    options: {
      data: {
        user_name: profile.userName,
        full_name: profile.userName,
        phone_number: profile.phoneNumber,
      },
    },
  });
  if (error) throw error;

  if (data.user && data.session) {
    await saveProfile(data.user.id, {
      email,
      fullName: profile.userName,
      phoneNumber: profile.phoneNumber,
      age: "",
      gender: "",
      occupation: "",
      pushNotifications: true,
      darkMode: false,
      emailUpdates: true,
    });
  }

  return data;
}

export async function signInWithGoogle() {
  const { data, error } = await requireSupabase().auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin,
      queryParams: {
        access_type: "offline",
        prompt: "select_account",
      },
    },
  });
  if (error) throw error;
  return data;
}

export async function sendPasswordResetEmail(email) {
  const { data, error } = await requireSupabase().auth.resetPasswordForEmail(
    email,
    { redirectTo: window.location.origin }
  );
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await requireSupabase().auth.signOut();
  if (error) throw error;
  localStorage.removeItem("admin_session");
}

export async function updatePassword(password) {
  const { data, error } = await requireSupabase().auth.updateUser({ password });
  if (error) throw error;
  return data;
}

export async function updateUserAvatar(base64DataUrl) {
  const { data, error } = await requireSupabase().auth.updateUser({
    data: { avatar_url: base64DataUrl },
  });
  if (error) throw error;
  return data.user;
}

export async function deleteCurrentAccount() {
  const { data, error } = await requireSupabase().rpc("delete_current_user");
  if (error) throw error;
  return data;
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export async function fetchProfile(userId, email, userMetadata = {}) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  if (data) return data;

  const fallbackProfile = {
    id: userId,
    email,
    full_name:
      userMetadata.full_name || userMetadata.user_name || "New User",
    phone_number: userMetadata.phone_number || "",
    age: null,
    gender: "",
    occupation: "",
    push_notifications: true,
    dark_mode: false,
    email_updates: true,
  };

  const { data: created, error: createError } = await client
    .from("profiles")
    .insert(fallbackProfile)
    .select()
    .single();

  if (createError) throw createError;
  return created;
}

export async function saveProfile(userId, profile) {
  const { data, error } = await requireSupabase()
    .from("profiles")
    .upsert(
      {
        id: userId,
        email: profile.email,
        full_name: profile.fullName,
        phone_number: profile.phoneNumber,
        age: profile.age ? Number(profile.age) : null,
        gender: profile.gender,
        occupation: profile.occupation,
        push_notifications: profile.pushNotifications,
        dark_mode: profile.darkMode,
        email_updates: profile.emailUpdates,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─── Finance ──────────────────────────────────────────────────────────────────

export async function fetchFinanceEntries(userId) {
  const { data, error } = await requireSupabase()
    .from("finance_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createFinanceEntry(userId, entry) {
  const { data, error } = await requireSupabase()
    .from("finance_entries")
    .insert({
      user_id: userId,
      entry_type: entry.type,
      source: entry.source,
      frequency: entry.frequency,
      payment_mode: entry.paymentMode,
      amount: Number(entry.amount),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteFinanceEntry(entryId) {
  const { error } = await requireSupabase()
    .from("finance_entries")
    .delete()
    .eq("id", entryId);

  if (error) throw error;
}

export async function updateFinanceEntry(entryId, entry) {
  const { data, error } = await requireSupabase()
    .from("finance_entries")
    .update({
      source: entry.source,
      frequency: entry.frequency,
      payment_mode: entry.paymentMode,
      amount: Number(entry.amount),
    })
    .eq("id", entryId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─── Health ───────────────────────────────────────────────────────────────────

export async function fetchLatestHealthAssessment(userId) {
  const { data, error } = await requireSupabase()
    .from("health_assessments")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function saveHealthAssessment(userId, formData) {
  const payload = {
    user_id: userId,
    name: formData.name,
    gender: formData.gender,
    age: formData.age ? Number(formData.age) : null,
    height: formData.height,
    weight: formData.weight,
    tea_coffee: formData.teaCoffee,
    breakfast: formData.breakfast,
    breakfast_quantity: numberOrNull(formData.breakfastQuantity),
    lunch: formData.lunch,
    lunch_quantity: numberOrNull(formData.lunchQuantity),
    dinner: formData.dinner,
    dinner_quantity: numberOrNull(formData.dinnerQuantity),
    snacks: formData.snacks,
    alcohol: numberOrNull(formData.alcohol),
    water_intake: numberOrNull(formData.waterIntake),
    sleeping_quality_hours: numberOrNull(formData.sleepingQualityHours),
    sleeping_quality_minutes: numberOrNull(formData.sleepingQualityMinutes),
    medication: formData.medication,
    headache: formData.headache,
    tired_morning: formData.tiredMorning,
    wake_energy: formData.wakeEnergy,
    body_pain: formData.bodyPain,
    physical_activity: formData.physicalActivity,
    meditation: formData.meditation,
    others_text: formData.othersText,
    others_yes_no: formData.othersYesNo,
    updated_at: new Date().toISOString(),
  };

  const { data: existing, error: existingError } = await requireSupabase()
    .from("health_assessments")
    .select("id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (existingError) throw existingError;

  const query = existing
    ? requireSupabase()
        .from("health_assessments")
        .update(payload)
        .eq("id", existing.id)
    : requireSupabase().from("health_assessments").insert(payload);

  const { data, error } = await query.select().single();
  if (error) throw error;
  return data;
}

// ─── Mindset ──────────────────────────────────────────────────────────────────

export async function fetchLatestMindsetAssessment(userId) {
  const { data, error } = await requireSupabase()
    .from("mindset_assessments")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function saveMindsetAssessment(userId, responses, score) {
  // FIX: uses mindset_assessments table (not health_assessments)
  const payload = {
    user_id: userId,
    responses,
    score,
    updated_at: new Date().toISOString(),
  };

  const { data: existing, error: existingError } = await requireSupabase()
    .from("mindset_assessments")
    .select("id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (existingError) throw existingError;

  const query = existing
    ? requireSupabase()
        .from("mindset_assessments")
        .update(payload)
        .eq("id", existing.id)
    : requireSupabase().from("mindset_assessments").insert(payload);

  const { data, error } = await query.select().single();
  if (error) throw error;
  return data;
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function loginAdmin(username, password) {
  if (username === "admin" && password === "admin") {
    const session = {
      user: {
        id: "admin",
        email: "admin@healthwealth.com",
        role: "admin",
      },
      token: "admin-token-" + Date.now(),
    };
    localStorage.setItem("admin_session", JSON.stringify(session));
    return session;
  }
  throw new Error("Invalid admin credentials");
}

// Synchronous — no await needed in App.jsx
export function getAdminSession() {
  try {
    const raw = localStorage.getItem("admin_session");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function fetchAllUsersData() {
  const client = requireSupabase();

  // Run all three queries in parallel for speed
  const [
    { data: profiles, error: pError },
    { data: finance, error: fError },
    { data: health, error: hError },
    { data: mindset, error: mError },
  ] = await Promise.all([
    client.from("profiles").select("*").order("created_at", { ascending: false }),
    client.from("finance_entries").select("*").order("created_at", { ascending: false }),
    client.from("health_assessments").select("*").order("updated_at", { ascending: false }),
    client.from("mindset_assessments").select("*").order("updated_at", { ascending: false }),
  ]);

  if (pError) throw pError;
  if (fError) throw fError;
  if (hError) throw hError;
  if (mError) throw mError;

  return {
    profiles: profiles || [],
    finance: finance || [],
    health: health || [],
    mindset: mindset || [],
  };
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function numberOrNull(value) {
  if (value === "" || value === null || value === undefined) return null;
  const n = Number(value);
  return isNaN(n) ? null : n;
}
