import { message } from "./components/common/alert";

export const handleError = (error) => {
    const { message: errorMsg = "Unknown error" } = error;
    switch (error.type) {
        case 504:
            if (errorMsg === "exceed recall time limit") {
                message.error(
                    "It has been more than two minutes and cannot be withdrawn"
                );
            }
            break;

        case 50:
            if (errorMsg === "Modify message limit reached") {
                message.error(
                    "The number of times the message has been modified has reached the upper limit"
                );
            }
            break;
        case 603:
            if (errorMsg === "blocked") {
                message.error(
                    "You have been blocked by the other person."
                );
            }
            break;
        default:
            console.error('error', error)
            message.error(errorMsg);
            break;
    }
};
