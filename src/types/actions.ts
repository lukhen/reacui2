
export type Action = NewYearInputAction | NewRescountAction | NewDateFrom;



export enum ActionTypes {
    NEWYEARINPUT = "NEWYEARINPUT",
    NEWRESCOUNT = "NEWRESCOUNT",
    NEWDATEFROM = "NEWDATEFROM",
    NEWDATETO = "NEWDATETO",
    PARSEDATEFROM = "PARSEDATEFROM",
    PARSEDATETO = "PARSEDATETO",
    NEWRESERVATIONS = "NEWRESERVATIONS",
    CHECKINPUTS = "CHECKINPUTS",
    NEWSERVERERROR = "NEWSERVERERROR"
}


export interface NewYearInputAction {
    type: ActionTypes.NEWYEARINPUT;
    yearInput: string;
}



export interface NewDateFrom {
    type: ActionTypes.NEWDATEFROM;
    dateInput: string;
}

export interface NewDateTo {
    type: ActionTypes.NEWDATETO;
    dateInput: string;
}

export interface NewRescountAction {
    type: ActionTypes.NEWRESCOUNT;
    rescount: number;
}

export function newRescount(rescount: number): NewRescountAction {
    return {
        type: ActionTypes.NEWRESCOUNT,
        rescount: rescount
    }
}
