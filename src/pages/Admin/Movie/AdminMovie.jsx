import React, { useEffect, useRef, useState } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined
} from '@ant-design/icons';

import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table
} from 'antd';

import Highlighter from 'react-highlight-words';
import '../../../css/AdminGenre.css';
import {
  APICreateMovies,
  APIGetAllDirector,
  APIGetAllMovies,
  APIGetDirectorDetail,
  APIGetMoviesDetail,
  APIUploadImage
} from '../../../services/service.api';

import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';

import moment from 'moment';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const AdminMovies = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [listMovies, setListMovies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [moviesDetail, setMoviesDetail] = useState(null);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);
  const [imagesUuid, setImagesUuid] = useState('');
  const [listDirector, setListDirector] = useState([]);
  const handleChangeStatus = (value) => {
    console.log(`selected ${value}`);
  };
  const handleChangeDirector = (value) => {
    console.log(`selected ${value}`);
  };
  // const baseURL = import.meta.env.VITE_BASE_URL; // Lấy base URL từ biến môi trường
  const handlePreviewCreateImage = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  // console.log('fileList,', fileList);
  const dummyRequestCreateImageCast = async ({ file, onSuccess }) => {
    console.log('Đây là file gì ' + file);
    const res = await APIUploadImage(file, '2');
    console.log('Check var' + res);
    if (res && res.status === 200) {
      console.log('UUID của ảnh:', res.data.data);
      setImagesUuid(res.data.data);
    }
    // form.setFieldsValue({ avatar: file as string });
    // setAvatar(file as string);
    onSuccess('ok');
  };
  const handleChangeCreateImage = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  // const showModalUpdate = async (uuid: string) => {
  //   try {
  //     const res = await APIGetMoviesDetail({ uuid });
  //     console.log('update', res);
  //     if (res && res.status === 200) {
  //       const moviesDetail = res.data.data;
  //       setMoviesDetail(moviesDetail);
  //       console.log(moviesDetail.birthday);
  //       formUpdate.setFieldsValue({
  //         moviesName: moviesDetail.moviesName,
  //         birthday: moment(moviesDetail.birthday, 'YYYY-MM-DD'),
  //         description: moviesDetail.description
  //       });
  //       setIsModalUpdateOpen(true);
  //       // setFileList([]);
  //       // setPreviewImage('');
  //     } else {
  //       message.error('Không tìm thấy thông tin chi tiết.');
  //     }
  //   } catch (error: any) {
  //     if (error.response) {
  //       const errorMessage =
  //         error.response.data?.error?.errorMessage ||
  //         'Đã xảy ra lỗi khi lấy thông tin chi tiết.';
  //       message.error(errorMessage);
  //     } else {
  //       message.error('Đã xảy ra lỗi khi lấy thông tin chi tiết.');
  //     }
  //   }
  // };

  const formatToDateString = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // const onFinishUpdateMoviesInfor: FormProps<FieldType>['onFinish'] = async (
  //   values
  // ) => {
  //   const { birthday } = values;
  //   const birthdayObj = new Date(birthday);
  //   const birthdayFormat = formatToDateString(birthdayObj);
  //   try {
  //     const res = await APICreateMovies({
  //       uuid: moviesDetail.uuid,
  //       moviesName: values.moviesName,
  //       birthday: birthdayFormat,
  //       description: values.description
  //     });
  //     console.log('adasdasd', res);
  //     if (res && res.status === 200) {
  //       message.success(res.data.error.errorMessage);
  //       getAllMovies();
  //       formUpdate.resetFields();
  //       handleCancelUpdate();
  //       setFileList([]);
  //       setPreviewImage('');
  //     }
  //     // console.log("Success:", values);
  //   } catch (error: any) {
  //     if (error.response) {
  //       const errorMessage =
  //         error.response.data?.error?.errorMessage ||
  //         'Đã xảy ra lỗi khi update.';
  //       message.error(errorMessage);
  //     } else if (error.request) {
  //       message.error(
  //         'Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.'
  //       );
  //     } else {
  //       message.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
  //     }
  //   }
  // };

  const getAllMovies = async () => {
    try {
      const res = await APIGetAllMovies({ pageSize: 10, page: 1 });
      console.log(res.data.data);
      if (res && res.data && res.data.data) {
        // Lọc các region có status khác "0"
        const filteredMovies = res.data?.data?.items.filter(
          (movies) => movies.status !== 0
        );
        setListMovies(filteredMovies);
        form.resetFields();
        handleCancel();
      }
    } catch (error) {
      console.log(error);
      message.error('Đã xảy ra lỗi khi lấy danh sách phim.');
    }
  };
  console.log('imagesUuid', imagesUuid);
  const onFinish = async (values) => {
    console.log('values', values);

    try {
      const res = await APICreateMovies({ ...values, imagesUuid });
      console.log(res);
      if (res && res.status === 200) {
        message.success(res.data.error.errorMessage);
        getAllMovies();
      }
      // console.log("Success:", values);
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data?.error?.errorMessage ||
          'Đã xảy ra lỗi khi thêm mới.';
        message.error(errorMessage);
      } else if (error.request) {
        message.error(
          'Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.'
        );
      } else {
        message.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      }
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleCancelUpdate = () => {
    setIsModalUpdateOpen(false);
  };

  const onClose = () => {
    setOpen(false);
    setIsModalUpdateOpen(false);
  };
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  // const confirm: PopconfirmProps['onConfirm'] = async (
  //   uuid: string
  // ): Promise<void> => {
  //   try {
  //     const res = await APIDeleteMovies({ uuid, status: 0 });
  //     if (res && res.status === 200) {
  //       message.success('Đã xoá thành công.');
  //       getAllMovies(); // Cập nhật lại danh sách movies sau khi xoá
  //     } else {
  //       message.error('Xoá thất bại.');
  //     }
  //   } catch (error: any) {
  //     if (error.response) {
  //       const errorMessage =
  //         error.response.data?.error?.errorMessage ||
  //         'Đã xảy ra lỗi khi cập nhật status.';
  //       message.error(errorMessage);
  //     } else if (error.request) {
  //       message.error(
  //         'Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.'
  //       );
  //     } else {
  //       message.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
  //     }
  //   }
  // };
  const getAllDirector = async () => {
    try {
      const res = await APIGetAllDirector({ pageSize: 10, page: 1 });
      console.log('API Response:', res); // In toàn bộ response để xem cấu trúc

      // Kiểm tra và in ra từng phần của res để debug
      console.log('res.data:', res.data);
      console.log('res.data.data:', res.data.data);

      // Kiểm tra xem res.data.data có phải là mảng hợp lệ hay không
      if (res && res.data && Array.isArray(res.data.data.items)) {
        const directors = res.data.data.items;

        // Tạo mảng mới với value là uuid và label là tên
        const directorOptions = directors.map((director) => ({
          value: director.uuid,
          label: director.directorName
        }));

        setListDirector(directorOptions); // Cập nhật state
        console.log('directorOptions', directorOptions); // Kiểm tra dữ liệu sau khi map
      } else {
        console.error('Dữ liệu không hợp lệ:', res.data);
        message.error('Không có dữ liệu đạo diễn hợp lệ.');
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi lấy danh sách đạo diễn.');
      console.error('API Error:', error); // In ra lỗi cụ thể
    }
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm phim`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Đặt lại
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Lọc
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Đóng
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      )
  });
  const listMoviesMap = listMovies.map((movies, index) => ({
    key: index + 1,
    ...movies
  }));
  const columns = [
    {
      title: 'Id',
      dataIndex: 'key'
      // width: 30
    },
    {
      title: 'Ảnh Phim',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      // width: 60,
      render: (text, record) => {
        console.log(record);
        const fullURL = record?.imageUrl
          ? `${import.meta.env.VITE_BACKEND_URL}/resources/images/${
              record?.imageUrl
            }`
          : null;
        console.log(fullURL);
        return fullURL ? (
          <Image
            width={70}
            height={70}
            src={fullURL}
            alt="Ảnh phim"
            style={{ borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : null;
      }
    },
    {
      title: 'Tên phim',
      dataIndex: 'title',
      key: 'title',
      // ...getColumnSearchProps('moviesName'),
      // width: 50,
      sorter: (a, b) => a.moviesName.length - b.moviesName.length,
      sortDirections: ['descend', 'ascend'],
      render: (movies, record) => {
        return <div>{movies}</div>;
      }
    },
    {
      title: 'Tên Tiếng Anh',
      dataIndex: 'engTitle',
      key: 'engTitle'
      // ...getColumnSearchProps("birthday"),
      // width: 50
    },
    {
      title: 'Trailer',
      dataIndex: 'trailer',
      key: 'trailer',
      // ...getColumnSearchProps("description"),
      // width: 50,
      render: (trailer) => <div className="truncate-description">{trailer}</div>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      // ...getColumnSearchProps("description"),
      // width: 80,
      render: (description) => (
        <div className="truncate-description">{description}</div>
      )
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      // ...getColumnSearchProps("description"),
      // width: 70,
      render: (duration) => (
        <div className="truncate-description">{duration}</div>
      )
    },
    {
      title: 'Rated',
      dataIndex: 'rated',
      key: 'rated',
      // ...getColumnSearchProps("description"),
      // width: 60,
      render: (rated) => <div className="truncate-description">{rated}</div>
    },
    {
      title: 'Đánh giá phim',
      dataIndex: 'averageReview',
      key: 'averageReview'
      // ...getColumnSearchProps("description"),
      // width: 100,
      // render: (average_review: number) => (
      //   <div className="truncate-description">{average_review}</div>
      // )
    },
    {
      title: 'Đạo diễn Phim',
      dataIndex: 'directorUuid',
      key: 'directorUuid'
    },
    {
      title: 'Trạng Thái Phim ',
      dataIndex: 'status',
      key: 'status',
      // ...getColumnSearchProps("description"),
      // width: 100,
      render: (status) => <div className="truncate-description">{status}</div>
    },

    {
      title: 'Hành động',
      width: 50,
      render: (record) => (
        <div className="flex gap-4">
          <Popconfirm
            title="Xoá phim"
            description="Bạn muốn xoá phim này?"
            onConfirm={() => confirm(record.uuid)}
            okText={<>Có</>}
            cancelText="Không"
          >
            <Button danger>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
          <Button
            type="text"
            className="bg-blue-700 text-white"
            // onClick={() => showModalUpdate(record.uuid)}
          >
            <EditOutlined />
          </Button>
        </div>
      )
    }
  ];
  useEffect(() => {
    getAllMovies();
  }, []);
  useEffect(() => {
    getAllDirector();
  }, []);
  return (
    <>
      <Button className="float-end mb-4" type="primary" onClick={showModal}>
        Thêm mới phim
      </Button>
      <Modal
        title="Thêm mới phim"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
        footer={<></>}
      >
        <Form
          form={form}
          name="basic"
          // labelCol={{ span: 8 }}
          // wrapperCol={{ span: 24 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col className="gutter-row" span={12}>
              <Form.Item
                label="Tên phim"
                name="title"
                rules={[{ required: true, message: 'Hãy nhập tên phim!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item
                label="Tên Phim (Eng)"
                name="engTitle"
                rules={[
                  {
                    required: true,
                    message: 'Hãy nhập tên phim của bạn!'
                  }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={12}>
              <Form.Item
                label="Trailer"
                name="trailer"
                rules={[{ required: true, message: 'Hãy nhập tên Trailer!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item
                label="Thời lượng"
                name="duration"
                rules={[
                  {
                    required: true,
                    message: 'Hãy nhập thời lượng phim của bạn!'
                  }
                ]}
              >
                <InputNumber className="w-full" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={12}>
              <Form.Item
                label="Đánh giá"
                name="rated"
                rules={[{ required: true, message: 'Hãy nhập đánh giá!' }]}
              >
                <InputNumber className="w-full" />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item
                label="Đánh giá trung bình"
                name="averageReview"
                rules={[
                  {
                    required: true,
                    message: 'Hãy nhập đánh giá trung bình!'
                  }
                ]}
              >
                <InputNumber className="w-full" placeholder="" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={12}>
              <Form.Item
                label="Tên phim"
                name="moviesName"
                rules={[{ required: true, message: 'Hãy nhập tên phim!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item
                label="Trạng Thái"
                name="status"
                rules={[
                  {
                    required: true,
                    message: 'Hãy nhập trạng thái phim của bạn!'
                  }
                ]}
              >
                <Select
                  defaultValue=""
                  onChange={handleChangeStatus}
                  options={[
                    { value: 0, label: 'Không còn' },
                    { value: 1, label: 'Đang chiếu' },
                    { value: 2, label: 'Sắp chiếu' },
                    { value: 3, label: 'Chiếu sớm' }
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={12}>
              <Form.Item label="Image" name="imageUrl" rules={[]}>
                <Upload
                  action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreviewCreateImage}
                  onChange={handleChangeCreateImage}
                  customRequest={dummyRequestCreateImageCast}
                >
                  {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                {previewImage && (
                  <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) =>
                        !visible && setPreviewImage('')
                    }}
                    src={previewImage}
                  />
                )}
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item
                label="Đạo diễn"
                name="directorUuid"
                rules={[
                  {
                    required: true,
                    message: 'Hãy nhập đạo diễn phim của bạn!'
                  }
                ]}
              >
                <Select
                  defaultValue=""
                  onChange={handleChangeDirector}
                  options={listDirector}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Mô Tả"
            name="description"
            rules={[
              {
                required: true,
                message: 'Hãy nhập mô tả phim của bạn!'
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Thêm mới
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Cập nhật phim"
        open={isModalUpdateOpen}
        onCancel={() => setIsModalUpdateOpen(false)}
        footer={
          <Button onClick={() => setIsModalUpdateOpen(false)}>Đóng</Button>
        }
      >
        <Form
          form={formUpdate}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          // onFinish={onFinishUpdateMoviesInfor}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Tên phim"
            name="moviesName"
            rules={[{ required: true, message: 'Hãy nhập tên phim!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Ngày sinh"
            name="birthday"
            rules={[
              {
                required: true,
                message: 'Hãy nhập ngày sinh của bạn!'
              }
            ]}
          >
            <DatePicker
              placeholder="Ngày sinh"
              variant="filled"
              className="w-full"
            />
          </Form.Item>

          <Form.Item label="Mô tả" name="description" rules={[]}>
            <Input.TextArea
              placeholder="Nhập mô tả...."
              autoSize={{ minRows: 2, maxRows: 6 }}
              onChange={(e) => {
                // Optional: Handle text area change if needed
              }}
            />
          </Form.Item>
          <Form.Item label="Image" name="imageUrl" rules={[]}>
            <Upload
              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              listType="picture-circle"
              fileList={fileList}
              onPreview={handlePreviewCreateImage}
              onChange={handleChangeCreateImage}
              customRequest={dummyRequestCreateImageCast}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            {previewImage && (
              <Image
                wrapperStyle={{ display: 'none' }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage('')
                }}
                src={previewImage}
              />
            )}
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Table
        columns={columns}
        dataSource={listMoviesMap}
        scroll={{ x: 500 }}
        pagination={{
          showTotal: (total, range) => {
            return `${range[0]}-${range[1]} of ${total} items`;
          },
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20']
        }}
      />
    </>
  );
};

export default AdminMovies;
