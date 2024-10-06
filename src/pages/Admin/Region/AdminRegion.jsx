import React, { useEffect, useRef, useState } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  EditTwoTone,
  SearchOutlined
} from '@ant-design/icons';

import {
  Button,
  Drawer,
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
  APICreateRegion,
  APIGetAllRegion,
  APIGetRegionDetail,
  APIDeleteRegion
} from '../../../services/service.api';

const AdminRegion = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef (null);
  const [listRegion, setListRegion] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [regionDetail, setRegionDetail] = useState (null);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);

  const showModalUpdate = async (uuid) => {
    try {
      const res = await APIGetRegionDetail({ uuid });
      if (res && res.status === 200) {
        const regionDetail = res.data.data;
        setRegionDetail(regionDetail);
        formUpdate.setFieldsValue({
          regionName: regionDetail.regionName
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
  const onFinishUpdateRegionName = async (values) => {
    try {
      const res = await APICreateRegion({
        uuid: regionDetail.uuid,
        regionName: values.regionName
      });
      if (res && res.status === 200) {
        message.success(res.data.error.errorMessage);
        getAllRegion();
        formUpdate.resetFields();
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

  const getAllRegion = async () => {
    try {
      const res = await APIGetAllRegion({ pageSize: 10, page: 1 });
      if (res && res.data && res.data.data) {
        // Lọc các region có status khác "0"
        const filteredRegions = res.data?.data?.items.filter(
          (region) => region.status !== 0
        );
        setListRegion(filteredRegions); // Cập nhật danh sách region đã lọc
        form.resetFields();
        handleCancel();
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi lấy danh sách quốc gia.');
    }
  };
  const onFinish = async (values) => {
    try {
      const res = await APICreateRegion(values);
      // console.log(res);
      if (res && res.status === 200) {
        message.success(res.data.error.errorMessage);
        getAllRegion();
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
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCancelUpdate = () => {
    setIsModalUpdateOpen(false);
  };

  // const showDrawer = async (uuid: string) => {
  //   try {
  //     const res = await APIGetRegionDetail({ uuid });
  //     // console.log('API Response:', res); // Kiểm tra dữ liệu trả về
  //     if (res && res.status === 200) {
  //       setRegionDetail(res.data.data);
  //       setOpen(true);
  //     } else {
  //       message.error("Không tìm thấy thông tin chi tiết.");
  //     }
  //   } catch (error: any) {
  //     if (error.response) {
  //       console.error(error.response.data);
  //       const errorMessage =
  //         error.response.data?.error?.errorMessage ||
  //         "Đã xảy ra lỗi khi lấy thông tin chi tiết.";
  //       message.error(errorMessage);
  //     } else {
  //       message.error("Đã xảy ra lỗi khi lấy thông tin chi tiết.");
  //     }
  //   }
  // };

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
      const res = await APIDeleteRegion({ uuid, status: 0 });
      if (res && res.status === 200) {
        message.success('Đã xoá thành công.');
        getAllRegion(); // Cập nhật lại danh sách region sau khi xoá
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
          placeholder={`Tìm kiếm quốc gia`}
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
            Đăt lại
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
  const listRegionMap = listRegion.map((region, index) => ({
    key: index + 1,
    ...region
  }));
  const columns = [
    {
      title: 'Id',
      dataIndex: 'key',
      width: 50
    },
    // {
    //   title: "UUID",
    //   width: 200,
    //    ...getColumnSearchProps("uuid"),
    //   render: (record) => {
    //     return (
    //       <div
    //         className="hover:text-[#4096ff] cursor-pointer"
    //         onClick={() => showDrawer(record.uuid)} // Gọi showDrawer với uuid
    //       >
    //         {record.uuid}
    //       </div>
    //     );
    //   },
    // },
    {
      title: 'Tên quốc gia',
      dataIndex: 'regionName',
      key: 'regionName',
      ...getColumnSearchProps('regionName'),
      width: 100,
      sorter: (a, b) => a.regionName.length - b.regionName.length,
      sortDirections: ['descend', 'ascend'],
      render: (region, record) => {
        return (
          <div
          // className="hover:text-[#4096ff] cursor-pointer"
          // onClick={() => showDrawer(record.uuid)} // Gọi hàm showDrawer với uuid
          >
            {region} {/* Hiển thị tên quốc gia */}
          </div>
        );
      }
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   width:50,
    // },
    {
      title: 'Hành động',
      width: 50,
      render: (record) => (
        <div className="flex gap-4">
          <Popconfirm
            title="Xoá quốc gia"
            description="Bạn chắc chắn muốn xoá quốc gia này?"
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
    getAllRegion();
  }, []);
  return (
    <>
      <Button className="float-end mb-4" type="primary" onClick={showModal}>
        Thêm mới quốc gia
      </Button>
      {/* <Drawer
        title="Chi tiết quốc gia"
        placement="right"
        onClose={onClose}
        open={open}
        width={400}
      > 
       {regionDetail ? (
          <div>
             <p><strong>UUID:</strong> {regionDetail.uuid}</p> 
            <p><strong>Tên Thể Loại:</strong> {regionDetail.regionName}</p>
            <p><strong>Trạng Thái:</strong> {regionDetail.status}</p>
             Thêm các thông tin khác nếu cần 
          </div>
        ) : (
          <p>Không có thông tin chi tiết để hiển thị.</p>
        )}
       </Drawer> */}
      <Modal
        title="Thêm mới quốc gia"
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
            label="Tên quốc gia"
            name="regionName"
            rules={[{ required: true, message: 'Nhập tên quốc gia!' }]}
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
        title="Cập nhật quốc gia"
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
          onFinish={onFinishUpdateRegionName}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Tên quốc gia"
            name="regionName"
            rules={[{ required: true, message: 'Nhập tên quốc gia!' }]}
          >
            <Input />
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
        dataSource={listRegionMap}
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

export default AdminRegion;
