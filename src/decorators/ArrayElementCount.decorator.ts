import { ValidationOptions, registerDecorator } from 'class-validator';
/**
 *
 * @param fieldName 해시태그는, 조사 필수
 * @param max 최대값
 * @param validationOptions message
 * @returns ${fieldName} 최대 ${max}개까지만 설정할 수 있습니다.
 */

export function ArrayElementCount(
  max: number,
  fieldName: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any[]) {
          if (Array.isArray(value) && value.length > max) {
            return false;
          } else {
            return true;
          }
        },
        defaultMessage() {
          return `${fieldName} 최대 ${max}개까지만 설정할 수 있습니다.`;
        },
      },
    });
  };
}
