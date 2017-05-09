import {Injector} from "@angular/core";
import {StreamContextImpl} from '../../api/stream/stream-context-impl';


export class TestRegistrationStream {
    static testRegistrationEventReceived(streamContext:StreamContextImpl, injector:Injector) {
        //const facade = injector.get(WatchlistFacade);
        TestRegistrationStream.handleTestRegistration(streamContext, streamContext.getRecord().getPayload());

    }


    static handleTestRegistration(streamContext:StreamContextImpl, payload:any) {
        setTimeout(() => {
            streamContext.ok();
        }, 2000);
    }
}
