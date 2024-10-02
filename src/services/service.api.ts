import instance from '../customs/customizes.api';
export const APILogin = (data: any) => {
  return instance.post('/api/v1/Auth/login', data, {
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
  return instance.post('/api/v1/User/register', data);
};

//Genre
export const APICreateGenre = (data: any) => {
  return instance.post('/api/v1/Genre/upsert_genre', data);
};
export const APIGetAllGenre = (data: any) => {
  return instance.post('/api/v1/Genre/page_list_genre', data);
};
export const APIGetGenreDetail = (data: any) => {
  return instance.post('/api/v1/Genre/genre_detail', data);
};

export const APIDeleteGenre = (data: any) => {
  return instance.post('/api/v1/Genre/update_genre_status', data);
};

//Region
export const APICreateRegion = (data: any) => {
  return instance.post('/api/v1/Region/upsert_region', data);
};
export const APIGetAllRegion = (data: any) => {
  return instance.post('/api/v1/Region/page_list_region', data);
};
export const APIGetRegionDetail = (data: any) => {
  return instance.post('/api/v1/Region/region_detail', data);
};

export const APIDeleteRegion = (data: any) => {
  return instance.post('/api/v1/Region/update_region_status', data);
};

//Director
export const APICreateDirector = (data: any) => {
  return instance.post('/api/v1/Director/upsert_director', data);
};
export const APIGetAllDirector = (data: any) => {
  return instance.post('/api/v1/Director/page_list_director', data);
};
export const APIGetDirectorDetail = (data: any) => {
  return instance.post('/api/v1/Director/director_detail', data);
};

export const APIDeleteDirector = (data: any) => {
  return instance.post('/api/v1/Director/update_director_status', data);
};

//Cast
export const APICreateCast = (data: any) => {
  return instance.post('/api/v1/Cast/upsert_cast', data);
};
export const APIGetAllCast = (data: any) => {
  return instance.post('/api/v1/Cast/page_list_cast', data);
};
export const APIGetCastDetail = (data: any) => {
  return instance.post('/api/v1/Cast/cast_detail', data);
};

export const APIDeleteCast = (data: any) => {
  return instance.post('/api/v1/Cast/update_cast_status', data);
};

//Movie
export const APICreateMovies = (data: any) => {
  return instance.post('/api/v1/Movies/upsert_movies', data);
};
export const APIGetAllMovies = (data: any) => {
  return instance.post('/api/v1/Movies/page_list_movies', data);
};
export const APIGetMoviesDetail = (data: any) => {
  return instance.post('/api/v1/Movies/movies_detail', data);
};

//Upload Image

export const APIUploadImage = (FileData: string, Type: string) => {
  const formData = new FormData();

  if (FileData) formData.append('FileData', FileData);
  if (Type) formData.append('Type', Type);
  const config = {
    headers: { 'Content-Type': 'multipart/form-data' }
    // Authorization: `Bearer ${localStorage.getItem('access_token')}`
  };
  return instance.put(`/api/v1/Upload/upload-image`, formData, config);
};
