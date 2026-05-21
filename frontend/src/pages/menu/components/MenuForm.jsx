import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePreview } from "@/components/ui/ImagePreview";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookUser,
  MoveLeft,
  Store,
  TableOfContents,
} from "lucide-react";
import { updateInput } from "@/api/menu";
import { useFieldArray, useFormContext } from "react-hook-form";
import Sections from "./sections";

const formSections = [
  {
    id: "basic_information",
    label: "Basic Information",
    icon: Store,
  },
  {
    id: "sections",
    label: "Sections",
    icon: TableOfContents,
  },
  {
    id: "contacts",
    label: "Contacts",
    icon: BookUser,
  },
];

function EditorMenu({ onSelect }) {
  return (
    <Card className="gap-0 py-0">
      {formSections.map((section) => {
        const Icon = section.icon;

        return (
          <Button
            key={section.id}
            type="button"
            variant="ghost"
            onClick={() => onSelect(section.id)}
            className="h-14 justify-start rounded-none border-b px-4 last:border-b-0"
          >
            <Icon className="h-5 w-5 text-muted-foreground" />
            {section.label}
          </Button>
        );
      })}
    </Card>
  );
}

function FieldError({ name }) {
  const {
    formState: { errors },
  } = useFormContext();
  const error = name
    .split(".")
    .reduce((current, key) => current?.[key], errors);

  if (!error?.message) {
    return null;
  }

  return <p className="text-xs text-destructive">{error.message}</p>;
}

function BasicInformationForm() {
  const { watch, register, setValue, getValues } = useFormContext();
  const fileInputRef = useRef(null);
  const logo = watch("store_logo");
  const [uploading, setUploading] = useState(false);

  const persistDetail = (key, value) => updateInput(getValues("slug"), key, value);

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setValue("store_logo", previewUrl, { shouldDirty: true });
    setUploading(true);
    await persistDetail("store_logo", file);
    setUploading(false);
  };

  const handleRemoveLogo = async () => {
    setValue("store_logo", null, { shouldDirty: true });
    await persistDetail("store_logo", null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Store identity used in the live menu preview.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="store_name">Store Name</Label>
            <Input
              id="store_name"
              placeholder="Store Name"
              {...register("store_name", {
                onBlur: (event) =>
                  persistDetail("store_name", event.target.value),
              })}
            />
            <FieldError name="store_name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Title"
              {...register("title", {
                onBlur: (event) => persistDetail("title", event.target.value),
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="store_subtitle">Store subtitle</Label>
            <Input
              id="store_subtitle"
              type="text"
              placeholder="Store subtitle"
              {...register("store_subtitle", {
                onBlur: (event) =>
                  persistDetail("store_subtitle", event.target.value),
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="store_logo">Store logo</Label>
            {logo ? (
              <ImagePreview onRemove={handleRemoveLogo} />
            ) : (
              <>
                <input
                  ref={fileInputRef}
                  id="store_logo"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleLogoUpload}
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-28 w-full border-dashed text-muted-foreground"
                >
                  {uploading ? "Uploading..." : "Click to upload logo"}
                </Button>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ContactsForm() {
  const { control, register } = useFormContext();
  const { fields } = useFieldArray({
    control,
    name: "contacts",
  });

  if (fields.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">
          No contacts yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contacts</CardTitle>
        <CardDescription>Contact details displayed on the menu.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((contact, index) => (
          <div key={contact.id} className="space-y-2">
            <Label htmlFor={`contact-${contact.id}`}>{contact.type}</Label>
            <Input
              id={`contact-${contact.id}`}
              type="text"
              {...register(`contacts.${index}.value`)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ActiveSection({ id }) {
  if (id === "basic_information") {
    return <BasicInformationForm />;
  }

  if (id === "sections") {
    return <Sections />;
  }

  if (id === "contacts") {
    return <ContactsForm />;
  }

  return null;
}

export const MenuForm = () => {
  const [activeSection, setActiveSection] = useState("");

  return (
    <aside className="h-full w-full overflow-y-auto border-l bg-muted/30 p-4 md:w-[460px]">
      {activeSection && (
        <Button
          type="button"
          variant="ghost"
          className="mb-5"
          onClick={() => setActiveSection("")}
        >
          <MoveLeft className="h-4 w-4" />
          Back
        </Button>
      )}

      {activeSection ? (
        <ActiveSection id={activeSection} />
      ) : (
        <EditorMenu onSelect={setActiveSection} />
      )}
    </aside>
  );
};
