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
        form.resetFields();
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

    const phoneConfigarations = {
        ru: {
            prefix: '+7',
            placeholder: '(926) 777-77-77',
            lengths: { min: 1, max: 13 },
            pattern: /\([89][0-9]{2}\)[\s][0-9]{3}[-][0-9]{2}[-][0-9]{2}$/m
        },
        du: {
            prefix: '+49',
            placeholder: '160-5556-417',
            lengths: { min: 1, max: 12 },
            pattern: /([1-9][0-9]{2})[-][0-9]{4}[-][0-9]{3}$/m
        }
    };

    const prefixSelector = (
        <Form.Item
            name="prefix"
            noStyle
        >
            <Select style={{ width: 70 }}>
                <Option value={phoneConfigarations.ru.prefix}>
                    {phoneConfigarations.ru.prefix}
                </Option>
                <Option value={phoneConfigarations.du.prefix}>
                    {phoneConfigarations.ru.prefix}
                </Option>
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
                prefix: phoneConfigarations.ru.prefix
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
                        message: 'must be a valid phone number!',
                        pattern: phoneConfigarations.ru.pattern
                    }
                ]}
            >
                <Input
                    addonBefore={prefixSelector}
                    style={{ width: '100%' }}
                    placeholder={phoneConfigarations.ru.placeholder}
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
