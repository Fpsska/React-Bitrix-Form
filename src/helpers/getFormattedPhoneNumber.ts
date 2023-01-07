export function getFormattedPhoneNumber(value: string, lang: string): string {
    if (!value) return value;

    const phoneNumber = value.replace(/[^\d]/g, ''); // leave only digits
    const phoneNumberLength = phoneNumber.length;

    switch (lang) {
        case 'ru':
            if (phoneNumberLength < 4) return phoneNumber;
            if (phoneNumberLength < 7) {
                return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
            }
            return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
                3,
                6
            )}-${phoneNumber.slice(6, 8)}-${phoneNumber.slice(8, 10)}`;
        case 'du':
            if (phoneNumberLength < 4) return phoneNumber;
            return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(
                3,
                7
            )}-${phoneNumber.slice(7, 10)}`;
        default:
            return value;
    }
}
