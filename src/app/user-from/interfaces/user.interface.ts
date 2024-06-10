export interface User {
    firstNameEn:   string;
    secondNameEn:  string;
    thirdNameEn:   string;
    lastNameEn:    string;
    firstNameAr:   string;
    secondNameAr:  string;
    thirdNameAr:   string;
    lastNameAr:    string;
    email:         string;
    countryCode:   string;
    phoneNumber:   number;
    dateOfBirth:           Dob;
    nationalId:    number;
    maritalStatus: string;
    gender:        string;
    addressEn:     string;
    addressAr:     string;
}

export interface Dob {
    year:  number;
    month: number;
    day:   number;
}