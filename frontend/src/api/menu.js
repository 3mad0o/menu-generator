import api from "../api/axois";

export const makeMenu = async () => {
  try {
    const data = await api.post("/menu/make");
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const fetchMenus = async () => {
  try {
    const data = await api.get("/menu/mine");
    return data;
  } catch (error) {
    console.error(error);
  }
};
export const fetchMenu = async (slug) => {
  try {
    const data = await api.get(`/menu/${slug}`);
    return data;
  } catch (error) {
    console.error(error);
  }
};
export const updateInput = async (slug, key, value) => {
  try {
    if (key === "store_logo" && value instanceof File) {
      const formData = new FormData();
      formData.append("key", key);
      formData.append("value", value);

      const data = await api.post(`/menu/${slug}/details`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    }
    const data = await api.post(`/menu/${slug}/details`, { key, value });
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const makeSection = async (slug) => {
  try {
    const data = await api.post(`/menu/${slug}/section/create`);
    return data;
  } catch (error) {
    console.error(error);
  }
};
export const updateSectionName = async (slug, sectionId, value) => {
  try {
    const data = await api.put(
      `/menu/${slug}/section/${sectionId}/update-name`,
      { title: value }
    );
    return data;
  } catch (error) {
    console.error(error);
  }
};
export const deleteSection = async (slug, sectionId) => {
  try {
    const data = await api.delete(`/menu/${slug}/section/${sectionId}`);
    return data;
  } catch (error) {
    console.error(error);
  }
};
export const addSectionVariant = async (slug, sectionId) => {
  try {
    const data = await api.post(
      `/menu/${slug}/section/${sectionId}/variant/create`
    );
    return data;
  } catch (error) {
    console.error(error);
  }
};
