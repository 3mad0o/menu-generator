import { z } from "zod";

const nullableString = z.string().nullable().optional();
const idValue = z.union([z.number(), z.string()]);

const contactSchema = z
  .object({
    id: idValue,
    type: z.string().min(1, "Contact type is required"),
    value: z.string().optional().default(""),
  })
  .passthrough();

const sectionVariantSchema = z
  .object({
    id: idValue,
    name: z.string().min(1, "Variant name is required"),
  })
  .passthrough();

const itemVariantSchema = z
  .object({
    id: idValue.optional(),
    price: z.string().optional().default(""),
    menu_section_variant_id: idValue,
  })
  .passthrough();

const sectionItemSchema = z
  .object({
    id: idValue,
    name: z.string().min(1, "Item name is required"),
    variants: z.array(itemVariantSchema).default([]),
  })
  .passthrough();

const sectionSchema = z
  .object({
    id: idValue,
    title: z.string().min(1, "Section title is required"),
    order: z.number().optional(),
    variants: z.array(sectionVariantSchema).default([]),
    items: z.array(sectionItemSchema).default([]),
    isOpen: z.boolean().optional(),
  })
  .passthrough();

export const menuSchema = z
  .object({
    title: z.string().optional().default(""),
    store_name: z.string().min(1, "Store name is required"),
    store_logo: nullableString,
    store_subtitle: nullableString,
    slug: z.string().optional().default(""),
    sections: z.array(sectionSchema).default([]),
    contacts: z.array(contactSchema).default([]),
  })
  .passthrough();

export const emptyMenuValues = {
  title: "",
  store_name: "",
  store_logo: null,
  store_subtitle: "",
  slug: "",
  sections: [],
  contacts: [],
};

export function normalizeMenuValues(menu) {
  const source = menu ?? {};

  return {
    ...emptyMenuValues,
    ...source,
    store_subtitle: source.store_subtitle ?? "",
    sections: (source.sections ?? []).map((section, index) => ({
      ...section,
      order: section.order ?? index + 1,
      variants: section.variants ?? [],
      items: (section.items ?? []).map((item) => ({
        ...item,
        variants: item.variants ?? [],
      })),
      isOpen: section.isOpen ?? index === 0,
    })),
    contacts: source.contacts ?? [],
  };
}

export function zodResolver(schema) {
  return async (values) => {
    const result = schema.safeParse(values);

    if (result.success) {
      return {
        values: result.data,
        errors: {},
      };
    }

    return {
      values: {},
      errors: result.error.issues.reduce((errors, issue) => {
        const path = issue.path.join(".");
        errors[path] = {
          type: issue.code,
          message: issue.message,
        };
        return errors;
      }, {}),
    };
  };
}
