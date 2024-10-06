import React, { useEffect, useRef, useState } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, DatePicker, Form, Input, message, Modal, Popconfirm, Space, Table, Upload, Image } from 'antd';
import Highlighter from 'react-highlight-words';
import '../../../css/AdminGenre.css';
import { APICreateCast, APIGetAllCast, APIGetCastDetail, APIDeleteCast, APIUploadImage } from '../../../services/service.api';
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

  const dummyRequestCreateImageCast = async ({ file, onSuccess }) => {
    const res = await APIUploadImage(file, '3');
    if (res && res.status === 200) {
      setImagesUuid(res.data.data);
    }
    onSuccess('ok');
  };

  const handleChangeCreateImage = ({ fileList: newFileList }) => setFileList(newFileList);

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
        formUpdate.setFieldsValue({
          castName: castDetail.castName,
          birthday: castDetail.birthday ? moment(castDetail.birthday, birthdayFormat) : null,
          description: castDetail.description,
        });
        setIsModalUpdateOpen(true);
      } else {
        message.error('Không tìm thấy thông tin chi tiết.');
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi lấy thông tin chi tiết.');
    }
  };

  const formatToDateString = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const onFinishUpdateCastInfor = async (values) => {
    const { birthday } = values;
    const birthdayObj = new Date(birthday);
    const birthdayFormat = formatToDateString(birthdayObj);
    try {
      const res = await APICreateCast({
        uuid: castDetail?.uuid,
        castName: values.castName,
        birthday: birthdayFormat,
        description: values.description,
      });
      if (res && res.status === 200) {
        message.success(res.data.error.errorMessage);
        getAllCast();
        formUpdate.resetFields();
        handleCancelUpdate();
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi update.');
    }
  };

  const getAllCast = async () => {
    try {
      const res = await APIGetAllCast({ pageSize: 10, page: 1 });
      if (res && res.data && res.data.data) {
        const filteredCasts = res.data.data.items.filter((cast) => cast.status !== 0);
        setListCast(filteredCasts);
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
    const dataCast = {
      ...restValues,
      birthday: birthdayFormat,
      imagesUuid: imagesUuid,
    };
    try {
      const res = await APICreateCast(dataCast);
      if (res && res.status === 200) {
        message.success(res.data.error.errorMessage);
        getAllCast();
        form.resetFields();
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi thêm mới.');
    }
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
        getAllCast();
      } else {
        message.error('Xoá thất bại.');
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm tên diễn viên`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
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
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
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
          <Button type="link" size="small" onClick={() => close()}>
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
        setTimeout(() => searchInput.current.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069' }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : text,
  });

  // Render component JSX
  return (
    <div>
      <Button onClick={showModal}>Thêm mới</Button>
      <Table dataSource={listCast} pagination={false}>
        <Column title="Tên diễn viên" dataIndex="castName" key="castName" {...getColumnSearchProps('castName')} />
        <Column title="Ngày sinh" dataIndex="birthday" key="birthday" />
        <Column title="Mô tả" dataIndex="description" key="description" />
        <Column
          title="Thao tác"
          key="action"
          render={(text, record) => (
            <Space size="middle">
              <Button
                onClick={() => showModalUpdate(record.uuid)}
                icon={<EditOutlined />}
                size="small"
              >
                Chỉnh sửa
              </Button>
              <Popconfirm
                title="Bạn có chắc chắn muốn xoá?"
                onConfirm={() => confirm(record.uuid)}
                okText="Có"
                cancelText="Không"
              >
                <Button icon={<DeleteOutlined />} size="small">
                  Xoá
                </Button>
              </Popconfirm>
            </Space>
          )}
        />
      </Table>
      <Modal title="Thêm mới diễn viên" visible={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item name="castName" label="Tên diễn viên" rules={[{ required: true, message: 'Vui lòng nhập tên diễn viên' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="birthday" label="Ngày sinh" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}>
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Hình ảnh" valuePropName="fileList" getValueFromEvent={(e) => Array.isArray(e) ? e : e && e.fileList}>
            <Upload
              customRequest={dummyRequestCreateImageCast}
              listType="picture-card"
              fileList={fileList}
              onChange={handleChangeCreateImage}
              onPreview={handlePreviewCreateImage}
              maxCount={1}
            >
              {fileList.length < 1 ? uploadButton : null}
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Thêm mới</Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal visible={isModalUpdateOpen} title="Chỉnh sửa thông tin diễn viên" onCancel={handleCancelUpdate} footer={null}>
        <Form form={formUpdate} onFinish={onFinishUpdateCastInfor} layout="vertical">
          <Form.Item name="castName" label="Tên diễn viên" rules={[{ required: true, message: 'Vui lòng nhập tên diễn viên' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="birthday" label="Ngày sinh" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}>
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Cập nhật</Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal visible={previewOpen} footer={null} onCancel={() => setPreviewOpen(false)}>
        <Image preview={false} src={previewImage} />
      </Modal>
    </div>
  );
};

export default AdminCast;
