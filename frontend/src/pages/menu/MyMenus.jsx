import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { makeMenu, fetchMenus } from "../../api/menu";
import default_menu_image from "@/assets/images/menu_1.jpg";
import { Edit, Copy, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const MyMenus = () => {
  const [myMenus, setMyMenus] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    fetchMenus()
      .then((res) => {
        if (isMounted) {
          setMyMenus(res.data); // assuming API returns { data: [...] }
        }
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleGenerateNewMenu() {
    try {
      const res = await makeMenu();
      setMyMenus((data) => [res.data, ...data]);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30">
      <div className="container mx-auto py-10">
        <div className="space-y-8">
          <div className="flex flex-col items-stretch justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">
                My Menus
              </h2>
              <p className="mt-1 text-muted-foreground">
                Create, manage, and organize your menus
              </p>
            </div>

            <Button
              onClick={handleGenerateNewMenu}
              className="w-full md:w-auto"
            >
              <Plus size={20} />
              New Menu
            </Button>
          </div>

          {myMenus.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {myMenus.map((menu) => (
                <Card
                  key={menu.slug}
                  className="group overflow-hidden py-0 transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-[4/3]">
                    <img
                      src={default_menu_image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        onClick={() => navigate(`/my-menus/${menu.slug}`)}
                      >
                        <Edit size={16} />
                      </Button>

                      <Button type="button" size="icon" variant="secondary">
                        <Copy size={16} />
                      </Button>

                      <Button type="button" size="icon" variant="destructive">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="line-clamp-2 text-lg">
                        {menu.title || "Untitled Menu"}
                      </CardTitle>
                      <Badge variant="secondary">Draft</Badge>
                    </div>
                    <CardDescription>
                      Created {new Date(menu.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="mx-auto mt-20 max-w-md text-center">
              <CardHeader>
                <CardTitle>No menus yet</CardTitle>
                <CardDescription>
                  Start by creating your first menu. You can edit and update it
                  anytime.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleGenerateNewMenu}>
                  <Plus className="h-4 w-4" />
                  New Menu
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
