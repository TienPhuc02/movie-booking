import React, { useEffect, useRef, useState } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined
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
  Table
} from 'antd';
import Highlighter from 'react-highlight-words';
import '../../../css/AdminGenre.css';
import {
  APICreateCinemas,
  APIGetAllCinemas,
  APIGetCinemasDetail,
  APIDeleteCinemas,
} from '../../../services/service.api';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import MapPicker from './MapPicker';

const AdminCinemas = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [listCinemas, setListCinemas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [cinemaDetail, setCinemasDetail] = useState(null);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [location, setLocation] = useState(null);

  const handleLocationSelect = (loc) => {
    setLocation(loc); // Lưu tọa độ vào state
  };

  const showModalUpdate = async (uuid) => {
    try {
      const res = await APIGetCinemasDetail({ uuid });
      console.log('update', res);
      if (res && res.status === 200) {
        const cinemaDetail = res.data.data;
        setCinemasDetail(cinemaDetail);
        //  console.log("Lam gi thi lam ",cinemaDetail.imageUrl);
        formUpdate.setFieldsValue({
          cinemaName: cinemaDetail.cinemaName,
          address: cinemaDetail.address,
          location: cinemaDetail.location,
        });
        setIsModalUpdateOpen(true);
        // setFileList([]);
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

  const onFinishUpdateCinemasInfor = async (values) => {
    try {
      const res = await APICreateCinemas({
        uuid: values.uuid,
        cinemaName: values.cinemaName,
        address: values.address,
        location: values.location,
      });

      console.log('Response:', res);
      if (res && res.status === 200) {
        message.success(res.data.error.errorMessage);
        form.resetFields();
        getAllCinemas();
        handleCancelUpdate();
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

  const getAllCinemas = async () => {
    try {
      const res = await APIGetAllCinemas({ pageSize: 10, page: 1 });
      console.log(res.data.data);
      if (res && res.data && res.data.data) {
        // Lọc các region có status khác "0"
        const filteredCinemas = res.data?.data?.items.filter(
          (cinema) => cinema.status !== 0
        );
        setListCinemas(filteredCinemas); // Cập nhật danh sách cinema đã lọc
        form.resetFields();
        handleCancel();
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi lấy danh sách rạp phim.');
    }
  };
  const onFinish = async (values) => {
    const dataCinemas = { ...values, location };
    try {
      const res = await APICreateCinemas(dataCinemas);
      console.log(res);
      if (res && res.status === 200) {
        message.success(res.data.error.errorMessage);
        form.resetFields();
        getAllCinemas();
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
  const confirm = async (uuid) => {
    try {
      const res = await APIDeleteCinemas({ uuid, status: 0 });
      if (res && res.status === 200) {
        message.success('Đã xoá thành công.');
        getAllCinemas(); // Cập nhật lại danh sách cinema sau khi xoá
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
          placeholder={`Tìm kiếm rạp phim`}
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
  const listCinemasMap = listCinemas.map((cinema, index) => ({
    key: index + 1,
    ...cinema
  }));
  const columns = [
    {
      title: 'Id',
      dataIndex: 'key',
      width: 50
    },
    {
      title: 'Tên rạp phim',
      dataIndex: 'cinemaName',
      key: 'cinemaName',
      ...getColumnSearchProps('cinemaName'),
      width: 50,
      sorter: (a, b) => a.cinemaName.length - b.cinemaName.length,
      sortDirections: ['descend', 'ascend'],
      render: (cinema, record) => {
        return (
          <div>
            {cinema} {/* Hiển thị tên quốc gia */}
          </div>
        );
      }
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      width: 50
    },
    {
      title: 'Hành động',
      width: 50,
      render: (record) => (
        <div className="flex gap-4">
          <Popconfirm
            title="Xoá rạp phim"
            description="Bạn muốn xoá rạp phim này?"
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
    getAllCinemas();
  }, []);
  return (
    <>
      <Button className="float-end mb-4" type="primary" onClick={showModal}>
        Thêm mới rạp phim
      </Button>
      <Modal
        title="Thêm mới rạp phim"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
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
            label="Tên rạp phim"
            name="cinemaName"
            rules={[{ required: true, message: 'Hãy nhập tên rạp phim!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="addres"
            rules={[
              {
                required: true,
                message: 'Hãy nhập địa chỉ rạp phim!'
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Địa chỉ map" name="location" rules={[
            {
                required: true,
                message: 'Hãy nhập địa chỉ map!'
            }
          ]}>
            <MapPicker onLocationSelect={handleLocationSelect} initialLocation={location} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Thêm mới
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Cập nhật rạp phim"
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
          onFinish={onFinishUpdateCinemasInfor}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Tên rạp phim"
            name="cinemaName"
            rules={[{ required: true, message: 'Hãy nhập tên rạp phim!' }]}
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
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Table
        columns={columns}
        dataSource={listCinemasMap}
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

export default AdminCinemas;