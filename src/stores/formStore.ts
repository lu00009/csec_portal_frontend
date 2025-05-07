import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';



interface FormData {
  profilePicture: File | string | null;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  birthDate: string;
  github: string;
  gender: string;
  telegramHandle: string;
  graduationYear: number | null;
  specialization: string;
  department: string;
  mentor: string;
  universityId: string;
  instagram: string;
  linkedin: string;
  codeforces: string;
  cv: string;
  leetcode: string;
  joiningDate: string;
  bio: string;
  resources: Array<string>;
}

interface FormState {
  step: number;
  formData: FormData;
  setStep: (step: number) => void;
  updateFormData: (data: Partial<FormData>) => void;
  
  resetForm: () => void;
  setProfilePicture: (file: File | string) => void;
}

const initialState: FormData = {
  email: '',
  bio: '',
  birthDate:'',
  cv:'',
  department: '',
  firstName:'',
  github: "",
  graduationYear:null,
  lastName: "",
  mentor: "",
  phoneNumber: "",
  specialization: "",
  telegramHandle: "",
  universityId: "",
  gender : "",
  leetcode: "",
  linkedin: "",
  codeforces: "",
  instagram: "",
  joiningDate: "",
  resources: [],
  profilePicture: null,
};

const useFormStore = create<FormState>()(
  immer((set) => ({
    step: 1,
    formData: { ...initialState },
    setStep: (step) => set({ step }),
    updateFormData: (data) =>
      set((state) => {
        Object.assign(state.formData, data);
      }),
    resetForm: () => set((state) => ({ formData: { ...initialState } })),
    setProfilePicture: (file) =>
      set((state) => {
        state.formData.profilePicture = file;
      }),
   
  }))
);

export default useFormStore;