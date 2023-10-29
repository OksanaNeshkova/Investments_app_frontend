import { Transaction } from "../transaction/transaction";

export interface Share{
   id:number;
   companyName:string;
   shareName:string;
   isin:string;
   country:string;
   economicField:string;
   transaction:Transaction[]; 
}