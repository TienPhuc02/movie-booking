import React, { useEffect, useRef, useState } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  PlusOutlined
} from '@ant-design/icons';

import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
  Upload,
  Image
} from 'antd';

import Highlighter from 'react-highlight-words';
import '../../../css/AdminGenre.css';
import {
  APICreateDirector,
  APIGetAllDirector,
  APIGetDirectorDetail,
  APIDeleteDirector,
  APIUploadImage
} from '../../../services/service.api';

import moment from 'moment';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const AdminDirector = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef < InputRef > null;
  const [listDirector, setListDirector] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [directorDetail, setDirectorDetail] =
    (useState < DataType) | (null > null);
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

  const dummyRequestCreateImageCast = async ({ file, onSuccess }) => {
    const res = await APIUploadImage(file, '3');
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
      const res = await APIGetDirectorDetail({ uuid });
      if (res && res.status === 200) {
        const directorDetail = res.data.data;
        setDirectorDetail(directorDetail);
        formUpdate.setFieldsValue({
          directorName: directorDetail.directorName,
          birthday: moment(directorDetail.birthday, 'YYYY-MM-DD'),
          description: directorDetail.description
        });
        setIsModalUpdateOpen(true);
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

  const onFinishUpdateDirectorInfor = async (values) => {
    const { birthday } = values;
    const birthdayObj = new Date(birthday);
    const birthdayFormat = formatToDateString(birthdayObj);
    try {
      const res = await APICreateDirector({
        uuid: directorDetail?.uuid,
        directorName: values.directorName,
        birthday: birthdayFormat,
        description: values.description
      });
      if (res && res.status === 200) {
        message.success(res.data.error.errorMessage);
        getAllDirector();
        formUpdate.resetFields();
        handleCancelUpdate();
        setFileList([]);
        setPreviewImage('');
      }
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

  const getAllDirector = async () => {
    try {
      const res = await APIGetAllDirector({ pageSize: 10, page: 1 });
      if (res && res.data && res.data.data) {
        const filteredDirectors = res.data.data.items.filter(
          (director) => director.status !== 0
        );
        setListDirector(filteredDirectors);
        form.resetFields();
        handleCancel();
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi lấy danh sách đạo diễn.');
    }
  };

  const onFinish = async (values) => {
    const { birthday, ...restValues } = values;
    const birthdayFormat = formatToDateString(new Date(birthday));
    const dataDirector = {
      ...restValues,
      birthday: birthdayFormat,
      imagesUuid
    };
    try {
      const res = await APICreateDirector(dataDirector);
      if (res && res.status === 200) {
        message.success(res.data.error.errorMessage);
        getAllDirector();
      }
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
      const res = await APIDeleteDirector({ uuid, status: 0 });
      if (res && res.status === 200) {
        message.success('Đã xoá thành công.');
        getAllDirector();
      } else {
        message.error('Xoá thất bại.');
      }
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data?.error?.errorMessage || 'Đã xảy ra lỗi khi xoá.';
        message.error(errorMessage);
      } else {
        message.error('Đã xảy ra lỗi khi xoá.');
      }
    }
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Tìm kiếm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
          }}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          ref={searchInput}
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
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      String(record[dataIndex])
        .toLowerCase()
        .includes(String(value).toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 0);
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

  useEffect(() => {
    getAllDirector();
  }, []);

  const columns = [
    {
      title: 'Tên đạo diễn',
      dataIndex: 'directorName',
      key: 'directorName',
      ...getColumnSearchProps('directorName')
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birthday',
      key: 'birthday'
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl) => <Image width={50} src={imageUrl} />
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Bạn có chắc chắn muốn xoá không?"
            onConfirm={() => confirm(record.uuid)}
          >
            <a>
              <DeleteOutlined />
            </a>
          </Popconfirm>
          <a onClick={() => showModalUpdate(record.uuid)}>
            <EditOutlined />
          </a>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Thêm mới
      </Button>
      <Table columns={columns} dataSource={listDirector} rowKey="uuid" />
      <Modal
        title="Thêm mới đạo diễn"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Tên đạo diễn"
            name="directorName"
            rules={[{ required: true, message: 'Vui lòng nhập tên đạo diễn!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Ngày sinh"
            name="birthday"
            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Hình ảnh">
            <Upload
              customRequest={dummyRequestCreateImageCast}
              fileList={fileList}
              onChange={handleChangeCreateImage}
              onPreview={handlePreviewCreateImage}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
            <Button type="primary" htmlType="submit">
              Thêm mới
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Cập nhật đạo diễn"
        open={isModalUpdateOpen}
        onCancel={handleCancelUpdate}
        footer={null}
      >
        <Form
          form={formUpdate}
          name="update"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={{ remember: true }}
          onFinish={onFinishUpdateDirectorInfor}
          autoComplete="off"
        >
          <Form.Item
            label="Tên đạo diễn"
            name="directorName"
            rules={[{ required: true, message: 'Vui lòng nhập tên đạo diễn!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Ngày sinh"
            name="birthday"
            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={previewOpen}
        title="Preview Image"
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="Preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default AdminDirector;
