interface Irule {
    [key: string]: string | number | boolean | RegExp;
}

export interface Iphone {
    [key: string]: {
        prefix: string;
        placeholder: string;
        rules: Irule[];
    };
}

export interface Ilayout {
    [key: string]: { [key: string]: { [key: string]: number } };
}
