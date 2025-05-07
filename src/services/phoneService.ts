import { useSettingsStore } from '@/stores/settingsStore';

class PhoneService {
  private static instance: PhoneService;
  private settings = useSettingsStore.getState();

  private constructor() {}

  static getInstance(): PhoneService {
    if (!PhoneService.instance) {
      PhoneService.instance = new PhoneService();
    }
    return PhoneService.instance;
  }

  isPhonePublic(): boolean {
    return this.settings.phonePublic;
  }

  async getPhoneNumber(userId: string): Promise<string | null> {
    try {
      // Here you would implement the actual API call to get the user's phone number
      // For now, we'll return a mock implementation
      const response = await fetch(`/api/users/${userId}/phone`);
      if (!response.ok) {
        throw new Error('Failed to fetch phone number');
      }
      const data = await response.json();
      return data.phoneNumber;
    } catch (error) {
      console.error('Failed to fetch phone number:', error);
      return null;
    }
  }

  async updatePhoneNumber(userId: string, phoneNumber: string): Promise<boolean> {
    try {
      // Here you would implement the actual API call to update the user's phone number
      // For now, we'll return a mock implementation
      const response = await fetch(`/api/users/${userId}/phone`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to update phone number:', error);
      return false;
    }
  }

  async getPublicPhoneNumber(userId: string): Promise<string | null> {
    // First check if phone visibility is enabled
    if (!this.isPhonePublic()) {
      return null;
    }

    try {
      // Only fetch and return the phone number if visibility is enabled
      const phoneNumber = await this.getPhoneNumber(userId);
      return phoneNumber;
    } catch (error) {
      console.error('Failed to get public phone number:', error);
      return null;
    }
  }

  // New method to check if a phone number should be visible
  shouldShowPhoneNumber(userId: string): boolean {
    return this.isPhonePublic();
  }
}

export const phoneService = PhoneService.getInstance(); 