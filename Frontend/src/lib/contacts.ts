import { Contact, Attachment } from "@/types/contact";

const STORAGE_KEY = "scm_contacts";

const defaultContacts: Contact[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    phoneNumber: "+1 555-0101",
    address: "123 Main St, New York",
    description: "Product designer at TechCorp",
    websiteLink: "https://alice.dev",
    linkedInLink: "https://linkedin.com/in/alice",
    favorite: true,
    pinned: true,
    picture: "https://i.pravatar.cc/150?img=1",
    birthday: "1995-04-15",
    lastContacted: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    phoneNumber: "+1 555-0102",
    address: "456 Oak Ave, San Francisco",
    description: "Full stack developer",
    linkedInLink: "https://linkedin.com/in/bob",
    favorite: false,
    picture: "https://i.pravatar.cc/150?img=3",
    birthday: "1990-03-28",
    lastContacted: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: "3",
    name: "Carol Williams",
    email: "carol@example.com",
    phoneNumber: "+1 555-0103",
    address: "789 Pine Rd, Chicago",
    description: "Marketing manager",
    websiteLink: "https://carol.io",
    favorite: true,
    picture: "https://i.pravatar.cc/150?img=5",
    birthday: "1988-12-01",
  },
  {
    id: "4",
    name: "David Lee",
    email: "david@example.com",
    phoneNumber: "+1 555-0104",
    address: "321 Elm St, Austin",
    description: "Data scientist at StartupXYZ",
    linkedInLink: "https://linkedin.com/in/david",
    favorite: false,
    picture: "https://i.pravatar.cc/150?img=7",
  },
  {
    id: "5",
    name: "Eva Martinez",
    email: "eva@example.com",
    phoneNumber: "+1 555-0105",
    address: "654 Maple Dr, Seattle",
    description: "UX researcher",
    websiteLink: "https://eva.design",
    linkedInLink: "https://linkedin.com/in/eva",
    favorite: true,
    pinned: true,
    picture: "https://i.pravatar.cc/150?img=9",
    birthday: "1993-04-02",
  },
];

export function getContacts(): Contact[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultContacts));
    return defaultContacts;
  }
  return JSON.parse(stored);
}

export function getActiveContacts(): Contact[] {
  return getContacts().filter((c) => !c.archived);
}

export function getArchivedContacts(): Contact[] {
  return getContacts().filter((c) => c.archived);
}

export function getContact(id: string): Contact | undefined {
  return getContacts().find((c) => c.id === id);
}

export function saveContact(contact: Omit<Contact, "id">): Contact {
  const contacts = getContacts();
  const newContact: Contact = { ...contact, id: Date.now().toString() };
  contacts.push(newContact);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  return newContact;
}

export function updateContact(id: string, data: Partial<Contact>): Contact | undefined {
  const contacts = getContacts();
  const idx = contacts.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  contacts[idx] = { ...contacts[idx], ...data };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  return contacts[idx];
}

export function deleteContact(id: string): void {
  const contacts = getContacts().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

export function archiveContact(id: string): Contact | undefined {
  return updateContact(id, { archived: true });
}

export function unarchiveContact(id: string): Contact | undefined {
  return updateContact(id, { archived: false });
}

export function toggleFavorite(id: string): Contact | undefined {
  const contacts = getContacts();
  const idx = contacts.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  contacts[idx].favorite = !contacts[idx].favorite;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  return contacts[idx];
}

export function togglePin(id: string): Contact | undefined {
  const contacts = getContacts();
  const idx = contacts.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  contacts[idx].pinned = !contacts[idx].pinned;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  return contacts[idx];
}

export function markContacted(id: string): Contact | undefined {
  return updateContact(id, { lastContacted: new Date().toISOString() });
}

export function checkDuplicate(email: string, phone: string, excludeId?: string): { emailDup?: Contact; phoneDup?: Contact } {
  const contacts = getContacts().filter((c) => c.id !== excludeId && !c.archived);
  const emailDup = email ? contacts.find((c) => c.email.toLowerCase() === email.toLowerCase()) : undefined;
  const phoneDup = phone ? contacts.find((c) => c.phoneNumber === phone) : undefined;
  return { emailDup, phoneDup };
}

export function getUpcomingBirthdays(days = 30): Contact[] {
  const today = new Date();
  return getActiveContacts()
    .filter((c) => c.birthday)
    .filter((c) => {
      const bday = new Date(c.birthday!);
      const thisYearBday = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());
      if (thisYearBday < today) thisYearBday.setFullYear(thisYearBday.getFullYear() + 1);
      const diff = (thisYearBday.getTime() - today.getTime()) / 86400000;
      return diff >= 0 && diff <= days;
    })
    .sort((a, b) => {
      const today2 = new Date();
      const getNext = (d: string) => {
        const bd = new Date(d);
        const n = new Date(today2.getFullYear(), bd.getMonth(), bd.getDate());
        if (n < today2) n.setFullYear(n.getFullYear() + 1);
        return n.getTime();
      };
      return getNext(a.birthday!) - getNext(b.birthday!);
    });
}

export function suggestContacts(query: string): Contact[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return getActiveContacts()
    .filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
    .slice(0, 5);
}

export function addAttachment(contactId: string, attachment: Omit<Attachment, "id" | "addedAt">): Contact | undefined {
  const contact = getContact(contactId);
  if (!contact) return undefined;
  const newAttachment: Attachment = {
    ...attachment,
    id: Date.now().toString(),
    addedAt: new Date().toISOString(),
  };
  const attachments = [...(contact.attachments || []), newAttachment];
  return updateContact(contactId, { attachments });
}

export function removeAttachment(contactId: string, attachmentId: string): Contact | undefined {
  const contact = getContact(contactId);
  if (!contact) return undefined;
  const attachments = (contact.attachments || []).filter((a) => a.id !== attachmentId);
  return updateContact(contactId, { attachments });
}

export function exportContactsCSV(): string {
  const contacts = getActiveContacts();
  const headers = ["Name", "Email", "Phone", "Address", "Description", "Website", "LinkedIn", "Favorite", "Birthday", "Last Contacted"];
  const rows = contacts.map((c) => [
    c.name,
    c.email,
    c.phoneNumber,
    c.address,
    c.description,
    c.websiteLink || "",
    c.linkedInLink || "",
    c.favorite ? "Yes" : "No",
    c.birthday || "",
    c.lastContacted ? new Date(c.lastContacted).toLocaleDateString() : "",
  ]);
  const csv = [headers, ...rows].map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n");
  return csv;
}

export function getInitialsAvatar(name: string): string {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return initials;
}
