export interface Iphone {
    [key: string]: {
        [key: string]: string | { [key: string]: number } | any;
    };
}

export interface Ilayout {
    [key: string]: { [key: string]: { [key: string]: number } };
}
