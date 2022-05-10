import * as t from "fp-ts/lib/Task";
import { Job } from "./Job";


export type TaskJob = t.Task<Job>;

/**
   Produce a copy of tj such that when called will
   call also job.

 **/
export function withJob(job: Job): (tj: TaskJob) => TaskJob {
    return tj => () => {
        job()
        return tj()
    }
}
