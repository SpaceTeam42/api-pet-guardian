import { TutorTypeEnum } from '@infra/database/typeorm/entities/Tutor';

export type ICreateTutorDTO = {
  name: string;
  email: string;
  password: string;
  type: keyof typeof TutorTypeEnum;
  cnpj_cpf: string;
  manager_ong?: string;
  personal_phone: string;
  personal_phone_is_whatsapp: boolean;
  public_phone?: string;
  public_phone_is_whatsapp?: boolean;
  enabled?: boolean;
  street_name: string;
  street_number: string;
  complement?: string;
  neighborhood: string;
  postal_code: string;
  reference?: string;
  state: string;
  city: string;
};
