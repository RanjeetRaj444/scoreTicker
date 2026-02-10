import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  message,
  Card,
} from "antd";
import { UserAddOutlined, ReloadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Assuming we have a route to fetch all users, or we can use a mock/filtered list for now
      // Since it's an admin panel, we might need a specific endpoint like /api/users
      const response = await axios.get("/api/users/all"); // We'll need to implement this on server
      setUsers(response.data.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
      // message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchUsers();
    // Temporary mock data until server route is ready
    setUsers([
      {
        _id: "1",
        username: "admin",
        email: "admin@example.com",
        fullName: "Super Admin",
        role: "SUPER_ADMIN",
      },
      {
        _id: "2",
        username: "ops1",
        email: "ops1@example.com",
        fullName: "Ops Team 1",
        role: "OPERATIONS",
      },
    ]);
  }, []);

  const handleAddUser = async (values) => {
    try {
      await axios.post("/api/users/register", values);
      message.success("User added successfully");
      setIsModalOpen(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to add user");
    }
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => <span className="font-bold">{text}</span>,
    },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        let color =
          role === "SUPER_ADMIN"
            ? "volcano"
            : role === "OPERATIONS"
              ? "green"
              : "blue";
        return <Tag color={color}>{role}</Tag>;
      },
    },
  ];

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight italic mb-2">
            User <span className="text-orange-500">Management</span>
          </h2>
          <p className="text-zinc-500 font-bold text-sm">
            Manage administrative access and roles
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchUsers}
            loading={loading}
            className="rounded-xl h-10 font-bold"
          />
          {currentUser?.role === "SUPER_ADMIN" && (
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setIsModalOpen(true)}
              className="rounded-xl h-10 bg-zinc-900 border-none font-bold hover:!bg-zinc-800"
            >
              Add New User
            </Button>
          )}
        </div>
      </div>

      <Card className="rounded-[2.5rem] shadow-xl border border-zinc-100 overflow-hidden p-0">
        <Table
          dataSource={users}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          className="custom-admin-table"
        />
      </Card>

      <Modal
        title={
          <span className="font-black uppercase italic">
            Add New Admin User
          </span>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        className="rounded-3xl overflow-hidden"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddUser}
          className="mt-4"
        >
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true }]}
          >
            <Input className="rounded-lg py-2" placeholder="e.g. John Doe" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input
              className="rounded-lg py-2"
              placeholder="e.g. john@example.com"
            />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true }]}
          >
            <Input className="rounded-lg py-2" placeholder="e.g. johndoe" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true }]}
          >
            <Input.Password
              className="rounded-lg py-2"
              placeholder="Min 6 characters"
            />
          </Form.Item>
          <Form.Item name="role" label="Role" initialValue="OPERATIONS">
            <Select className="rounded-lg h-10">
              <Select.Option value="OPERATIONS">Operations</Select.Option>
              <Select.Option value="ANALYST">Analyst</Select.Option>
              <Select.Option value="TECH_ADMIN">Tech Admin</Select.Option>
              {currentUser?.role === "SUPER_ADMIN" && (
                <Select.Option value="SUPER_ADMIN">Super Admin</Select.Option>
              )}
            </Select>
          </Form.Item>
          <div className="flex gap-2 justify-end mt-6">
            <Button
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl h-10 font-bold"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="rounded-xl h-10 bg-zinc-900 border-none font-bold"
            >
              Create User
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
