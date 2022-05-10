import { Job } from "./Job";


export type Craft<A> = (a: A) => Job;
