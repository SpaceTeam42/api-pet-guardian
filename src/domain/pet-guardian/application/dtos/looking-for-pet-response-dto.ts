export type ILookingForPetResponseDTO = {
  name_pet: string;
  breed: string;
  gender: string;
  name_tutor: string;
  phone_tutor: string;
  phone_tutor_is_whatsapp: boolean;
  last_seen: string;
  description: string;
  is_found: boolean;
  is_reward?: boolean;
  reward_amount?: number;
  avatar: string;
  avatar_url: string | null;
  tutor_id?: string;
  user_id?: string;
};
