export type Method = "CREATE" | "READ" | "UPDATE" | "DELETE";

type EditRestriction = {
  field: string;
  condition: any;
}

export interface IRole {
  name: string;
  tables: string[];
  operations: string[];
  editFields: string[];
  editRestrictions: EditRestriction[];
}
