import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  notification,
  Typography,
  Card,
  Input,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useArticles from "../hooks/useArticles";

const { Title } = Typography;

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const { getArticles, deleteArticle, loading } = useArticles();
  const navigate = useNavigate();

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (error) {
      notification.error({ message: "Failed to load articles" });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await deleteArticle(id);
        notification.success({ message: "Article deleted" });
        loadArticles();
      } catch (error) {
        notification.error({ message: "Delete failed" });
      }
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div>
          <div className="font-bold text-zinc-900">{text}</div>
          <div className="text-[10px] text-zinc-400 font-mono italic">
            {record.slug}
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (cat) => <Tag color="blue">{cat}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "Published"
              ? "green"
              : status === "Draft"
                ? "gold"
                : "red"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Views",
      dataIndex: "views",
      key: "views",
      align: "right",
      render: (v) => <span className="font-mono">{v}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() =>
              navigate(`/articles/edit/${record._id}`, {
                state: { article: record },
              })
            }
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

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <Title
            level={2}
            className="m-0 font-black uppercase italic tracking-tighter"
          >
            CMS <span className="text-orange-500">Board</span>
          </Title>
          <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mt-1">
            Editorial & Content Management
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-zinc-900 h-12 px-8 rounded-xl font-bold uppercase"
          onClick={() => navigate("/articles/create")}
        >
          New Article
        </Button>
      </div>

      <Card className="rounded-[2rem] shadow-xl border-zinc-100 overflow-hidden">
        <Table
          columns={columns}
          dataSource={articles}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default Articles;
