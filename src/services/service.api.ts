import instance from '../customs/customizes.api';
export const APILogin = (data: any) => {
  return instance.post('Auth/login', data, {
    headers: {
      'Content-Type': 'application/json' // Đảm bảo Content-Type đúng
    }
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
  return instance.post('User/register', data);
};

//Genre
export const APICreateGenre = (data: any) => {
  return instance.post('Genre/upsert_genre', data, );
};
export const APIGetAllGenre = (data: any) => {
  return instance.post('Genre/page_list_genre', data, );
};
export const APIGetGenreDetail = (data: any) => {
  return instance.post('Genre/genre_detail', data, );
};

export const APIDeleteGenre = (data: any) => {
  return instance.post('Genre/update_genre_status', data, );
};

//Region
export const APICreateRegion = (data: any) => {
  return instance.post('Region/upsert_region', data, );
};
export const APIGetAllRegion = (data: any) => {
  return instance.post('Region/page_list_region', data, );
};
export const APIGetRegionDetail = (data: any) => {
  return instance.post('Region/region_detail', data, );
};

export const APIDeleteRegion = (data: any) => {
  return instance.post('Region/update_region_status', data, );
};

//Director
export const APICreateDirector = (data: any) => {
  return instance.post('Director/upsert_director', data, );
};
export const APIGetAllDirector = (data: any) => {
  return instance.post('Director/page_list_director', data, );
};
export const APIGetDirectorDetail = (data: any) => {
  return instance.post('Director/director_detail', data, );
};

export const APIDeleteDirector = (data: any) => {
  return instance.post('Director/update_director_status', data,);
};

//Cast
export const APICreateCast = (data: any) => {
  return instance.post('Cast/upsert_cast', data, );
};
export const APIGetAllCast = (data: any) => {
  return instance.post('Cast/page_list_cast', data);
};
export const APIGetCastDetail = (data: any) => {
  return instance.post('Cast/cast_detail', data, );
};

export const APIDeleteCast = (data: any) => {
  return instance.post('Cast/update_cast_status', data, );
};

//Upload Image

export const APIUploadImage = (FileData: string, Type: string, owner_uuid:string, owner_type :string) => {
  const formData = new FormData();

  if (FileData) formData.append('FileData', FileData);
  if (Type) formData.append('Type', Type);
  if (owner_uuid) formData.append('owner_uuid', owner_uuid);
  if (owner_type) formData.append('owner_type', owner_type);
  const config = {
    headers: { 'Content-Type': 'multipart/form-data' },
    // Authorization: `Bearer ${localStorage.getItem('access_token')}`
  };
  return instance.put(`Upload/upload-image`, formData, config);
};
