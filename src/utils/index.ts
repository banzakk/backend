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
   * @returns ${fieldName} ${type} 이어야 합니다.
   */
  notEmpty(fieldName: string): Message {
    return { message: `${fieldName} 비울 수 없습니다.` };
  }
  /**
   * @param fieldName 아이디는, 비밀번호는 등 *조사 필수
   * @param min 최소값
   * @returns ${fieldName} ${type} 이어야 합니다.
   */
  minIs(fieldName: string, min: number): Message {
    return { message: `${fieldName} 최소 ${min}자 이상이어야 합니다.` };
  }
  /**
   * @param fieldName 아이디는, 비밀번호는 등 *조사 필수
   * @param max 최대값
   * @returns ${fieldName} ${type} 이어야 합니다.
   */
  maxIs(fieldName: string, max: number): Message {
    return { message: `${fieldName} 최대 ${max}자 이하이어야 합니다.` };
  }
}

export const trimAll = (value: string): string => {
  const target = value.replace(/\s+/g, '');
  return target.trim();
};
