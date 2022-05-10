import React from "react";

interface Props {
    errorMessages: Array<string>
}

// !!!
export const InvalidInputComponent: React.FC<Props> = (props: Props) => {
    return <div>invalid input</div>;
};
