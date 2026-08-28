import { setGlobalOptions }
    from "firebase-functions/v2";

import {
    scanRepairOrder,
} from "./repair-import/scanRepairOrder";

setGlobalOptions({
    maxInstances: 10,
});

export {
    scanRepairOrder,
};