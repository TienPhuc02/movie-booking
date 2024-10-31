import React, { useEffect, useRef, useState } from 'react';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, message, Modal, Popconfirm, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import '../../../css/AdminGenre.css';
import {
  APICreateCast,
  APIGetAllCast,
  APIGetCastDetail,
  APIDeleteCast,
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

const AdminCast = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [listCast, setListCast] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [castDetail, setCastDetail] = useState(null);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);
  const [imagesUuid, setImagesUuid] = useState('');
  const handlePreviewCreateImage = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  // console.log('fileList,', fileList);
  const dummyRequestCreateImageCast = async ({ file, onSuccess }) => {
    console.log(file);
    const res = await APIUploadImage(file, '3');
    console.log(res);
    if (res && res.status === 200) {
      setImagesUuid(res.data.data);
    }
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
  const showModalUpdate = async (uuid) => {
    try {
      const res = await APIGetCastDetail({ uuid });
      if (res && res.status === 200) {
        const castDetail = res.data.data;
        setCastDetail(castDetail);
        const birthdayFormat = 'YYYY-MM-DD';
        const imageUrl = `${import.meta.env.VITE_BACKEND_URL
          }/resources/images/${castDetail.imageUrl}`;
        formUpdate.setFieldsValue({
          castName: castDetail.castName,
          birthday: castDetail.birthday
            ? moment(castDetail.birthday, birthdayFormat)
            : null,
          description: castDetail.description,
          imageUrl: castDetail.imageUrl
        });
        setFileList([{ url: imageUrl }]);
        setIsModalUpdateOpen(true);
        setPreviewImage('');
      } else {
        message.error('Không tìm thấy thông tin chi tiết.');
      }
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data?.error?.errorMessage ||
          'Đã xảy ra lỗi khi lấy thông tin chi tiết.';
        message.error(errorMessage);
      } else {
        message.error('Đã xảy ra lỗi khi lấy thông tin chi tiết.');
      }
    }
  };

  const formatToDateString = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const onFinishUpdateCastInfor = async (values) => {
    const { birthday, ...restValues } = values;
    const birthdayObj = new Date(birthday);
    const birthdayFormat = formatToDateString(birthdayObj);
    // console.log(birthdayFormat);
    let tempImagesUuid = imagesUuid;
    if (fileList.length > 0) {
      const uploadResponse = await APIUploadImage(fileList[0].originFileObj, '3');
      if (uploadResponse && uploadResponse.status === 200) {
        tempImagesUuid = uploadResponse.data.data; // Use the returned UUID from the image upload
      }
    }
    try {
      const res = await APICreateCast({
        uuid: castDetail?.uuid,
        castName: restValues.castName,
        birthday: birthdayFormat,
        description: restValues.description,
        imagesUuid: tempImagesUuid
      });
      if (res && res.status === 200) {
        message.success(res.data.error.errorMessage);
        form.resetFields();
        setFileList([]);
        setImagesUuid('');
        getAllCast();
        handleCancelUpdate();
      }
      // console.log("Success:", values);
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data?.error?.errorMessage ||
          'Đã xảy ra lỗi khi update.';
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

  const getAllCast = async () => {
    try {
      const res = await APIGetAllCast({ pageSize: 1000, page: 1 });
      console.log(res.data.data);
      if (res && res.data && res.data.data) {
        // Lọc các cast có status khác "0"
        const filteredCasts = res.data?.data?.items.filter(
          (cast) => cast.status !== 0
        );
        setListCast(filteredCasts); // Cập nhật danh sách cast đã lọc
        form.resetFields();
        handleCancel();
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi lấy danh sách diễn viên.');
    }
  };
  const onFinish = async (values) => {
    const { birthday, ...restValues } = values;
    const birthdayFormat = formatToDateString(new Date(birthday));
    let tempImagesUuid = imagesUuid;
    if (fileList.length > 0) {
      const uploadResponse = await APIUploadImage(fileList[0].originFileObj, '3');
      if (uploadResponse && uploadResponse.status === 200) {
        tempImagesUuid = uploadResponse.data.data; // Use the returned UUID from the image upload
      }
    }
    const dataCast = {
      ...restValues,
      birthday: birthdayFormat,
      imagesUuid: tempImagesUuid
    };
    try {
      const res = await APICreateCast(dataCast);
      if (res && res.status === 200) {
        message.success(res.data.error.errorMessage);
        form.resetFields();
        setFileList([]);
        setImagesUuid('');
        getAllCast();
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
    setFileList([]);
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
    setFileList([]);
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
  const confirm = async (uuid) => {
    try {
      const res = await APIDeleteCast({ uuid, status: 0 });
      if (res && res.status === 200) {
        message.success('Đã xoá thành công.');
        getAllCast(); // Cập nhật lại danh sách cast sau khi xoá
      } else {
        message.error('Xoá thất bại.');
      }
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data?.error?.errorMessage ||
          'Đã xảy ra lỗi khi cập nhật status.';
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
          placeholder={`Tìm kiếm tên diễn viên`}
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
  const listCastMap = listCast.map((cast, index) => ({
    key: index + 1,
    ...cast
  }));
  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
      width: 50
    },
    {
      title: 'Ảnh đại diện',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 60,
      render: (text, record) => {
        console.log(record);
        const fullURL = record?.imageUrl
          ? `${import.meta.env.VITE_BACKEND_URL}/resources/images/${record?.imageUrl
          }`
          : null;
        // console.log(fullURL);
        return fullURL ? (
          <Image
            width={70}
            height={70}
            src={fullURL}
            alt="Ảnh diễn viên"
            style={{ borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : null;
      }
    },
    {
      title: 'Tên diễn viên',
      dataIndex: 'castName',
      key: 'castName',
      ...getColumnSearchProps('castName'),
      width: 50,
      sorter: (a, b) => a.castName.length - b.castName.length,
      sortDirections: ['descend', 'ascend'],
      render: (cast, record) => {
        return (
          <div
          // className="hover:text-[#4096ff] cursor-pointer"
          // onClick={() => showDrawer(record.uuid)} // Gọi hàm showDrawer với uuid
          >
            {cast} {/* Hiển thị tên diễn viên */}
          </div>
        );
      }
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birthday',
      key: 'birthday',
      // ...getColumnSearchProps("birthday"),
      width: 50
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',

      width: 100,
      render: (description) => (
        <div className="truncate-description">{description}</div>
      )
    },

    {
      title: '',
      width: 50,
      render: (record) => (
        <div className="flex gap-4">
          <Popconfirm
            title="Xoá diễn viên"
            description="Bạn muốn xoá diễn viên này?"
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
            onClick={() => showModalUpdate(record.uuid)}
          >
            <EditOutlined />
          </Button>
        </div>
      )
    }
  ];
  useEffect(() => {
    getAllCast();
  }, []);
  return (
    <>
      <Button className="float-end mb-4" type="primary" onClick={showModal}>
        Thêm mới diễn viên
      </Button>

      <Modal
        title="Thêm mới diễn viên"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={<></>}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Tên diên viên"
            name="castName"
            rules={[{ required: true, message: 'Hãy nhập tên diễn viên!' }]}
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
            />
          </Form.Item>
          <Form.Item label="Image" name="imagesUuid" rules={[]}>
            <Upload
              listType="picture-circle"
              fileList={fileList}
              onPreview={handlePreviewCreateImage}
              onChange={handleChangeCreateImage}
              beforeUpload={(file) => {
                setFileList([file]);
                return false; // Prevents automatic upload
              }}
            >
              {fileList.length >= 1 ? null : uploadButton}
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
              Thêm mới
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Cập nhật diễn viên"
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
          onFinish={onFinishUpdateCastInfor}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Tên diễn viên"
            name="castName"
            rules={[{ required: true, message: 'Hãy nhập tên diễn viên!' }]}
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
            // onChange={(e) => {
            //   // Optional: Handle text area change if needed
            // }}
            />
          </Form.Item>
          <Form.Item label="Image" name="imagesUuid" rules={[]}>
            <Upload
              listType="picture-circle"
              fileList={fileList}
              onPreview={handlePreviewCreateImage}
              onChange={handleChangeCreateImage}
              beforeUpload={(file) => {
                setFileList([file]);
                return false; 
              }}
            >
              {fileList.length >= 1 ? null : uploadButton}
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
        dataSource={listCastMap}
        scroll={{ x: 1000, y: 500 }}
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

export default AdminCast;
