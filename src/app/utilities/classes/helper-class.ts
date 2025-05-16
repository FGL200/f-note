import { AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidatorFn } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { InvalidControlInreface } from "../interfaces/global.interface";

export class Helper {

  public static readonly forms = {
    errorMsg: {
      requiredFields: `* Please fill out required fields.`,
    },

    getInvalidControls: (formGroup?: FormGroup | null, debugMode = false) => {
      if (!formGroup) return [];
      const errors: InvalidControlInreface[] = [];

      const markInvalidControl = (control: FormControl, key: string) => {
        if (!control.invalid) return;
        control.markAsTouched();
        errors.push({ control, key });
        if (debugMode) console.warn({ invalidControl: { control, key } });
      };

      const validateFormArray = (formArray: FormArray) => {
        for (const aControlKey in formArray.controls) {
          const aControl = formArray.controls[aControlKey];

          if (aControl instanceof FormControl) markInvalidControl(aControl, aControlKey);
          if (aControl instanceof FormGroup) Helper.forms.getInvalidControls(aControl).forEach(v => errors.push(v));
          if (aControl instanceof FormArray) validateFormArray(aControl);
        }
      }

      for (const cKey in formGroup.controls) {
        const aControl = formGroup.controls[cKey];

        if (aControl instanceof FormControl) markInvalidControl(aControl, cKey);
        if (aControl instanceof FormGroup) Helper.forms.getInvalidControls(aControl).forEach(v => errors.push(v));
        if (aControl instanceof FormArray) validateFormArray(aControl);
      }

      return errors;
    },

    markAllAsUntouched: (formGroup: FormGroup) => {

    },

    controls: <T>(value?: T | null, validators?: ValidatorFn[] | null, asyncValidators?: AsyncValidatorFn[] | null) => {
      return new FormControl<T | null | undefined>(value, { validators, asyncValidators });
    },
  }

