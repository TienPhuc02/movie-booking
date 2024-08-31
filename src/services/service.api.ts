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
export const APICreateGenre = (data: { genreName: string }) => {
  return instance.post("Genre/upsert_genre", data);
};
export const APIGetAllGenre = (data: any) => {
  return instance.post("Genre/page_list_genre", data);
};
export const APIGetGenreDetail = (data:any) => {
  return instance.post("Genre/genre_detail", data, {headers: {
    "Content-Type": "application/json", // Đảm bảo Content-Type đúng
    },
  }); 
};

export const APICreateRegion = (data: { regionName: string }) => {
  return instance.post("Region/upsert_region", data);
};
export const APIGetAllRegion = (data: any) => {
  return instance.post("Region/page_list_region", data);
};
export const APIGetRegionDetail = (data:any) => {
  return instance.post("Region/region_detail", data, {headers: {
    "Content-Type": "application/json", // Đảm bảo Content-Type đúng
    },
  }); 
};
