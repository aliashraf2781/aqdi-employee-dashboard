/** Flat API field keys allowed per admin contract step */
export const CONTRACT_STEP_KEYS = {
  summary: [
    "contract_type",
    "instrument_type",
    "contract_period_id",
    "name_owner",
    "property_owner_id_num",
    "property_owner_mobile",
    "property_owner_iban",
    "property_owner_dob",
    "type_dob_property_owner",
    "add_legal_agent_of_owner",
    "id_num_of_property_owner_agent",
    "mobile_of_property_owner_agent",
    "dob_of_property_owner_agent",
    "type_dob_property_owner_agent",
    "notes_edits",
  ],
  step1: [
    "property_place_id",
    "property_city_id",
    "neighborhood",
    "street",
    "building_number",
    "postal_code",
    "extra_figure",
    "latitude",
    "longitude",
    "address_url",
  ],
  step2: [
    "unit_type_id",
    "unit_usage_id",
    "unit_number",
    "floor_number",
    "unit_area",
    "tootal_rooms",
    "number_of_rooms",
    "The_number_of_halls",
    "The_number_of_kitchens",
    "The_number_of_toilets",
    "The_number_of_the_toilet",
    "window_ac",
    "split_ac",
    "kitchen_tank",
    "furnished",
    "type_furnished",
    "electricity_meter",
    "electricity_meter_number",
    "electricity_meter_ownership",
    "water_meter",
    "water_meter_number",
    "water_meter_ownership",
  ],
  step3: [
    "tenant_entity",
    "tenant_id_num",
    "tenant_dob",
    "tenant_dob_day",
    "tenant_dob_month",
    "tenant_dob_year",
    "tenant_mobile",
    "type_tenant_dob",
    "tenant_entity_unified_registry_number",
    "authorization_type",
    "id_num_of_property_tenant_agent",
    "id_number_of_property_tenant_agent",
    "type_dob_tenant_agent",
    "dob_of_property_tenant_agent",
    "dob_of_property_tenant_agent_day",
    "dob_of_property_tenant_agent_month",
    "dob_of_property_tenant_agent_year",
    "mobile_of_property_tenant_agent",
    "notes",
  ],
  step4: [
    "contract_starting_date",
    "type_contract_starting_date",
    "contract_term_in_years",
    "duration_preset",
    "duration_years",
    "duration_months",
    "payment_type_id",
    "conditions",
    "tenant_roles",
    "additional_terms",
    "text_additional_terms",
    "notes",
    "tenant_role_id",
    "tenant_role_ids",
  ],
};

function readStep2(orderData, key) {
  const s2 = orderData?.step2 ?? {};
  const unit = s2.unit ?? orderData?.unit ?? {};
  if (key === "unit_number") {
    return s2.unit_number ?? unit.unit_number ?? orderData?.unit_number;
  }
  if (key === "floor_number") {
    return s2.floor_number ?? unit.floor_number ?? orderData?.floor_number;
  }
  if (key === "unit_area") {
    return s2.unit_area ?? unit.unit_area ?? orderData?.unit_area;
  }
  return s2[key] ?? unit[key] ?? orderData?.[key];
}

function readStep3(orderData, key) {
  const s3 = orderData?.step3 ?? {};
  if (key === "id_num_of_property_tenant_agent") {
    return (
      s3.id_num_of_property_tenant_agent ??
      s3.id_number_of_property_tenant_agent ??
      orderData?.id_num_of_property_tenant_agent ??
      orderData?.id_number_of_property_tenant_agent
    );
  }
  return s3[key] ?? orderData?.[key];
}

function readValue(orderData, step, key) {
  if (step === "summary") {
    return orderData?.contract_summary?.[key] ?? orderData?.[key];
  }
  if (step === "step1") return orderData?.step1?.[key] ?? orderData?.[key];
  if (step === "step2") return readStep2(orderData, key);
  if (step === "step3") return readStep3(orderData, key);
  if (step === "step4") return orderData?.step4?.[key] ?? orderData?.[key];
  return undefined;
}

export function parseTenantRoleIds(value) {
  if (Array.isArray(value)) {
    return value
      .map((v) => parseInt(String(v), 10))
      .filter((n) => !Number.isNaN(n));
  }
  if (value === null || value === undefined || value === "") return [];
  return String(value)
    .split(/[,،]/)
    .map((v) => parseInt(v.trim(), 10))
    .filter((n) => !Number.isNaN(n));
}

function tenantRoleIdsEqual(a, b) {
  const left = [...parseTenantRoleIds(a)].sort((x, y) => x - y);
  const right = [...parseTenantRoleIds(b)].sort((x, y) => x - y);
  return (
    left.length === right.length && left.every((id, index) => id === right[index])
  );
}

const BOOLEAN_FIELD_KEYS = new Set([
  "add_legal_agent_of_owner",
  "is_there_a_legal_representative_of_the_tenant",
  "furnished",
  "kitchen_tank",
  "electricity_meter",
  "water_meter",
  "conditions",
  "tenant_roles",
  "additional_terms",
]);

const REQUIRED_BOOLEAN_DEFAULTS = {
  add_legal_agent_of_owner: 0,
};

export function normalizeFieldValue(value, key) {
  if (key === "tenant_role_ids") {
    return parseTenantRoleIds(value);
  }
  if (BOOLEAN_FIELD_KEYS.has(key)) {
    return value === 1 || value === "1" || value === true ? 1 : 0;
  }
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === "object") {
    if (value?.price != null) return String(value.price);
    return "";
  }
  return String(value);
}

export function getStepFormValues(orderData, step) {
  const keys = CONTRACT_STEP_KEYS[step] ?? [];
  return Object.fromEntries(
    keys.map((key) => [key, normalizeFieldValue(readValue(orderData, step, key), key)])
  );
}

export function buildContractUpdatePayload(step, form, initialForm) {
  const allowed = new Set(CONTRACT_STEP_KEYS[step] ?? []);
  const payload = {};

  for (const [key, value] of Object.entries(form)) {
    if (!allowed.has(key)) continue;
    const initial = initialForm?.[key];
    if (value === initial) continue;
    if (value === "" && (initial === "" || initial === undefined)) continue;

    if (key === "tenant_role_ids") {
      const ids = parseTenantRoleIds(value);
      if (!tenantRoleIdsEqual(ids, initial)) {
        payload[key] = ids;
      }
      continue;
    }

    if (
      [
        "furnished",
        "kitchen_tank",
        "add_legal_agent_of_owner",
        "is_there_a_legal_representative_of_the_tenant",
      ].includes(key)
    ) {
      payload[key] = value === 1 || value === "1" || value === true ? 1 : 0;
      continue;
    }

    payload[key] = value;
  }

  for (const [key, defaultValue] of Object.entries(REQUIRED_BOOLEAN_DEFAULTS)) {
    if (!allowed.has(key) || key in payload) continue;
    if (!(key in form)) continue;
    const value = form[key];
    payload[key] =
      value === 1 || value === "1" || value === true ? 1 : defaultValue;
  }

  return payload;
}

export function mapApiValidationErrors(errors) {
  if (!errors || typeof errors !== "object") return {};
  const mapped = {};
  for (const [key, messages] of Object.entries(errors)) {
    mapped[key] = Array.isArray(messages) ? messages[0] : String(messages);
  }
  return mapped;
}