  public static readonly url = {
    toParams: (baseURL: string, obj: any): string => {
      const body: Record<string, string> = {};
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (!value) return;
        else body[key] = String(value);
      });
      const params = new URLSearchParams(body);
      return `${baseURL}?${params.toString()}`;
    },
    getIdOnPath: (aRoute?: ActivatedRoute | null, key: string = 'id'): string => {
      if (!aRoute) return '<not_found>';
      return aRoute.snapshot.paramMap.get(key) ?? '';
    }
  }

  public static readonly file = {

    /**
     * Convert image file into base64
     * @param file - the image file from the input:file.
     */
    imgFileToBase64: (file?: File | null): Promise<string | null> => {
      return new Promise((resolve, reject) => {
        if (!file || !file.type.startsWith('image/')) {
          reject(new Error('Invalid file type. Please upload an image.'));
          return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event: ProgressEvent<FileReader>) => {
          if (event.target && event.target.result) {
            resolve(event.target.result as string);
          } else {
            reject(new Error('Failed to read image file.'));
          }
        };
        reader.onerror = (error) => {
          reject(new Error('Error reading image file: ' + error));
        };
      });
    },

    getExtension: (file?: File | null): string => {
      if (!file) return '';
      return file.name.split(".")[1];
    }
  }

  public static readonly array = {

    sortByPropertyName: <T>(value?: T[] | null, propertyName?: keyof T | null) => {
      if (!value) return [];
      if (!propertyName) return [];
      return value.sort((a, b) => {
        const first = a[propertyName];
        const second = b[propertyName];

        if (first == null && second == null) return 0;
        if (first == null) return -1;
        if (second == null) return 1;

        return Helper.string.trimLowerCase(String(first)).localeCompare(Helper.string.trimLowerCase(String(second)));
      });
    },

    sort: <T>(value?: T[] | null, custom?: (() => number) | null) => {
      if (!value) return [];
      if (!custom) return value.sort();
      return value.sort(custom);
    },

    compareArrays: (arrays: any[], manipulate: (selected: any[]) => any) => {
      return manipulate([...arrays]);
    },

    makeArrayOfNumber: (start: number, end: number) => Array(end - start).fill(0).map((_, i) => start + i + 1),

    arr1InArr2: (arr1?: any[] | null, arr2?: any[]) => {
      if (!arr1) return false;
      if (!arr2) return false;

      const set1 = new Set(arr1);

      return arr2.some(element => set1.has(element));
    },

    hasDuplicateValues: (arr?: any[] | null) => {
      if (!arr) return false;

      const uniqueValues = new Set(arr);
      return uniqueValues.size !== arr.length;
    },
  }

  public static readonly string = {

    upperCaseFirstL: (raw: string) => {
      const first = raw[0];
      const rest = raw.substring(1, raw.length);
      return `${first.toUpperCase()}${rest}`;
    },

    formatId: {
      toNumber: (formattedId?: string | null): number => {
        if (!formattedId) return -1;
        const [_, id] = formattedId.split('-');
        if (!id) return Number(_);
        return Number(id);
      },
      toId: (id: number | null | undefined, start: string, lenght: number): string => {
        if (!id) return '';
        return `${start}-${String(id).padStart(lenght, '0')}`;
      }
    },

    aplhapbet: {
      lowerCase: "abcdefghijklmnopqrstuvwxyz",
      upperCase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      numbers: "0123456789",
    },

    hasCommonCharacter: (str1: string, str2: string) => {
      const set1 = new Set(str1);
      const set2 = new Set(str2);
      return [...set1].some(char => set2.has(char));
    },

    trimLowerCase: (value: string | undefined | null) => value ? value.toLowerCase().trim() : '',

    generateRandom: (length: number, word: boolean = false) => {
      const alphabet = `${Helper.string.aplhapbet.lowerCase}${Helper.string.aplhapbet.upperCase}${Helper.string.aplhapbet.numbers}`;
      let rand = '';
      for (let i = 0; i < length;) {
        const space = Helper.number.generateRandom(1, 100) <= 25;
        rand += space ? ' ' : alphabet[Helper.number.generateRandom(0, alphabet.length - 1)];
        if (word && space) i++;
        if (!word) i++;
      }
      return rand;
    },

    replaceAll: (str: string, wordToReplace: string, replacementWord: string) => {
      const escapedWord = wordToReplace.replace(/([.*+?^=!:${}()|[\]\\])/g, '\\$1');
      const regex = new RegExp(`\\b${escapedWord}\\b`, 'g');
      return str.replace(regex, replacementWord);
    },

    extractStringInParentheses: (input?: string | null): string | null => {
      if (!input) return '';
      const regex = /\(([^)]+)\)/;
      const match = input.match(regex);
      return match ? match[1] : null;
    },

    bindToStringTemplate: (template: string, key_value: Record<string, string>) => {
      Object.entries(key_value).forEach(([k, v]) => template = template.replace(`{{${k}}}`, v));
      return template;
    },

    toTitleCase: (value: string): string => {
      return value.split(" ").map(v => `${v.slice(0, 1).toUpperCase()}${v.substring(1, v.length)}`).reduce((c, n) => `${c} ${n}`, "");
    },

    reverse: (value: string): string => {
      return value.split('').reverse().join('');
    }
  }

  public static readonly number = {
    currency: (inital: number | string | null | undefined, currency: string): string => {
      if (!inital) return '';
      if (typeof inital == "string") inital = Number(inital);
      const raw = inital.toFixed(2);
      const [wholeNumber, decimal] = String(raw).split(".");
      const proper = Helper.string.reverse(Helper.string.reverse(wholeNumber).split('').map((v, i) => i == 0 ? v : (i % 3 == 0 ? `,${v}` : v)).join(''));
      return `${currency} ${proper}.${decimal}`;
    },

    generateRandom: (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    numberToWords: (value: number): string => {
      const ones: any = {
        0: "zero",
        1: "one",
        2: "two",
        3: "three",
        4: "four",
        5: "five",
        6: "six",
        7: "seven",
        8: "eight",
        9: "nine",
      };

      const teens: any = {
        10: "ten",
        11: "eleven",
        12: "twelve",
        13: "thirteen",
        14: "fourteen",
        15: "fifteen",
        16: "sixteen",
        17: "seventeen",
        18: "eighteen",
        19: "nineteen",
      };

      const tens: any = {
        20: "twenty",
        30: "thirty",
        40: "forty",
        50: "fifty",
        60: "sixty",
        70: "seventy",
        80: "eighty",
        90: "ninety",
      };

      const largeNumbers: any = {
        100: "hundred",
        1000: "thousand",
        1000000: "million",
        1000000000: "billion",
      };

      if (value === 0) return ones[0];

      function convertHundreds(num: number): string {
        let result = "";

        if (num >= 100) {
          result += ones[Math.floor(num / 100)] + " " + largeNumbers[100];
          num %= 100;
          if (num > 0) result += " ";
        }

        if (num >= 20) {
          result += tens[Math.floor(num / 10) * 10];
          num %= 10;
          if (num > 0) result += "-" + ones[num];
        } else if (num >= 10) {
          result += teens[num];
        } else if (num > 0) {
          result += ones[num];
        }

        return result;
      }

      function convertDecimal(decimal: number): string {
        if (decimal < 10) {
          return ones[decimal];
        } else if (decimal < 20) {
          return teens[decimal];
        } else {
          const tensPlace = Math.floor(decimal / 10) * 10;
          const onesPlace = decimal % 10;
          return onesPlace ? `${tens[tensPlace]}-${ones[onesPlace]}` : tens[tensPlace];
        }
      }

      let [integerPart, decimalPart] = String(value).split('.').map(Number);

      let result = "";
      if (integerPart >= 1000000) {
        result += convertHundreds(Math.floor(integerPart / 1000000)) + " " + largeNumbers[1000000];
        integerPart %= 1000000;
        if (integerPart > 0) result += ", ";
      }

      if (integerPart >= 1000) {
        result += convertHundreds(Math.floor(integerPart / 1000)) + " " + largeNumbers[1000];
        integerPart %= 1000;
        if (integerPart > 0) result += ", ";
      }

      if (integerPart > 0) {
        result += convertHundreds(integerPart);
      }

      // Convert the decimal part if it exists
      if (decimalPart !== undefined) {
        result += " and " + convertDecimal(decimalPart);
      }

      return result.trim();
    }
  }

  public static readonly object = {

    /**
     * Transform object into array of object with structure of `{ key, value }`.
     * @param object object to tranform
     * @returns `{ key, value }[]`
     */
    toArray: <T>(object: Object) => {
      const pairs: { key: string, value: T }[] = [];
      Object.entries(object).forEach(([key, value]) => pairs.push({ key, value }));
      return pairs;
    }
  }

  public static readonly date = {

    newDate: new Date(),


    getNumberDays: (month: number, year: number): number => {
      // Check for invalid month
      if (month < 1 || month > 12) {
        return -1;
      }

      // CHeck if leap year
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

      // Set the number of days based on month and leap year status
      const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if (month === 2 && isLeapYear) {
        return 29; // February has 29 days in a leap year
      } else {
        return daysInMonth[month - 1];
      }
    },

    /**
     * Perform addition/subtraction to day of Date 
     * @param input the base date
     * @param dayToAdd number of days to add (can be positive or negative)
     */
    addDay: (input?: Date | string | null, dayToAdd: number = 10) => {
      if (!input) return new Date();
      const newDate = new Date(input);
      newDate.setDate(newDate.getDate() + dayToAdd);
      return newDate;
    },

    /**
     * Format a date 
     * @param input the Date to format
     * @param type `1`-> yyyy-mm-dd `2`-> dd-mm-yyy `3`-> mm-dd-yyy | `Add 0 to add "Time" (ex: 10, 20, 30)` -> `y-m-d h:m:s`
     * @param separator string that seperate values
     */
    format: (input: Date | string | null | undefined, type: number, seperator: string) => {
      if (!input) return '';
      const [y, m, d, _, hour, min, sec] = Helper.date.dateDestruct(new Date(input));
      const [year, month, day] = [String(y).padStart(4, '0'), String(m).padStart(2, '0'), String(d).padStart(2, '0')];

      if (type == 1) return `${year}${seperator}${month}${seperator}${day}`;
      if (type == 2) return `${day}${seperator}${month}${seperator}${year}`;
      if (type == 3) return `${month}${seperator}${day}${seperator}${year}`;

      if (type == 10) return `${year}${seperator}${month}${seperator}${day} ${hour}:${min}:${sec}`;
      if (type == 20) return `${day}${seperator}${month}${seperator}${year} ${hour}:${min}:${sec}`;
      if (type == 30) return `${month}${seperator}${day}${seperator}${year} ${hour}:${min}:${sec}`;
      return `${year}-${month}-${day}`;
    },

    /**
     * Desctuct a Date to Array of values in numbers
     * @param value 
     * @returns [ year, month, date, day, hour, min, sec, mili ]
     */
    dateDestruct: (value?: string | Date | null) => {
      if (!value) return [];
      const date = new Date(value);
      return [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getDay(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()];
    },

    improperToProperformat: (improperDateFromLogs?: string | null) => {
      if (!improperDateFromLogs) return '';

      // The format passed from auditlogs is YYYY-MM-DD HH:MM:SS PM Monday";
      // Get all the necessary data
      const [date, time, m, day] = improperDateFromLogs.split(' ');

      return new Date(`${date} ${time} ${m}`).toString();
    },

    monthList: {
      short: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
      long: ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"],
    }


  }

  /**
   * Only use this in (keypress) event
   */
  public static readonly input = {

    /**
     * Only accepts Aplhabets, Number (WITHOUT SPACE)
     */
    alphaNumeric: (e: KeyboardEvent) => {
      const char = e.key;
      const regex = /[a-zA-Z0-9-+]/;
      if (!regex.test(char)) {
        e.preventDefault();
      }
    },

    /**
     * Only accepts Aplhabets, Number
     */
    alphaNumericSpace: (e: KeyboardEvent) => {
      const char = e.key;
      const regex = /[a-zA-Z0-9-+ ]/;
      if (!regex.test(char)) {
        e.preventDefault();
      }
    },

    /**
     * Only accepts Aplhabets (WITHOUT SPACE)
     */
    aplha: (e: KeyboardEvent) => {
      const char = e.key;
      const regex = /[a-zA-Z]/;
      if (!regex.test(char)) {
        e.preventDefault();
      }
    },

    /**
     * Only accepts Aplhabets
     */
    alphaSpace: (e: KeyboardEvent) => {
      const char = e.key;
      const regex = /[a-zA-Z ]/;
      if (!regex.test(char)) {
        e.preventDefault();
      }
    }
    ,
    /**
     * Only accepts Numbers
     */
    numericSpace: (e: KeyboardEvent) => {
      const inputElement = (e.target as HTMLInputElement);
      inputElement.value.replace(/[^0-9]/g, "");

      const char = e.key;
      const regex = /[0-9-+. ]/;
      if (!regex.test(char)) {
        e.preventDefault();
      }
    },

    /**
     * Only accepts Numbers (WITHOUT SPACE)
     */
    positiveNumeric: (e: KeyboardEvent) => {
      const inputElement = (e.target as HTMLInputElement);
      inputElement.value.replace(/[^0-9]/g, "");

      const char = e.key;
      const regex = /[0-9.]/;
      if (!regex.test(char)) {
        e.preventDefault();
      }
    },

    /**
     * Only accepts Numbers (WITHOUT SPACE)
     */
    numeric: (e: KeyboardEvent) => {
      const inputElement = (e.target as HTMLInputElement);
      inputElement.value.replace(/[^0-9]/g, "");

      const char = e.key;
      const regex = /[0-9-+.]/;
      if (!regex.test(char)) {
        e.preventDefault();
      }
    },
  }

  private constructor() { }
}