import React, { useState, useRef } from 'react';

import emailjs from '@emailjs/browser';

import { Button, Form, Input, Select, message } from 'antd';

import { useAppDispatch } from '../../app/hooks';

import {
    setFormData,
    switchFormSubmittedStatus
} from '../../app/slices/formSlice';

import { Iphone, IformData } from '../../Types/formTypes';

import { getFormattedPhoneNumber } from '../../helpers/getFormattedPhoneNumber';

import { fetchUserIP } from '../../app/api/fetchUserIP';

import './form.scss';

// /. imports

const FeedbackForm: React.FC = () => {
    const [lang, setLang] = useState<string>('ru');
    const [isLoading, setLoadingStatus] = useState<boolean>(false);

    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const formWrapperRef = useRef<HTMLDivElement>(null!);

    const { Option } = Select;

    const dispatch = useAppDispatch();

    // /. hooks

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
                    setTimeout(() => {
                        dispatch(switchFormSubmittedStatus(true));
                    }, 600);
                },
                error => {
                    console.log('Error of emailjs:', error.text);
                }
            );
    };

    const successAction = (values: IformData): void => {
        console.log('successAction');

        messageApi
            .open({
                type: 'loading',
                content: 'Getting user information..',
                duration: 2.8
            })
            .then(() => {
                message.success('Your request successfully send', 2.5);

                const outputFormData = {
                    name: values.name,
                    phone: `${values.prefix}${values.phone.replace(
                        /[^\d]/g,
                        ''
                    )}`,
                    email: values.email,
                    message: values.message || '',
                    sendingTime: new Date().toUTCString(),
                    url: window.location.href,
                    userIP: values.userIP
                };
                dispatch(setFormData(outputFormData));

                sendEmail();
            })
            .then(() => {
                setLoadingStatus(false);
                form.resetFields();
            });
    };

    const errorAction = (errorMessage: string): void => {
        console.log('errorAction');

        messageApi
            .open({
                type: 'loading',
                content: 'Trying to receive user information..',
                duration: 2.8
            })
            .then(() => {
                message.error(errorMessage, 2.5);
                setLoadingStatus(false);
            });
    };

    const onFormSubmit = (values: any): void => {
        setLoadingStatus(true);

        fetchUserIP()
            .then(({ ip }) => {
                const extendedFormData = { ...values, userIP: ip };

                messageApi
                    .open({
                        type: 'loading',
                        content: 'Action in progress..',
                        duration: 2.8
                    })
                    .then(() => successAction(extendedFormData));
            })
            .catch(({ message }) => {
                errorAction(message);
            });
    };

    // /. functions

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
                wrapperCol={{ span: 24 }}
                labelCol={{ span: 24 }}
                scrollToFirstError
            >
                <Form.Item
                    name="name"
                    label="Name"
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
                    tooltip="Your E-mail address"
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
                    tooltip="Type your question here"
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
                    wrapperCol={{ sm: { span: 12, offset: 6 } }}
                    style={{
                        margin: '0 auto'
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
