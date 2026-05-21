import { useMemo } from "react";
import {
  addSectionVariant,
  createSectionItem,
  deleteSection,
  deleteSectionItem,
  deleteSectionVariant,
  makeSection,
  updateSectionItem,
  updateSectionName,
  updateSectionVariant,
} from "@/api/menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Rows3,
  Trash2,
} from "lucide-react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

const createClientId = (prefix) =>
  `${prefix}-${globalThis.crypto?.randomUUID?.() ?? Date.now()}`;

const buildItemVariant = (variantId) => ({
  id: createClientId("item-variant"),
  menu_section_variant_id: variantId,
  price: "",
});

const buildItem = (variants, fallbackName = "New item") => ({
  id: createClientId("item"),
  name: fallbackName,
  variants: variants.map((variant) => buildItemVariant(variant.id)),
});

function getItemVariantIndex(item, sectionVariantId) {
  return item?.variants?.findIndex(
    (variant) => variant.menu_section_variant_id === sectionVariantId
  );
}

function SectionItemsTable({ sectionIndex, sectionId, slug }) {
  const { control, register, getValues, setValue } = useFormContext();
  const variantsName = `sections.${sectionIndex}.variants`;
  const itemsName = `sections.${sectionIndex}.items`;
  const watchedVariantValues = useWatch({ control, name: variantsName });
  const watchedItemValues = useWatch({ control, name: itemsName });
  const watchedVariants = useMemo(
    () => watchedVariantValues ?? [],
    [watchedVariantValues]
  );
  const watchedItems = useMemo(
    () => watchedItemValues ?? [],
    [watchedItemValues]
  );

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: variantsName,
  });

  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control,
    name: itemsName,
  });

  const columns = useMemo(
    () =>
      variantFields.map((field, index) => ({
        ...field,
        value: watchedVariants[index],
      })),
    [variantFields, watchedVariants]
  );

  const rows = useMemo(
    () =>
      itemFields.map((field, index) => ({
        ...field,
        value: watchedItems[index],
      })),
    [itemFields, watchedItems]
  );

  const handleAddVariant = async () => {
    const response = await addSectionVariant(slug, sectionId);
    const variant = response?.data ?? {
      id: createClientId("variant"),
      name: `Variant ${columns.length + 1}`,
    };

    appendVariant(variant);

    rows.forEach((row, rowIndex) => {
      const variants = row.value?.variants ?? [];
      setValue(`${itemsName}.${rowIndex}.variants`, [
        ...variants,
        buildItemVariant(variant.id),
      ]);
    });
  };

  const handleRemoveVariant = async (variantIndex, variantId) => {
    await deleteSectionVariant(slug, sectionId, variantId);
    removeVariant(variantIndex);

    rows.forEach((row, rowIndex) => {
      const variants = (row.value?.variants ?? []).filter(
        (itemVariant) => itemVariant.menu_section_variant_id !== variantId
      );
      setValue(`${itemsName}.${rowIndex}.variants`, variants);
    });
  };

  const handleAddItem = async () => {
    const response = await createSectionItem(slug, sectionId);
    const item = response?.data ?? buildItem(watchedVariants);
    const existingVariants = item.variants ?? [];

    appendItem({
      ...item,
      variants: watchedVariants.map(
        (variant) =>
          existingVariants.find(
            (itemVariant) => itemVariant.menu_section_variant_id === variant.id
          ) ?? buildItemVariant(variant.id)
      ),
    });
  };

  const handleRemoveItem = async (itemIndex, itemId) => {
    await deleteSectionItem(slug, sectionId, itemId);
    removeItem(itemIndex);
  };

  const persistItem = async (itemIndex) => {
    const item = getValues(`${itemsName}.${itemIndex}`);
    await updateSectionItem(slug, sectionId, item.id, item);
  };

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-md border bg-card">
        <table className="w-full min-w-[620px] table-fixed border-collapse text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="w-[180px] border-b border-r p-2 text-left font-medium text-muted-foreground">
                Item
              </th>
              {columns.map((variant, variantIndex) => (
                <th
                  key={variant.id}
                  className="min-w-[130px] border-b border-r p-2 align-top"
                >
                  <div className="flex items-center gap-2">
                    <Input
                      aria-label="Variant name"
                      placeholder="Variant"
                      className="h-8 bg-white font-medium"
                      {...register(
                        `${variantsName}.${variantIndex}.name`,
                        {
                          onBlur: (event) =>
                            updateSectionVariant(
                              slug,
                              sectionId,
                              variant.value?.id,
                              event.target.value
                            ),
                        }
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-muted-foreground"
                      onClick={() =>
                        handleRemoveVariant(variantIndex, variant.value?.id)
                      }
                      aria-label="Remove variant"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </th>
              ))}
              <th className="w-12 border-b p-2 text-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleAddVariant}
                  aria-label="Add variant"
                  title="Add variant"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item, itemIndex) => (
              <tr key={item.id}>
                <td className="border-r border-t p-2 align-top">
                  <Input
                    aria-label="Item name"
                    placeholder="Item name"
                    className="h-8 bg-white font-medium"
                    {...register(`${itemsName}.${itemIndex}.name`, {
                      onBlur: () => persistItem(itemIndex),
                    })}
                  />
                </td>
                {columns.map((variant) => {
                  const itemVariantIndex = getItemVariantIndex(
                    item.value,
                    variant.value?.id
                  );
                  const pricePath =
                    itemVariantIndex >= 0
                      ? `${itemsName}.${itemIndex}.variants.${itemVariantIndex}.price`
                      : "";

                  return (
                    <td
                      key={variant.id}
                      className="border-r border-t p-2 align-top"
                    >
                      {pricePath ? (
                        <Input
                          aria-label={`${item.value?.name ?? "Item"} ${
                            variant.value?.name ?? "variant"
                          } price`}
                          placeholder="Price"
                          inputMode="decimal"
                          className="h-8 bg-white"
                          {...register(pricePath, {
                            onBlur: () => persistItem(itemIndex),
                          })}
                        />
                      ) : (
                        <span className="block h-8 rounded-md bg-muted" />
                      )}
                    </td>
                  );
                })}
                <td className="border-t p-2 text-center align-top">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(itemIndex, item.value?.id)}
                    className="text-muted-foreground"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleAddItem}
      >
        <Rows3 className="h-4 w-4" />
        Add item
      </Button>
    </div>
  );
}

