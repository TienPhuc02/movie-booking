import instance from "../customs/customizes.api";
export const APILogin = (data:any) => {
  return instance.post("Auth/login", data,{
    headers: {
      "Content-Type": "application/json", // Đảm bảo Content-Type đúng
    },
  });
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
       Authorization: `Bearer ${localStorage.getItem("access_token")}`
    },
 

  });
};
export const APIGetAllGenre = (data: any) => {
  return instance.post("Genre/page_list_genre", data,{
    headers: {
       Authorization: `Bearer ${localStorage.getItem("access_token")}`
    },
 

  });
};
export const APIGetGenreDetail = (data: any) => {
  return instance.post("Genre/genre_detail", data,{
    headers: {
       Authorization: `Bearer ${localStorage.getItem("access_token")}`
    },
 

  });
};

export const APIDeleteGenre = (data: any) => {
  return instance.post("Genre/update_genre_status", data,{
    headers: {
       Authorization: `Bearer ${localStorage.getItem("access_token")}`
    },
 

  });
};


//Region
export const APICreateRegion = (data:any) => {
  return instance.post("Region/upsert_region", data,{
    headers: {
       Authorization: `Bearer ${localStorage.getItem("access_token")}`
    },
 

  });
};
export const APIGetAllRegion = (data: any) => {
  return instance.post("Region/page_list_region", data,{
    headers: {
       Authorization: `Bearer ${localStorage.getItem("access_token")}`
    },
 

  });
};
export const APIGetRegionDetail = (data: any) => {
  return instance.post("Region/region_detail", data,{
    headers: {
       Authorization: `Bearer ${localStorage.getItem("access_token")}`
    },
 

  });
};

export const APIDeleteRegion = (data: any) => {
  return instance.post("Region/update_region_status", data,{
    headers: {
       Authorization: `Bearer ${localStorage.getItem("access_token")}`
    },
 

  });
};


//Director
export const APICreateDirector = (data:any) => {
  return instance.post("Director/upsert_director", data,{
    headers: {
       Authorization: `Bearer ${localStorage.getItem("access_token")}`
    },
 

  });
};
export const APIGetAllDirector = (data: any) => {
  return instance.post("Director/page_list_director", data,{
    headers: {
       Authorization: `Bearer ${localStorage.getItem("access_token")}`
    },
 

  });
};
export const APIGetDirectorDetail = (data: any) => {
  return instance.post("Director/director_detail", data,{
    headers: {
       Authorization: `Bearer ${localStorage.getItem("access_token")}`
    },
 

  });
};

export const APIDeleteDirector = (data: any) => {
  return instance.post("Director/update_director_status", data,{
    headers: {
       Authorization: `Bearer ${localStorage.getItem("access_token")}`
    },
 

  });
};


//Cast
export const APICreateCast = (data:any) => {
  return instance.post("Cast/upsert_cast", data,{
    headers: {
       Authorization: `Bearer ${localStorage.getItem("access_token")}`
    },
 

  });
};
export const APIGetAllCast = (data: any) => {
  return instance.post("Cast/page_list_cast", data,{
    headers: {
       Authorization: `Bearer ${localStorage.getItem("access_token")}`
    },
 

  });
};
export const APIGetCastDetail = (data: any) => {
  return instance.post("Cast/cast_detail", data,{
    headers: {
       Authorization: `Bearer ${localStorage.getItem("access_token")}`
    },
 

  });
};

export const APIDeleteCast = (data: any) => {
  return instance.post("Cast/update_cast_status", data,{
    headers: {
       Authorization: `Bearer ${localStorage.getItem("access_token")}`
    },
 

  });
};