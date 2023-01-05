import React from 'react';

import { Button, Form, Input, Select } from 'antd';
import { Col, Row } from 'antd/es/grid';

import './form.scss';

// /. imports

const FeedbackForm: React.FC = () => {
    const [form] = Form.useForm();

    const { Option } = Select;

    // /. hooks

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
    };

    const formItemLayout = {
        labelCol: {
            xs: { span: 12 },
            sm: { span: 5 }
        },
        wrapperCol: {
            xs: { span: 12 },
            sm: { span: 19 }
        }
    };

    const prefixSelector = (
        <Form.Item
            name="prefix"
            noStyle
        >
            <Select style={{ width: 70 }}>
                <Option value="7">+7</Option>
                <Option value="87">+87</Option>
            </Select>
        </Form.Item>
    );

    return (
        <Form
            className="form"
            {...formItemLayout}
            form={form}
            name="feedback"
            onFinish={onFinish}
            initialValues={{
                prefix: '7'
            }}
            scrollToFirstError
        >
            <Form.Item
                name="name"
                label="Name"
                tooltip="What do you want others to call you?"
                rules={[
                    {
                        required: true,
                        whitespace: true,
                        message: 'Please input your name!'
                    }
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                    {
                        required: true,
                        message: 'Please input your phone number!'
                    }
                ]}
            >
                <Input
                    addonBefore={prefixSelector}
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item
                name="email"
                label="E-mail"
                rules={[
                    {
                        type: 'email',
                        message: 'The input is not valid E-mail!'
                    },
                    {
                        required: true,
                        message: 'Please input your E-mail!'
                    }
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="message"
                label="Message"
                rules={[
                    { required: false, message: 'Please input your Message' }
                ]}
            >
                <Input.TextArea
                    showCount
                    maxLength={100}
                />
            </Form.Item>

            <Row>
                <Col
                    xs={{ span: 24, offset: 0 }}
                    sm={{ span: 8, offset: 10 }}
                >
                    <Button
                        htmlType="submit"
                        type="primary"
                        style={{ width: '100%' }}
                    >
                        Submit
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default FeedbackForm;
