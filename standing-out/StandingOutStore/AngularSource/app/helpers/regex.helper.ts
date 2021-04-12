﻿export class RegexHelper {
    emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    passwordRegex: RegExp = /(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[\W_])/;
    contactNumberRegex: RegExp = /^(?!0123456789|9876543210|9999999999|0000000000)([+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$)/;
    postcodeRegex: RegExp = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]{0,1} ?[0-9][A-Z]{2}$/i;
}