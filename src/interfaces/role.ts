export type Method = "CREATE" | "READ" | "UPDATE" | "DELETE";

type EditRestriction = {
  field: string;
  condition: any;
}

export interface IRole {
  name: string;
  tables: Array<string>;
  operations: Array<string>;
  editFields: Array<string>;
  editRestrictions: Array<EditRestriction>;
}
