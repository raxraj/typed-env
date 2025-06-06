export type BaseField<Type extends 'string' | 'number' | 'boolean', T> = {
  type: Type;
  default?: T;
  required?: boolean;
  choices?: readonly T[];
} & (Type extends 'string'
  ? {
      minLength?: number;
      maxLength?: number;
      pattern?: RegExp | string;
      customValidator?: (value: string) => boolean;
    }
  : {}) &
  (Type extends 'number'
    ? {
        min?: number;
        max?: number;
        customValidator?: (value: number) => boolean;
      }
    : {}) &
  (Type extends 'boolean'
    ? {
        customValidator?: (value: boolean) => boolean;
      }
    : {});

export type EnvSchema = {
  [key: string]:
    | BaseField<'string', string>
    | BaseField<'number', number>
    | BaseField<'boolean', boolean>;
};

type TypeMap = {
  string: string;
  number: number;
  boolean: boolean;
};

// Inference logic
export type InferSchema<T extends EnvSchema> = {
  [K in keyof T as T[K] extends {required: true}
    ? K
    : never]: T[K] extends BaseField<
    infer Type,
    'string' | 'number' | 'boolean'
  >
    ? TypeMap[Type]
    : never;
} & {
  [K in keyof T as T[K] extends {required: true}
    ? never
    : K]?: T[K] extends BaseField<infer Type, 'string' | 'number' | 'boolean'>
    ? TypeMap[Type]
    : never;
};
