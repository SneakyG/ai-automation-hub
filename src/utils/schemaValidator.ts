/**
 * Trình kiểm tra JSON Schema rút gọn cho các schema mẫu trong ứng dụng:
 * hỗ trợ type (kể cả mảng kiểu như ["string","null"]), properties, required,
 * additionalProperties: false, items và enum.
 */

type JsonSchema = {
  type?: string | string[];
  properties?: Record<string, JsonSchema>;
  required?: string[];
  additionalProperties?: boolean;
  items?: JsonSchema;
  enum?: unknown[];
};

const typeOf = (value: unknown): string => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'number') return Number.isInteger(value) ? 'integer' : 'number';
  return typeof value;
};

const matchesType = (value: unknown, expected: string): boolean => {
  const actual = typeOf(value);
  if (expected === 'number') return actual === 'number' || actual === 'integer';
  return actual === expected;
};

const validateNode = (value: unknown, schema: JsonSchema, path: string, errors: string[]) => {
  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!types.some((t) => matchesType(value, t))) {
      errors.push(`${path || '(gốc)'}: cần kiểu ${types.join(' | ')}, nhận ${typeOf(value)}`);
      return;
    }
  }
  if (schema.enum && !schema.enum.includes(value)) {
    errors.push(`${path}: giá trị "${String(value)}" không nằm trong ${schema.enum.join(', ')}`);
  }
  if (typeOf(value) === 'object' && schema.properties) {
    const obj = value as Record<string, unknown>;
    (schema.required ?? []).forEach((key) => {
      if (!(key in obj)) errors.push(`${path ? `${path}.` : ''}${key}: thiếu trường bắt buộc`);
    });
    Object.entries(obj).forEach(([key, child]) => {
      const childSchema = schema.properties?.[key];
      const childPath = path ? `${path}.${key}` : key;
      if (childSchema) validateNode(child, childSchema, childPath, errors);
      else if (schema.additionalProperties === false) errors.push(`${childPath}: trường không có trong schema`);
    });
  }
  if (Array.isArray(value) && schema.items) {
    value.forEach((child, i) => validateNode(child, schema.items as JsonSchema, `${path}[${i}]`, errors));
  }
};

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

const invoiceArithmetic = (data: Record<string, unknown>): string[] => {
  const warnings: string[] = [];
  const items = Array.isArray(data.items) ? (data.items as Record<string, number>[]) : [];
  items.forEach((it, i) => {
    if (Math.abs(it.quantity * it.unit_price - it.total_amount) > 1) warnings.push(`items[${i}]: SL × đơn giá ≠ thành tiền`);
  });
  const sum = items.reduce((s, it) => s + (Number(it.total_amount) || 0), 0);
  const subtotal = Number(data.subtotal);
  const vat = Number(data.vat_amount);
  const total = Number(data.grand_total);
  if (!Number.isNaN(subtotal) && Math.abs(sum - subtotal) > 1) warnings.push('Tổng các dòng ≠ subtotal');
  if (![subtotal, vat, total].some(Number.isNaN) && Math.abs(subtotal + vat - total) > 1) warnings.push('subtotal + vat_amount ≠ grand_total');
  return warnings;
};

export const validateAgainstSchema = (jsonText: string, schemaText: string, arithmetic?: 'invoice'): ValidationResult => {
  let data: unknown;
  let schema: JsonSchema;
  try {
    schema = JSON.parse(schemaText) as JsonSchema;
  } catch {
    return { ok: false, errors: ['Schema mẫu không phải JSON hợp lệ.'], warnings: [] };
  }
  try {
    data = JSON.parse(jsonText);
  } catch (e) {
    return { ok: false, errors: [`JSON đầu ra không hợp lệ: ${(e as Error).message}`], warnings: [] };
  }
  const errors: string[] = [];
  validateNode(data, schema, '', errors);
  const warnings = arithmetic === 'invoice' && typeOf(data) === 'object' ? invoiceArithmetic(data as Record<string, unknown>) : [];
  return { ok: errors.length === 0 && warnings.length === 0, errors, warnings };
};
