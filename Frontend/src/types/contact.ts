export interface Contact {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  description: string;
  websiteLink?: string;
  linkedInLink?: string;
  favorite: boolean;
  picture?: string;
  birthday?: string;
  lastContacted?: string;
  pinned?: boolean;
  archived?: boolean;
  attachments?: Attachment[];
  role?: "admin" | "user";
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  dataUrl: string;
  addedAt: string;
}
