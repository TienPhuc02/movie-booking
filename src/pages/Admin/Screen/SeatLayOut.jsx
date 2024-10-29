import React, { useState } from "react";
import { Button, InputNumber, Row, Col, Modal, Select } from "antd";
import { EditOutlined } from "@ant-design/icons"; // Import icon chỉnh sửa

const { Option } = Select;

const SeatLayout = () => {
  const [rows, setRows] = useState(5); // Số hàng mặc định
  const [cols, setCols] = useState(8); // Số cột mặc định
  const [seats, setSeats] = useState([]);
  const [visible, setVisible] = useState(false); // Modal hiển thị ghế
  const [editModalVisible, setEditModalVisible] = useState(false); // Modal chọn loại ghế
  const [selectedRow, setSelectedRow] = useState(null); // Lưu hàng ghế đang chỉnh sửa
  const [seatType, setSeatType] = useState("normal"); // Loại ghế đang chọn

  // Tạo ghế dựa trên số hàng và cột nhập vào
  const generateSeats = () => {
    const newSeats = [];
    for (let row = 0; row < rows; row++) {
      const seatRow = [];
      const rowChar = String.fromCharCode(65 + row); // A, B, C...

      for (let col = 0; col < cols; col++) {
        let seatType = "couple"; // Mặc định là ghế couple

        // Xác định loại ghế dựa vào ký tự hàng
        if (["A", "B", "C", "D"].includes(rowChar)) {
          seatType = "normal"; // Ghế thường
        } else if (["E", "F", "G", "H", "I", "J", "K", "L", "M", "N"].includes(rowChar)) {
          seatType = "vip"; // Ghế VIP
        }

        seatRow.push({
          label: `${rowChar}${col + 1}`, // Ví dụ A1, A2, B1...
          type: seatType, // Gán loại ghế
        });
      }
      newSeats.push(seatRow);
    }
    setSeats(newSeats);
  };

  // Mở Modal chọn loại ghế khi nhấn vào nút Edit
  const openEditModal = (rowIndex) => {
    setSelectedRow(rowIndex);
    setEditModalVisible(true); // Mở modal chọn loại ghế
  };

  // Xác nhận lựa chọn và áp dụng loại ghế cho cả hàng
  const applySeatTypeForRow = () => {
    const newSeats = [...seats];
    newSeats[selectedRow] = newSeats[selectedRow].map((seat) => ({
      ...seat,
      type: seatType, // Áp dụng loại ghế đã chọn cho cả hàng
    }));

    setSeats(newSeats);
    setEditModalVisible(false); // Đóng modal chọn loại ghế
  };

  // Hiển thị màu dựa trên loại ghế
  const getSeatColor = (type) => {
    if (type === "normal") return "#5A4FCF"; // Ghế thường (màu tím)
    if (type === "vip") return "#FF4D4F"; // Ghế VIP (màu đỏ)
    if (type === "couple") return "#FF69B4"; // Ghế couple (màu hồng)
    if (type === "disabled") return "#808080"; // Không khả dụng (màu xám)
  };

  return (
    <div>
      <Button onClick={() => setVisible(true)}>Cập nhật ghế phòng chiếu</Button>
      <Modal
        title="Cập nhật ghế phòng chiếu"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={1000}
      >
        <Row gutter={16}>
          <Col span={12}>
            <label>Số hàng:</label>
            <InputNumber
              min={1}
              value={rows}
              onChange={(value) => setRows(value)}
            />
          </Col>
          <Col span={12}>
            <label>Số cột:</label>
            <InputNumber
              min={1}
              value={cols}
              onChange={(value) => setCols(value)}
            />
          </Col>
        </Row>
        <Button type="primary" onClick={generateSeats} style={{ marginTop: 16 }}>
          Tạo ghế
        </Button>
        <div style={{ marginTop: 24 }}>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <Button>MAN HÌNH</Button>
          </div>
          <div>
            {seats.map((row, rowIndex) => (
              <Row key={rowIndex} justify="center" gutter={[8, 8]}>
                {row.map((seat, colIndex) => {
                  // Xử lý ghế couple, chỉ ghép cặp khi số cột là chẵn
                  if (seat.type === "couple" && colIndex % 2 === 0) {
                    if (cols % 2 !== 0 && colIndex === cols - 1) {
                      return null; // Không hiển thị ghế cuối nếu số cột lẻ
                    }
                    return (
                      <Col key={colIndex} span={2}>
                        <Button
                          style={{
                            backgroundColor: getSeatColor(seat.type),
                            color: "white",
                            width: 80, // Ghế couple sẽ to gấp đôi
                            height: 40,
                            borderRadius: 4,
                            marginRight: -8 // Bỏ cách giữa ghế couple để tránh bị khoảng trống
                          }}
                        >
                          {`${seat.label} & ${row[colIndex + 1]?.label}`} {/* Ghép cặp */}
                        </Button>
                      </Col>
                    );
                  }
                  // Bỏ qua ghế thứ hai của couple (ghế ghép đôi đã hiển thị)
                  if (seat.type === "couple" && colIndex % 2 !== 0) {
                    return null;
                  }
                  return (
                    <Col key={colIndex} span={1}>
                      <Button
                        style={{
                          backgroundColor: getSeatColor(seat.type),
                          color: "white",
                          width: 40,
                          height: 40,
                          borderRadius: 4,
                        }}
                      >
                        {seat.label}
                      </Button>
                    </Col>
                  );
                })}
                {/* Thêm biểu tượng chỉnh sửa ở cuối mỗi hàng */}
                <Col>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => openEditModal(rowIndex)} // Mở modal chọn loại ghế khi nhấn Edit
                  />
                </Col>
              </Row>
            ))}
          </div>
          {/* Chú thích màu sắc các loại ghế */}
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <Row justify="center" gutter={[16, 16]}>
              <Col>
                <Button
                  style={{
                    backgroundColor: "#5A4FCF",
                    color: "white",
                    width: 40,
                    height: 40,
                    borderRadius: 4,
                  }}
                />
                <div>Ghế Thường</div>
              </Col>
              <Col>
                <Button
                  style={{
                    backgroundColor: "#FF4D4F",
                    color: "white",
                    width: 40,
                    height: 40,
                    borderRadius: 4,
                  }}
                />
                <div>Ghế VIP</div>
              </Col>
              <Col>
                <Button
                  style={{
                    backgroundColor: "#FF69B4",
                    color: "white",
                    width: 40,
                    height: 40,
                    borderRadius: 4,
                  }}
                />
                <div>Ghế Couple</div>
              </Col>
              <Col>
                <Button
                  style={{
                    backgroundColor: "#808080",
                    color: "white",
                    width: 40,
                    height: 40,
                    borderRadius: 4,
                  }}
                />
                <div>Không khả dụng</div>
              </Col>
            </Row>
          </div>
        </div>
      </Modal>

      {/* Modal để chọn loại ghế */}
      <Modal
        title="Chọn loại ghế cho cả hàng"
        visible={editModalVisible} // Kiểm soát modal chọn loại ghế
        onCancel={() => setEditModalVisible(false)} // Đóng modal chọn loại ghế
        onOk={applySeatTypeForRow} // Áp dụng loại ghế khi nhấn OK
      >
        <Select
          style={{ width: "100%" }}
          value={seatType}
          onChange={(value) => setSeatType(value)}
        >
          <Option value="normal">Ghế thường</Option>
          <Option value="vip">Ghế VIP</Option>
          <Option value="couple">Ghế couple</Option>
          <Option value="disabled">Không khả dụng</Option>
        </Select>
      </Modal>
    </div>
  );
};

export default SeatLayout;
