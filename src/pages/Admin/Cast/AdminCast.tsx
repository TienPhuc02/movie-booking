import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type {
  FormProps,
  InputRef,
  PopconfirmProps,
  TableColumnsType,
  TableColumnType,
} from "antd";
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
} from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import "../../../css/AdminGenre.css";
import {
  APICreateCast,
  APIGetAllCast,
  APIGetCastDetail,
  APIDeleteCast,
} from "../../../services/service.api";
import moment from "moment";
interface DataType {
  id: string;
  uuid: string;
  castName: string;
  birthday: string;
  description: string;
  status: number;
}

type DataIndex = keyof DataType;

type FieldType = {
  castName: string;
  birthday: string;
  description: string;
};

const AdminCast: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [listCast, setListCast] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [castDetail, setCastDetail] = useState<DataType | null>(null);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);

  const showModalUpdate = async (uuid: string) => {
    try {
      const res = await APIGetCastDetail({ uuid });
      if (res && res.status === 200) {
        const castDetail = res.data.data;
        setCastDetail(castDetail);
        const birthdayFormat = 'YYYY-MM-DD';
        console.log(moment(castDetail.birthday, birthdayFormat));
        formUpdate.setFieldsValue({
          castName: castDetail.castName,
          birthday: castDetail.birthday ? moment(castDetail.birthday, birthdayFormat) : null,
          description: castDetail.description,
        });
        setIsModalUpdateOpen(true);
      } else {
        message.error("Không tìm thấy thông tin chi tiết.");
      }
    } catch (error: any) {
      if (error.response) {
        const errorMessage =
          error.response.data?.error?.errorMessage ||
          "Đã xảy ra lỗi khi lấy thông tin chi tiết.";
        message.error(errorMessage);
      } else {
        message.error("Đã xảy ra lỗi khi lấy thông tin chi tiết.");
      }
    }
  };

  const formatToDateString = (dateObj: Date) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const onFinishUpdateCastInfor: FormProps<FieldType>["onFinish"] = async (
    values
  ) => {
    const { birthday } = values;
    const birthdayObj = new Date(birthday);
    const birthdayFormat = formatToDateString(birthdayObj);
    // console.log(birthdayFormat);
    try {
      const res = await APICreateCast({
        uuid: castDetail?.uuid,
        castName: values.castName,
        birthday: birthdayFormat,
        description: values.description,
      });
      console.log("adasdasd", res);
      if (res && res.status === 200) {
        message.success(res.data.error.errorMessage);
        getAllCast();
        formUpdate.resetFields();
        handleCancelUpdate();
      }
      // console.log("Success:", values);
    } catch (error: any) {
      if (error.response) {
        const errorMessage =
          error.response.data?.error?.errorMessage ||
          "Đã xảy ra lỗi khi update.";
        message.error(errorMessage);
      } else if (error.request) {
        message.error(
          "Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại."
        );
      } else {
        message.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
    }
  };

  const getAllCast = async (): Promise<void> => {
    try {
      const res = await APIGetAllCast({ pageSize: 10, page: 1 });
      console.log(res.data.data);
      if (res && res.data && res.data.data) {
        // Lọc các cast có status khác "0"
        const filteredCasts = res.data?.data?.items.filter(
          (cast: DataType) => cast.status !== 0
        );
        setListCast(filteredCasts); // Cập nhật danh sách cast đã lọc
        form.resetFields();
        handleCancel();
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi lấy danh sách thể loại.");
    }
  };
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { birthday, ...restValues } = values;
    const birthdayFormat = formatToDateString(new Date(birthday));
    const dataCast = { ...restValues, birthday: birthdayFormat };
    try {
      const res = await APICreateCast(dataCast);
      if (res && res.status === 200) {
        message.success(res.data.error.errorMessage);
        getAllCast();
      }
      // console.log("Success:", values);
    } catch (error: any) {
      if (error.response) {
        const errorMessage =
          error.response.data?.error?.errorMessage ||
          "Đã xảy ra lỗi khi thêm mới.";
        message.error(errorMessage);
      } else if (error.request) {
        message.error(
          "Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại."
        );
      } else {
        message.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
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

  const showDrawer = async (uuid: string) => {
    try {
      const res = await APIGetCastDetail({ uuid });
      // console.log('API Response:', res); // Kiểm tra dữ liệu trả về
      if (res && res.status === 200) {
        setCastDetail(res.data.data);
        setOpen(true);
      } else {
        message.error("Không tìm thấy thông tin chi tiết.");
      }
    } catch (error: any) {
      if (error.response) {
        console.error(error.response.data);
        const errorMessage =
          error.response.data?.error?.errorMessage ||
          "Đã xảy ra lỗi khi lấy thông tin chi tiết.";
        message.error(errorMessage);
      } else {
        message.error("Đã xảy ra lỗi khi lấy thông tin chi tiết.");
      }
    }
  };

  const onClose = () => {
    setOpen(false);
    setIsModalUpdateOpen(false);
  };
  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };
  const confirm: PopconfirmProps["onConfirm"] = async (
    uuid: string
  ): Promise<void> => {
    try {
      const res = await APIDeleteCast({ uuid, status: 0 });
      if (res && res.status === 200) {
        message.success("Đã xoá thành công.");
        getAllCast(); // Cập nhật lại danh sách cast sau khi xoá
      } else {
        message.error("Xoá thất bại.");
      }
    } catch (error: any) {
      if (error.response) {
        const errorMessage =
          error.response.data?.error?.errorMessage ||
          "Đã xảy ra lỗi khi cập nhật status.";
        message.error(errorMessage);
      } else if (error.request) {
        message.error(
          "Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại."
        );
      } else {
        message.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
    }
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const listCastMap = listCast.map((cast, index) => ({
    key: index + 1,
    ...cast,
  }));
  const columns: TableColumnsType<DataType> = [
    {
      title: "Id",
      dataIndex: "key",
      width: 50,
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
      title: "Cast Name",
      dataIndex: "castName",
      key: "castName",
      ...getColumnSearchProps("castName"),
      width: 50,
      sorter: (a, b) => a.castName.length - b.castName.length,
      sortDirections: ["descend", "ascend"],
      render: (cast: string, record: DataType) => {
        return (
          <div
            className="hover:text-[#4096ff] cursor-pointer"
            onClick={() => showDrawer(record.uuid)} // Gọi hàm showDrawer với uuid
          >
            {cast} {/* Hiển thị tên diễn viên */}
          </div>
        );
      },
    },
    {
      title: "Birth Day",
      dataIndex: "birthday",
      key: "birthday",
      ...getColumnSearchProps("birthday"),
      width: 50,
    },
    {
      title: "Decription",
      dataIndex: "description",
      key: "description",
      ...getColumnSearchProps("description"),
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 50,
    },
    {
      title: "Action",
      width: 50,
      render: (record) => (
        <div className="flex gap-4">
          <Popconfirm
            title="Delete the cast"
            description="Are you sure to delete this cast?"
            onConfirm={() => confirm(record.uuid)}
            okText={<>Yes</>}
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
          <Button type="text" onClick={() => showModalUpdate(record.uuid)}>
            Update
          </Button>
        </div>
      ),
    },
  ];
  useEffect(() => {
    getAllCast();
  }, []);
  return (
    <>
      <Button className="float-end mb-4" type="primary" onClick={showModal}>
        Create Cast
      </Button>
      <Drawer
        title="Chi tiết quốc gia"
        placement="right"
        onClose={onClose}
        open={open}
        width={400}
      >
        {castDetail ? (
          <div>
            {/* <p><strong>UUID:</strong> {regionDetail.uuid}</p> */}
            <p>
              <strong>Tên Thể Loại:</strong> {castDetail.castName}
            </p>
            <p>
              <strong>Ngày sinh:</strong> {castDetail.birthday}
            </p>
            <p>
              <strong>Mô tả:</strong> {castDetail.description}
            </p>
            <p>
              <strong>Trạng Thái:</strong> {castDetail.status}
            </p>
            {/* Thêm các thông tin khác nếu cần */}
          </div>
        ) : (
          <p>Không có thông tin chi tiết để hiển thị.</p>
        )}
      </Drawer>
      <Modal
        title="Create Cast Modal"
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
          <Form.Item<FieldType>
            label="Cast Name"
            name="castName"
            rules={[
              { required: true, message: "Please input your cast name!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Ngày sinh"
            name="birthday"
            rules={[
              {
                required: true,
                message: "Please input your birthday!",
              },
            ]}
          >
            <DatePicker
              placeholder="Ngày sinh"
              variant="filled"
              className="w-full"
            />
          </Form.Item>

          <Form.Item<FieldType> label="Mô tả" name="description" rules={[]}>
            <Input.TextArea
              placeholder="Nhập mô tả...."
              autoSize={{ minRows: 2, maxRows: 6 }}
              maxLength={300}
              onChange={(e) => {
                // Optional: Handle text area change if needed
              }}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Create Cast
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Update Cast Name Modal"
        open={isModalUpdateOpen}
        onCancel={() => setIsModalUpdateOpen(false)}
        footer={
          <Button onClick={() => setIsModalUpdateOpen(false)}>Cancel</Button>
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
            label="Cast Name"
            name="castName"
            rules={[
              { required: true, message: "Please input your cast Name!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Ngày sinh"
            name="birthday"
            rules={[
              {
                required: true,
                message: "Hãy nhập ngày sinh của bạn!",
              },
            ]}
          >
            <DatePicker
              placeholder="Ngày sinh"
              variant="filled"
              className="w-full"
              
            />
          </Form.Item>

          <Form.Item<FieldType> label="Mô tả" name="description" rules={[]}>
            <Input.TextArea
              placeholder="Nhập mô tả...."
              autoSize={{ minRows: 2, maxRows: 6 }}
              maxLength={300}
              onChange={(e) => {
                // Optional: Handle text area change if needed
              }}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Update Cast
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
          pageSizeOptions: ["5", "10", "20"],
        }}
      />
    </>
  );
};

export default AdminCast;
