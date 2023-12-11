type Message = {
  message: string;
};

export class ValidationMessage {
  static make() {
    return new ValidationMessage();
  }
  /**
   * @param fieldName 아이디는, 비밀번호는 등 *조사 필수
   * @param type 문자열, 숫자 등
   * @returns ${fieldName} ${type} 이어야 합니다.
   */
  typeIs(fieldName: string, type: string): Message {
    return { message: `${fieldName} ${type} 이어야 합니다.` };
  }
  /**
   * @param fieldName 아이디는, 비밀번호는 등 *조사 필수
   * @returns ${fieldName} 비울 수 없습니다.
   */
  notEmpty(fieldName: string): Message {
    return { message: `${fieldName} 비울 수 없습니다.` };
  }
  /**
   * @param fieldName 아이디는, 비밀번호는 등 *조사 필수
   * @param min 최소값
   * @returns ${fieldName} 최소 ${min}자 이상이어야 합니다.
   */
  minIs(fieldName: string, min: number, each: boolean): Message {
    const messageObj = {
      message: `${fieldName} 최소 ${min}자 이상이어야 합니다.`,
    };
    if (each) Object.assign(messageObj, { each });
    return messageObj;
  }
  /**
   * @param fieldName 아이디는, 비밀번호는 등 *조사 필수
   * @param max 최대값
   * @param each 배열인지 아닌지 여부
   * @returns ${fieldName} 최대 ${max}자 이하이어야 합니다.
   */
  maxIs(fieldName: string, max: number, each: boolean): Message {
    const messageObj = {
      message: `${fieldName} 최대 ${max}자 이하이어야 합니다.`,
    };
    if (each) Object.assign(messageObj, { each });
    return messageObj;
  }
  /**
   * @param fieldName 아이디는, 비밀번호는 등 *조사 필수
   * @param min 최소값
   * @param each 배열인지 아닌지 여부
   * @returns ${fieldName} 최소 ${min}개까지만 설정할 수 있습니다
   */
  arrayMinIs(fieldName: string, min: number) {
    return { message: `${fieldName} 최소 ${min}개까지만 설정할 수 있습니다.` };
  }
  /**
   * @param fieldName 아이디는, 비밀번호는 등 *조사 필수
   * @param max 최대값
   * @param each 배열인지 아닌지 여부
   * @returns ${fieldName} 최대 ${max}개까지만 설정할 수 있습니다
   */
  arrayMaxIs(fieldName: string, max: number) {
    return { message: `${fieldName} 최대 ${max}개까지만 설정할 수 있습니다.` };
  }
}

/**
 * @function trimAll 모든 공백 제거 함수
 * @param value 문자열 데이터
 * @returns 모든 공백이 제거된 문자열 데이터
 */
export const trimAll = (value: string): string => {
  const target = value.replace(/\s+/g, '');
  return target.trim();
};

/**
 * @function allKeysExist 객체 키 값 존재 확인 함수
 * @param obj 확인할 객체
 * @param keyArr 키 값에 해당하는 값을 가지고 있는 배열
 * @returns boolean
 */
export const allKeysExist = (
  obj: { [key: string]: unknown },
  keyArr: string[],
): boolean => {
  if (Object.keys(obj).length !== keyArr.length) {
    return false;
  }
  return keyArr.every((key) => key in obj);
};
