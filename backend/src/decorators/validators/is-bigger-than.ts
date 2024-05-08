import { ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";

//. This decorator will validate if the value of the property is bigger than the value of the property passed as argument.
export function IsBiggerThan(property: string, validationOptions?: ValidationOptions){
  return function (object: Object, propertyName: string){
    registerDecorator({
      name: 'IsBiggerThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
            const [relatedPropertyName] = args.constraints;
            const relatedValue = (args.object as any)[relatedPropertyName];
            return typeof value === 'number' && typeof relatedValue === 'number' && value > relatedValue;
        },
      },
    });
  };
}