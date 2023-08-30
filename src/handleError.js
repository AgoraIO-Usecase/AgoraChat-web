import { message } from "./components/common/alert";

export const handleError = (error) => {
    if (error.type == 504) {
        message.error('It has been more than two minutes and cannot be withdrawn')
    }
}