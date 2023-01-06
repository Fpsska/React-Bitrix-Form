import React, { useState } from 'react';

import { Button, Form, Input, Select } from 'antd';
import { Col, Row } from 'antd/es/grid';

import { Iphone, Ilayout } from '../../Types/formTypes';

import './form.scss';

// /. imports

const FeedbackForm: React.FC = () => {
    const [lang, setLang] = useState<string>('ru');

    const [form] = Form.useForm();

    const { Option } = Select;

    // /. hooks

    const onFinish = (values: any): void => {
        form.resetFields();
        console.log('Received values of form: ', values);
    };

    const formItemLayout: Ilayout = {
        labelCol: {
            xs: { span: 12 },
            sm: { span: 5 }
        },
        wrapperCol: {
            xs: { span: 12 },
            sm: { span: 19 }
        }
    };

    const phoneConfigurations: Iphone = {
        ru: {
            prefix: '+7',
            placeholder: '(926) 777-77-77',
            rules: {
                lengths: { min: 1, max: 13 },
                pattern: /\([89][0-9]{2}\)[\s][0-9]{3}[-][0-9]{2}[-][0-9]{2}$/m
            }
        },
        du: {
            prefix: '+49',
            placeholder: '160-5556-417',
            lengths: { min: 1, max: 12 },
            pattern: /([1-9][0-9]{2})[-][0-9]{4}[-][0-9]{3}$/m
        }
    };

    const onPhoneSelectChange = (phonePrefix: any): void => {
        switch (phonePrefix) {
            case '+7':
                setLang('ru');
                break;
            case '+49':
                setLang('du');
                break;
            default:
                setLang('ru');
        }
    };

    const prefixSelector = (
        <Form.Item
            name="prefix"
            noStyle
        >
            <Select
                style={{ width: 70 }}
                onChange={value => onPhoneSelectChange(value)}
            >
                <Option value={phoneConfigurations.ru.prefix}>
                    {phoneConfigurations.ru.prefix}
                </Option>
                <Option value={phoneConfigurations.du.prefix}>
                    {phoneConfigurations.du.prefix}
                </Option>
            </Select>
        </Form.Item>
    );

    // /. functions

    //. effects

    return (
        <Form
            className="form"
            {...formItemLayout}
            form={form}
            name="feedback"
            onFinish={onFinish}
            initialValues={{
                prefix: phoneConfigurations[lang].prefix
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
                        pattern: phoneConfigurations[lang].pattern
                    }
                ]}
            >
                <Input
                    addonBefore={prefixSelector}
                    style={{ width: '100%' }}
                    placeholder={phoneConfigurations[lang].placeholder}
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
