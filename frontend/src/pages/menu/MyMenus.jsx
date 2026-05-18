import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { makeMenu, fetchMenus } from "../../api/menu";
import default_menu_image from "@/assets/images/menu_1.jpg";
import { Edit, Copy, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const MyMenus = () => {
  const [myMenus, setMyMenus] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    handleFetchMenus();
  }, []);

  async function handleFetchMenus() {
    try {
      const res = await fetchMenus();
      setMyMenus(res.data); // assuming API returns { data: [...] }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleGenerateNewMenu() {
    try {
      const res = await makeMenu();
      setMyMenus((data) => [res.data, ...data]);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="relative w-full min-h-screen bg-slate-50 overflow-hidden">
      <div className="container ">
        {/* Background icons */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <div className="absolute top-20 left-10 text-[180px]">🍽️</div>
          <div className="absolute bottom-10 right-20 text-[220px]">📋</div>
          <div className="absolute top-1/2 right-1/3 text-[160px]">🥗</div>
        </div>

        <div className="relative z-10 py-14">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between mb-8 gap-[20px]">
            <div>
              <h4 className="text-4xl font-semibold text-slate-900">
                My Menus
              </h4>
              <p className="mt-1 text-slate-500">
                Create, manage, and organize your menus
              </p>
            </div>

            <button
              onClick={handleGenerateNewMenu}
              className="flex items-center justify-center gap-2 rounded-[6px] bg-blue-600 px-5 py-3 text-white shadow-lg transition hover:bg-blue-700 cursor-pointer"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">New Menu</span>
            </button>
          </div>

          {/* Menus grid */}
          {myMenus.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 cursor-pointer">
              {myMenus.map((menu) => (
                <div
                  key={menu.slug}
                  className="group min-h-[320px] relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100"
                >
                  {/* Actions */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition z-50">
                    <button
                      onClick={() => {
                        navigate(`/my-menus/${menu.slug}`);
                      }}
                      className="w-9 h-9 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 transition"
                    >
                      <Edit size={16} className="text-white" />
                    </button>

                    <button className="w-9 h-9 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 transition">
                      <Copy size={16} className="text-white" />
                    </button>

                    <button className="w-9 h-9 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 transition">
                      <Trash2 size={16} className="text-white" />
                    </button>
                  </div>

                  <img
                    src={default_menu_image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover rounded-[6px]"
                  />

                  <div className="absolute flex flex-col justify-end items-center left-0 bottom-0 w-full h-40 bg-gradient-to-t from-black/70 to-transparent rounded-[6px]">
                    <div className="p-6 ">
                      {" "}
                      <h5 className="text-xl font-semibold text-white mb-2 tracking-tight">
                        {menu.title || "Untitled Menu"}
                      </h5>
                      <p className="text-slate-400 text-xs">
                        Created ·{" "}
                        {new Date(menu.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-24 flex flex-col items-center justify-center text-center ">
              <div className="mb-6 rounded-2xl bg-white p-8 shadow-md">
                <span className="text-6xl">🍽️</span>
              </div>
              <h5 className="text-xl font-medium text-slate-800">
                No menus yet
              </h5>
              <p className="mt-2 max-w-sm text-slate-500">
                Start by creating your first menu. You can edit and update it
                anytime.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
