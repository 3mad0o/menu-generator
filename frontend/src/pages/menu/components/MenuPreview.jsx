import React, { forwardRef, use, useEffect } from "react";
import { useFormContext } from "react-hook-form";

const MenuPreview = forwardRef((ref) => {
  const { watch } = useFormContext();
  const data = watch();
  useEffect(() => {
    console.log("Menu Preview Data:", data);
  }, [data]);
  return (
    <>
      {data && (
        <div
          ref={ref}
          className="flex-1 bg-[#f7f4ec]  p-10 shadow-md font-serif print:shadow-none w-[210mm] min-h-[297mm] scale-80"
        >
          {/* Header */}
          <div className="grid grid-cols-2 gap-10 mb-12">
            <div className="flex items-center justify-center  flex-row gap-2">
              {data.store_logo && (
                <img
                  src={data.store_logo}
                  alt="Store Logo"
                  className="h-32 w-32 object-cover"
                />
              )}
              {data.store_name && (
                <h1 className="text-3xl font-bold leading-none">
                  {data.store_name}
                </h1>
              )}
            </div>

            <div className="text-right">
              {data?.contacts?.map((c) => (
                <p key={c.id} className="text-sm text-gray-600">
                  {c.type}: {c.value}
                </p>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="grid grid-cols-2 gap-12">
            {data?.sections?.map((section, index) => (
              <MenuSection
                key={section.id}
                section={section}
                alignRight={index % 2 !== 0}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
});

function MenuSection({ section }) {
  return (
    <div>
      <h2 className="text-xl font-semibold border-b pb-2 mb-6">
        {section.title}
      </h2>

      <div className="space-y-5">
        {section.items?.map((item) => (
          <div key={item.id}>
            <p className="font-semibold">{item.name}</p>

            <div className="mt-1 space-y-1">
              {item.variants.map((variant) => {
                const variantName =
                  section?.variants?.find(
                    (v) => v.id === variant.menu_section_variant_id
                  )?.name ?? "";

                return (
                  <div
                    key={variant.id}
                    className="flex justify-between text-sm text-gray-700"
                  >
                    <span className="italic">{variantName}</span>
                    <span>${variant.price}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuPreview;