function SectionEditor({ index, onRemove }) {
  const { register, getValues, setValue } = useFormContext();
  const section = useWatch({ name: `sections.${index}` });
  const slug = getValues("slug");
  const isOpen = section?.isOpen ?? false;

  const toggleSection = () => {
    setValue(`sections.${index}.isOpen`, !isOpen);
  };

  const handleDeleteSection = async () => {
    await deleteSection(slug, section.id);
    onRemove(index);
  };

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardHeader className="flex-row items-center gap-2 border-b bg-muted/40 px-3 py-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleSection}
          aria-label={isOpen ? "Collapse section" : "Expand section"}
        >
          {isOpen ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </Button>

        <Input
          {...register(`sections.${index}.title`, {
            onBlur: (event) =>
              updateSectionName(slug, section.id, event.target.value),
          })}
          className="h-9 border-transparent bg-background font-semibold"
          placeholder="Section title"
        />

        <Badge variant="secondary" className="hidden shrink-0 sm:inline-flex">
          {section?.items?.length ?? 0} items
        </Badge>
        <DeleteSectionButton onDelete={handleDeleteSection} />
      </CardHeader>

      {isOpen && (
        <CardContent className="p-4">
          <SectionItemsTable
            sectionIndex={index}
            sectionId={section.id}
            slug={slug}
          />
        </CardContent>
      )}
    </Card>
  );
}

function DeleteSectionButton({ onDelete }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onDelete}
      className="text-muted-foreground"
      aria-label="Delete section"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

const Sections = () => {
  const { control, getValues } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
  });

  const handleNewSection = async () => {
    const response = await makeSection(getValues("slug"));
    const section = response?.data ?? {
      id: createClientId("section"),
      title: `Section ${fields.length + 1}`,
      order: fields.length + 1,
      variants: [],
      items: [],
    };

    append({
      ...section,
      variants: section.variants ?? [],
      items: section.items ?? [],
      isOpen: true,
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>Sections</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Add categories, item rows, and variant columns.
            </p>
          </div>
          <Button type="button" onClick={handleNewSection}>
            <Plus className="h-4 w-4" />
            Add section
          </Button>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {fields.map((section, index) => (
          <SectionEditor key={section.id} index={index} onRemove={remove} />
        ))}
      </div>
    </div>
  );
};

export default Sections;
