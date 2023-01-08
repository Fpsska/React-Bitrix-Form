import React, { useState, useEffect, useRef } from 'react';

import emailjs from '@emailjs/browser';

import { Button, Form, Input, Select, message } from 'antd';

import { Iphone, Ilayout } from '../../Types/formTypes';

import { getFormattedPhoneNumber } from '../../helpers/getFormattedPhoneNumber';

import { fetchUserIP } from '../../app/api/fetchUserIP';

import './form.scss';

// /. imports

const FeedbackForm: React.FC = () => {
    const [lang, setLang] = useState<string>('ru');
    const [isLoading, setLoadingStatus] = useState<boolean>(false);
    const [userIP, setUserIP] = useState<string>('');
    const [fetchIpErr, setFetchIpErr] = useState<null | string>(
        'INITIAL ERROR'
    );

    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const formWrapperRef = useRef<HTMLDivElement>(null!);

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

    const sendEmail = (): void => {
        const formRef = formWrapperRef.current.children[0] as HTMLFormElement;

        emailjs
            .sendForm(
                String(process.env.REACT_APP_SERVICE_ID),
                String(process.env.REACT_APP_TEMPLATE_ID),
                formRef,
                String(process.env.REACT_APP_PUBLIC_KEY)
            )
            .then(
                result => {
                    console.log('Result of emailjs:', result.text);
                },
                error => {
                    console.log('Error of emailjs:', error.text);
                }
            );
    };

    const successAction = (values: any): void => {
        console.log('successAction');

        messageApi
            .open({
                type: 'loading',
                content: 'Getting user information..',
                duration: 2.8
            })
            .then(() => sendEmail())
            .then(() => {
                message.success('Successfully completed', 2.5);

                setLoadingStatus(false);
                form.resetFields();

                console.log('Received values of form: ', {
                    name: values.name,
                    phone: `${values.prefix}${values.phone.replace(
                        /[^\d]/g,
                        ''
                    )}`,
                    email: values.email,
                    message: values.message || '',
                    sendingTime: new Date().toUTCString(),
                    url: window.location.href,
                    userIP: userIP
                });
            });
    };

    const errorAction = (): void => {
        console.log('errorAction');
        messageApi
            .open({
                type: 'error',
                content: fetchIpErr,
                duration: 2.8
            })
            .then(() => setLoadingStatus(false));
    };

    const onFormSubmit = (values: any): void => {
        setLoadingStatus(true);
        messageApi
            .open({
                type: 'loading',
                content: 'Action in progress..',
                duration: 2.8
            })
            .then(() => {
                userIP ? successAction(values) : errorAction();
            });
    };

    // /. functions

    useEffect(() => {
        if (isLoading) {
            fetchUserIP()
                .then(({ ip }) => {
                    setUserIP(ip);
                })
                .catch(message => {
                    setFetchIpErr(message);
                });
        }
    }, [isLoading]);

    // /. effects

    return (
        <div ref={formWrapperRef}>
            <Form
                className="form"
                form={form}
                name="feedback"
                onFinish={onFormSubmit}
                initialValues={{
                    prefix: phoneConfigurations[lang].prefix
                }}
                {...formItemLayout}
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
                    <Input name="name_field" />
                </Form.Item>
                <Form.Item
                    name="phone"
                    label="Phone Number"
                    rules={phoneConfigurations[lang].rules}
                >
                    <Input
                        name="phone_field"
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
                    <Input name="email_field" />
                </Form.Item>
                <Form.Item
                    name="message"
                    label="Message"
                    rules={[
                        {
                            required: false,
                            message: 'Please input your Message'
                        }
                    ]}
                >
                    <Input.TextArea
                        name="message_field"
                        showCount
                        maxLength={100}
                    />
                </Form.Item>
                <Form.Item
                    wrapperCol={{
                        xs: { span: 24, offset: 0 },
                        sm: { span: 8, offset: 10 }
                    }}
                    style={{
                        margin: '0'
                    }}
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
                </Form.Item>
            </Form>
        </div>
    );
};

export default FeedbackForm;
