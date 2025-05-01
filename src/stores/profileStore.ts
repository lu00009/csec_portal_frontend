import { create } from 'zustand';

interface ProfileState {
  step: 'required' | 'optional' | 'resources';
  formData: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    linkedin?: string;
    universityId?: string;
    cvUrl?: string;
  };
  setFormData: (data: Partial<ProfileState['formData']>) => void;
  setStep: (step: ProfileState['step']) => void;
  submitForm: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  reset: () => void;
}

const useProfileStore = create<ProfileState>((set, get) => ({
  step: 'required',
  formData: {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    linkedin: '',
    universityId: '',
    cvUrl: '',
  },

  setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),

  setStep: (step) => set({ step }),

  fetchProfile: async () => {
    try {
      const response = await fetch('/api/profile');
      const data = await response.json();
      set({ formData: data });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  },

  submitForm: async () => {
    const { step, formData } = get();
    try {
      const method = step === 'resources' ? 'PUT' : 'PATCH';
      const response = await fetch('/api/profile', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Submission failed');

      if (step !== 'resources') {
        const nextStep = step === 'required' ? 'optional' : 'resources';
        set({ step: nextStep });
      } else {
        set({ step: 'required' });
        window.location.href = '/profile';
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  },

  reset: () => set({
    step: 'required',
    formData: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      linkedin: '',
      universityId: '',
      cvUrl: '',
    },
  }),
}));

export default useProfileStore;