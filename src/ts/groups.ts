import type { Group } from "./types";

class GroupsHandler {
  items: Group[];
  groupIdCount: number;

  constructor() {
    this.items = [];
    this.groupIdCount = 0;
  }
  createGroup(id: number, title: string): Group {
    return { id, title };
  }

  addGroup(group: Group): number {
    return this.items.push(group) - 1;
  }

  removeGroupById(id: number): Group[] | null {
    const index = this.items.findIndex((group) => group.id === id);
    if (index !== -1) {
      return this.items.splice(index, 1);
    } else {
      console.warn(`Группа с id=${id} не найдена.`);
      return null;
    }
  }

  init(): void {
    this.groupIdCount = this.items.reduce((highest, curr) => {
      return curr.id > highest ? curr.id : highest;
    }, 0);
  }
}
const groupsHandler = new GroupsHandler();

export { groupsHandler };
