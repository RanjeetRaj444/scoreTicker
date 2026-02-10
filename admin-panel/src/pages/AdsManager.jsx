import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  notification,
  Typography,
  Card,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BarChartOutlined,
  EyeOutlined,
  CursorOutlined,
} from "@ant-design/icons";
import useAds from "../hooks/useAds";

const { Title, Text } = Typography;

const AdsManager = () => {
  const [ads, setAds] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [form] = Form.useForm();
  const { getAds, createAd, updateAd, deleteAd, loading } = useAds();

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    try {
      const data = await getAds();
      setAds(data);
    } catch (error) {
      notification.error({ message: "Failed to load ads" });
    }
  };

  const showModal = (ad = null) => {
    setEditingAd(ad);
    if (ad) {
      form.setFieldsValue(ad);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingAd(null);
  };

  const onFinish = async (values) => {
    try {
      if (editingAd) {
        await updateAd(editingAd._id, values);
        notification.success({ message: "Ad updated successfully" });
      } else {
        await createAd(values);
        notification.success({ message: "Ad created successfully" });
      }
      setIsModalVisible(false);
      loadAds();
    } catch (error) {
      notification.error({ message: "Operation failed" });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this ad unit?")) {
      try {
        await deleteAd(id);
        notification.success({ message: "Ad deleted" });
        loadAds();
      } catch (error) {
        notification.error({ message: "Delete failed" });
      }
    }
  };

  const columns = [
    {
      title: "Ad Detail",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center gap-4">
          <img
            src={record.imageUrl}
            alt=""
            className="w-12 h-12 rounded-lg object-cover border border-zinc-100"
          />
          <div>
            <div className="font-bold text-zinc-900">{text}</div>
            <Tag
              color="orange"
              className="text-[10px] uppercase font-black tracking-widest"
            >
              {record.placement}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: "Performance",
      key: "performance",
      render: (_, record) => (
        <Space size="large">
          <div className="text-center">
            <div className="text-[10px] text-zinc-400 uppercase font-black tracking-widest leading-none">
              Impressions
            </div>
            <div className="font-mono font-bold text-zinc-900 leading-tight mt-1">
              {record.impressions.toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-zinc-400 uppercase font-black tracking-widest leading-none">
              Clicks
            </div>
            <div className="font-mono font-bold text-orange-500 leading-tight mt-1">
              {record.clicks.toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-zinc-400 uppercase font-black tracking-widest leading-none">
              CTR
            </div>
            <div className="font-mono font-bold text-zinc-600 leading-tight mt-1">
              {record.impressions > 0
                ? ((record.clicks / record.impressions) * 100).toFixed(2)
                : "0.00"}
              %
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  const totalImpressions = ads.reduce((sum, ad) => sum + ad.impressions, 0);
  const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <Title
            level={2}
            className="m-0 font-black uppercase italic tracking-tighter"
          >
            AD <span className="text-orange-500">MANAGER</span>
          </Title>
          <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mt-1">
            Monetization & Inventory Management
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-zinc-900 h-12 px-8 rounded-xl font-bold uppercase"
          onClick={() => showModal()}
        >
          Inject Ad Unit
        </Button>
      </div>

      <Row gutter={24} className="mb-10">
        <Col span={8}>
          <Card className="rounded-3xl border-none shadow-xl bg-orange-500 text-white overflow-hidden relative">
            <BarChartOutlined className="absolute -right-4 -bottom-4 text-8xl opacity-10 rotate-12" />
            <Statistic
              title={
                <span className="text-white/80 font-black uppercase tracking-widest text-[10px]">
                  Active Inventory
                </span>
              }
              value={ads.filter((a) => a.status === "Active").length}
              valueStyle={{
                color: "white",
                fontWeight: 900,
                fontSize: "2.5rem",
              }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="rounded-3xl border-none shadow-xl bg-zinc-900 text-white overflow-hidden relative">
            <EyeOutlined className="absolute -right-4 -bottom-4 text-8xl opacity-10 rotate-12" />
            <Statistic
              title={
                <span className="text-white/80 font-black uppercase tracking-widest text-[10px]">
                  Total Impressions
                </span>
              }
              value={totalImpressions}
              valueStyle={{
                color: "white",
                fontWeight: 900,
                fontSize: "2.5rem",
              }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="rounded-3xl border-none shadow-xl bg-white overflow-hidden relative border border-zinc-100">
            <CursorOutlined className="absolute -right-4 -bottom-4 text-8xl text-orange-500 opacity-5 rotate-12" />
            <Statistic
              title={
                <span className="text-zinc-400 font-black uppercase tracking-widest text-[10px]">
                  Global Engagement
                </span>
              }
              value={totalClicks}
              valueStyle={{
                color: "#f97316",
                fontWeight: 900,
                fontSize: "2.5rem",
              }}
              suffix={
                <span className="text-xs font-black text-zinc-300 ml-2">
                  Clicks
                </span>
              }
            />
          </Card>
        </Col>
      </Row>

      <Card className="rounded-[2.5rem] shadow-2xl border-none overflow-hidden p-6">
        <Table
          columns={columns}
          dataSource={ads}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      <Modal
        title={
          <Title
            level={4}
            className="m-0 font-black uppercase italic tracking-tighter"
          >
            {editingAd ? "Reconfigure" : "Inject"}{" "}
            <span className="text-orange-500">Ad Unit</span>
          </Title>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
        className="premium-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ status: "Active", type: "Banner" }}
        >
          <Form.Item
            name="name"
            label="Campaign Name"
            rules={[{ required: true }]}
          >
            <Input
              className="h-12 rounded-xl"
              placeholder="e.g. Summer Sports Sale"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="Ad Type">
                <Select className="h-12 rounded-xl">
                  <Select.Option value="Banner">Banner</Select.Option>
                  <Select.Option value="Video">Video</Select.Option>
                  <Select.Option value="Popup">Popup</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="placement"
                label="Screen Placement"
                rules={[{ required: true }]}
              >
                <Select className="h-12 rounded-xl">
                  <Select.Option value="HomeHero">Home Hero</Select.Option>
                  <Select.Option value="Sidebar">Sidebar</Select.Option>
                  <Select.Option value="ScorecardBottom">
                    Scorecard Bottom
                  </Select.Option>
                  <Select.Option value="NewsList">News List</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="imageUrl"
            label="Creative Image URL"
            rules={[{ required: true }]}
          >
            <Input className="h-12 rounded-xl" placeholder="https://..." />
          </Form.Item>

          <Form.Item
            name="targetUrl"
            label="Destination Link"
            rules={[{ required: true }]}
          >
            <Input className="h-12 rounded-xl" placeholder="https://..." />
          </Form.Item>

          <Form.Item name="status" label="Broadcast Status">
            <Select className="h-12 rounded-xl">
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full h-14 bg-zinc-900 border-none rounded-2xl font-black uppercase tracking-widest text-orange-500 mt-4"
          >
            {editingAd ? "Update Campaign" : "Launch Ad Unit"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default AdsManager;
