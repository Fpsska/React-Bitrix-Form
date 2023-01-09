interface Irule {
    [key: string]: string | number | boolean | RegExp;
}

export interface Iphone {
    [key: string]: {
        prefix: string;
        placeholder: string;
        mask: string;
        rules: Irule[];
    };
}

export interface Ilayout {
    [key: string]: { [key: string]: { [key: string]: number } };
}

export interface IformData {
    name: string;
    phone: string;
    email: string;
    message: string;
    url: string;
    userIP: string;
    sendingTime: string;
    prefix?: string;
}
