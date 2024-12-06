export interface ICreateLookingForPetDTO {
  name_pet: string;
  breed: string;
  gender: string;
  category_id: string;
  name_tutor: string;
  phone_tutor: string;
  phone_tutor_is_whatsapp: boolean;
  last_seen: string;
  description: string;
  is_found: boolean;
  is_reward?: boolean;
  reward_amount?: number;
  avatar: string;
  state: string;
  city: string;
  tutor_id?: string;
  user_id?: string;
  enabled?: boolean;
}
