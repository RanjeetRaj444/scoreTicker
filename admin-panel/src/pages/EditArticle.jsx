import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  notification,
  Card,
  Typography,
  Row,
  Col,
  Space,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useArticles from "../hooks/useArticles";
import useMatch from "../hooks/useMatch";

const { Title } = Typography;
const { TextArea } = Input;

const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const { createArticle, updateArticle, loading } = useArticles();
  const { matches } = useMatch();

  const isEdit = !!id;

  useEffect(() => {
    if (isEdit && location.state?.article) {
      form.setFieldsValue(location.state.article);
    }
  }, [id, location.state]);

  const onFinish = async (values) => {
    try {
      // Temporary author ID - in a real app, this comes from auth context
      const payload = { ...values, author: "65c3b8f8f1c2a123456789ab" };

      if (isEdit) {
        await updateArticle(id, payload);
        notification.success({ message: "Article updated" });
      } else {
        await createArticle(payload);
        notification.success({ message: "Article created" });
      }
      navigate("/articles");
    } catch (error) {
      notification.error({ message: "Failed to save article" });
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button
          shape="circle"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/articles")}
          className="border-zinc-200"
        />
        <Title
          level={3}
          className="m-0 font-black uppercase italic tracking-tighter"
        >
          {isEdit ? "Edit" : "Compose"}{" "}
          <span className="text-orange-500">Article</span>
        </Title>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ status: "Draft", category: "News" }}
      >
        <Row gutter={24}>
          <Col span={16}>
            <Card className="rounded-3xl shadow-lg mb-6">
              <Form.Item
                name="title"
                label="Headline"
                rules={[{ required: true, message: "Please enter a headline" }]}
              >
                <Input
                  size="large"
                  className="rounded-xl font-bold text-lg"
                  placeholder="Enter a catchy title..."
                />
              </Form.Item>

              <Form.Item
                name="content"
                label="Story Content"
                rules={[{ required: true, message: "Please write something!" }]}
              >
                <TextArea
                  rows={15}
                  className="rounded-xl"
                  placeholder="Tell the story..."
                />
              </Form.Item>
            </Card>
          </Col>

          <Col span={8}>
            <Card className="rounded-3xl shadow-lg space-y-4">
              <Form.Item name="category" label="Category">
                <Select className="h-12 rounded-xl">
                  <Select.Option value="News">News</Select.Option>
                  <Select.Option value="Match Preview">
                    Match Preview
                  </Select.Option>
                  <Select.Option value="Match Report">
                    Match Report
                  </Select.Option>
                  <Select.Option value="Editorial">Editorial</Select.Option>
                  <Select.Option value="Story">Story</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name="status" label="Publishing Status">
                <Select className="h-12 rounded-xl text-orange-500">
                  <Select.Option value="Draft">Draft</Select.Option>
                  <Select.Option value="Published">Published</Select.Option>
                  <Select.Option value="Archived">Archived</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name="matchId" label="Related Match">
                <Select
                  placeholder="Select a match"
                  className="h-12 rounded-xl"
                >
                  {matches?.map((m) => (
                    <Select.Option key={m._id} value={m._id}>
                      {m.matchTitle || m.teams.map((t) => t.name).join(" vs ")}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="thumbnail" label="Image URL">
                <Input className="rounded-xl" placeholder="https://..." />
              </Form.Item>

              <Divider />

              <Space direction="vertical" className="w-full">
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<RocketOutlined />}
                  loading={loading}
                  className="w-full h-14 bg-zinc-900 border-none rounded-2xl font-black uppercase tracking-widest text-orange-500"
                >
                  Publish Now
                </Button>
                <Button
                  icon={<SaveOutlined />}
                  className="w-full h-12 bg-zinc-50 border-zinc-100 rounded-2xl font-black uppercase tracking-widest text-zinc-400"
                  onClick={() => form.submit()}
                >
                  Save as Draft
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default EditArticle;
