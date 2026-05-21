import { useEffect, useRef, useState } from "react";
import { Download, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import MenuPreview from "./components/MenuPreview";
import { MenuForm } from "./components/MenuForm";
import { useParams } from "react-router-dom";
import { fetchMenu } from "../../api/menu";
import { FormProvider, useForm } from "react-hook-form";
import {
  emptyMenuValues,
  menuSchema,
  normalizeMenuValues,
  zodResolver,
} from "./menuSchema";

async function waitForImages(element) {
  const images = Array.from(element.querySelectorAll("img"));

  await Promise.all(
    images.map(async (image) => {
      if (image.complete && image.naturalWidth > 0) {
        return;
      }

      if (typeof image.decode === "function") {
        try {
          await image.decode();
          return;
        } catch {
          // Fall through to load/error events for browsers that reject decode early.
        }
      }

      await new Promise((resolve) => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      });
    })
  );
}

export const SingleMenu = () => {
  const menuRef = useRef(null);
  const { slug } = useParams();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  const methods = useForm({
    defaultValues: emptyMenuValues,
    mode: "onBlur",
    resolver: zodResolver(menuSchema),
  });

  useEffect(() => {
    async function fetchMenuData() {
      const response = await fetchMenu(slug);

      if (response?.data) {
        methods.reset(normalizeMenuValues(response.data));
        return;
      }

      const localResponse = await fetch("/response.json");
      const localData = await localResponse.json();
      methods.reset(normalizeMenuValues(localData.data));
    }

    fetchMenuData();
  }, [methods, slug]);

  const handleDownloadPdf = async () => {
    if (!menuRef.current) return;

    setIsDownloading(true);
    try {
      await waitForImages(menuRef.current);
      const html2pdf = (await import("html2pdf.js")).default;

      await html2pdf()
        .set({
          margin: 0,
          filename: `${methods.getValues("slug") || "menu"}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
            onclone: (clonedDocument) => {
              const style = clonedDocument.createElement("style");
              style.textContent = `
                :root {
                  --background: #ffffff !important;
                  --foreground: #000000 !important;
                  --card: #ffffff !important;
                  --card-foreground: #000000 !important;
                  --popover: #ffffff !important;
                  --popover-foreground: #000000 !important;
                  --primary: #000000 !important;
                  --primary-foreground: #ffffff !important;
                  --secondary: #f5f5f5 !important;
                  --secondary-foreground: #000000 !important;
                  --muted: #f5f5f5 !important;
                  --muted-foreground: #525252 !important;
                  --accent: #f5f5f5 !important;
                  --accent-foreground: #000000 !important;
                  --destructive: #000000 !important;
                  --border: #d4d4d4 !important;
                  --input: #d4d4d4 !important;
                  --ring: #000000 !important;
                }

                .menu-pdf-page,
                .menu-pdf-page * {
                  border-color: #d4d4d4 !important;
                  outline-color: #000000 !important;
                  text-decoration-color: currentColor !important;
                  box-shadow: none !important;
                }

                .menu-pdf-page {
                  transform: none !important;
                }
              `;
              clonedDocument.head.appendChild(style);
            },
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
          },
        })
        .from(menuRef.current)
        .save();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="relative flex h-full flex-col md:flex-row">
        <div className="fixed bottom-5 right-5 z-20 md:hidden">
          <Button
            type="button"
            onClick={() => setIsMobilePreviewOpen(true)}
            className="shadow-lg"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
        </div>

        <div className="absolute right-6 top-6 z-10 hidden md:block">
          <Button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
          >
            <Download className="h-4 w-4" />
            {isDownloading ? "Preparing..." : "Download PDF"}
          </Button>
        </div>
        <MenuPreview ref={menuRef} className="hidden md:block" />
        <MenuForm />

        {isMobilePreviewOpen && (
          <div className="fixed inset-0 z-30 flex flex-col bg-white md:hidden">
            <div className="flex items-center justify-between border-b bg-background px-4 py-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsMobilePreviewOpen(false)}
                aria-label="Close preview"
              >
                <X className="h-5 w-5" />
              </Button>

              <Button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isDownloading}
              >
                <Download className="h-4 w-4" />
                {isDownloading ? "Preparing..." : "Download"}
              </Button>
            </div>

            <MenuPreview ref={menuRef} className="min-h-0" />
          </div>
        )}
      </div>
    </FormProvider>
  );
};
