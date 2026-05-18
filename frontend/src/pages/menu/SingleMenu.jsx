import React, { useEffect, useRef, useState } from "react";
import MenuPreview from "./components/MenuPreview";
import { MenuForm } from "./components/MenuForm";
import { Form, useParams } from "react-router-dom";
import { fetchMenu } from "../../api/menu";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

export const SingleMenu = () => {
  const [menuData, setMenuData] = useState();
  const menuRef = useRef();
  const methods = useForm();
  const { slug } = useParams();
  async function fetchMenuData() {
    const res = await fetchMenu(slug);
    methods.reset(res.data);
    console.log(res.data);
  }
  useEffect(() => {
    fetchMenuData(slug);
  }, []);
  return (
    <FormProvider {...methods}>
      <div className="flex flex-col md:flex-row h-full">
        <MenuPreview ref={menuRef} />
        <MenuForm menuData={menuData} slug={slug} />
      </div>
    </FormProvider>
  );
};
