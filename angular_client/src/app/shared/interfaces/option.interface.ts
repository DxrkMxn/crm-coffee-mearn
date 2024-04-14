import { UserDetailsInterface } from "./UserDetailsInterface ";

export interface OptionInterface {
      name: string;
      cost: number;
      category: string;
      user?: string;
      _id?: string;
      message? : string | undefined;
}

export interface OptionWithQuantityInterface extends OptionInterface {
      quantity?: number;
}

export interface OrderContent {
      order: number;
      list: [];
      user: String;
      client: String;
      status: String;
      _id: String;
      date: String;
}

export interface OrderInterface {
      date?: Date;
      order?: OrderContent;
      list: OptionWithQuantityInterface[];
      user?: string;
      client?: UserDetailsInterface;
      status?: string;
      _id?: string;
}
