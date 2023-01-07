import React, { useState } from 'react';

import { Button, Form, Input, Select, message } from 'antd';
import { Col, Row } from 'antd/es/grid';

import { Iphone, Ilayout } from '../../Types/formTypes';

import { getFormattedPhoneNumber } from '../../helpers/getFormattedPhoneNumber';

import './form.scss';

// /. imports

const FeedbackForm: React.FC = () => {
    const [lang, setLang] = useState<string>('ru');
    const [isLoading, setLoadingStatus] = useState<boolean>(false);

    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const { Option } = Select;

    // /. hooks

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
            mask: '(___) ___-__-__',
            rules: [
                {
                    required: true,
                    message: 'Please input your phone number!'
                },
                {
                    pattern: /\([0-9]{3}\)[\s][0-9]{3}[-][0-9]{2}[-][0-9]{2}$/,
                    message: 'number is not valid!'
                },
                { min: 1, message: 'must be minimum 1 characters' },
                { max: 15, message: 'must be less than 15 characters' }
            ]
        },
        du: {
            prefix: '+49',
            placeholder: '160-5556-417',
            mask: '___-____-___',
            rules: [
                {
                    required: true,
                    message: 'Please input your phone number!'
                },
                {
                    pattern: /([1-9][0-9]{2})[-][0-9]{4}[-][0-9]{3}$/,
                    message: 'number is not valid!'
                },
                { min: 1, message: 'must be minimum 1 characters' },
                { max: 12, message: 'must be less than 12 characters' }
            ]
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

    // /. variables

    const onInputPhoneChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const formattedPhoneNumber = getFormattedPhoneNumber(
            e.target.value,
            lang
        );
        form.setFieldsValue({
            ['phone']: formattedPhoneNumber
        });
    };

    const onFinish = (values: any): void => {
        setLoadingStatus(true);

        messageApi
            .open({
                type: 'loading',
                content: 'Action in progress..',
                duration: 2.8
            })
            .then(() => {
                message.success('Delivery finished', 2.5);
                setLoadingStatus(false);
            });

        form.resetFields();

        console.log('Received values of form: ', {
            name: values.name,
            phone: `${values.prefix} ${values.phone}`,
            email: values.email,
            message: values.message || '',
            sendingTime: new Date().toUTCString()
        });
    };

    const onPhoneSelectChange = (phonePrefix: string): void => {
        form.resetFields(['phone']);
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

    // /. functions

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
                rules={phoneConfigurations[lang].rules}
            >
                <Input
                    placeholder={phoneConfigurations[lang].placeholder}
                    addonBefore={prefixSelector}
                    style={{ width: '100%' }}
                    onChange={e => onInputPhoneChange(e)}
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
                        loading={isLoading}
                    >
                        Submit
                    </Button>
                    <>{contextHolder}</>
                </Col>
            </Row>
        </Form>
    );
};

export default FeedbackForm;
