import instance from "../customs/customizes.api";
export const APILogin = (data: { email: string; password: string }) => {
  return instance.post("Auth/login", data);
};
export const APIRegister = (data: {
  email: string;
  fullname: string;
  gender: number;
  birthday: string;
  phoneNumber: string;
  password: string;
  password2: string;
}) => {
  return instance.post("User/register", data);
};

//Genre
export const APICreateGenre = (data:any) => {
  return instance.post("Genre/upsert_genre", data,{
    headers: {
      "Content-Type": "application/json", // Đảm bảo Content-Type đúng
    },
  });
};
export const APIGetAllGenre = (data: any) => {
  return instance.post("Genre/page_list_genre", data);
};
export const APIGetGenreDetail = (data: any) => {
  return instance.post("Genre/genre_detail", data, {
    headers: {
      "Content-Type": "application/json", // Đảm bảo Content-Type đúng
    },
  });
};

export const APIDeleteGenre = (data: any) => {
  return instance.post("Genre/update_genre_status", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};


//Region
export const APICreateRegion = (data:any) => {
  return instance.post("Region/upsert_region", data);
};
export const APIGetAllRegion = (data: any) => {
  return instance.post("Region/page_list_region", data);
};
export const APIGetRegionDetail = (data: any) => {
  return instance.post("Region/region_detail", data, {
    headers: {
      "Content-Type": "application/json", // Đảm bảo Content-Type đúng
    },
  });
};

export const APIDeleteRegion = (data: any) => {
  return instance.post("Region/update_region_status", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};


//Director
export const APICreateDirector = (data:any) => {
  return instance.post("Director/upsert_director", data);
};
export const APIGetAllDirector = (data: any) => {
  return instance.post("Director/page_list_director", data);
};
export const APIGetDirectorDetail = (data: any) => {
  return instance.post("Director/director_detail", data, {
    headers: {
      "Content-Type": "application/json", // Đảm bảo Content-Type đúng
    },
  });
};

export const APIDeleteDirector = (data: any) => {
  return instance.post("Director/update_director_status", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};