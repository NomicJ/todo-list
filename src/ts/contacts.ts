import type { Contact } from "./types";

class ContactsHandler {
  items: Contact[];

  constructor() {
    this.items = [];
  }

  createContact(
    username: string,
    phoneNumber: number,
    groupIndex: number
  ): Contact {
    return { username, phoneNumber, groupIndex };
  }

  addContact(contact: Contact): number {
    return this.items.push(contact) - 1;
  }

  removeContact(phoneNumber: number): Contact[] | null {
    const index = this.items.findIndex(
      (contact) => contact.phoneNumber === phoneNumber
    );
    if (index !== -1) {
      return this.items.splice(index, 1);
    } else {
      console.warn(`Контакт с номером ${phoneNumber} не найден.`);
      return null;
    }
  }

  removeGroupContacts(groupId: number): void {
    this.items = this.items.filter((contact) => contact.groupIndex !== groupId);
  }
}
const contactsHandler = new ContactsHandler();

export { contactsHandler };
