import { forwardRef, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

const colors = {
  page: "#ffffff",
  ink: "#000000",
  muted: "#404040",
  subtle: "#737373",
  rule: "#d4d4d4",
  shell: "#f5f5f5",
};

const MenuPreview = forwardRef(function MenuPreview({ className }, ref) {
  const { watch } = useFormContext();
  const data = watch();
  const viewportRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const nextScale = Math.min(
        (width - 32) / A4_WIDTH,
        (height - 32) / A4_HEIGHT,
        1
      );
      setScale(Math.max(nextScale, 0.28));
    });

    resizeObserver.observe(viewport);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <section
      ref={viewportRef}
      className={cn(
        "flex-1 overflow-auto p-4 md:p-8",
        className
      )}
      style={{ backgroundColor: colors.shell }}
    >
      <div
        className="mx-auto"
        style={{
          width: A4_WIDTH * scale,
          height: A4_HEIGHT * scale,
        }}
      >
        <div
          ref={ref}
          data-pdf-page="true"
          className="menu-pdf-page origin-top-left p-10 font-serif shadow-md print:shadow-none"
          style={{
            width: A4_WIDTH,
            minHeight: A4_HEIGHT,
            transform: `scale(${scale})`,
            backgroundColor: colors.page,
            color: colors.ink,
          }}
        >
          <div className="mb-10 grid grid-cols-[1fr_auto] gap-8">
            <div className="flex items-center gap-4">
              {data.store_logo && (
                <img
                  src={data.store_logo}
                  alt="Store Logo"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  className="h-24 w-24 object-cover"
                />
              )}
              <div>
                {data.store_name && (
                  <h1
                    className="text-4xl font-bold leading-tight"
                    style={{ color: colors.ink }}
                  >
                    {data.store_name}
                  </h1>
                )}
                {data.store_subtitle && (
                  <p
                    className="mt-2 text-base"
                    style={{ color: colors.muted }}
                  >
                    {data.store_subtitle}
                  </p>
                )}
                {data.title && (
                  <p
                    className="mt-1 text-sm uppercase tracking-[0.2em]"
                    style={{ color: colors.subtle }}
                  >
                    {data.title}
                  </p>
                )}
              </div>
            </div>

            <div className="text-right">
              {data?.contacts?.map((contact) => (
                <p
                  key={contact.id}
                  className="text-sm"
                  style={{ color: colors.muted }}
                >
                  <span className="font-semibold">{contact.type}:</span>{" "}
                  {contact.value}
                </p>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-10">
            {data?.sections?.map((section) => (
              <MenuSection key={section.id} section={section} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

function MenuSection({ section }) {
  return (
    <div>
      <h2
        className="mb-5 pb-2 text-xl font-semibold"
        style={{
          borderBottom: `1px solid ${colors.rule}`,
          color: colors.ink,
        }}
      >
        {section.title}
      </h2>

      <div className="space-y-5">
        {section.items?.map((item) => (
          <MenuItem key={item.id} section={section} item={item} />
        ))}
      </div>
    </div>
  );
}

function MenuItem({ section, item }) {
  return (
    <div>
      <p className="font-semibold">{item.name}</p>

      <div className="mt-1 space-y-1">
        {item.variants
          ?.filter((variant) => variant.price !== "")
          .map((variant) => {
            const variantName =
              section?.variants?.find(
                (sectionVariant) =>
                  sectionVariant.id === variant.menu_section_variant_id
              )?.name ?? "";

            return (
              <div
                key={variant.id ?? variant.menu_section_variant_id}
                className="flex justify-between gap-4 text-sm"
                style={{ color: colors.muted }}
              >
                <span className="italic">{variantName}</span>
                <span>{variant.price}</span>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default MenuPreview;
