import React, { use, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePreview } from "@/components/ui/ImagePreview";
import { MoveLeft } from "lucide-react";
import { Store } from "lucide-react";
import { TableOfContents } from "lucide-react";
import { BookUser } from "lucide-react";
import { updateInput } from "@/api/menu";
import { useForm, useFormContext } from "react-hook-form";
import Sections from "./sections";
export const MenuForm = () => {
  const { watch, register, setValue, getValues } = useFormContext();
  const [showThisSection, setShowThisSection] = useState("");
  const fileInputRef = useRef(null);
  const logo = watch("store_logo");
  const [uploading, setUploading] = useState(false);
  const slug = watch("slug");
  const sections = watch("sections");
  const contacts = watch("contacts");
  useEffect(() => {
    console.log(getValues());
  }, []);
  // useEffect(() => {
  //   if (menuData) {
  //     reset();
  //   }
  // }, [menuData, reset]);

  async function handleInputChange(key, value) {
    const res = await updateInput(slug, key, value);
    console.warn(res);
  }
  const handleNewSection = async () => {
    console.log("new section generated");
  };
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    const previewUrl = URL.createObjectURL(file);

    setValue("store_logo", previewUrl);
    if (!file) return;

    setUploading(true);

    // Send file to backend
    await handleInputChange("store_logo", file);

    setUploading(false);
  };

  return (
    <div className="flex-1 p-4 overflow-y-scroll">
      {/* back Arrow */}
      {showThisSection != "" && (
        <>
          <MoveLeft
            className="cursor-pointer"
            onClick={() => {
              setShowThisSection("");
            }}
          />
        </>
      )}
      {/* List of Sections  */}
      {showThisSection == "" && (
        <div className="flex flex-col rounded-[6px]">
          {/* Basic Information */}
          <div
            onClick={() => {
              setShowThisSection("basic_information");
            }}
            className="flex flex-row gap-[10px] p-4 border-b border-b-gray-400 cursor-pointer"
          >
            <Store />
            <span>{`Basic Information`}</span>
          </div>
          {/* Sections */}
          <div
            onClick={() => {
              setShowThisSection("sections");
            }}
            className="flex flex-row gap-[10px] p-4 border-b border-b-gray-400 cursor-pointer"
          >
            <TableOfContents />
            <span>{`Sections`}</span>
          </div>
          {/* Contacts */}
          <div
            onClick={() => {
              setShowThisSection("contacts");
            }}
            className="flex flex-row gap-[10px] p-4 border-b border-b-gray-400 cursor-pointer"
          >
            <BookUser />
            <span>{`Contacts`}</span>
          </div>
        </div>
      )}

      {/* --------------------Inside Each Section----------------------------- */}

      {/* Basic Information*/}

      {showThisSection === "basic_information" && (
        <form className="mt-[40px]" action="">
          <div className="store-name flex flex-col gap-[5px] mb-[15px]">
            <Label className={"mb-[5px]"} htmlFor="store_name">
              Store Name
            </Label>
            <Input
              id="store_name"
              placeholder="Store Name"
              {...register("store_name", {
                onChange: (e) =>
                  handleInputChange("store_name", e.target.value),
              })}
            />
          </div>
          <div className="title flex flex-col gap-[5px] mb-[15px]">
            <Label className={"mb-[5px]"} htmlFor="title">
              title
            </Label>
            <Input
              id={"title"}
              type="text"
              {...register("title", {
                onChange: (e) => handleInputChange("title", e.target.value),
              })}
              placeholder="title"
            />
          </div>
          <div className="store_subtitle flex flex-col gap-[5px] mb-[15px]">
            <Label className={"mb-[5px]"} htmlFor="store_subtitle">
              store_subtitle
            </Label>
            <Input
              id={"store_subtitle"}
              type="text"
              {...register("store_subtitle", {
                onChange: (e) =>
                  handleInputChange("store_subtitle", e.target.value),
              })}
              placeholder="store_subtitle"
            />
          </div>
          <div className="image flex flex-col gap-[5px] mb-[15px]">
            <Label className={"mb-[5px]"} htmlFor="store_logo">
              store_logo
            </Label>
            {logo != null ? (
              <ImagePreview
                onRemove={() => {
                  setValue("store_logo", null);
                }}
              />
            ) : (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleLogoUpload}
                />

                <div
                  onClick={() => fileInputRef.current.click()}
                  className="h-[100px] flex flex-col justify-center items-center text-slate-400 text-sm w-full rounded-[6px] border border-gray-300 border-dashed cursor-pointer hover:bg-slate-50 transition"
                >
                  {uploading ? "Uploading..." : "Click to upload logo"}
                </div>
              </>
            )}
          </div>
        </form>
      )}
      {/* Sections */}

      {showThisSection === "sections" && sections?.length > 0 && <Sections />}
      {/* Contacts */}

      {showThisSection === "contacts" &&
        contacts?.map((contact) => (
          <div
            key={contact.id}
            className="mt-[10px] flex flex-col gap-[5px] mb-[15px]"
          >
            <Label>{contact.type}</Label>
            <Input type="text" value={contact.value} />
          </div>
        ))}
    </div>
  );
};
